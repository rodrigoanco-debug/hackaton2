import type {
  SectorStoryResponse,
  SectorSummary,
  StoryMetrics,
  StoryStage,
} from '../types/sector.types';
import { safeNumber, clamp } from './storyVisuals';

/** The story contract guarantees exactly this many ordered stages. */
export const EXPECTED_STAGE_COUNT = 8;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function parseMetrics(value: unknown): StoryMetrics {
  const record = isRecord(value) ? value : {};
  // Raw values are kept as-is (only coerced to finite numbers) so the UI shows
  // the real figures; visual scaling clamps them separately.
  return {
    stability: safeNumber(record.stability),
    energy: safeNumber(record.energy),
    alerts: safeNumber(record.alerts),
  };
}

function parseStage(value: unknown, index: number): StoryStage {
  const record = isRecord(value) ? value : {};
  return {
    id: asString(record.id, `stage-${index}`),
    order: safeNumber(record.order, index),
    title: asString(record.title),
    narrative: asString(record.narrative),
    dominantEvent: asString(record.dominantEvent),
    metrics: parseMetrics(record.metrics),
    assetKey: asString(record.assetKey),
    colorToken: asString(record.colorToken),
    progress: clamp(safeNumber(record.progress, 0), 0, 1),
  };
}

/**
 * Validates the raw `/sectors/:id/story` payload. Stages are parsed and ordered,
 * but never fabricated: whatever count the API returns is preserved so the page
 * can flag a contract violation when it is not exactly {@link EXPECTED_STAGE_COUNT}.
 */
export function parseSectorStory(data: unknown): SectorStoryResponse {
  if (!isRecord(data)) {
    throw new Error('La respuesta de la historia está vacía o no es válida.');
  }

  const sectorRecord = isRecord(data.sector) ? data.sector : {};
  const rawStages = Array.isArray(data.stages) ? data.stages : [];
  const stages = rawStages
    .map((stage, index) => parseStage(stage, index))
    .sort((a, b) => a.order - b.order);

  return {
    sector: {
      id: asString(sectorRecord.id),
      name: asString(sectorRecord.name),
      climate: asString(sectorRecord.climate),
    },
    stages,
  };
}

function parseSectorSummary(value: unknown, index: number): SectorSummary {
  const record = isRecord(value) ? value : {};
  return {
    id: asString(record.id, `sector-${index}`),
    sectorCode: asString(record.sectorCode),
    name: asString(record.name),
    climate: asString(record.climate),
    capacity: safeNumber(record.capacity),
    currentLoad: safeNumber(record.currentLoad),
    stabilityLevel: safeNumber(record.stabilityLevel),
  };
}

/** Validates the raw `/sectors` payload, tolerating an `items` array or a bare array. */
export function parseSectorList(data: unknown): SectorSummary[] {
  const items = isRecord(data) && Array.isArray(data.items) ? data.items : Array.isArray(data) ? data : [];
  return items.map((item, index) => parseSectorSummary(item, index));
}
