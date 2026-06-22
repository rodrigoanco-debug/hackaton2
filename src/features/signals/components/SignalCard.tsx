import { Link, useLocation } from 'react-router';
import type { SignalItem } from '../types/signal.types';

export function SignalCard({ signal }: { signal: SignalItem }) {
  const location = useLocation();
  return (
    <article className="panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2"><span className="badge">{signal.signalType}</span><span className="badge">{signal.severity}</span><span className="badge">{signal.status}</span></div>
          <h3 className="mt-3 text-lg font-semibold">{signal.tropel.name}</h3>
          <p className="mt-2 text-sm text-slate-400">{signal.rawContent}</p>
        </div>
        <Link className="button-secondary" to={`/signals/${signal.id}${location.search}`}>Abrir detalle</Link>
      </div>
    </article>
  );
}
