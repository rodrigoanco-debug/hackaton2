import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { getErrorMessage } from '../../../shared/api/ApiError';
import { useAuth } from '../hooks/useAuth';

interface LoginLocationState {
  from?: string;
}

export function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [teamCode, setTeamCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ teamCode: teamCode.trim(), email: email.trim(), password });
      const state = location.state as LoginLocationState | null;
      navigate(state?.from ?? '/dashboard', { replace: true });
    } catch (loginError: unknown) {
      setError(getErrorMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_#164e63,_#020617_55%)] px-4 py-10 text-slate-100">
      <form className="panel w-full max-w-md" onSubmit={handleSubmit}>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Pizza Protocol</p>
        <h1 className="mt-2 text-3xl font-bold">Encender la consola</h1>
        <p className="mt-2 text-sm text-slate-400">Ingresa las credenciales entregadas a tu equipo.</p>

        <label className="field-label mt-6">
          Código del equipo
          <input className="field-input" value={teamCode} onChange={(event) => setTeamCode(event.target.value)} required />
        </label>
        <label className="field-label">
          Correo
          <input className="field-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="field-label">
          Contraseña
          <input className="field-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>

        {error ? <p className="mt-4 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p> : null}

        <button className="button-primary mt-6 w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Conectando…' : 'Ingresar'}
        </button>
      </form>
    </main>
  );
}
