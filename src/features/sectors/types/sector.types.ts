export type Climate = 'PIXEL_FOREST' | 'NEON_CAVE' | 'CLOUD_AQUARIUM' | 'RETRO_ARCADE';

export interface SectorSummary {
  id: string;
  sectorCode: string;
  name: string;
  climate: Climate;
  capacity: number;
  currentLoad: number;
  stabilityLevel: number;
}

export interface SectorListResponse {
  items: SectorSummary[];
}

export interface StoryStage {
  id: string;
  order: number;
  title: string;
  narrative: string;
  dominantEvent: string;
  metrics: {
    stability: number;
    energy: number;
    alerts: number;
  };
  assetKey: string;
  colorToken: string;
  progress: number;
}

export interface SectorStoryResponse {
  sector: {
    id: string;
    name: string;
    climate: Climate;
  };
  stages: StoryStage[];
}
