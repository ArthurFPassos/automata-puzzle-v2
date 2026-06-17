import { useState } from 'react';
import type { IdentifyActivity, Level } from '@/types';
import { AutomatonViz } from '@/components/AutomatonViz';
import { FONT_MONO } from '@/styles/tokens';

interface Props {
  activity: IdentifyActivity;
  level: Level;
  worldColor: string;
  onResult: (correct: boolean) => void;
  locked: boolean;
}

export function IdentifyActivityView({ activity, level, worldColor, onResult, locked }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  const max = activity.maxSelections ?? activity.correctIds.length;

  const toggle = (id: string) => {
    if (locked || submitted) return;
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= max) return prev;
      return [...prev, id];
    });
  };

  const handleSubmit = () => {
    const correctSet = new Set(activity.correctIds);
    const selSet = new Set(selected);
    const correct =
      correctSet.size === selSet.size &&
      [...correctSet].every(id => selSet.has(id));

    setSubmitted(true);
    setWasCorrect(correct);

    if (correct) {
      setTimeout(() => onResult(true), 800);
    } else {
      setTimeout(() => {
        setSubmitted(false);
        setWasCorrect(null);
        setSelected([]);
      }, 1100);
    }
  };

  const correctIds = submitted && wasCorrect ? activity.correctIds : [];
  const incorrectIds = submitted && !wasCorrect ? selected.filter(id => !activity.correctIds.includes(id)) : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl px-4 py-3 border border-slate-800 bg-slate-900/50">
        <div className="text-xs font-bold mb-1" style={{ fontFamily: FONT_MONO, color: worldColor }}>
          🎯 IDENTIFICAR NO DIAGRAMA
        </div>
        <p className="text-white text-sm font-medium leading-relaxed">{activity.instruction}</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
        <AutomatonViz
          level={level}
          onStateClick={toggle}
          onTransitionClick={toggle}
          selectedIds={selected}
          correctIds={correctIds}
          incorrectIds={incorrectIds}
          accentColor={worldColor}
        />
      </div>

      <div className="text-center text-xs text-slate-500" style={{ fontFamily: FONT_MONO }}>
        {submitted
          ? wasCorrect ? '✓ Correto!' : '❌ Tente novamente!'
          : `Selecionado: ${selected.length}/${max} — toque nos elementos do diagrama`}
      </div>

      {!locked && !submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
          className="w-full py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.01]
                     active:scale-[0.99] disabled:opacity-30"
          style={{ fontFamily: FONT_MONO, background: `linear-gradient(135deg,${worldColor}CC,${worldColor}88)`, color: '#020817' }}
        >
          ✓ CONFIRMAR SELEÇÃO
        </button>
      )}
    </div>
  );
}
