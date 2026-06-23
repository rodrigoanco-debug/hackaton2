import { useMemo, type ReactNode } from 'react';
import { deriveIntensity, pickVariant, resolveClimate, resolveColorToken } from '../lib/storyVisuals';
import type { VisualClimate } from '../lib/storyVisuals';
import type { StoryStage } from '../types/sector.types';
import { CloudAquariumVisual } from './visuals/CloudAquariumVisual';
import { GenericVisual } from './visuals/GenericVisual';
import { NeonCaveVisual } from './visuals/NeonCaveVisual';
import { PixelForestVisual } from './visuals/PixelForestVisual';
import { RetroArcadeVisual } from './visuals/RetroArcadeVisual';
import type { ClimateVisualProps } from './visuals/climateVisualProps';

interface StoryVisualProps {
  stage: StoryStage;
  climate: string;
}

function renderScene(climate: VisualClimate, props: ClimateVisualProps): ReactNode {
  switch (climate) {
    case 'PIXEL_FOREST':
      return <PixelForestVisual {...props} />;
    case 'NEON_CAVE':
      return <NeonCaveVisual {...props} />;
    case 'CLOUD_AQUARIUM':
      return <CloudAquariumVisual {...props} />;
    case 'RETRO_ARCADE':
      return <RetroArcadeVisual {...props} />;
    case 'GENERIC':
      return <GenericVisual {...props} />;
    default:
      return <GenericVisual {...props} />;
  }
}

/**
 * Persistent visual for the active stage. Deterministically interprets climate,
 * assetKey, colorToken, dominantEvent and metrics — no remote assets, no IA.
 */
export function StoryVisual({ stage, climate }: StoryVisualProps) {
  const resolvedClimate = resolveClimate(climate);
  const seed = stage.assetKey || stage.id;

  const visualProps = useMemo<ClimateVisualProps>(
    () => ({
      color: resolveColorToken(stage.colorToken),
      intensity: deriveIntensity(stage.metrics),
      seed,
      variant: pickVariant(seed, 5),
      event: stage.dominantEvent,
    }),
    [stage.colorToken, stage.metrics, stage.dominantEvent, seed],
  );

  return (
    <figure className="story-visual">
      <div className="story-visual-scene">{renderScene(resolvedClimate, visualProps)}</div>
      <figcaption className="story-visual-caption">
        <span className="story-visual-chip">{climate || 'CLIMA DESCONOCIDO'}</span>
        <span className="story-visual-chip story-visual-chip-muted">{stage.assetKey || 'sin-asset'}</span>
        <p className="story-visual-event">
          Evento dominante: <strong>{stage.dominantEvent || '—'}</strong>
        </p>
      </figcaption>
    </figure>
  );
}
