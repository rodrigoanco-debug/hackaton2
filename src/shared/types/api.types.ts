export interface ApiErrorBody {
  error: string;
  message: string;
  timestamp?: string;
  path?: string;
  details?: Record<string, unknown>;
}
