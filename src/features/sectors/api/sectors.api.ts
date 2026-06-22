import { apiFetch } from '../../../shared/api/httpClient';
import type { SectorListResponse, SectorStoryResponse } from '../types/sector.types';

export const sectorsApi = {
  list(signal?: AbortSignal): Promise<SectorListResponse> {
    return apiFetch<SectorListResponse>('/sectors', { signal });
  },
  story(id: string, signal?: AbortSignal): Promise<SectorStoryResponse> {
    return apiFetch<SectorStoryResponse>(`/sectors/${encodeURIComponent(id)}/story`, { signal });
  },
};
