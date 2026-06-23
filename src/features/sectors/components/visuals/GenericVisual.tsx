import type { CSSProperties } from 'react';
import { seededParticles } from '../../lib/storyVisuals';
import type { ClimateVisualProps } from './climateVisualProps';

/** Safe fallback for unknown climates: abstract rings, grid and drifting motes. */
export function GenericVisual({ color, intensity, seed, event }: ClimateVisualProps) {
  const motes = seededParticles(`${seed}-mote`, Math.min(8 + Math.round(intensity.energy * 10), 22));

  return (
    <div
      className="visual visual--generic"
      data-event={event}
      aria-hidden="true"
      style={
        {
          '--c': color,
          '--i-stability': intensity.stability,
          '--i-energy': intensity.energy,
          '--i-alerts': intensity.alerts,
        } as CSSProperties
      }
    >
      <div className="generic-grid" />
      <div className="generic-rings">
        <span />
        <span />
        <span />
      </div>
      <div className="generic-motes">
        {motes.map((mote, index) => (
          <span
            key={index}
            className="generic-mote"
            style={
              {
                '--x': `${mote.x * 100}%`,
                '--y': `${mote.y * 100}%`,
                '--s': `${(3 + mote.size * 5).toFixed(1)}px`,
                '--d': `${(mote.delay * 4).toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
