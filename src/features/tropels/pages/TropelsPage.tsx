import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { getErrorMessage } from '../../../shared/api/ApiError';
import { AsyncPanel } from '../../../shared/components/AsyncPanel';
import { PageHeader } from '../../../shared/components/PageHeader';
import { tropelsApi } from '../api/tropels.api';
import { TropelFilters } from '../components/TropelFilters';
import { TropelTable } from '../components/TropelTable';
import { parseTropelQuery } from '../lib/tropelQuery';
import type { TropelPage } from '../types/tropel.types';

export function TropelsPage() {
  const [params, setParams] = useSearchParams();
  const query = useMemo(() => parseTropelQuery(params), [params]);
  const queryKey = params.toString();
  const requestSequence = useRef(0);
  const [page, setPage] = useState<TropelPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const sequence = ++requestSequence.current;
    setIsLoading(true);
    setError(null);

    tropelsApi
      .list(query, controller.signal)
      .then((response) => {
        if (sequence === requestSequence.current) setPage(response);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        if (sequence === requestSequence.current) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (sequence === requestSequence.current) setIsLoading(false);
      });

    return () => controller.abort();
  }, [queryKey, retryKey]);

  function updateParam(name: string, value: string) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(name, value);
      else next.delete(name);
      if (name !== 'page') next.set('page', '0');
      return next;
    });
  }

  return (
    <section>
      <PageHeader eyebrow="Checkpoint 2" title="Atlas de Tropeles" description="Paginación, filtros y ordenamiento ejecutados por el servidor." />
      <TropelFilters query={query} onChange={updateParam} />

      {isLoading ? <AsyncPanel title="Consultando Tropeles" message="El layout permanece estable mientras llega la respuesta." /> : null}
      {!isLoading && error ? <AsyncPanel title="No se pudo cargar el atlas" message={error} action={<button className="button-primary" onClick={() => setRetryKey((value) => value + 1)}>Reintentar</button>} /> : null}
      {!isLoading && !error && page?.content.length === 0 ? <AsyncPanel title="Sin resultados" message="Modifica los filtros o la búsqueda." /> : null}
      {!isLoading && !error && page && page.content.length > 0 ? (
        <>
          <TropelTable tropels={page.content} />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-400">Página {page.currentPage + 1} de {Math.max(page.totalPages, 1)} · {page.totalElements} resultados</p>
            <div className="flex gap-2">
              <button className="button-secondary" disabled={page.currentPage <= 0} onClick={() => updateParam('page', String(page.currentPage - 1))}>Anterior</button>
              <button className="button-secondary" disabled={page.currentPage + 1 >= page.totalPages} onClick={() => updateParam('page', String(page.currentPage + 1))}>Siguiente</button>
              <select className="field-input w-auto" aria-label="Resultados por página" value={query.size} onChange={(event) => updateParam('size', event.target.value)}>
                <option value="10">10</option><option value="20">20</option><option value="50">50</option>
              </select>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
