import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../../shared/api/ApiError';
import { AsyncPanel } from '../../../shared/components/AsyncPanel';
import { PageHeader } from '../../../shared/components/PageHeader';
import { dashboardApi } from '../api/dashboard.api';
import type { DashboardSummary } from '../types/dashboard.types';

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    dashboardApi
      .getSummary(controller.signal)
      .then(setSummary)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(getErrorMessage(requestError));
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [retryKey]);

  return (
    <section>
      <PageHeader eyebrow="Checkpoint 1" title="Dashboard" description="Indicadores reales del workspace activo." />

      {isLoading ? <AsyncPanel title="Cargando indicadores" message="Consultando el estado de la colonia…" /> : null}
      {!isLoading && error ? (
        <AsyncPanel
          title="No se pudo cargar el dashboard"
          message={error}
          action={<button className="button-primary" onClick={() => setRetryKey((value) => value + 1)}>Reintentar</button>}
        />
      ) : null}
      {!isLoading && !error && !summary ? <AsyncPanel title="Sin información" message="El backend no devolvió indicadores." /> : null}
      {!isLoading && !error && summary ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Tropeles" value={summary.totalTropels} />
            <MetricCard label="Tropeles críticos" value={summary.criticalTropels} />
            <MetricCard label="Señales abiertas" value={summary.openSignals} />
            <MetricCard label="Estabilidad promedio" value={`${summary.sectorStabilityAvg}%`} />
          </div>
          <div className="panel mt-4">
            <h3 className="font-semibold">Señales por severidad</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {Object.entries(summary.signalsBySeverity).map(([severity, value]) => (
                <div key={severity} className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-slate-400">{severity}</p>
                  <p className="mt-1 text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="panel">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-cyan-200">{value}</p>
    </article>
  );
}
