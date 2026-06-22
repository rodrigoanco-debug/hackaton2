import { apiFetch } from '../../../shared/api/httpClient';
import type { AuthUser, LoginRequest, LoginResponse } from '../types/auth.types';

export const authApi = {
  login(payload: LoginRequest, signal?: AbortSignal): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      signal,
    });
  },
  me(signal?: AbortSignal): Promise<AuthUser> {
    return apiFetch<AuthUser>('/auth/me', { signal });
  },
};
