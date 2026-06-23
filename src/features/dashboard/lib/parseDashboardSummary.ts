import type { DashboardSummary } from '../types/dashboard.types';

const SEVERITY_KEYS = ['LEVE', 'MODERADO', 'GRAVE', 'CRITICO'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * Validates the raw `/dashboard/summary` payload at runtime. The HTTP layer
 * returns `unknown`, so this is the single place where the shape is checked
 * before the rest of the feature trusts it as a `DashboardSummary`.
 */
export function parseDashboardSummary(data: unknown): DashboardSummary {
  if (!isRecord(data)) {
    throw new Error('La respuesta del dashboard está vacía o no es válida.');
  }

  const { totalTropels, criticalTropels, openSignals, sectorStabilityAvg, signalsBySeverity, generatedAt } = data;

  if (
    !isFiniteNumber(totalTropels) ||
    !isFiniteNumber(criticalTropels) ||
    !isFiniteNumber(openSignals) ||
    !isFiniteNumber(sectorStabilityAvg)
  ) {
    throw new Error('El dashboard no devolvió los indicadores numéricos esperados.');
  }

  if (!isRecord(signalsBySeverity)) {
    throw new Error('El dashboard no devolvió la distribución de señales por severidad.');
  }

  const severity = SEVERITY_KEYS.reduce<DashboardSummary['signalsBySeverity']>(
    (acc, key) => {
      const value = signalsBySeverity[key];
      acc[key] = isFiniteNumber(value) ? value : 0;
      return acc;
    },
    { LEVE: 0, MODERADO: 0, GRAVE: 0, CRITICO: 0 },
  );

  return {
    totalTropels,
    criticalTropels,
    openSignals,
    sectorStabilityAvg,
    signalsBySeverity: severity,
    generatedAt: typeof generatedAt === 'string' ? generatedAt : '',
  };
}
