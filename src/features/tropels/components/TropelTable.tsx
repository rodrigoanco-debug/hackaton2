import { Link } from 'react-router';
import type { Tropel } from '../types/tropel.types';

export function TropelTable({ tropels }: { tropels: Tropel[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Especie</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Energía</th>
            <th className="px-4 py-3">Caos</th>
            <th className="px-4 py-3">Sector</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10 bg-slate-900/60">
          {tropels.map((tropel) => (
            <tr key={tropel.id} className="hover:bg-white/5">
              <td className="px-4 py-3 font-medium"><Link className="text-cyan-300 hover:underline" to={`/tropels/${tropel.id}`}>{tropel.name}</Link></td>
              <td className="px-4 py-3">{tropel.species}</td>
              <td className="px-4 py-3"><span className="badge">{tropel.vitalState}</span></td>
              <td className="px-4 py-3">{tropel.energyLevel}</td>
              <td className="px-4 py-3">{tropel.chaosIndex}</td>
              <td className="px-4 py-3">{tropel.sector.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
