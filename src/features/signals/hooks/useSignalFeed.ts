import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getErrorMessage } from '../../../shared/api/ApiError';
import { signalsApi } from '../api/signals.api';
import type { SignalFilters, SignalItem } from '../types/signal.types';

export function useSignalFeed(filters: SignalFilters) {
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);
  const generation = useRef(0);
  const inFlight = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const cursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const [items, setItems] = useState<SignalItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const appendUnique = useCallback((incoming: SignalItem[]) => {
    setItems((current) => {
      const byId = new Map(current.map((item) => [item.id, item]));
      incoming.forEach((item) => byId.set(item.id, item));
      return Array.from(byId.values());
    });
  }, []);

  const load = useCallback(async (reset: boolean) => {
    if (inFlight.current) return;
    if (!reset && !hasMoreRef.current) return;

    inFlight.current = true;
    const activeGeneration = generation.current;
    const controller = new AbortController();
    controllerRef.current = controller;
    setError(null);
    reset ? setIsInitialLoading(true) : setIsLoadingMore(true);

    try {
      const response = await signalsApi.feed(filters, reset ? null : cursorRef.current, controller.signal);
      if (activeGeneration !== generation.current) return;
      if (reset) setItems([]);
      appendUnique(response.items);
      cursorRef.current = response.nextCursor;
      hasMoreRef.current = response.hasMore;
      setHasMore(response.hasMore);
    } catch (requestError: unknown) {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      if (activeGeneration === generation.current) setError(getErrorMessage(requestError));
    } finally {
      if (activeGeneration === generation.current) {
        inFlight.current = false;
        setIsInitialLoading(false);
        setIsLoadingMore(false);
      }
    }
  }, [appendUnique, filterKey]);

  useEffect(() => {
    generation.current += 1;
    controllerRef.current?.abort();
    inFlight.current = false;
    cursorRef.current = null;
    hasMoreRef.current = true;
    setHasMore(true);
    setItems([]);
    void load(true);
    return () => controllerRef.current?.abort();
  }, [filterKey, load]);

  const updateSignalInFeed = useCallback((updated: SignalItem) => {
    setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  }, []);

  return {
    items,
    hasMore,
    error,
    isInitialLoading,
    isLoadingMore,
    loadMore: () => load(false),
    retry: () => load(items.length === 0),
    updateSignalInFeed,
  };
}
