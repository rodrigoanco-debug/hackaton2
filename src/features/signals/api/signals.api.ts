import { apiFetch } from '../../../shared/api/httpClient';
import type { MutableSignalStatus, SignalFeedResponse, SignalFilters, SignalItem } from '../types/signal.types';

function feedQuery(filters: SignalFilters, cursor?: string | null, limit = 15): string {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set('cursor', cursor);
  if (filters.signalType) params.set('signalType', filters.signalType);
  if (filters.severity) params.set('severity', filters.severity);
  if (filters.status) params.set('status', filters.status);
  if (filters.q) params.set('q', filters.q.slice(0, 80));
  return params.toString();
}

export const signalsApi = {
  feed(filters: SignalFilters, cursor?: string | null, signal?: AbortSignal): Promise<SignalFeedResponse> {
    return apiFetch<SignalFeedResponse>(`/signals/feed?${feedQuery(filters, cursor)}`, { signal });
  },
  detail(id: string, signal?: AbortSignal): Promise<SignalItem> {
    return apiFetch<SignalItem>(`/signals/${encodeURIComponent(id)}`, { signal });
  },
  updateStatus(id: string, status: MutableSignalStatus, signal?: AbortSignal): Promise<SignalItem> {
    return apiFetch<SignalItem>(`/signals/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      signal,
    });
  },
};
