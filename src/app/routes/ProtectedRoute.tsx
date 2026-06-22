import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { FullPageState } from '../../shared/components/FullPageState';

export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'restoring') {
    return <FullPageState title="Restaurando sesión" message="Validando el acceso al workspace…" />;
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return <Outlet />;
}
