import type { StoryMetrics as Metrics } from '../types/sector.types';

const ITEMS = [
  { key: 'stability', label: 'Estabilidad', suffix: '%' },
  { key: 'energy', label: 'Energía', suffix: '%' },
  { key: 'alerts', label: 'Alertas', suffix: '' },
] as const;

function formatMetric(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

/**
 * Live readout of the active stage metrics. `aria-live="polite"` announces the
 * values whenever the active stage changes, keeping them in sync with the scroll.
 */
export function StoryMetrics({ metrics, stageLabel }: { metrics: Metrics; stageLabel: string }) {
  return (
    <div className="story-metrics" aria-live="polite">
      <p className="sr-only">Métricas de {stageLabel}</p>
      {ITEMS.map((item) => (
        <div key={item.key} className="story-metric">
          <p className="story-metric-label">{item.label}</p>
          <p className="story-metric-value">
            {formatMetric(metrics[item.key])}
            {item.suffix}
          </p>
        </div>
      ))}
    </div>
  );
}
