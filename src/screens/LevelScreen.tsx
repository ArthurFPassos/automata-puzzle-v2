import type { Level, World, ProgressMap, Screen } from '@/types';
import { FONT_MONO, FONT_SANS, COLOR } from '@/styles/tokens';
import { Stars } from '@/components/Stars';

interface Props {
  world: World;
  levels: Level[];
  progress: ProgressMap;
  allLevels: Level[];
  onSelectLevel: (id: number) => void;
  onBack: () => void;
  onNavigate: (s: Screen) => void;
}

const ACTIVITY_LABELS: Record<string, string> = {
  'quiz':           '❓ Quiz',
  'match':          '🔗 Associação',
  'order':          '🔢 Ordenar',
  'identify':       '🎯 Identificar',
  'select-elements':'👆 Seleção Visual',
  'dragdrop':       '🧩 Arrastar e Soltar',
  'fill-diagram':   '✏️ Completar',
  'build-automaton':'🏗️ Construção',
};

const BUILD_STAGE_LABELS: Record<string, string> = {
  'mark-states':     'Marcar estados',
  'add-transitions': 'Adicionar transições',
  'full-build':      'Construção livre',
};

export function LevelScreen({ world, levels, progress, allLevels, onSelectLevel, onBack, onNavigate }: Props) {
  const prevWorldLevels = allLevels.filter(l => l.world === world.id - 1);
  const worldLocked = world.id > 1 && prevWorldLevels.some(l => !progress[l.id]?.completed);
  const done = levels.filter(l => progress[l.id]?.completed).length;

  return (
    <div className="min-h-screen" style={{ background: COLOR.base, fontFamily: FONT_SANS }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 border-b"
           style={{ borderColor: COLOR.border, background: COLOR.base }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center text-slate-400 hover:text-white"
                  style={{ borderColor: COLOR.border }}>
            ←
          </button>
          <div className="flex items-center gap-3 flex-1">
            <span className="text-3xl">{world.emoji}</span>
            <div>
              <h1 className="text-white font-black text-lg leading-tight" style={{ fontFamily: FONT_MONO }}>
                {world.name}
              </h1>
              <p className="text-sm font-bold" style={{ color: world.color }}>{world.subtitle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-black text-xl" style={{ fontFamily: FONT_MONO, color: world.color }}>
              {done}/{levels.length}
            </div>
            <div className="text-[10px] text-slate-600" style={{ fontFamily: FONT_MONO }}>completos</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full rounded-full transition-all"
               style={{ width: `${(done / levels.length) * 100}%`, background: world.color }} />
        </div>
      </div>

      {worldLocked ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
          <div className="text-5xl">🔒</div>
          <h2 className="text-white font-black text-xl text-center" style={{ fontFamily: FONT_MONO }}>
            Mundo Bloqueado
          </h2>
          <p className="text-slate-500 text-sm text-center" style={{ fontFamily: FONT_MONO }}>
            Complete todas as fases do Mundo {world.id - 1} para desbloquear.
          </p>
          <button onClick={onBack}
                  className="px-6 py-3 rounded-xl border text-sm font-bold"
                  style={{ fontFamily: FONT_MONO, borderColor: COLOR.border, color: COLOR.dim }}>
            ← Voltar
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-4 max-w-lg mx-auto">
          {levels.map((level, i) => {
            const p      = progress[level.id];
            const isLocked = i > 0 && !progress[levels[i - 1].id]?.completed;
            const act    = level.activity;
            const typeLabel = ACTIVITY_LABELS[act.type] ?? act.type;
            const stageLabel = act.type === 'build-automaton'
              ? ` · ${BUILD_STAGE_LABELS[act.stage]}`
              : '';

            return (
              <button
                key={level.id}
                onClick={() => !isLocked && onSelectLevel(level.id)}
                disabled={isLocked}
                className="w-full rounded-2xl border p-4 text-left transition-all hover:scale-[1.005] active:scale-[0.995] disabled:opacity-35"
                style={{
                  borderColor: p?.completed ? world.color + '55' : isLocked ? COLOR.border : COLOR.borderMid,
                  background: p?.completed ? `${world.color}0A` : isLocked ? COLOR.card2 : COLOR.card,
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Number */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                       style={{
                         fontFamily: FONT_MONO,
                         background: p?.completed ? `${world.color}33` : isLocked ? '#1E293B' : '#0F172A',
                         color: p?.completed ? world.color : isLocked ? COLOR.muted : COLOR.dim,
                         border: `1px solid ${p?.completed ? world.color + '44' : COLOR.border}`,
                       }}>
                    {isLocked ? '🔒' : level.id}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-black text-sm truncate" style={{ fontFamily: FONT_MONO }}>
                        {level.name}
                      </p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0"
                            style={{ fontFamily: FONT_MONO, background: `${world.color}22`, color: world.color }}>
                        {typeLabel}{stageLabel}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs truncate mt-0.5" style={{ fontFamily: FONT_MONO }}>
                      {level.concept}
                    </p>
                  </div>

                  {/* Stars / difficulty */}
                  <div className="shrink-0 text-right">
                    {p?.completed ? (
                      <Stars count={p.stars} size="text-xs" />
                    ) : (
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, di) => (
                          <div key={di} className="w-1.5 h-1.5 rounded-full"
                               style={{ background: di < level.difficulty ? world.color : COLOR.border }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
