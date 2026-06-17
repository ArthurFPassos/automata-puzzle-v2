import { useState, useCallback, useRef, useMemo } from 'react';
import type { BuildAutomatonActivity, AutomatonState, AutomatonTransition, Automaton } from '@/types';
import { FONT_MONO, SVG } from '@/styles/tokens';
import { transitionId, type TransitionId } from '@/components/AutomatonViz';

interface Props {
  activity: BuildAutomatonActivity;
  worldColor: string;
  onResult: (correct: boolean) => void;
  locked: boolean;
}

function runAutomaton(
  automaton: Automaton,
  input: string,
): boolean {
  const initial = automaton.states.find(s => s.isInitial);
  if (!initial) return false;
  let current = initial.id;
  for (const sym of input.split('').filter(c => c !== ',' && c !== ' ' && c !== '')) {
    const t = automaton.transitions.find(t => t.from === current && t.label === sym);
    if (!t) return false;
    current = t.to;
  }
  const finalState = automaton.states.find(s => s.id === current);
  return !!finalState?.isAccept;
}

// ─── Stage 1: Mark initial/accept states ─────────────────────────────────────

function MarkStatesStage({ activity, worldColor, onResult, locked }: Props) {
  const [markedInitial, setMarkedInitial] = useState<string | null>(null);
  const [markedAccept, setMarkedAccept] = useState<string[]>([]);
  const [mode, setMode] = useState<'initial' | 'accept'>('initial');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const states = activity.starter.states;
  const transitions = activity.starter.transitions;

  const toggleState = (id: string) => {
    if (locked || feedback) return;
    if (mode === 'initial') {
      setMarkedInitial(prev => (prev === id ? null : id));
    } else {
      setMarkedAccept(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
      );
    }
  };

  const handleSubmit = () => {
    const builtAutomaton: Automaton = {
      states: states.map(s => ({
        ...s,
        isInitial: s.id === markedInitial,
        isAccept: markedAccept.includes(s.id),
      })),
      transitions,
    };
    const accept = activity.testAccept ?? [];
    const reject = activity.testReject ?? [];
    const correct =
      accept.every(s => runAutomaton(builtAutomaton, s)) &&
      reject.every(s => !runAutomaton(builtAutomaton, s));

    setFeedback(correct ? 'correct' : 'incorrect');
    if (correct) setTimeout(() => onResult(true), 800);
    else setTimeout(() => setFeedback(null), 1200);
  };

  return (
    <div className="flex flex-col gap-3">
      <BuildCanvas
        states={states}
        transitions={transitions}
        markedInitial={markedInitial}
        markedAccept={markedAccept}
        onStateClick={toggleState}
        worldColor={worldColor}
        feedback={feedback}
      />
      <div className="flex gap-2">
        {(['initial', 'accept'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="flex-1 py-2 rounded-xl border text-xs font-bold transition-all"
            style={{
              fontFamily: FONT_MONO,
              borderColor: mode === m ? worldColor : '#1E293B',
              background: mode === m ? `${worldColor}22` : '#0A0F1A',
              color: mode === m ? worldColor : '#64748B',
            }}
          >
            {m === 'initial' ? '▶ Estado Inicial' : '⊙ Estado Aceitador'}
          </button>
        ))}
      </div>
      {feedback === 'incorrect' && (
        <p className="text-red-400 text-xs text-center" style={{ fontFamily: FONT_MONO }}>
          ❌ Alguns casos de teste falharam. Tente outra configuração!
        </p>
      )}
      <button
        onClick={handleSubmit}
        disabled={locked || !markedInitial || !!feedback}
        className="w-full py-3 rounded-xl font-black text-sm transition-all disabled:opacity-30"
        style={{ fontFamily: FONT_MONO, background: `linear-gradient(135deg,${worldColor}CC,${worldColor}88)`, color: '#020817' }}
      >
        ✓ TESTAR AUTÔMATO
      </button>
    </div>
  );
}

// ─── Stage 2: Add transitions ────────────────────────────────────────────────

function AddTransitionsStage({ activity, worldColor, onResult, locked }: Props) {
  const [transitions, setTransitions] = useState<AutomatonTransition[]>([...activity.starter.transitions]);
  const [draggingLabel, setDraggingLabel] = useState<string | null>(null);
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const [pendingLabel, setPendingLabel] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const states = activity.starter.states;
  const max = activity.maxTransitions ?? 99;
  const pool = activity.labelPool ?? [];

  const addTransition = (from: string, to: string, label: string) => {
    if (transitions.length >= max) return;
    // avoid exact duplicate
    if (transitions.some(t => t.from === from && t.to === to && t.label === label)) return;
    setTransitions(prev => [...prev, { from, to, label }]);
  };

  const removeTransition = (idx: number) => {
    setTransitions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleStateClick = (id: string) => {
    if (locked || feedback) return;
    if (!pendingFrom) {
      setPendingFrom(id);
    } else if (!pendingLabel) {
      // need label first — do nothing, wait for label pick
    } else {
      addTransition(pendingFrom, id, pendingLabel);
      setPendingFrom(null);
      setPendingLabel(null);
    }
  };

  const handleLabelPick = (label: string) => {
    if (!pendingFrom) return;
    setPendingLabel(label);
  };

  const handleSubmit = () => {
    const built: Automaton = { states: activity.starter.states, transitions };
    const accept = activity.testAccept ?? [];
    const reject = activity.testReject ?? [];
    const correct =
      accept.every(s => runAutomaton(built, s)) &&
      reject.every(s => !runAutomaton(built, s));
    setFeedback(correct ? 'correct' : 'incorrect');
    if (correct) setTimeout(() => onResult(true), 800);
    else setTimeout(() => setFeedback(null), 1200);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl px-4 py-3 border border-slate-800 bg-slate-900/50">
        <div className="text-xs font-bold mb-1" style={{ fontFamily: FONT_MONO, color: worldColor }}>
          📊 USAR TRANSIÇÕES: {transitions.length}/{max}
        </div>
        <p className="text-slate-400 text-xs" style={{ fontFamily: FONT_MONO }}>
          {!pendingFrom
            ? '1. Toque no estado DE ONDE a transição sai'
            : !pendingLabel
              ? `De: ${pendingFrom} — 2. Escolha o rótulo abaixo`
              : `De: ${pendingFrom} [${pendingLabel}] — 3. Toque no estado DESTINO`}
        </p>
      </div>

      <BuildCanvas
        states={states}
        transitions={transitions}
        markedInitial={states.find(s => s.isInitial)?.id ?? null}
        markedAccept={states.filter(s => s.isAccept).map(s => s.id)}
        onStateClick={handleStateClick}
        highlightedState={pendingFrom}
        worldColor={worldColor}
        feedback={feedback}
      />

      {/* Label pool */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 self-center" style={{ fontFamily: FONT_MONO }}>Rótulos:</span>
        {pool.map(label => (
          <button
            key={label}
            onClick={() => handleLabelPick(label)}
            disabled={!pendingFrom || !!pendingLabel}
            className="px-3 py-1.5 rounded-lg border text-xs font-bold transition-all disabled:opacity-40"
            style={{
              fontFamily: FONT_MONO,
              borderColor: pendingLabel === label ? worldColor : `${worldColor}55`,
              background: pendingLabel === label ? `${worldColor}33` : `${worldColor}15`,
              color: worldColor,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Transition list */}
      <div className="flex flex-col gap-1 max-h-28 overflow-y-auto">
        {transitions.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/30 text-xs"
            style={{ fontFamily: FONT_MONO }}
          >
            <span className="text-slate-400 flex-1">{t.from} →[{t.label}]→ {t.to}</span>
            {!locked && !feedback && i >= activity.starter.transitions.length && (
              <button onClick={() => removeTransition(i)} className="text-red-400 hover:text-red-300 text-base leading-none">×</button>
            )}
          </div>
        ))}
      </div>

      {feedback === 'incorrect' && (
        <p className="text-red-400 text-xs text-center" style={{ fontFamily: FONT_MONO }}>
          ❌ O autômato não aceita/rejeita as strings corretamente. Revise suas transições!
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={locked || !!feedback}
        className="w-full py-3 rounded-xl font-black text-sm transition-all disabled:opacity-30"
        style={{ fontFamily: FONT_MONO, background: `linear-gradient(135deg,${worldColor}CC,${worldColor}88)`, color: '#020817' }}
      >
        ✓ TESTAR AUTÔMATO
      </button>
    </div>
  );
}

// ─── Stage 3: Full build ─────────────────────────────────────────────────────

function FullBuildStage({ activity, worldColor, onResult, locked }: Props) {
  const availableStates = activity.availableStates ?? 4;
  const pool = activity.labelPool ?? [];

  const [states, setStates] = useState<AutomatonState[]>(() => {
    const base = activity.starter.states;
    const extras: AutomatonState[] = Array.from({ length: availableStates }, (_, i) => ({
      id: `q${base.length + i}`,
      label: `q${base.length + i}`,
      x: 100 + i * 130,
      y: 230,
      isInitial: false,
      isAccept: false,
    }));
    return [...base, ...extras];
  });
  const [transitions, setTransitions] = useState<AutomatonTransition[]>([]);
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const [pendingLabel, setPendingLabel] = useState<string | null>(null);
  const [mode, setMode] = useState<'build' | 'mark-initial' | 'mark-accept'>('build');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleStateClick = (id: string) => {
    if (locked || feedback) return;
    if (mode === 'mark-initial') {
      setStates(prev => prev.map(s => ({ ...s, isInitial: s.id === id })));
      return;
    }
    if (mode === 'mark-accept') {
      setStates(prev => prev.map(s => s.id === id ? { ...s, isAccept: !s.isAccept } : s));
      return;
    }
    if (!pendingFrom) { setPendingFrom(id); return; }
    if (!pendingLabel) return;
    if (!transitions.some(t => t.from === pendingFrom && t.to === id && t.label === pendingLabel)) {
      setTransitions(prev => [...prev, { from: pendingFrom, to: id, label: pendingLabel }]);
    }
    setPendingFrom(null);
    setPendingLabel(null);
  };

  const handleSubmit = () => {
    const built: Automaton = { states, transitions };
    const accept = activity.testAccept ?? [];
    const reject = activity.testReject ?? [];
    const correct =
      accept.every(s => runAutomaton(built, s)) &&
      reject.every(s => !runAutomaton(built, s));
    setFeedback(correct ? 'correct' : 'incorrect');
    if (correct) setTimeout(() => onResult(true), 800);
    else setTimeout(() => setFeedback(null), 1400);
  };

  const markedInitial = states.find(s => s.isInitial)?.id ?? null;
  const markedAccept = states.filter(s => s.isAccept).map(s => s.id);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl px-4 py-3 border border-slate-800 bg-slate-900/50">
        <div className="text-xs font-bold mb-1" style={{ fontFamily: FONT_MONO, color: worldColor }}>
          🏗️ CONSTRUÇÃO LIVRE
        </div>
        <p className="text-slate-400 text-xs" style={{ fontFamily: FONT_MONO }}>
          {mode === 'build'
            ? (!pendingFrom ? '1. Toque no estado ORIGEM' : !pendingLabel ? '2. Escolha o rótulo' : '3. Toque no estado DESTINO')
            : mode === 'mark-initial' ? 'Toque no estado inicial'
            : 'Toque para alternar estados aceitadores'}
        </p>
      </div>

      {/* Mode bar */}
      <div className="flex gap-1.5">
        {([
          { key: 'build', label: '→ Transição' },
          { key: 'mark-initial', label: '▶ Inicial' },
          { key: 'mark-accept', label: '⊙ Aceitar' },
        ] as const).map(m => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setPendingFrom(null); setPendingLabel(null); }}
            className="flex-1 py-1.5 rounded-lg border text-[11px] font-bold transition-all"
            style={{
              fontFamily: FONT_MONO,
              borderColor: mode === m.key ? worldColor : '#1E293B',
              background: mode === m.key ? `${worldColor}22` : '#0A0F1A',
              color: mode === m.key ? worldColor : '#64748B',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <BuildCanvas
        states={states}
        transitions={transitions}
        markedInitial={markedInitial}
        markedAccept={markedAccept}
        onStateClick={handleStateClick}
        highlightedState={pendingFrom}
        worldColor={worldColor}
        feedback={feedback}
      />

      {/* Label pool for build mode */}
      {mode === 'build' && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500" style={{ fontFamily: FONT_MONO }}>Rótulo:</span>
          {pool.map(label => (
            <button
              key={label}
              onClick={() => handleLabelPickFull(label, pendingFrom, setPendingLabel, pendingLabel)}
              disabled={!pendingFrom || !!pendingLabel}
              className="px-3 py-1.5 rounded-lg border text-xs font-bold transition-all disabled:opacity-40"
              style={{
                fontFamily: FONT_MONO,
                borderColor: pendingLabel === label ? worldColor : `${worldColor}55`,
                background: pendingLabel === label ? `${worldColor}33` : `${worldColor}15`,
                color: worldColor,
              }}
            >
              {label}
            </button>
          ))}
          {transitions.length > 0 && (
            <button
              onClick={() => setTransitions(prev => prev.slice(0, -1))}
              className="px-2 py-1 rounded border border-red-900 text-red-400 text-xs"
            >
              ↩ Desfazer
            </button>
          )}
        </div>
      )}

      {feedback === 'incorrect' && (
        <p className="text-red-400 text-xs text-center" style={{ fontFamily: FONT_MONO }}>
          ❌ O autômato não está correto. Verifique as strings de teste e tente de novo!
        </p>
      )}

      {/* Test cases preview */}
      <TestCasesPreview
        automaton={{ states, transitions }}
        testAccept={activity.testAccept ?? []}
        testReject={activity.testReject ?? []}
        worldColor={worldColor}
      />

      <button
        onClick={handleSubmit}
        disabled={locked || !!feedback || !markedInitial}
        className="w-full py-3 rounded-xl font-black text-sm transition-all disabled:opacity-30"
        style={{ fontFamily: FONT_MONO, background: `linear-gradient(135deg,${worldColor}CC,${worldColor}88)`, color: '#020817' }}
      >
        ✓ TESTAR AUTÔMATO
      </button>
    </div>
  );
}

function handleLabelPickFull(
  label: string,
  pendingFrom: string | null,
  setPendingLabel: (l: string | null) => void,
  pendingLabel: string | null,
) {
  if (!pendingFrom) return;
  setPendingLabel(label);
}

// ─── Shared SVG canvas ───────────────────────────────────────────────────────

function BuildCanvas({
  states,
  transitions,
  markedInitial,
  markedAccept,
  onStateClick,
  highlightedState,
  worldColor,
  feedback,
}: {
  states: AutomatonState[];
  transitions: AutomatonTransition[];
  markedInitial: string | null;
  markedAccept: string[];
  onStateClick: (id: string) => void;
  highlightedState?: string | null;
  worldColor: string;
  feedback: 'correct' | 'incorrect' | null;
}) {
  const { W, H, R, LOOP_R, CURVE_OFFSET } = SVG;

  const stateMap = useMemo(() => {
    const m: Record<string, AutomatonState> = {};
    states.forEach(s => (m[s.id] = s));
    return m;
  }, [states]);

  const enrichedStates = states.map(s => ({
    ...s,
    isInitial: s.id === markedInitial,
    isAccept: markedAccept.includes(s.id),
  }));

  return (
    <div className="rounded-2xl border overflow-hidden"
         style={{ borderColor: feedback === 'correct' ? '#34D399' : feedback === 'incorrect' ? '#F87171' : '#1E293B' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ minWidth: 400, display: 'block' }}>
        <defs>
          <marker id="arrowHead" markerWidth={10} markerHeight={7} refX={10} refY={3.5} orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
          </marker>
          <filter id="glowFX" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={6} result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <pattern id="dotGrid" width={44} height={44} patternUnits="userSpaceOnUse">
            <circle cx={22} cy={22} r={1} fill="#1E293B" />
          </pattern>
        </defs>

        <rect width={W} height={H} fill="#020817" rx={12} />
        <rect width={W} height={H} fill="url(#dotGrid)" rx={12} />

        {/* Transitions */}
        {transitions.map((t, i) => {
          const from = stateMap[t.from];
          const to = stateMap[t.to];
          if (!from || !to) return null;
          const isSelf = t.from === t.to;

          if (isSelf) {
            return (
              <g key={i}>
                <path
                  d={`M ${from.x - 14} ${from.y - R} A ${LOOP_R} ${LOOP_R} 0 1 1 ${from.x + 14} ${from.y - R}`}
                  fill="none" stroke="#475569" strokeWidth={1.8} markerEnd="url(#arrowHead)"
                />
                <text x={from.x} y={from.y - R - LOOP_R - 16} textAnchor="middle"
                      fill="#94A3B8" fontSize={11} fontFamily={FONT_MONO}>{t.label}</text>
              </g>
            );
          }

          const dx = to.x - from.x; const dy = to.y - from.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ux = dx / dist; const uy = dy / dist;
          const hasRev = transitions.some(r => r.from === t.to && r.to === t.from);

          let pathD: string; let lx: number; let ly: number;
          if (hasRev) {
            const px = -uy * CURVE_OFFSET; const py = ux * CURVE_OFFSET;
            const mx = (from.x + to.x) / 2 + px; const my = (from.y + to.y) / 2 + py;
            pathD = `M ${from.x + ux * R} ${from.y + uy * R} Q ${mx} ${my} ${to.x - ux * R} ${to.y - uy * R}`;
            lx = mx; ly = my - 12;
          } else {
            pathD = `M ${from.x + ux * R} ${from.y + uy * R} L ${to.x - ux * R} ${to.y - uy * R}`;
            lx = (from.x + to.x) / 2; ly = (from.y + to.y) / 2 - 10;
          }

          return (
            <g key={i}>
              <path d={pathD} fill="none" stroke="#475569" strokeWidth={1.8} markerEnd="url(#arrowHead)" />
              <text x={lx} y={ly} textAnchor="middle" fill="#94A3B8" fontSize={11} fontFamily={FONT_MONO}>{t.label}</text>
            </g>
          );
        })}

        {/* States */}
        {enrichedStates.map(s => {
          const isHighlighted = highlightedState === s.id;
          let fill = '#1E3A8A'; let stroke2 = '#3B82F6';
          if (s.isAccept) { fill = '#064E3B'; stroke2 = '#34D399'; }
          if (isHighlighted) { fill = '#D97706'; stroke2 = '#FCD34D'; }

          return (
            <g key={s.id} onClick={() => onStateClick(s.id)} style={{ cursor: 'pointer' }}>
              {s.isInitial && (
                <line x1={s.x - 72} y1={s.y} x2={s.x - R - 2} y2={s.y}
                      stroke="#334155" strokeWidth={2} markerEnd="url(#arrowHead)" />
              )}
              {s.isAccept && (
                <circle cx={s.x} cy={s.y} r={R + 7} fill="none" stroke="#34D399" strokeWidth={1.5} opacity={0.5} />
              )}
              {isHighlighted && (
                <circle cx={s.x} cy={s.y} r={R + 13} fill="none" stroke={worldColor}
                        strokeWidth={2} strokeDasharray="4 3" opacity={0.8} />
              )}
              <circle cx={s.x} cy={s.y} r={R} fill={fill} stroke={stroke2}
                      strokeWidth={isHighlighted ? 3 : 1.8}
                      filter={isHighlighted ? 'url(#glowFX)' : undefined}
                      style={{ transition: 'all 0.25s ease' }} />
              <text x={s.x} y={s.y + 5} textAnchor="middle" fill="white"
                    fontSize={11} fontWeight={700} fontFamily={FONT_MONO}
                    style={{ pointerEvents: 'none' }}>
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Test cases preview ───────────────────────────────────────────────────────

function TestCasesPreview({
  automaton, testAccept, testReject, worldColor,
}: {
  automaton: Automaton;
  testAccept: string[];
  testReject: string[];
  worldColor: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-xs text-slate-500" style={{ fontFamily: FONT_MONO }}>CASOS DE TESTE (ao vivo):</div>
      <div className="flex flex-wrap gap-2">
        {testAccept.map(s => {
          const ok = runAutomaton(automaton, s);
          return (
            <div key={s} className="px-2 py-1 rounded border text-xs" style={{
              fontFamily: FONT_MONO,
              borderColor: ok ? '#34D399' : '#1E293B',
              background: ok ? '#064E3B22' : '#0A0F1A',
              color: ok ? '#34D399' : '#475569',
            }}>
              {ok ? '✓' : '○'} "{s}" aceitar
            </div>
          );
        })}
        {testReject.map(s => {
          const rejected = !runAutomaton(automaton, s);
          return (
            <div key={s} className="px-2 py-1 rounded border text-xs" style={{
              fontFamily: FONT_MONO,
              borderColor: rejected ? '#34D399' : '#F87171',
              background: rejected ? '#064E3B22' : '#7F1D1D22',
              color: rejected ? '#34D399' : '#F87171',
            }}>
              {rejected ? '✓' : '✗'} "{s}" rejeitar
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component (dispatcher) ─────────────────────────────────────────────

export function BuildAutomatonActivityView(props: Props) {
  const { activity, worldColor } = props;

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl px-4 py-3 border border-slate-800 bg-slate-900/50">
        <div className="text-xs font-bold mb-1" style={{ fontFamily: FONT_MONO, color: worldColor }}>
          🏗️ CONSTRUÇÃO DE AUTÔMATO
        </div>
        <p className="text-white text-sm font-medium leading-relaxed">{activity.instruction}</p>
        <div className="mt-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700">
          <span className="text-xs text-slate-400" style={{ fontFamily: FONT_MONO }}>L = </span>
          <span className="text-xs font-bold text-amber-400" style={{ fontFamily: FONT_MONO }}>
            {activity.languageDescription}
          </span>
        </div>
      </div>

      {activity.stage === 'mark-states' && <MarkStatesStage {...props} />}
      {activity.stage === 'add-transitions' && <AddTransitionsStage {...props} />}
      {activity.stage === 'full-build' && <FullBuildStage {...props} />}
    </div>
  );
}
