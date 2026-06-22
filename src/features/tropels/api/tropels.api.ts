import { apiFetch } from '../../../shared/api/httpClient';
import type { Tropel, TropelPage, TropelQuery } from '../types/tropel.types';

function toSearchParams(query: TropelQuery): string {
  const params = new URLSearchParams({
    page: String(query.page),
    size: String(query.size),
    sort: query.sort,
  });
  if (query.species) params.set('species', query.species);
  if (query.vitalState) params.set('vitalState', query.vitalState);
  if (query.sectorId) params.set('sectorId', query.sectorId);
  if (query.q) params.set('q', query.q);
  return params.toString();
}

export const tropelsApi = {
  list(query: TropelQuery, signal?: AbortSignal): Promise<TropelPage> {
    return apiFetch<TropelPage>(`/tropels?${toSearchParams(query)}`, { signal });
  },
  detail(id: string, signal?: AbortSignal): Promise<Tropel> {
    return apiFetch<Tropel>(`/tropels/${encodeURIComponent(id)}`, { signal });
  },
};
