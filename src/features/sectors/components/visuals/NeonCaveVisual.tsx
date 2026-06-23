import type { CSSProperties } from 'react';
import { seededParticles } from '../../lib/storyVisuals';
import type { ClimateVisualProps } from './climateVisualProps';

/** Abstract rocky shards with violet/cyan glow lights and internal waves. */
export function NeonCaveVisual({ color, intensity, seed, variant, event }: ClimateVisualProps) {
  const shards = seededParticles(`${seed}-shard`, 6 + (variant % 4));
  const lights = seededParticles(`${seed}-light`, Math.min(4 + Math.round(intensity.alerts * 8), 14));

  return (
    <div
      className="visual visual--cave"
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
      <div className="cave-depth" />
      <div className="cave-shards">
        {shards.map((shard, index) => (
          <span
            key={index}
            className="cave-shard"
            data-side={index % 2 === 0 ? 'top' : 'bottom'}
            style={
              {
                '--x': `${shard.x * 100}%`,
                '--w': `${9 + shard.size * 15}%`,
                '--len': `${40 + shard.size * 45}%`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="cave-lights">
        {lights.map((light, index) => (
          <span
            key={index}
            className="cave-light"
            style={
              {
                '--x': `${light.x * 100}%`,
                '--y': `${light.y * 100}%`,
                '--s': `${(28 + light.size * 64).toFixed(0)}px`,
                '--d': `${(light.delay * 5).toFixed(2)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="cave-wave" />
    </div>
  );
}
