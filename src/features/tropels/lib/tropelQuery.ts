import type { Species, TropelPageSize, TropelQuery, TropelSort, VitalState } from '../types/tropel.types';

const speciesValues: Species[] = ['BLOBITO', 'CHISPA', 'GRUNON', 'DORMILON', 'GLITCHY'];
const vitalStateValues: VitalState[] = ['ESTABLE', 'HAMBRIENTO', 'AGITADO', 'MUTANDO', 'CRITICO'];
const sortValues: TropelSort[] = ['name,asc', 'updatedAt,desc', 'chaosIndex,desc'];
const sizeValues: TropelPageSize[] = [10, 20, 50];

function isMember<T extends string | number>(value: string | number, values: readonly T[]): value is T {
  return values.includes(value as T);
}

export function parseTropelQuery(params: URLSearchParams): TropelQuery {
  const pageValue = Number(params.get('page') ?? 0);
  const sizeValue = Number(params.get('size') ?? 20);
  const species = params.get('species') ?? undefined;
  const vitalState = params.get('vitalState') ?? undefined;
  const sort = params.get('sort') ?? 'updatedAt,desc';

  return {
    page: Number.isInteger(pageValue) && pageValue >= 0 ? pageValue : 0,
    size: isMember(sizeValue, sizeValues) ? sizeValue : 20,
    species: species && isMember(species, speciesValues) ? species : undefined,
    vitalState: vitalState && isMember(vitalState, vitalStateValues) ? vitalState : undefined,
    sectorId: params.get('sectorId') || undefined,
    q: params.get('q')?.slice(0, 80) || undefined,
    sort: isMember(sort, sortValues) ? sort : 'updatedAt,desc',
  };
}
