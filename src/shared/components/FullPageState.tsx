interface FullPageStateProps {
  title: string;
  message: string;
}

export function FullPageState({ title, message }: FullPageStateProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-slate-100">
      <section className="panel max-w-md text-center" aria-live="polite">
        <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-cyan-400/60" />
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-slate-400">{message}</p>
      </section>
    </main>
  );
}
