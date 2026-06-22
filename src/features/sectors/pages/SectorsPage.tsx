import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getErrorMessage } from '../../../shared/api/ApiError';
import { AsyncPanel } from '../../../shared/components/AsyncPanel';
import { PageHeader } from '../../../shared/components/PageHeader';
import { sectorsApi } from '../api/sectors.api';
import { navigateWithViewTransition } from '../lib/viewTransition';
import type { SectorSummary } from '../types/sector.types';

export function SectorsPage() {
  const navigate = useNavigate();
  const [sectors, setSectors] = useState<SectorSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    sectorsApi.list(controller.signal).then((response) => setSectors(response.items)).catch((requestError: unknown) => {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(getErrorMessage(requestError));
    }).finally(() => setIsLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <section>
      <PageHeader eyebrow="Checkpoint 5" title="Sectores" description="Selecciona un sector para recorrer su historia operativa." />
      {isLoading ? <AsyncPanel title="Cargando sectores" /> : null}
      {error ? <AsyncPanel title="No se pudieron cargar los sectores" message={error} /> : null}
      {!isLoading && !error && sectors.length === 0 ? <AsyncPanel title="Sin sectores" /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sectors.map((sector) => (
          <article key={sector.id} className="panel">
            <p className="text-xs uppercase tracking-wider text-cyan-300">{sector.sectorCode} · {sector.climate}</p>
            <h3 className="mt-2 text-xl font-bold">{sector.name}</h3>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm"><span>{sector.currentLoad}/{sector.capacity}</span><span>{sector.stabilityLevel}%</span><span>carga</span></div>
            <button className="button-primary mt-5" onClick={() => navigateWithViewTransition(navigate, `/sectors/${sector.id}/story`)}>Abrir historia</button>
          </article>
        ))}
      </div>
    </section>
  );
}
