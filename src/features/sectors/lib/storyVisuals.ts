import type { Climate, StoryMetrics } from '../types/sector.types';

/** Climates with a dedicated, hand-built visual composition. */
export const KNOWN_CLIMATES: readonly Climate[] = ['PIXEL_FOREST', 'NEON_CAVE', 'CLOUD_AQUARIUM', 'RETRO_ARCADE'];

/** A resolved climate is either a known one or the generic fallback bucket. */
export type VisualClimate = Climate | 'GENERIC';

export function isKnownClimate(value: string): value is Climate {
  return (KNOWN_CLIMATES as readonly string[]).includes(value);
}

/** Maps any raw climate token to a known climate or the generic fallback. */
export function resolveClimate(raw: string): VisualClimate {
  const normalized = raw.trim().toUpperCase();
  return isKnownClimate(normalized) ? normalized : 'GENERIC';
}

const COLOR_TOKENS: Record<string, string> = {
  emerald: '#10b981',
  green: '#22c55e',
  lime: '#84cc16',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#38bdf8',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  slate: '#64748b',
};

export const FALLBACK_COLOR = '#22d3ee';

/** Resolves a colorToken identifier to a concrete CSS color, with a safe fallback. */
export function resolveColorToken(token: string): string {
  return COLOR_TOKENS[token.trim().toLowerCase()] ?? FALLBACK_COLOR;
}

/** Deterministic 32-bit FNV-1a hash of a string. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Deterministic integer in [0, count) derived from a seed string. */
export function pickVariant(seed: string, count: number): number {
  if (count <= 0) return 0;
  return hashString(seed) % count;
}

/** Deterministic sequence of `count` values in [0, 1) derived from a seed (xorshift32). */
export function seededValues(seed: string, count: number): number[] {
  let state = hashString(seed) || 1;
  const values: number[] = [];
  for (let index = 0; index < count; index += 1) {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >> 17;
    state ^= state << 5;
    state >>>= 0;
    values.push(state / 0xffffffff);
  }
  return values;
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/** Coerces unknown runtime data into a finite number, falling back when invalid. */
export function safeNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export interface VisualIntensity {
  /** 0..1 — drives how settled/bright the scene feels. */
  stability: number;
  /** 0..1 — drives motion amplitude and particle activity. */
  energy: number;
  /** 0..1 — drives alarm accents, mapped from a display ceiling of 20. */
  alerts: number;
}

/**
 * Maps raw stage metrics (which may be out of range) into clamped 0..1 visual
 * intensities. The raw numbers are still shown verbatim elsewhere; this is only
 * for deterministic visual scaling so nothing breaks on unexpected values.
 */
export function deriveIntensity(metrics: StoryMetrics): VisualIntensity {
  return {
    stability: clamp(metrics.stability, 0, 100) / 100,
    energy: clamp(metrics.energy, 0, 100) / 100,
    alerts: clamp(metrics.alerts, 0, 20) / 20,
  };
}

export interface SeededParticle {
  /** Horizontal position, 0..1. */
  x: number;
  /** Vertical position, 0..1. */
  y: number;
  /** Relative size, 0..1. */
  size: number;
  /** Animation delay factor, 0..1. */
  delay: number;
}

/** Builds a deterministic set of particles from a seed (stable across renders). */
export function seededParticles(seed: string, count: number): SeededParticle[] {
  const safeCount = Math.max(0, Math.min(count, 60));
  const values = seededValues(seed, safeCount * 4);
  const particles: SeededParticle[] = [];
  for (let index = 0; index < safeCount; index += 1) {
    particles.push({
      x: values[index * 4] ?? 0,
      y: values[index * 4 + 1] ?? 0,
      size: values[index * 4 + 2] ?? 0,
      delay: values[index * 4 + 3] ?? 0,
    });
  }
  return particles;
}
