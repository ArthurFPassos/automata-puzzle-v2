import { useState, useMemo } from 'react';
import type { MatchActivity } from '@/types';
import { FONT_MONO } from '@/styles/tokens';

interface Props {
  activity: MatchActivity;
  worldColor: string;
  onResult: (correct: boolean) => void;
  locked: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MatchActivityView({ activity, worldColor, onResult, locked }: Props) {
  const rightItems = useMemo(
    () => shuffle(activity.pairs.map(p => ({ id: p.id, text: p.right }))),
    [activity],
  );

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({}); // leftId -> rightId
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  const allMatched = Object.keys(matched).length === activity.pairs.length;

  const handleLeftClick = (id: string) => {
    if (locked || matched[id]) return;
    setSelectedLeft(id);
  };

  const handleRightClick = (rightId: string, ownerLeftId: string) => {
    if (locked || !selectedLeft) return;
    // already matched right item, skip
    if (Object.values(matched).includes(rightId)) return;

    if (selectedLeft === ownerLeftId) {
      const next = { ...matched, [selectedLeft]: rightId };
      setMatched(next);
      setSelectedLeft(null);
      if (Object.keys(next).length === activity.pairs.length) {
        setTimeout(() => onResult(true), 400);
      }
    } else {
      setWrongFlash(rightId);
      setTimeout(() => setWrongFlash(null), 500);
      setSelectedLeft(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl px-4 py-3 border border-slate-800 bg-slate-900/50">
        <div className="text-xs font-bold mb-1" style={{ fontFamily: FONT_MONO, color: worldColor }}>
          🔗 ASSOCIAÇÃO
        </div>
        <p className="text-white text-sm font-medium leading-relaxed">{activity.instruction}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Left column - terms */}
        <div className="flex flex-col gap-2">
          {activity.pairs.map(pair => {
            const isMatched = !!matched[pair.id];
            const isSelected = selectedLeft === pair.id;
            return (
              <button
                key={pair.id}
                onClick={() => handleLeftClick(pair.id)}
                disabled={isMatched || locked}
                className="text-left px-3 py-3 rounded-xl border text-sm font-bold transition-all
                           disabled:cursor-not-allowed"
                style={{
                  fontFamily: FONT_MONO,
                  borderColor: isMatched ? '#34D399' : isSelected ? worldColor : '#1E293B',
                  background: isMatched ? '#064E3B22' : isSelected ? `${worldColor}22` : '#0A0F1A',
                  color: isMatched ? '#34D399' : isSelected ? worldColor : '#94A3B8',
                }}
              >
                {pair.left}
              </button>
            );
          })}
        </div>

        {/* Right column - definitions */}
        <div className="flex flex-col gap-2">
          {rightItems.map(item => {
            const ownerLeftId = activity.pairs.find(p => p.id === item.id)!.id;
            const isMatchedTarget = Object.values(matched).includes(item.id);
            const isWrong = wrongFlash === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleRightClick(item.id, ownerLeftId)}
                disabled={isMatchedTarget || locked}
                className="text-left px-3 py-3 rounded-xl border text-xs leading-relaxed transition-all
                           disabled:cursor-not-allowed"
                style={{
                  fontFamily: FONT_MONO,
                  borderColor: isMatchedTarget ? '#34D399' : isWrong ? '#F87171' : '#1E293B',
                  background: isMatchedTarget ? '#064E3B22' : isWrong ? '#7F1D1D22' : '#0A0F1A',
                  color: isMatchedTarget ? '#34D399' : isWrong ? '#F87171' : '#94A3B8',
                }}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-center text-xs text-slate-500" style={{ fontFamily: FONT_MONO }}>
        {allMatched
          ? '✓ Todos os pares corretos!'
          : `${Object.keys(matched).length}/${activity.pairs.length} associados — toque em um termo e depois na definição correspondente`}
      </div>
    </div>
  );
}
