export type Species = 'BLOBITO' | 'CHISPA' | 'GRUNON' | 'DORMILON' | 'GLITCHY';
export type VitalState = 'ESTABLE' | 'HAMBRIENTO' | 'AGITADO' | 'MUTANDO' | 'CRITICO';
export type TropelSort = 'name,asc' | 'updatedAt,desc' | 'chaosIndex,desc';
export type TropelPageSize = 10 | 20 | 50;

export interface Tropel {
  id: string;
  name: string;
  species: Species;
  vitalState: VitalState;
  energyLevel: number;
  chaosIndex: number;
  mutationStage: number;
  guardianName: string;
  sector: {
    id: string;
    name: string;
    sectorCode: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TropelPage {
  content: Tropel[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export interface TropelQuery {
  page: number;
  size: TropelPageSize;
  species?: Species;
  vitalState?: VitalState;
  sectorId?: string;
  q?: string;
  sort: TropelSort;
}
