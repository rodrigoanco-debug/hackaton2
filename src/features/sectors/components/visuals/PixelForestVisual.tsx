import type { CSSProperties } from 'react';
import { seededParticles } from '../../lib/storyVisuals';
import type { ClimateVisualProps } from './climateVisualProps';

/** Layered geometric canopy, pixel grid and rising green pixels. */
export function PixelForestVisual({ color, intensity, seed, variant, event }: ClimateVisualProps) {
  const trees = seededParticles(`${seed}-tree`, 5 + (variant % 3));
  const pixelCount = Math.min(8 + Math.round(intensity.energy * 14) + (event === 'REPRODUCCION_MASIVA' ? 8 : 0), 30);
  const pixels = seededParticles(`${seed}-pixel`, pixelCount);

  return (
    <div
      className="visual visual--forest"
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
      <div className="forest-grid" />
      <div className="forest-trees">
        {trees.map((tree, index) => (
          <span
            key={index}
            className="forest-tree"
            style={
              {
                '--x': `${8 + tree.x * 84}%`,
                '--h': `${46 + tree.size * 40 + intensity.energy * 22}%`,
                '--d': `${(tree.delay * 2).toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="forest-particles">
        {pixels.map((pixel, index) => (
          <span
            key={index}
            className="forest-pixel"
            style={
              {
                '--x': `${pixel.x * 100}%`,
                '--y': `${pixel.y * 100}%`,
                '--s': `${(4 + pixel.size * 6).toFixed(1)}px`,
                '--d': `${(pixel.delay * 4).toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="forest-pulse" />
    </div>
  );
}
