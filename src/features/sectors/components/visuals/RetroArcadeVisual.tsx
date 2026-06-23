import type { CSSProperties } from 'react';
import { seededParticles } from '../../lib/storyVisuals';
import type { ClimateVisualProps } from './climateVisualProps';

/** Perspective grid floor, scanlines and retro neon blocks. */
export function RetroArcadeVisual({ color, intensity, seed, variant, event }: ClimateVisualProps) {
  const blocks = seededParticles(`${seed}-block`, 6 + (variant % 5));

  return (
    <div
      className="visual visual--arcade"
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
      <div className="arcade-sky" />
      <div className="arcade-blocks">
        {blocks.map((block, index) => (
          <span
            key={index}
            className="arcade-block"
            style={
              {
                '--x': `${6 + block.x * 88}%`,
                '--h': `${(18 + block.size * 40).toFixed(0)}px`,
                '--w': `${(14 + block.delay * 26).toFixed(0)}px`,
                '--d': `${(block.delay * 3).toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="arcade-grid" />
      <div className="arcade-scanlines" />
    </div>
  );
}
