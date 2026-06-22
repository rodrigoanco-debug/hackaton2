import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../../features/auth/hooks/useAuth';

const navigation = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tropels', label: 'Tropeles' },
  { to: '/signals', label: 'Señales' },
  { to: '/sectors', label: 'Sectores' },
] as const;

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Tuckersoft</p>
            <h1 className="font-semibold">TropelCare Control Room</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-400 sm:inline">{user?.displayName}</span>
            <button className="button-secondary" type="button" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        </div>
        <nav aria-label="Navegación principal" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
