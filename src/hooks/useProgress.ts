import { useState, useCallback } from 'react';
import type { ProgressMap, LevelProgress } from '@/types';

const KEY = 'automata-v2-progress';

function load(): ProgressMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function save(p: ProgressMap) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(load);

  const completeLevel = useCallback(
    (levelId: number, score: number, stars: number, noHint: boolean) => {
      setProgress(prev => {
        const existing = prev[levelId];
        // keep best score
        if (existing?.stars >= stars && existing?.score >= score) return prev;
        const next: ProgressMap = {
          ...prev,
          [levelId]: {
            completed: true,
            stars: Math.max(existing?.stars ?? 0, stars),
            score: Math.max(existing?.score ?? 0, score),
            noHint: existing?.noHint ? true : noHint,
          } satisfies LevelProgress,
        };
        save(next);
        return next;
      });
    },
    [],
  );

  const resetProgress = useCallback(() => {
    const empty: ProgressMap = {};
    setProgress(empty);
    save(empty);
  }, []);

  return { progress, completeLevel, resetProgress };
}
