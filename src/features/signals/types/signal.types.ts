export type SignalType = 'HAMBRE' | 'ABANDONO' | 'MUTACION' | 'FUGA' | 'CONFLICTO' | 'REPRODUCCION_MASIVA' | 'SENAL_CORRUPTA';
export type Severity = 'LEVE' | 'MODERADO' | 'GRAVE' | 'CRITICO';
export type SignalStatus = 'RECIBIDA' | 'PROCESANDO' | 'ATENDIDA';
export type MutableSignalStatus = 'PROCESANDO' | 'ATENDIDA';

export interface SignalItem {
  id: string;
  signalType: SignalType;
  severity: Severity;
  status: SignalStatus;
  rawContent: string;
  tropel: {
    id: string;
    name: string;
    species: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SignalFeedResponse {
  items: SignalItem[];
  nextCursor: string | null;
  hasMore: boolean;
  totalEstimate: number;
}

export interface SignalFilters {
  signalType?: SignalType;
  severity?: Severity;
  status?: SignalStatus;
  q?: string;
}

export interface SignalOutletContext {
  updateSignalInFeed: (signal: SignalItem) => void;
}
