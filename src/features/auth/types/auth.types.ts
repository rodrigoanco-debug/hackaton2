export interface LoginRequest {
  teamCode: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  displayName: string;
  email: string;
  teamCode: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: AuthUser;
}

export type AuthStatus = 'restoring' | 'authenticated' | 'anonymous';
