import { clamp } from '../lib/storyVisuals';

interface StoryProgressProps {
  /** Progress along the story, 0..1. */
  value: number;
  activeIndex: number;
  total: number;
}

/** Accessible progress bar reflecting the active stage (role=progressbar). */
export function StoryProgress({ value, activeIndex, total }: StoryProgressProps) {
  const pct = Math.round(clamp(value, 0, 1) * 100);
  const valueText = `Etapa ${activeIndex + 1} de ${total} — ${pct}% del recorrido`;

  return (
    <div
      className="story-progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-valuetext={valueText}
      aria-label="Progreso del recorrido"
    >
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}
