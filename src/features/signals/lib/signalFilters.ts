import type { Severity, SignalFilters, SignalStatus, SignalType } from '../types/signal.types';

const signalTypes: SignalType[] = ['HAMBRE', 'ABANDONO', 'MUTACION', 'FUGA', 'CONFLICTO', 'REPRODUCCION_MASIVA', 'SENAL_CORRUPTA'];
const severities: Severity[] = ['LEVE', 'MODERADO', 'GRAVE', 'CRITICO'];
const statuses: SignalStatus[] = ['RECIBIDA', 'PROCESANDO', 'ATENDIDA'];

function isStringMember<T extends string>(value: string | null, allowed: readonly T[]): value is T {
  return value !== null && allowed.includes(value as T);
}

export function parseSignalFilters(params: URLSearchParams): SignalFilters {
  const signalType = params.get('signalType');
  const severity = params.get('severity');
  const status = params.get('status');
  return {
    signalType: isStringMember(signalType, signalTypes) ? signalType : undefined,
    severity: isStringMember(severity, severities) ? severity : undefined,
    status: isStringMember(status, statuses) ? status : undefined,
    q: params.get('q')?.slice(0, 80) || undefined,
  };
}
