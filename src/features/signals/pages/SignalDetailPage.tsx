import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router';
import { getErrorMessage } from '../../../shared/api/ApiError';
import { signalsApi } from '../api/signals.api';
import type { MutableSignalStatus, SignalItem, SignalOutletContext } from '../types/signal.types';

export function SignalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateSignalInFeed } = useOutletContext<SignalOutletContext>();
  const [signal, setSignal] = useState<SignalItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setIsLoading(true);
    signalsApi.detail(id, controller.signal).then(setSignal).catch((requestError: unknown) => {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(getErrorMessage(requestError));
    }).finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [id]);

  async function updateStatus(status: MutableSignalStatus) {
    if (!id || isSaving) return;
    setIsSaving(true);
    setError(null);
    setConfirmation(null);
    try {
      const updated = await signalsApi.updateStatus(id, status);
      setSignal(updated);
      updateSignalInFeed(updated);
      setConfirmation(`La señal ahora está ${updated.status}.`);
    } catch (requestError: unknown) {
      setError(`${getErrorMessage(requestError)} Puedes volver a intentarlo.`);
    } finally {
      setIsSaving(false);
    }
  }

  function close() {
    const query = searchParams.toString();
    navigate(`/signals${query ? `?${query}` : ''}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/75 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="signal-title">
      <button className="absolute inset-0 cursor-default" aria-label="Cerrar detalle" onClick={close} />
      <aside className="relative z-10 h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-slate-950 p-6 shadow-2xl">
        <div className="flex justify-between gap-3"><h2 id="signal-title" className="text-2xl font-bold">Detalle de señal</h2><button className="button-secondary" onClick={close}>Cerrar</button></div>
        {isLoading ? <p className="mt-8 text-slate-400">Cargando detalle…</p> : null}
        {!isLoading && signal ? (
          <div className="mt-6 space-y-4">
            <div className="panel"><p className="text-sm text-slate-400">Tropel</p><p className="mt-1 text-xl font-semibold">{signal.tropel.name}</p><p className="mt-3">{signal.rawContent}</p></div>
            <div className="grid grid-cols-3 gap-2"><Info label="Tipo" value={signal.signalType} /><Info label="Severidad" value={signal.severity} /><Info label="Estado" value={signal.status} /></div>
            {confirmation ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-emerald-200">{confirmation}</p> : null}
            {error ? <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-3 text-rose-200">{error}</p> : null}
            <div className="flex flex-wrap gap-3">
              <button className="button-primary" disabled={isSaving || signal.status === 'PROCESANDO'} onClick={() => void updateStatus('PROCESANDO')}>Marcar PROCESANDO</button>
              <button className="button-primary" disabled={isSaving || signal.status === 'ATENDIDA'} onClick={() => void updateStatus('ATENDIDA')}>Marcar ATENDIDA</button>
            </div>
          </div>
        ) : null}
        {!isLoading && !signal && error ? <p className="mt-8 text-rose-200">{error}</p> : null}
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-white/5 p-3"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>;
}
