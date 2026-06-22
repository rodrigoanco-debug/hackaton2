import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-slate-100">
      <section className="panel text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404</p>
        <h1 className="mt-2 text-3xl font-bold">Ruta no encontrada</h1>
        <Link className="button-primary mt-6 inline-flex" to="/dashboard">
          Volver al control room
        </Link>
      </section>
    </main>
  );
}
