import { useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '../../../shared/api/ApiError';
import { AsyncPanel } from '../../../shared/components/AsyncPanel';
import { PageHeader } from '../../../shared/components/PageHeader';
import { dashboardApi } from '../api/dashboard.api';
import type { DashboardSummary } from '../types/dashboard.types';

type Status = 'loading' | 'error' | 'success';

const SEVERITY_ORDER = [
  { key: 'LEVE', label: 'Leve', bar: 'bg-emerald-400' },
  { key: 'MODERADO', label: 'Moderado', bar: 'bg-amber-400' },
  { key: 'GRAVE', label: 'Grave', bar: 'bg-orange-400' },
  { key: 'CRITICO', label: 'Crítico', bar: 'bg-rose-400' },
] as const;

function formatTimestamp(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    setError(null);
    dashboardApi
      .getSummary(controller.signal)
      .then((data) => {
        setSummary(data);
        setStatus('success');
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(getErrorMessage(requestError));
        setStatus('error');
      });
    return () => controller.abort();
  }, [retryKey]);

  const updatedAt = useMemo(() => (summary ? formatTimestamp(summary.generatedAt) : null), [summary]);

  return (
    <section>
      <PageHeader
        eyebrow="Checkpoint 1"
        title="Dashboard"
        description="Indicadores reales del workspace activo."
        action={
          <button
            type="button"
            className="button-secondary"
            onClick={() => setRetryKey((value) => value + 1)}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Actualizando…' : 'Actualizar'}
          </button>
        }
      />

      {status === 'loading' ? (
        <AsyncPanel title="Cargando indicadores" message="Consultando el estado de la colonia…" />
      ) : null}

      {status === 'error' ? (
        <AsyncPanel
          title="No se pudo cargar el dashboard"
          message={error ?? 'Error desconocido.'}
          action={
            <button type="button" className="button-primary" onClick={() => setRetryKey((value) => value + 1)}>
              Reintentar
            </button>
          }
        />
      ) : null}

      {status === 'success' && summary ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Tropeles totales" value={summary.totalTropels} />
            <MetricCard label="Tropeles críticos" value={summary.criticalTropels} tone="critical" />
            <MetricCard label="Señales abiertas" value={summary.openSignals} />
            <MetricCard label="Estabilidad promedio" value={`${summary.sectorStabilityAvg}%`} />
          </div>

          <div className="panel">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h3 className="font-semibold">Señales por severidad</h3>
              {updatedAt ? (
                <p className="text-xs text-slate-500">
                  Actualizado: <time dateTime={summary.generatedAt}>{updatedAt}</time>
                </p>
              ) : null}
            </div>
            <SeverityBreakdown data={summary.signalsBySeverity} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function MetricCard({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number | string;
  tone?: 'default' | 'critical';
}) {
  return (
    <article className="panel min-h-28">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone === 'critical' ? 'text-rose-300' : 'text-cyan-200'}`}>{value}</p>
    </article>
  );
}

function SeverityBreakdown({ data }: { data: DashboardSummary['signalsBySeverity'] }) {
  const max = Math.max(...SEVERITY_ORDER.map((item) => data[item.key]), 1);
  return (
    <dl className="mt-4 grid gap-3">
      {SEVERITY_ORDER.map((item) => {
        const value = data[item.key];
        const width = `${Math.round((value / max) * 100)}%`;
        return (
          <div key={item.key} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3">
            <dt className="text-sm text-slate-300">{item.label}</dt>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
              <div className={`h-full rounded-full ${item.bar}`} style={{ width }} />
            </div>
            <dd className="text-right text-sm font-semibold tabular-nums text-slate-100">{value}</dd>
          </div>
        );
      })}
    </dl>
  );
}
