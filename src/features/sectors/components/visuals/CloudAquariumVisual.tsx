import type { CSSProperties } from 'react';
import { seededParticles } from '../../lib/storyVisuals';
import type { ClimateVisualProps } from './climateVisualProps';

/** Soft fluid layers, floating blobs and rising bubbles. */
export function CloudAquariumVisual({ color, intensity, seed, variant, event }: ClimateVisualProps) {
  const blobs = seededParticles(`${seed}-blob`, 4 + (variant % 3));
  const bubbleCount = Math.min(10 + Math.round(intensity.energy * 16) + (event === 'REPRODUCCION_MASIVA' ? 6 : 0), 34);
  const bubbles = seededParticles(`${seed}-bubble`, bubbleCount);

  return (
    <div
      className="visual visual--aquarium"
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
      <div className="aquarium-layer aquarium-layer-1" />
      <div className="aquarium-layer aquarium-layer-2" />
      <div className="aquarium-blobs">
        {blobs.map((blob, index) => (
          <span
            key={index}
            className="aquarium-blob"
            style={
              {
                '--x': `${blob.x * 100}%`,
                '--y': `${blob.y * 70}%`,
                '--s': `${(60 + blob.size * 90).toFixed(0)}px`,
                '--d': `${(blob.delay * 6).toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="aquarium-bubbles">
        {bubbles.map((bubble, index) => (
          <span
            key={index}
            className="aquarium-bubble"
            style={
              {
                '--x': `${bubble.x * 100}%`,
                '--s': `${(4 + bubble.size * 12).toFixed(1)}px`,
                '--d': `${(bubble.delay * 5).toFixed(2)}s`,
                '--dur': `${(5 + bubble.size * 6).toFixed(1)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
