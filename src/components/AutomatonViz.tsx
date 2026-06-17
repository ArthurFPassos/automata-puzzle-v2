import { useMemo } from 'react';
import type { Level, AutomatonState, AutomatonTransition, Automaton } from '@/types';
import { SVG, STATE_COLORS, FONT_MONO } from '@/styles/tokens';

export type TransitionId = `T:${string}-${string}`;
export const transitionId = (t: { from: string; to: string }): TransitionId => `T:${t.from}-${t.to}`;

interface InteractiveProps {
  level?: Level;
  automaton?: Automaton;
  highlightState?: string | null;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;

  onStateClick?: (id: string) => void;
  onTransitionClick?: (id: TransitionId) => void;
  selectedIds?: string[];
  correctIds?: string[];
  incorrectIds?: string[];
  hideLabelFor?: TransitionId[];
  accentColor?: string;
  dropTargetIds?: TransitionId[];
  onDropOnTransition?: (id: TransitionId, label: string) => void;
}

function StateNode({
  s,
  highlighted,
  selected,
  correct,
  incorrect,
  clickable,
  accentColor,
  onClick,
}: {
  s: AutomatonState;
  highlighted: boolean;
  selected: boolean;
  correct: boolean;
  incorrect: boolean;
  clickable: boolean;
  accentColor: string;
  onClick?: () => void;
}) {
  const { R } = SVG;
  let colors = highlighted
    ? STATE_COLORS.active
    : s.isError
      ? STATE_COLORS.error
      : s.isAccept
        ? STATE_COLORS.accept
        : STATE_COLORS.normal;

  if (correct) colors = { fill: '#064E3B', stroke: '#34D399' };
  if (incorrect) colors = { fill: '#7F1D1D', stroke: '#F87171' };

  return (
    <g onClick={onClick} style={{ cursor: clickable ? 'pointer' : 'default' }}>
      {s.isInitial && (
        <>
          <line
            x1={s.x - 72} y1={s.y}
            x2={s.x - R - 2} y2={s.y}
            stroke="#334155" strokeWidth={2}
            markerEnd="url(#arrowHead)"
          />
          <text x={s.x - 82} y={s.y - 9} textAnchor="middle" fill="#475569" fontSize={10} fontFamily={FONT_MONO}>
            início
          </text>
        </>
      )}

      {s.isAccept && (
        <circle cx={s.x} cy={s.y} r={R + 7} fill="none" stroke={highlighted ? '#FCD34D' : '#34D399'} strokeWidth={1.5} opacity={0.5} />
      )}

      {selected && (
        <circle cx={s.x} cy={s.y} r={R + 12} fill="none" stroke={accentColor} strokeWidth={2.5} strokeDasharray="4 3" opacity={0.9} />
      )}

      <circle
        cx={s.x} cy={s.y} r={R}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={highlighted || selected ? 3 : 1.8}
        filter={highlighted ? 'url(#glowFX)' : undefined}
        style={{ transition: 'all 0.3s ease' }}
      />

      <text x={s.x} y={s.y + 5} textAnchor="middle" fill="white" fontSize={11} fontWeight={700} fontFamily={FONT_MONO} style={{ pointerEvents: 'none' }}>
        {s.label}
      </text>
    </g>
  );
}

export function AutomatonViz({
  level,
  automaton,
  highlightState = null,
  isFullscreen = false,
  onToggleFullscreen,
  onStateClick,
  onTransitionClick,
  selectedIds = [],
  correctIds = [],
  incorrectIds = [],
  hideLabelFor = [],
  accentColor = '#FCD34D',
  dropTargetIds = [],
  onDropOnTransition,
}: InteractiveProps) {
  const states = automaton?.states ?? level?.states ?? [];
  const transitions = automaton?.transitions ?? level?.transitions ?? [];
  const { W, H, R, LOOP_R, CURVE_OFFSET } = SVG;

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const correctSet = useMemo(() => new Set(correctIds), [correctIds]);
  const incorrectSet = useMemo(() => new Set(incorrectIds), [incorrectIds]);
  const hideSet = useMemo(() => new Set(hideLabelFor), [hideLabelFor]);
  const dropSet = useMemo(() => new Set(dropTargetIds), [dropTargetIds]);

  const stateMap = useMemo(() => {
    const m: Record<string, AutomatonState> = {};
    states.forEach(s => (m[s.id] = s));
    return m;
  }, [states]);

  const renderTransition = (t: AutomatonTransition, i: number) => {
    const from = stateMap[t.from];
    const to   = stateMap[t.to];
    if (!from || !to) return null;

    const tid = transitionId(t);
    const isSelected = selectedSet.has(tid);
    const isCorrect = correctSet.has(tid);
    const isIncorrect = incorrectSet.has(tid);
    const isDropTarget = dropSet.has(tid);
    const hideLabel = hideSet.has(tid);
    const clickable = !!onTransitionClick;

    let stroke = '#475569';
    let sw = 1.8;
    if (isCorrect) { stroke = '#34D399'; sw = 2.6; }
    if (isIncorrect) { stroke = '#F87171'; sw = 2.6; }
    if (isSelected) { stroke = accentColor; sw = 2.6; }
    if (isDropTarget) { stroke = accentColor; sw = 2.2; }

    const isSelf = t.from === t.to;

    const handleClick = () => onTransitionClick?.(tid);
    const handleDragOver = (e: React.DragEvent) => { if (isDropTarget) e.preventDefault(); };
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const label = e.dataTransfer.getData('text/plain');
      if (label) onDropOnTransition?.(tid, label);
    };

    if (isSelf) {
      return (
        <g key={i} onClick={handleClick} style={{ cursor: clickable ? 'pointer' : 'default' }}
           onDragOver={handleDragOver} onDrop={handleDrop}>
          <path
            d={`M ${from.x - 14} ${from.y - R} A ${LOOP_R} ${LOOP_R} 0 1 1 ${from.x + 14} ${from.y - R}`}
            fill="none" stroke={stroke} strokeWidth={sw} markerEnd="url(#arrowHead)"
          />
          {isDropTarget && (
            <circle cx={from.x} cy={from.y - R - LOOP_R} r={16} fill={`${accentColor}22`} stroke={accentColor} strokeDasharray="3 2" />
          )}
          {!hideLabel && (
            <text x={from.x} y={from.y - R - LOOP_R - 16} textAnchor="middle"
                  fill={isCorrect ? '#34D399' : isIncorrect ? '#F87171' : '#94A3B8'} fontSize={11} fontFamily={FONT_MONO}>
              {t.label}
            </text>
          )}
          {hideLabel && (
            <text x={from.x} y={from.y - R - LOOP_R - 16} textAnchor="middle" fill={accentColor} fontSize={14} fontFamily={FONT_MONO}>?</text>
          )}
        </g>
      );
    }

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / dist;
    const uy = dy / dist;

    const hasReverse = transitions.some(r => r.from === t.to && r.to === t.from);

    let pathD: string;
    let labelX: number;
    let labelY: number;

    if (hasReverse) {
      const px = -uy * CURVE_OFFSET;
      const py = ux * CURVE_OFFSET;
      const mx = (from.x + to.x) / 2 + px;
      const my = (from.y + to.y) / 2 + py;
      pathD = `M ${from.x + ux * R} ${from.y + uy * R} Q ${mx} ${my} ${to.x - ux * R} ${to.y - uy * R}`;
      labelX = mx;
      labelY = my - 12;
    } else {
      pathD = `M ${from.x + ux * R} ${from.y + uy * R} L ${to.x - ux * R} ${to.y - uy * R}`;
      labelX = (from.x + to.x) / 2;
      labelY = (from.y + to.y) / 2 - 10;
    }

    return (
      <g key={i} onClick={handleClick} style={{ cursor: clickable ? 'pointer' : 'default' }}
         onDragOver={handleDragOver} onDrop={handleDrop}>
        <path d={pathD} fill="none" stroke={stroke} strokeWidth={sw} markerEnd="url(#arrowHead)" />
        <path d={pathD} fill="none" stroke="transparent" strokeWidth={20} />
        {isDropTarget && (
          <circle cx={labelX} cy={labelY} r={16} fill={`${accentColor}22`} stroke={accentColor} strokeDasharray="3 2" />
        )}
        {!hideLabel && (
          <text x={labelX} y={labelY} textAnchor="middle"
                fill={isCorrect ? '#34D399' : isIncorrect ? '#F87171' : '#94A3B8'} fontSize={11} fontFamily={FONT_MONO}>
            {t.label}
          </text>
        )}
        {hideLabel && (
          <text x={labelX} y={labelY} textAnchor="middle" fill={accentColor} fontSize={14} fontFamily={FONT_MONO}>?</text>
        )}
      </g>
    );
  };

  const legend = (
    <div className="flex gap-4 px-3 pb-2 pt-1 flex-wrap">
      {[
        { fill: '#1E3A8A', stroke: '#3B82F6', label: 'Estado' },
        { fill: '#064E3B', stroke: '#34D399', label: 'Aceitação (duplo)' },
        { fill: '#7F1D1D', stroke: '#F87171', label: 'Erro / Rejeição' },
      ].map(l => (
        <div key={l.label} className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full border" style={{ background: l.fill, borderColor: l.stroke }} />
          <span className="text-slate-500 text-[10px]" style={{ fontFamily: FONT_MONO }}>{l.label}</span>
        </div>
      ))}
    </div>
  );

  const svgEl = (fullscreen: boolean) => (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      <defs>
        <marker id={fullscreen ? 'arrowHeadFS' : 'arrowHead'} markerWidth={10} markerHeight={7} refX={10} refY={3.5} orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
        </marker>
        <filter id={fullscreen ? 'glowFXFS' : 'glowFX'} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={6} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id={fullscreen ? 'dotGridFS' : 'dotGrid'} width={44} height={44} patternUnits="userSpaceOnUse">
          <circle cx={22} cy={22} r={1} fill="#1E293B" />
        </pattern>
      </defs>

      <rect width={W} height={H} fill="#020817" rx={12} />
      <rect width={W} height={H} fill={`url(#${fullscreen ? 'dotGridFS' : 'dotGrid'})`} rx={12} />

      {transitions.map((t, i) => renderTransition(t, i))}

      {states.map(s => {
        const isSelected = selectedSet.has(s.id);
        const isCorrect = correctSet.has(s.id);
        const isIncorrect = incorrectSet.has(s.id);
        return (
          <StateNode
            key={s.id}
            s={s}
            highlighted={highlightState === s.id}
            selected={isSelected}
            correct={isCorrect}
            incorrect={isIncorrect}
            clickable={!!onStateClick}
            accentColor={accentColor}
            onClick={() => onStateClick?.(s.id)}
          />
        );
      })}
    </svg>
  );

  return (
    <>
      {/* Normal inline view */}
      <div className="w-full overflow-x-auto relative">
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="absolute top-2 right-2 z-10 w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700
                       flex items-center justify-center text-slate-300 hover:text-white transition-colors text-sm shadow"
            title="Ampliar autômato"
          >
            🔍
          </button>
        )}
        <div style={{ minWidth: 400, maxHeight: 450, overflow: 'hidden' }}>
          {svgEl(false)}
        </div>
        {legend}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: 'rgba(2,8,23,0.96)', backdropFilter: 'blur(6px)' }}
          onClick={onToggleFullscreen}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 shrink-0">
            <span className="text-slate-300 text-sm font-bold" style={{ fontFamily: FONT_MONO }}>
              🔍 Visualização do Autômato
            </span>
            <button
              onClick={onToggleFullscreen}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-900 flex items-center justify-center text-slate-300 hover:text-white transition-colors text-sm"
              title="Fechar"
            >
              ✕
            </button>
          </div>
          <div
            className="flex-1 flex flex-col items-center justify-center p-4 gap-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-slate-700 shadow-2xl"
                 style={{ background: '#020817' }}>
              {svgEl(true)}
            </div>
            {legend}
          </div>
        </div>
      )}
    </>
  );
}
