import { useState } from 'react';
import type { FillDiagramActivity, Level } from '@/types';
import { AutomatonViz } from '@/components/AutomatonViz';
import { FONT_MONO } from '@/styles/tokens';

interface Props {
  activity: FillDiagramActivity;
  level: Level;
  worldColor: string;
  onResult: (correct: boolean) => void;
  locked: boolean;
}

export function FillDiagramActivityView({ activity, level, worldColor, onResult, locked }: Props) {
  const [markedInitial, setMarkedInitial] = useState<string[]>([]);
  const [markedAccept, setMarkedAccept] = useState<string[]>([]);
  const [mode, setMode] = useState<'initial' | 'accept'>('initial');
  const [submitted, setSubmitted] = useState(false);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  // strip isInitial/isAccept from all states — player must define them
  const strippedLevel: Level = {
    ...level,
    states: level.states.map(s => ({ ...s, isInitial: false, isAccept: false })),
  };

  const toggleState = (id: string) => {
    if (locked || submitted) return;
    if (mode === 'initial') {
      setMarkedInitial(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
      );
    } else {
      setMarkedAccept(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
      );
    }
  };

  const handleSubmit = () => {
    const initOk =
      new Set(markedInitial).size === new Set(activity.correctInitial).size &&
      activity.correctInitial.every(id => markedInitial.includes(id));
    const accOk =
      new Set(markedAccept).size === new Set(activity.correctAccept).size &&
      activity.correctAccept.every(id => markedAccept.includes(id));
    const correct = initOk && accOk;

    setSubmitted(true);
    setWasCorrect(correct);

    if (correct) {
      setTimeout(() => onResult(true), 800);
    } else {
      setTimeout(() => {
        setSubmitted(false);
        setWasCorrect(null);
        setMarkedInitial([]);
        setMarkedAccept([]);
        setMode('initial');
      }, 1200);
    }
  };

  const correctIds = submitted && wasCorrect
    ? [...activity.correctInitial, ...activity.correctAccept]
    : [];
  const incorrectIds = submitted && !wasCorrect
    ? [
        ...markedInitial.filter(id => !activity.correctInitial.includes(id)),
        ...markedAccept.filter(id => !activity.correctAccept.includes(id)),
      ]
    : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl px-4 py-3 border border-slate-800 bg-slate-900/50">
        <div className="text-xs font-bold mb-1" style={{ fontFamily: FONT_MONO, color: worldColor }}>
          ✏️ COMPLETAR DIAGRAMA
        </div>
        <p className="text-white text-sm font-medium leading-relaxed">{activity.instruction}</p>
      </div>

      {/* Mode switcher */}
      <div className="flex gap-2">
        {[
          { key: 'initial' as const, label: '▶ Marcar Estado Inicial', count: markedInitial.length, max: activity.correctInitial.length },
          { key: 'accept' as const, label: '⊙ Marcar Estado Aceitador', count: markedAccept.length, max: activity.correctAccept.length },
        ].map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className="flex-1 py-2 rounded-xl border text-xs font-bold transition-all"
            style={{
              fontFamily: FONT_MONO,
              borderColor: mode === m.key ? worldColor : '#1E293B',
              background: mode === m.key ? `${worldColor}22` : '#0A0F1A',
              color: mode === m.key ? worldColor : '#64748B',
            }}
          >
            {m.label} ({m.count}/{m.max})
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
        <AutomatonViz
          level={strippedLevel}
          onStateClick={toggleState}
          selectedIds={mode === 'initial' ? markedInitial : markedAccept}
          correctIds={correctIds}
          incorrectIds={incorrectIds}
          accentColor={worldColor}
        />
      </div>

      {/* Visual summary of marked states */}
      <div className="flex gap-3 text-xs" style={{ fontFamily: FONT_MONO }}>
        <div className="flex-1 p-2 rounded-lg border border-slate-800 bg-slate-900/30">
          <span className="text-slate-500">Inicial(is): </span>
          <span style={{ color: worldColor }}>{markedInitial.join(', ') || '—'}</span>
        </div>
        <div className="flex-1 p-2 rounded-lg border border-slate-800 bg-slate-900/30">
          <span className="text-slate-500">Aceitador(es): </span>
          <span style={{ color: '#34D399' }}>{markedAccept.join(', ') || '—'}</span>
        </div>
      </div>

      {submitted && !wasCorrect && (
        <div className="text-center text-red-400 text-xs" style={{ fontFamily: FONT_MONO }}>
          ❌ Marcação incorreta, tente novamente!
        </div>
      )}

      {!locked && !submitted && (
        <button
          onClick={handleSubmit}
          disabled={markedInitial.length === 0 && markedAccept.length === 0}
          className="w-full py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.01]
                     active:scale-[0.99] disabled:opacity-30"
          style={{
            fontFamily: FONT_MONO,
            background: `linear-gradient(135deg,${worldColor}CC,${worldColor}88)`,
            color: '#020817',
          }}
        >
          ✓ CONFIRMAR DIAGRAMA
        </button>
      )}
    </div>
  );
}
