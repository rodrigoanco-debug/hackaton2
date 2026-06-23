import { apiFetch } from '../../../shared/api/httpClient';
import { parseSectorList, parseSectorStory } from '../lib/parseSectorStory';
import type { SectorStoryResponse, SectorSummary } from '../types/sector.types';

export const sectorsApi = {
  async list(signal?: AbortSignal): Promise<SectorSummary[]> {
    const data = await apiFetch<unknown>('/sectors', { signal });
    return parseSectorList(data);
  },
  async story(id: string, signal?: AbortSignal): Promise<SectorStoryResponse> {
    const data = await apiFetch<unknown>(`/sectors/${encodeURIComponent(id)}/story`, { signal });
    return parseSectorStory(data);
  },
};
