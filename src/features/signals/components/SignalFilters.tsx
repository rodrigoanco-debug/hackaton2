import type { SignalFilters as Filters } from '../types/signal.types';

export function SignalFilters({ filters, onChange }: { filters: Filters; onChange: (name: string, value: string) => void }) {
  return (
    <div className="panel mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <label className="field-label">
        Búsqueda
        <input className="field-input" value={filters.q ?? ''} maxLength={80} onChange={(event) => onChange('q', event.target.value)} />
      </label>
      <label className="field-label">
        Tipo
        <select className="field-input" value={filters.signalType ?? ''} onChange={(event) => onChange('signalType', event.target.value)}>
          <option value="">Todos</option><option>HAMBRE</option><option>ABANDONO</option><option>MUTACION</option><option>FUGA</option><option>CONFLICTO</option><option>REPRODUCCION_MASIVA</option><option>SENAL_CORRUPTA</option>
        </select>
      </label>
      <label className="field-label">
        Severidad
        <select className="field-input" value={filters.severity ?? ''} onChange={(event) => onChange('severity', event.target.value)}>
          <option value="">Todas</option><option>LEVE</option><option>MODERADO</option><option>GRAVE</option><option>CRITICO</option>
        </select>
      </label>
      <label className="field-label">
        Estado
        <select className="field-input" value={filters.status ?? ''} onChange={(event) => onChange('status', event.target.value)}>
          <option value="">Todos</option><option>RECIBIDA</option><option>PROCESANDO</option><option>ATENDIDA</option>
        </select>
      </label>
    </div>
  );
}
