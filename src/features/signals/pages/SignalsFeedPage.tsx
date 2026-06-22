import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Outlet, useSearchParams } from 'react-router';
import { AsyncPanel } from '../../../shared/components/AsyncPanel';
import { PageHeader } from '../../../shared/components/PageHeader';
import { SignalCard } from '../components/SignalCard';
import { SignalFilters } from '../components/SignalFilters';
import { useSignalFeed } from '../hooks/useSignalFeed';
import { parseSignalFilters } from '../lib/signalFilters';

export function SignalsFeedPage() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parseSignalFilters(params), [params]);
  const { items, hasMore, error, isInitialLoading, isLoadingMore, loadMore, retry, updateSignalInFeed } = useSignalFeed(filters);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const observeSentinel = useCallback((node: HTMLDivElement | null) => {
    sentinelRef.current = node;
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) void loadMore();
    }, { rootMargin: '500px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, items.length]);

  function updateFilter(name: string, value: string) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(name, value); else next.delete(name);
      return next;
    });
  }

  return (
    <section>
      <PageHeader eyebrow="Checkpoints 3 y 4" title="Feed de Señales" description="Cursor, deduplicación y detalle sin desmontar el feed." />
      <SignalFilters filters={filters} onChange={updateFilter} />

      {isInitialLoading ? <AsyncPanel title="Cargando señales" message="Preparando la primera página…" /> : null}
      {!isInitialLoading && items.length === 0 && error ? <AsyncPanel title="No se pudo cargar el feed" message={error} action={<button className="button-primary" onClick={retry}>Reintentar</button>} /> : null}
      {!isInitialLoading && items.length === 0 && !error ? <AsyncPanel title="Sin señales" message="No existen resultados para estos filtros." /> : null}

      <div className="grid gap-3">
        {items.map((item) => <SignalCard key={item.id} signal={item} />)}
      </div>

      {items.length > 0 && error ? <AsyncPanel title="La página siguiente falló" message={error} action={<button className="button-primary" onClick={retry}>Reintentar sin borrar lo cargado</button>} /> : null}
      {isLoadingMore ? <p className="py-6 text-center text-sm text-slate-400" aria-live="polite">Cargando más señales…</p> : null}
      {!hasMore && items.length > 0 ? <p className="py-8 text-center text-sm text-slate-500">Fin del feed</p> : null}
      <div ref={observeSentinel} className="h-2" aria-hidden="true" />

      <Outlet context={{ updateSignalInFeed }} />
    </section>
  );
}
