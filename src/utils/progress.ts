import type { ProgressMap, LevelProgress } from '@/types';

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'automata-puzzle-v3';

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function saveProgress(p: ProgressMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // storage not available
  }
}

export function mergeProgress(
  prev: ProgressMap,
  levelId: number,
  entry: LevelProgress,
): ProgressMap {
  const old = prev[levelId];
  const merged: LevelProgress = {
    completed: true,
    stars:  Math.max(old?.stars  ?? 0, entry.stars),
    score:  Math.max(old?.score  ?? 0, entry.score),
    noHint: (old?.noHint ?? false) || entry.noHint,
  };
  return { ...prev, [levelId]: merged };
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

export function scoreToStars(score: number): 1 | 2 | 3 {
  if (score >= 90) return 3;
  if (score >= 60) return 2;
  return 1;
}

// ─── Aggregate Stats ─────────────────────────────────────────────────────────

export function totalStars(p: ProgressMap): number {
  return Object.values(p).reduce((a, x) => a + (x.stars ?? 0), 0);
}

export function totalCompleted(p: ProgressMap): number {
  return Object.values(p).filter(x => x.completed).length;
}

export function worldStars(p: ProgressMap, levelIds: number[]): number {
  return levelIds.reduce((a, id) => a + (p[id]?.stars ?? 0), 0);
}

export function worldCompleted(p: ProgressMap, levelIds: number[]): number {
  return levelIds.filter(id => p[id]?.completed).length;
}
