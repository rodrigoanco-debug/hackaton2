import { Navigate, Route, Routes } from 'react-router';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { SignalDetailPage } from '../features/signals/pages/SignalDetailPage';
import { SignalsFeedPage } from '../features/signals/pages/SignalsFeedPage';
import { SectorStoryPage } from '../features/sectors/pages/SectorStoryPage';
import { SectorsPage } from '../features/sectors/pages/SectorsPage';
import { TropelDetailPage } from '../features/tropels/pages/TropelDetailPage';
import { TropelsPage } from '../features/tropels/pages/TropelsPage';
import { NotFoundPage } from '../shared/pages/NotFoundPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tropels" element={<TropelsPage />} />
          <Route path="/tropels/:id" element={<TropelDetailPage />} />
          <Route path="/signals" element={<SignalsFeedPage />}>
            <Route path=":id" element={<SignalDetailPage />} />
          </Route>
          <Route path="/sectors" element={<SectorsPage />} />
          <Route path="/sectors/:id/story" element={<SectorStoryPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
