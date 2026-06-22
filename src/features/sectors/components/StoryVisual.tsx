import type { CSSProperties } from 'react';
import type { StoryStage } from '../types/sector.types';

const tokenColors: Record<string, string> = {
  emerald: '#10b981', cyan: '#06b6d4', violet: '#8b5cf6', amber: '#f59e0b', rose: '#f43f5e', blue: '#3b82f6', lime: '#84cc16', fuchsia: '#d946ef',
};

export function StoryVisual({ stage }: { stage: StoryStage }) {
  const color = tokenColors[stage.colorToken.toLowerCase()] ?? '#22d3ee';
  return (
    <div className="story-visual" style={{ '--story-color': color } as CSSProperties} aria-live="polite">
      <div className="story-orb" aria-hidden="true"><span /><span /><span /></div>
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.25em] text-white/60">{stage.assetKey}</p>
        <h2 className="mt-2 text-3xl font-bold">{stage.title}</h2>
        <p className="mt-2 text-sm text-white/70">Evento dominante: {stage.dominantEvent}</p>
        <div className="mt-6 grid grid-cols-3 gap-2">
          <Metric label="Estabilidad" value={stage.metrics.stability} />
          <Metric label="Energía" value={stage.metrics.energy} />
          <Metric label="Alertas" value={stage.metrics.alerts} />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl bg-black/20 p-3 backdrop-blur"><p className="text-xs text-white/60">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>;
}
