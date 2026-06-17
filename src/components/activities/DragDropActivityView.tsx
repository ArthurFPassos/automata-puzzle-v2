import { useState, useMemo } from 'react';
import type { DragDropActivity, Level } from '@/types';
import { AutomatonViz, transitionId, type TransitionId } from '@/components/AutomatonViz';
import { FONT_MONO } from '@/styles/tokens';

interface Props {
  activity: DragDropActivity;
  level: Level;
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

export function DragDropActivityView({ activity, level, worldColor, onResult, locked }: Props) {
  const blankIds = useMemo(
    () => activity.blanks.map(b => transitionId(b)),
    [activity],
  );

  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [pool, setPool] = useState<string[]>(() => shuffle(activity.labelPool));
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [activeDropTargets, setActiveDropTargets] = useState<TransitionId[]>(blankIds);

  const allFilled = Object.keys(placements).length === activity.blanks.length;

  const vizAutomaton = useMemo(() => ({
    states: level.states,
    transitions: level.transitions.map(t => {
      const tid = transitionId(t);
      const filled = placements[tid];
      return filled ? { ...t, label: filled } : t;
    }),
  }), [level, placements]);

  const hideLabelFor = blankIds.filter(tid => !placements[tid]);

  const correctIds = feedback === 'correct' ? blankIds : [];
  const incorrectIds = feedback === 'incorrect'
    ? blankIds.filter(tid => placements[tid]?.trim().toLowerCase() !==
        activity.blanks.find(b => transitionId(b) === tid)?.correctLabel.trim().toLowerCase())
    : [];

  const handleDrop = (tid: TransitionId, label: string) => {
    if (locked || placements[tid]) return;
    setPlacements(prev => ({ ...prev, [tid]: label }));
    setPool(prev => {
      const idx = prev.indexOf(label);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
    setActiveDropTargets(prev => prev.filter(x => x !== tid));
  };

  const handleSubmit = () => {
    const correct = activity.blanks.every(b => {
      const tid = transitionId(b);
      return placements[tid]?.trim().toLowerCase() === b.correctLabel.trim().toLowerCase();
    });

    if (correct) {
      setFeedback('correct');
      setTimeout(() => onResult(true), 800);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
        setPlacements({});
        setPool(shuffle(activity.labelPool));
        setActiveDropTargets(blankIds);
      }, 1100);
    }
  };

  const removeFilled = (tid: TransitionId) => {
    if (locked || !!feedback) return;
    const label = placements[tid];
    if (!label) return;
    setPlacements(prev => {
      const next = { ...prev };
      delete next[tid];
      return next;
    });
    setPool(prev => [...prev, label]);
    setActiveDropTargets(prev => [...prev, tid]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl px-4 py-3 border border-slate-800 bg-slate-900/50">
        <div className="text-xs font-bold mb-1" style={{ fontFamily: FONT_MONO, color: worldColor }}>
          🧩 ARRASTAR E SOLTAR
        </div>
        <p className="text-white text-sm font-medium leading-relaxed">{activity.instruction}</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
        <AutomatonViz
          automaton={vizAutomaton}
          hideLabelFor={hideLabelFor as TransitionId[]}
          dropTargetIds={activeDropTargets}
          onDropOnTransition={handleDrop}
          correctIds={correctIds}
          incorrectIds={incorrectIds}
          accentColor={worldColor}
        />
      </div>

      {/* Tap-to-fill fallback */}
      <div className="flex flex-col gap-1.5">
        <div className="text-xs text-slate-500" style={{ fontFamily: FONT_MONO }}>TRANSIÇÕES A COMPLETAR:</div>
        <div className="flex flex-wrap gap-2">
          {activity.blanks.map(b => {
            const tid = transitionId(b);
            const filled = placements[tid];
            return (
              <button
                key={String(tid)}
                onClick={() => filled && removeFilled(tid)}
                disabled={locked}
                className="px-3 py-2 rounded-lg border text-xs font-mono"
                style={{
                  borderColor: filled ? '#34D39955' : '#1E293B',
                  background: filled ? '#064E3B22' : '#0A0F1A',
                  color: filled ? '#34D399' : '#64748B',
                }}
              >
                {b.from} → {b.to}: {filled ?? '?'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Label pool */}
      <div className="flex flex-wrap gap-2">
        {pool.map((label, i) => (
          <div
            key={label + i}
            draggable={!locked && !feedback}
            onDragStart={e => e.dataTransfer.setData('text/plain', label)}
            className="px-3 py-2 rounded-lg border text-xs font-bold cursor-grab active:cursor-grabbing"
            style={{ fontFamily: FONT_MONO, borderColor: `${worldColor}55`, background: `${worldColor}15`, color: worldColor }}
          >
            {label}
          </div>
        ))}
        {pool.length === 0 && (
          <div className="text-xs text-slate-600 italic" style={{ fontFamily: FONT_MONO }}>
            Todos os rótulos foram usados.
          </div>
        )}
      </div>

      {feedback === 'incorrect' && (
        <div className="text-center text-red-400 text-xs" style={{ fontFamily: FONT_MONO }}>
          ❌ Algum rótulo está errado, tente novamente!
        </div>
      )}

      {!locked && !feedback && (
        <button
          onClick={handleSubmit}
          disabled={!allFilled}
          className="w-full py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30"
          style={{ fontFamily: FONT_MONO, background: `linear-gradient(135deg,${worldColor}CC,${worldColor}88)`, color: '#020817' }}
        >
          ✓ CONFIRMAR
        </button>
      )}
    </div>
  );
}
