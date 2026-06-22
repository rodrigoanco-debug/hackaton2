import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getErrorMessage } from '../../../shared/api/ApiError';
import { AsyncPanel } from '../../../shared/components/AsyncPanel';
import { PageHeader } from '../../../shared/components/PageHeader';
import { tropelsApi } from '../api/tropels.api';
import type { Tropel } from '../types/tropel.types';

export function TropelDetailPage() {
  const { id } = useParams();
  const [tropel, setTropel] = useState<Tropel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    tropelsApi.detail(id, controller.signal).then(setTropel).catch((requestError: unknown) => {
      if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
      setError(getErrorMessage(requestError));
    });
    return () => controller.abort();
  }, [id]);

  return (
    <section>
      <PageHeader title="Detalle de Tropel" action={<Link className="button-secondary" to="/tropels">Volver</Link>} />
      {error ? <AsyncPanel title="No se pudo cargar" message={error} /> : null}
      {!error && !tropel ? <AsyncPanel title="Cargando detalle" /> : null}
      {tropel ? (
        <article className="panel grid gap-4 md:grid-cols-2">
          <Detail label="Nombre" value={tropel.name} /><Detail label="Especie" value={tropel.species} />
          <Detail label="Estado vital" value={tropel.vitalState} /><Detail label="Guardián" value={tropel.guardianName} />
          <Detail label="Energía" value={tropel.energyLevel} /><Detail label="Índice de caos" value={tropel.chaosIndex} />
          <Detail label="Etapa de mutación" value={tropel.mutationStage} /><Detail label="Sector" value={`${tropel.sector.sectorCode} · ${tropel.sector.name}`} />
        </article>
      ) : null}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl bg-white/5 p-4"><p className="text-xs text-slate-400">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}
