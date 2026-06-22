import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getErrorMessage } from '../../../shared/api/ApiError';
import { AsyncPanel } from '../../../shared/components/AsyncPanel';
import { sectorsApi } from '../api/sectors.api';
import { StoryVisual } from '../components/StoryVisual';
import { useActiveStoryStage } from '../hooks/useActiveStoryStage';
import { navigateWithViewTransition } from '../lib/viewTransition';
import type { SectorStoryResponse } from '../types/sector.types';

export function SectorStoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLElement | null>(null);
  const [story, setStory] = useState<SectorStoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { activeIndex, setActiveIndex } = useActiveStoryStage(containerRef, story?.stages.length ?? 0);
  const activeStage = useMemo(() => story?.stages[activeIndex] ?? story?.stages[0], [story, activeIndex]);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    sectorsApi.story(id, controller.signal).then((response) => {
      setStory({ ...response, stages: [...response.stages].sort((a, b) => a.order - b.order) });
    }).catch((requestError: unknown) => {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(getErrorMessage(requestError));
    }).finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [id]);

  function focusStage(index: number) {
    if (!story) return;
    const bounded = Math.min(Math.max(index, 0), story.stages.length - 1);
    setActiveIndex(bounded);
    const element = containerRef.current?.querySelector<HTMLElement>(`[data-story-stage="${bounded}"]`);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    element?.focus({ preventScroll: true });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'ArrowDown' || event.key === 'PageDown') { event.preventDefault(); focusStage(activeIndex + 1); }
    if (event.key === 'ArrowUp' || event.key === 'PageUp') { event.preventDefault(); focusStage(activeIndex - 1); }
    if (event.key === 'Home') { event.preventDefault(); focusStage(0); }
    if (event.key === 'End' && story) { event.preventDefault(); focusStage(story.stages.length - 1); }
  }

  if (isLoading) return <AsyncPanel title="Construyendo historia" message="Cargando las etapas desde el backend…" />;
  if (error) return <AsyncPanel title="No se pudo cargar la historia" message={error} />;
  if (!story || !activeStage || story.stages.length === 0) return <AsyncPanel title="Historia vacía" />;

  return (
    <section ref={containerRef} className="story-shell" onKeyDown={handleKeyDown}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs uppercase tracking-[0.3em] text-cyan-300">{story.sector.climate}</p><h1 className="mt-1 text-3xl font-bold">{story.sector.name}</h1></div>
        <button className="button-secondary" type="button" onClick={() => navigateWithViewTransition(navigate, '/sectors')}>Volver a sectores</button>
      </div>

      <div className="story-progress" aria-label={`Progreso ${Math.round(activeStage.progress * 100)}%`}><span style={{ width: `${Math.max(activeStage.progress * 100, ((activeIndex + 1) / story.stages.length) * 100)}%` }} /></div>

      <div className="story-grid">
        <div className="story-sticky"><StoryVisual stage={activeStage} /></div>
        <div className="story-steps">
          {story.stages.map((stage, index) => (
            <article
              key={stage.id}
              data-story-stage={index}
              tabIndex={0}
              onFocus={() => setActiveIndex(index)}
              aria-current={index === activeIndex ? 'step' : undefined}
              className={`story-step ${index === activeIndex ? 'story-step-active' : ''}`}
            >
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Etapa {index + 1} de {story.stages.length}</p>
              <h2 className="mt-3 text-2xl font-bold">{stage.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-300">{stage.narrative}</p>
            </article>
          ))}
        </div>
      </div>
      <p className="sr-only">Usa flechas arriba y abajo, Page Up, Page Down, Inicio o Fin para navegar por las etapas.</p>
    </section>
  );
}
