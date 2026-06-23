import type { VisualIntensity } from '../../lib/storyVisuals';

/** Shared contract every climate composition renders against. */
export interface ClimateVisualProps {
  /** Resolved CSS color for this stage. */
  color: string;
  /** Clamped 0..1 intensities derived from the stage metrics. */
  intensity: VisualIntensity;
  /** Deterministic seed (the stage assetKey) for stable particle layout. */
  seed: string;
  /** Deterministic sub-variant index. */
  variant: number;
  /** Dominant event token, used for event-specific accents. */
  event: string;
}
