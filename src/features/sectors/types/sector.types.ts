/** Climates the engine renders a dedicated visual for. */
export type Climate = 'PIXEL_FOREST' | 'NEON_CAVE' | 'CLOUD_AQUARIUM' | 'RETRO_ARCADE';

export interface SectorSummary {
  id: string;
  sectorCode: string;
  name: string;
  /** Raw climate token from the API. May be an unknown value, handled by a fallback. */
  climate: string;
  capacity: number;
  currentLoad: number;
  stabilityLevel: number;
}

export interface SectorListResponse {
  items: SectorSummary[];
}

export interface StoryMetrics {
  stability: number;
  energy: number;
  alerts: number;
}

export interface StoryStage {
  id: string;
  order: number;
  title: string;
  narrative: string;
  dominantEvent: string;
  metrics: StoryMetrics;
  assetKey: string;
  colorToken: string;
  progress: number;
}

export interface StorySector {
  id: string;
  name: string;
  /** Raw climate token from the API. May be an unknown value, handled by a fallback. */
  climate: string;
}

export interface SectorStoryResponse {
  sector: StorySector;
  stages: StoryStage[];
}
