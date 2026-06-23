import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ApiError, getErrorMessage } from '../../../shared/api/ApiError';
import { AsyncPanel } from '../../../shared/components/AsyncPanel';
import { sectorsApi } from '../api/sectors.api';
import { StoryMetrics } from '../components/StoryMetrics';
import { StoryProgress } from '../components/StoryProgress';
import { StoryVisual } from '../components/StoryVisual';
import { useActiveStoryStage } from '../hooks/useActiveStoryStage';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { EXPECTED_STAGE_COUNT } from '../lib/parseSectorStory';
import { clamp } from '../lib/storyVisuals';
import { navigateWithViewTransition } from '../lib/viewTransition';
import type { SectorStoryResponse } from '../types/sector.types';

type Status = 'loading' | 'error' | 'success';

function formatMetric(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function SectorStoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  const [story, setStory] = useState<SectorStoryResponse | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const stages = story?.stages ?? [];
  const { activeIndex, setActiveIndex } = useActiveStoryStage(containerRef, stages.length);
  const activeStage = stages[activeIndex] ?? stages[0];

  useEffect(() => {
    if (!id) {
      setError('Falta el identificador del sector en la URL.');
      setStatus('error');
      return;
    }
    const controller = new AbortController();
    setStatus('loading');
    setError(null);
    sectorsApi
      .story(id, controller.signal)
      .then((response) => {
        setStory(response);
        setStatus('success');
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        if (requestError instanceof ApiError && requestError.status === 404) {
          setError('El sector solicitado no existe o no pertenece a tu workspace.');
        } else {
          setError(getErrorMessage(requestError));
        }
        setStatus('error');
      });
    return () => controller.abort();
  }, [id, retryKey]);

  useEffect(() => {
    // A freshly loaded story always starts at the first stage; this also keeps
    // activeIndex in range if a retry returns a different number of stages.
    setActiveIndex(0);
  }, [story?.sector.id, setActiveIndex]);

  function focusStage(index: number) {
    const bounded = Math.min(Math.max(index, 0), stages.length - 1);
    setActiveIndex(bounded);
    const element = containerRef.current?.querySelector<HTMLElement>(`[data-story-stage="${bounded}"]`);
    element?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    element?.focus({ preventScroll: true });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    switch (event.key) {
      case 'ArrowDown':
      case 'PageDown':
        event.preventDefault();
        focusStage(activeIndex + 1);
        break;
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault();
        focusStage(activeIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusStage(0);
        break;
      case 'End':
        event.preventDefault();
        focusStage(stages.length - 1);
        break;
      default:
        break;
    }
  }

  if (status === 'loading') {
    return <AsyncPanel title="Construyendo historia" message="Cargando las etapas desde el backend…" />;
  }

  if (status === 'error') {
    return (
      <AsyncPanel
        title="No se pudo cargar la historia"
        message={error ?? 'Error desconocido.'}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" className="button-primary" onClick={() => setRetryKey((value) => value + 1)}>
              Reintentar
            </button>
            <button
              type="button"
              className="button-secondary"
              onClick={() => navigateWithViewTransition(navigate, '/sectors')}
            >
              Volver a sectores
            </button>
          </div>
        }
      />
    );
  }

  if (!story || stages.length === 0 || !activeStage) {
    return (
      <AsyncPanel
        title="Historia sin etapas"
        message="El backend no devolvió etapas para este sector."
        action={
          <button type="button" className="button-secondary" onClick={() => navigateWithViewTransition(navigate, '/sectors')}>
            Volver a sectores
          </button>
        }
      />
    );
  }

  const total = stages.length;
  const contractViolation = total !== EXPECTED_STAGE_COUNT;
  const boundedIndex = Math.min(Math.max(activeIndex, 0), total - 1);
  const indexProgress = total > 1 ? boundedIndex / (total - 1) : 1;
  const progressValue = clamp(Math.max(clamp(activeStage.progress, 0, 1), indexProgress), 0, 1);

  return (
    <section
      ref={containerRef}
      className="story-shell"
      onKeyDown={handleKeyDown}
      aria-label={`Historia del sector ${story.sector.name || 'sin nombre'}`}
    >
      <header className="story-header">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
            {story.sector.climate || 'CLIMA DESCONOCIDO'}
          </p>
          <h1 className="mt-1 text-3xl font-bold">{story.sector.name || 'Sector'}</h1>
        </div>
        <button
          type="button"
          className="button-secondary"
          onClick={() => navigateWithViewTransition(navigate, '/sectors')}
        >
          Volver a sectores
        </button>
      </header>

      {contractViolation ? (
        <p role="alert" className="story-contract-warning">
          Contrato incompleto: se esperaban {EXPECTED_STAGE_COUNT} etapas y el backend devolvió {total}. Se muestran
          las etapas recibidas sin inventar las que faltan.
        </p>
      ) : null}

      <StoryProgress value={progressValue} activeIndex={boundedIndex} total={total} />

      <div className="story-grid">
        <div className="story-sticky">
          <StoryVisual stage={activeStage} climate={story.sector.climate} />
          <StoryMetrics
            metrics={activeStage.metrics}
            stageLabel={`etapa ${activeIndex + 1}: ${activeStage.title || 'sin título'}`}
          />
        </div>

        <ol className="story-steps">
          {stages.map((stage, index) => (
            <li key={stage.id}>
              <article
                data-story-stage={index}
                tabIndex={0}
                onFocus={() => setActiveIndex(index)}
                aria-current={index === activeIndex ? 'step' : undefined}
                className={`story-step ${index === activeIndex ? 'story-step-active' : ''}`}
              >
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
                  Etapa {index + 1} de {total}
                </p>
                <h2 className="mt-3 text-2xl font-bold">{stage.title || 'Etapa sin título'}</h2>
                <p className="mt-4 text-lg leading-relaxed text-slate-300">
                  {stage.narrative || 'Sin narrativa para esta etapa.'}
                </p>
                <dl className="story-step-metrics">
                  <div>
                    <dt>Estabilidad</dt>
                    <dd>{formatMetric(stage.metrics.stability)}%</dd>
                  </div>
                  <div>
                    <dt>Energía</dt>
                    <dd>{formatMetric(stage.metrics.energy)}%</dd>
                  </div>
                  <div>
                    <dt>Alertas</dt>
                    <dd>{formatMetric(stage.metrics.alerts)}</dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ol>
      </div>

      <p className="sr-only">
        Usa Tab y Shift+Tab o las flechas, Re Pág, Av Pág, Inicio y Fin para recorrer las etapas.
      </p>
    </section>
  );
}
