import { useRef, useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { getErrorMessage } from '../../../shared/api/ApiError';
import { isApiConfigured } from '../../../shared/api/httpClient';
import { useAuth } from '../hooks/useAuth';

interface LoginLocationState {
  from?: string;
}

type LoginField = 'teamCode' | 'email' | 'password';
type FieldErrors = Partial<Record<LoginField, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: { teamCode: string; email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.teamCode) {
    errors.teamCode = 'Ingresa el código del equipo (por ejemplo, TEAM-001).';
  }
  if (!values.email) {
    errors.email = 'Ingresa el correo del operador.';
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = 'El correo no tiene un formato válido.';
  }
  if (!values.password) {
    errors.password = 'Ingresa la contraseña del equipo.';
  }
  return errors;
}

export function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [teamCode, setTeamCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const teamCodeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const apiConfigured = isApiConfigured();

  if (status === 'authenticated') {
    const state = location.state as LoginLocationState | null;
    return <Navigate to={state?.from ?? '/dashboard'} replace />;
  }

  function focusFirstInvalid(errors: FieldErrors) {
    if (errors.teamCode) teamCodeRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.password) passwordRef.current?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Guard against double submits even if the button were re-enabled mid-flight.
    if (isSubmitting) return;

    const credentials = { teamCode: teamCode.trim(), email: email.trim(), password };
    const errors = validate(credentials);
    if (Object.keys(errors).length > 0) {
      setFormError(null);
      setFieldErrors(errors);
      focusFirstInvalid(errors);
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setIsSubmitting(true);
    try {
      await login(credentials);
      const state = location.state as LoginLocationState | null;
      // Return to the originally requested route, or the dashboard by default.
      navigate(state?.from ?? '/dashboard', { replace: true });
    } catch (loginError: unknown) {
      // Keep the entered credentials so the operator can correct and retry.
      setFormError(getErrorMessage(loginError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_#164e63,_#020617_55%)] px-4 py-10 text-slate-100">
      <form className="panel w-full max-w-md" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Pizza Protocol</p>
        <h1 className="mt-2 text-3xl font-bold">Encender la consola</h1>
        <p className="mt-2 text-sm text-slate-400">Ingresa las credenciales entregadas a tu equipo.</p>

        {!apiConfigured ? (
          <p className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-xs text-amber-200">
            Configura <code>VITE_API_BASE_URL</code> en tu archivo <code>.env</code> para conectar con el backend.
          </p>
        ) : null}

        <label className="field-label mt-6" htmlFor="teamCode">
          Código del equipo
          <input
            id="teamCode"
            ref={teamCodeRef}
            className="field-input"
            value={teamCode}
            onChange={(event) => setTeamCode(event.target.value)}
            autoComplete="organization"
            placeholder="TEAM-001"
            aria-invalid={Boolean(fieldErrors.teamCode)}
            aria-describedby={fieldErrors.teamCode ? 'teamCode-error' : undefined}
            disabled={isSubmitting}
          />
          {fieldErrors.teamCode ? (
            <span id="teamCode-error" className="text-xs text-rose-300">
              {fieldErrors.teamCode}
            </span>
          ) : null}
        </label>

        <label className="field-label" htmlFor="email">
          Correo
          <input
            id="email"
            ref={emailRef}
            className="field-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
            placeholder="correo@ejemplo.com"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            disabled={isSubmitting}
          />
          {fieldErrors.email ? (
            <span id="email-error" className="text-xs text-rose-300">
              {fieldErrors.email}
            </span>
          ) : null}
        </label>

        <label className="field-label" htmlFor="password">
          Contraseña
          <input
            id="password"
            ref={passwordRef}
            className="field-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            disabled={isSubmitting}
          />
          {fieldErrors.password ? (
            <span id="password-error" className="text-xs text-rose-300">
              {fieldErrors.password}
            </span>
          ) : null}
        </label>

        {formError ? (
          <p
            role="alert"
            aria-live="assertive"
            className="mt-4 rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200"
          >
            {formError}
          </p>
        ) : null}

        <button className="button-primary mt-6 w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Conectando…' : 'Ingresar'}
        </button>
      </form>
    </main>
  );
}
