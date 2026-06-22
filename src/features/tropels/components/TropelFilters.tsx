import type { TropelQuery } from '../types/tropel.types';

interface TropelFiltersProps {
  query: TropelQuery;
  onChange: (name: string, value: string) => void;
}

export function TropelFilters({ query, onChange }: TropelFiltersProps) {
  return (
    <div className="panel mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      <label className="field-label xl:col-span-2">
        Búsqueda
        <input className="field-input" value={query.q ?? ''} maxLength={80} onChange={(event) => onChange('q', event.target.value)} placeholder="Nombre o guardián" />
      </label>
      <label className="field-label">
        Especie
        <select className="field-input" value={query.species ?? ''} onChange={(event) => onChange('species', event.target.value)}>
          <option value="">Todas</option>
          <option value="BLOBITO">BLOBITO</option>
          <option value="CHISPA">CHISPA</option>
          <option value="GRUNON">GRUNON</option>
          <option value="DORMILON">DORMILON</option>
          <option value="GLITCHY">GLITCHY</option>
        </select>
      </label>
      <label className="field-label">
        Estado vital
        <select className="field-input" value={query.vitalState ?? ''} onChange={(event) => onChange('vitalState', event.target.value)}>
          <option value="">Todos</option>
          <option value="ESTABLE">ESTABLE</option>
          <option value="HAMBRIENTO">HAMBRIENTO</option>
          <option value="AGITADO">AGITADO</option>
          <option value="MUTANDO">MUTANDO</option>
          <option value="CRITICO">CRITICO</option>
        </select>
      </label>
      <label className="field-label">
        Sector ID
        <input className="field-input" value={query.sectorId ?? ''} onChange={(event) => onChange('sectorId', event.target.value)} placeholder="sec_001" />
      </label>
      <label className="field-label">
        Orden
        <select className="field-input" value={query.sort} onChange={(event) => onChange('sort', event.target.value)}>
          <option value="updatedAt,desc">Actualización reciente</option>
          <option value="name,asc">Nombre A–Z</option>
          <option value="chaosIndex,desc">Mayor caos</option>
        </select>
      </label>
    </div>
  );
}
