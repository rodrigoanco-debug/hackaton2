import { ApiError } from './ApiError';
import { tokenStorage } from '../lib/tokenStorage';
import type { ApiErrorBody } from '../types/api.types';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

if (!apiBaseUrl) {
  console.warn('Falta VITE_API_BASE_URL. Copia .env.example como .env.');
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<ApiErrorBody>;
  return typeof candidate.error === 'string' && typeof candidate.message === 'string';
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers = new Headers(init.headers);

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers });
  const body = await parseJson(response);

  if (!response.ok) {
    const apiError: ApiErrorBody = isApiErrorBody(body)
      ? body
      : { error: 'HTTP_ERROR', message: `La solicitud falló con estado ${response.status}.` };
    throw new ApiError(response.status, apiError);
  }

  return body as T;
}
