import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getErrorMessage } from '../../../shared/api/ApiError';
import { AsyncPanel } from '../../../shared/components/AsyncPanel';
import { PageHeader } from '../../../shared/components/PageHeader';
import { sectorsApi } from '../api/sectors.api';
import { navigateWithViewTransition } from '../lib/viewTransition';
import type { SectorSummary } from '../types/sector.types';

type Status = 'loading' | 'error' | 'success';

export function SectorsPage() {
  const navigate = useNavigate();
  const [sectors, setSectors] = useState<SectorSummary[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    setError(null);
    sectorsApi
      .list(controller.signal)
      .then((items) => {
        setSectors(items);
        setStatus('success');
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(getErrorMessage(requestError));
        setStatus('error');
      });
    return () => controller.abort();
  }, [retryKey]);

  return (
    <section>
      <PageHeader
        eyebrow="Checkpoint 5"
        title="Sectores"
        description="Selecciona un sector para recorrer su historia operativa."
      />

      {status === 'loading' ? (
        <AsyncPanel title="Cargando sectores" message="Consultando los sectores del workspace…" />
      ) : null}

      {status === 'error' ? (
        <AsyncPanel
          title="No se pudieron cargar los sectores"
          message={error ?? 'Error desconocido.'}
          action={
            <button type="button" className="button-primary" onClick={() => setRetryKey((value) => value + 1)}>
              Reintentar
            </button>
          }
        />
      ) : null}

      {status === 'success' && sectors.length === 0 ? (
        <AsyncPanel title="Sin sectores" message="El workspace no tiene sectores disponibles todavía." />
      ) : null}

      {status === 'success' && sectors.length > 0 ? (
        <ul className="grid list-none gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">
          {sectors.map((sector) => (
            <li key={sector.id}>
              <article className="panel flex h-full flex-col">
                <p className="text-xs uppercase tracking-wider text-cyan-300">
                  {sector.sectorCode || '—'} · {sector.climate || 'CLIMA DESCONOCIDO'}
                </p>
                <h3 className="mt-2 text-xl font-bold">{sector.name || 'Sector sin nombre'}</h3>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-slate-400">Carga</dt>
                    <dd className="font-semibold tabular-nums">
                      {sector.currentLoad}/{sector.capacity}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Estabilidad</dt>
                    <dd className="font-semibold tabular-nums">{sector.stabilityLevel}%</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="button-primary mt-5 self-start"
                  onClick={() => navigateWithViewTransition(navigate, `/sectors/${sector.id}/story`)}
                >
                  Abrir historia
                  <span className="sr-only"> de {sector.name || 'sector sin nombre'}</span>
                </button>
              </article>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
