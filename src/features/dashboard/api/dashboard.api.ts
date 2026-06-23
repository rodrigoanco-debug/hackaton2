import { apiFetch } from '../../../shared/api/httpClient';
import { parseDashboardSummary } from '../lib/parseDashboardSummary';
import type { DashboardSummary } from '../types/dashboard.types';

export const dashboardApi = {
  async getSummary(signal?: AbortSignal): Promise<DashboardSummary> {
    // The HTTP layer hands back `unknown`; the feature only trusts a validated shape.
    const data = await apiFetch<unknown>('/dashboard/summary', { signal });
    return parseDashboardSummary(data);
  },
};
