import { useState, useMemo } from 'react';
import type { OrderActivity } from '@/types';
import { FONT_MONO } from '@/styles/tokens';

interface Props {
  activity: OrderActivity;
  worldColor: string;
  onResult: (correct: boolean) => void;
  locked: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  let a = [...arr];
  let attempts = 0;
  do {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    attempts++;
  } while (JSON.stringify(a) === JSON.stringify(arr) && attempts < 5);
  return a;
}

export function OrderActivityView({ activity, worldColor, onResult, locked }: Props) {
  const [items, setItems] = useState<string[]>(() => shuffle(activity.items));
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const correctSet = useMemo(() => new Set(activity.items), [activity]);

  const move = (from: number, to: number) => {
    if (locked) return;
    setItems(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const moveUp = (idx: number) => idx > 0 && move(idx, idx - 1);
  const moveDown = (idx: number) => idx < items.length - 1 && move(idx, idx + 1);

  const handleCheck = () => {
    const correct = items.every((it, i) => it === activity.items[i]);
    setChecked(true);
    setAllCorrect(correct);
    if (correct) {
      setTimeout(() => onResult(true), 600);
    } else {
      setTimeout(() => setChecked(false), 900);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl px-4 py-3 border border-slate-800 bg-slate-900/50">
        <div className="text-xs font-bold mb-1" style={{ fontFamily: FONT_MONO, color: worldColor }}>
          🔢 ORDENAR ETAPAS
        </div>
        <p className="text-white text-sm font-medium leading-relaxed">{activity.instruction}</p>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, idx) => {
          if (!correctSet.has(item)) return null;
          const wrongHighlight = checked && !allCorrect;
          return (
            <div
              key={item}
              draggable={!locked}
              onDragStart={() => setDragIdx(idx)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => {
                if (dragIdx !== null && dragIdx !== idx) move(dragIdx, idx);
                setDragIdx(null);
              }}
              className="flex items-center gap-2 px-3 py-3 rounded-xl border text-sm transition-all"
              style={{
                fontFamily: FONT_MONO,
                borderColor: wrongHighlight ? '#F87171' : allCorrect && checked ? '#34D399' : '#1E293B',
                background: wrongHighlight ? '#7F1D1D22' : allCorrect && checked ? '#064E3B22' : '#0A0F1A',
                color: '#E2E8F0',
                cursor: locked ? 'default' : 'grab',
              }}
            >
              <span
                className="w-5 flex items-center justify-center text-base shrink-0 select-none"
                style={{ color: '#475569' }}
              >
                ⠿
              </span>
              <span className="flex-1">{item}</span>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={locked || idx === 0}
                  className="w-6 h-5 rounded text-slate-500 hover:text-white disabled:opacity-20 text-xs"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={locked || idx === items.length - 1}
                  className="w-6 h-5 rounded text-slate-500 hover:text-white disabled:opacity-20 text-xs"
                >
                  ▼
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {checked && !allCorrect && (
        <div className="text-center text-red-400 text-xs animate-shake" style={{ fontFamily: FONT_MONO }}>
          ❌ Ordem incorreta, tente novamente!
        </div>
      )}

      {!locked && (
        <button
          onClick={handleCheck}
          className="w-full py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{
            fontFamily: FONT_MONO,
            background: `linear-gradient(135deg,${worldColor}CC,${worldColor}88)`,
            color: '#020817',
          }}
        >
          ✓ CONFIRMAR ORDEM
        </button>
      )}
    </div>
  );
}
