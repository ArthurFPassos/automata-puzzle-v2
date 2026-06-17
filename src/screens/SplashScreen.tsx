import type { Screen, World, ProgressMap } from '@/types';
import { getLevelsByWorld } from '@/data/levels';
import { FONT_MONO, FONT_SANS, COLOR } from '@/styles/tokens';

interface Props {
  worlds: World[];
  progress: ProgressMap;
  onSelectWorld: (id: number) => void;
  onNavigate: (s: Screen) => void;
}

export function SplashScreen({ worlds, progress, onSelectWorld, onNavigate }: Props) {
  const totalLevels    = 30;
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const pct            = Math.round((completedCount / totalLevels) * 100);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: COLOR.base, fontFamily: FONT_SANS }}>
      {/* Hero */}
      <div className="px-6 pt-10 pb-6 text-center relative">
        <button
          onClick={() => onNavigate('menu')}
          className="absolute left-4 top-4 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02]"
          style={{ fontFamily: FONT_MONO, borderColor: COLOR.border, color: COLOR.dim, background: COLOR.card2 }}
        >
          ← Menu
        </button>
        <div className="text-5xl mb-3">🤖</div>
        <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: FONT_MONO }}>
          Automata Puzzle
        </h1>
        <p className="text-slate-500 text-sm" style={{ fontFamily: FONT_MONO }}>
          Aprenda autômatos finitos jogando
        </p>
        {completedCount > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1" style={{ fontFamily: FONT_MONO }}>
              <span>Progresso geral</span><span>{completedCount}/{totalLevels} fases</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full transition-all"
                   style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#6EE7B7,#60A5FA,#F87171)' }} />
            </div>
          </div>
        )}
      </div>

      {/* World cards */}
      <div className="flex flex-col gap-3 px-4 pb-4 max-w-lg mx-auto w-full">
        {worlds.map((w, i) => {
          const levels     = getLevelsByWorld(w.id);
          const done       = levels.filter(l => progress[l.id]?.completed).length;
          const locked     = i > 0 && getLevelsByWorld(worlds[i - 1].id).some(l => !progress[l.id]?.completed);
          const isNew      = done === 0 && !locked;

          return (
            <button
              key={w.id}
              onClick={() => !locked && onSelectWorld(w.id)}
              disabled={locked}
              className="w-full rounded-2xl border p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40"
              style={{ borderColor: locked ? COLOR.border : w.color + '55', background: locked ? COLOR.card2 : `${w.color}0D` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                     style={{ background: `${w.color}22` }}>
                  {locked ? '🔒' : w.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white font-black text-base" style={{ fontFamily: FONT_MONO }}>{w.name}</span>
                    {isNew && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ fontFamily: FONT_MONO, background: `${w.color}33`, color: w.color }}>NOVO</span>
                    )}
                  </div>
                  <p className="text-sm font-bold mb-0.5" style={{ color: w.color }}>{w.subtitle}</p>
                  <p className="text-slate-500 text-xs truncate" style={{ fontFamily: FONT_MONO }}>{w.mechanicLabel}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-lg" style={{ fontFamily: FONT_MONO, color: w.color }}>
                    {done}/{levels.length}
                  </div>
                  <div className="text-[10px] text-slate-600" style={{ fontFamily: FONT_MONO }}>fases</div>
                </div>
              </div>

              {done > 0 && (
                <div className="mt-3">
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                         style={{ width: `${(done / levels.length) * 100}%`, background: w.color }} />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom nav */}
      <div className="px-4 pb-6 flex gap-2 max-w-lg mx-auto w-full">
        <button
          onClick={() => onNavigate('flashcards')}
          className="flex-1 py-3 rounded-xl border text-sm font-bold transition-all hover:scale-[1.01]"
          style={{ fontFamily: FONT_MONO, borderColor: COLOR.border, color: COLOR.dim }}
        >
          📚 Flashcards
        </button>
        <button
          onClick={() => onNavigate('training')}
          className="flex-1 py-3 rounded-xl border text-sm font-bold transition-all hover:scale-[1.01]"
          style={{ fontFamily: FONT_MONO, borderColor: COLOR.border, color: COLOR.dim }}
        >
          🎯 Treino
        </button>
        <button
          onClick={() => onNavigate('achievements')}
          className="flex-1 py-3 rounded-xl border text-sm font-bold transition-all hover:scale-[1.01]"
          style={{ fontFamily: FONT_MONO, borderColor: COLOR.border, color: COLOR.dim }}
        >
          🏅 Conquistas
        </button>
      </div>
    </div>
  );
}
