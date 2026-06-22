import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { authApi } from '../api/auth.api';
import type { AuthStatus, AuthUser, LoginRequest } from '../types/auth.types';
import { tokenStorage } from '../../../shared/lib/tokenStorage';

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthStatus>('restoring');
  const [user, setUser] = useState<AuthUser | null>(null);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    setStatus('anonymous');
  }, []);

  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) {
      setStatus('anonymous');
      return;
    }

    const controller = new AbortController();
    authApi
      .me(controller.signal)
      .then((restoredUser) => {
        setUser(restoredUser);
        setStatus('authenticated');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        logout();
      });

    return () => controller.abort();
  }, [logout]);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    tokenStorage.set(response.token);
    setUser(response.user);
    setStatus('authenticated');
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ status, user, login, logout }), [status, user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
