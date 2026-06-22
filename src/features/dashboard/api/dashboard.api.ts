import { apiFetch } from '../../../shared/api/httpClient';
import type { DashboardSummary } from '../types/dashboard.types';

export const dashboardApi = {
  getSummary(signal?: AbortSignal): Promise<DashboardSummary> {
    return apiFetch<DashboardSummary>('/dashboard/summary', { signal });
  },
};
