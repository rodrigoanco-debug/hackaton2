export interface DashboardSummary {
  totalTropels: number;
  criticalTropels: number;
  openSignals: number;
  sectorStabilityAvg: number;
  signalsBySeverity: {
    LEVE: number;
    MODERADO: number;
    GRAVE: number;
    CRITICO: number;
  };
  generatedAt: string;
}
