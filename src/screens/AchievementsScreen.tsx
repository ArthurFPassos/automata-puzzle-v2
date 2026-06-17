import type { ProgressMap } from '@/types';
import { ALL_LEVELS } from '@/data/levels';
import { FONT_MONO, FONT_SANS, COLOR } from '@/styles/tokens';

interface Props { progress: ProgressMap; onBack: () => void; }

const ACHIEVEMENTS = [
  { id: 'first',     emoji: '🌟', title: 'Primeiro Passo',      desc: 'Complete sua primeira fase',                   req: (p: ProgressMap) => Object.values(p).some(l => l.completed) },
  { id: 'world1',    emoji: '🔵', title: 'Fundamentos Sólidos',  desc: 'Complete todos os níveis do Mundo 1',           req: (p: ProgressMap) => ALL_LEVELS.filter(l => l.world === 1).every(l => p[l.id]?.completed) },
  { id: 'world2',    emoji: '⚡', title: 'Raciocínio Afiado',    desc: 'Complete todos os níveis do Mundo 2',           req: (p: ProgressMap) => ALL_LEVELS.filter(l => l.world === 2).every(l => p[l.id]?.completed) },
  { id: 'world3',    emoji: '🏗️', title: 'Arquiteto de Autômatos', desc: 'Complete todos os níveis do Mundo 3',         req: (p: ProgressMap) => ALL_LEVELS.filter(l => l.world === 3).every(l => p[l.id]?.completed) },
  { id: 'all',       emoji: '🏆', title: 'Campeão dos Autômatos', desc: 'Complete todos os 30 níveis',                  req: (p: ProgressMap) => ALL_LEVELS.every(l => p[l.id]?.completed) },
  { id: 'nohint',    emoji: '🧠', title: 'Sem Ajuda!',           desc: 'Complete 5 fases sem usar dica',               req: (p: ProgressMap) => Object.values(p).filter(l => l.noHint).length >= 5 },
  { id: 'perfect',   emoji: '💎', title: 'Perfeccionista',       desc: 'Conquiste 3 estrelas em 10 fases',             req: (p: ProgressMap) => Object.values(p).filter(l => l.stars === 3).length >= 10 },
  { id: 'builder1',  emoji: '🔧', title: 'Construtor Iniciante', desc: 'Complete a primeira fase de construção (fase 21)', req: (p: ProgressMap) => !!p[21]?.completed },
  { id: 'builder2',  emoji: '🏛️', title: 'Arquiteto',           desc: 'Complete a construção livre (fase 28)',         req: (p: ProgressMap) => !!p[28]?.completed },
  { id: 'final',     emoji: '🎓', title: 'Mestre dos Autômatos', desc: 'Complete o Grande Desafio Final (fase 30)',     req: (p: ProgressMap) => !!p[30]?.completed },
];

export function AchievementsScreen({ progress, onBack }: Props) {
  const unlocked = ACHIEVEMENTS.filter(a => a.req(progress));
  const locked   = ACHIEVEMENTS.filter(a => !a.req(progress));

  return (
    <div className="min-h-screen" style={{ background: COLOR.base, fontFamily: FONT_SANS }}>
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3 border-b flex items-center gap-3"
           style={{ borderColor: COLOR.border, background: COLOR.base }}>
        <button onClick={onBack}
                className="w-8 h-8 rounded-lg border flex items-center justify-center text-slate-400"
                style={{ borderColor: COLOR.border }}>
          ←
        </button>
        <div>
          <h1 className="text-white font-black text-lg" style={{ fontFamily: FONT_MONO }}>🏅 Conquistas</h1>
          <p className="text-slate-500 text-xs" style={{ fontFamily: FONT_MONO }}>
            {unlocked.length}/{ACHIEVEMENTS.length} desbloqueadas
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 max-w-lg mx-auto">
        {unlocked.length > 0 && (
          <>
            <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: FONT_MONO }}>DESBLOQUEADAS</p>
            {unlocked.map(a => (
              <div key={a.id} className="flex items-center gap-3 rounded-2xl border p-4"
                   style={{ borderColor: '#34D39944', background: '#064E3B11' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                     style={{ background: '#064E3B33' }}>
                  {a.emoji}
                </div>
                <div>
                  <p className="text-white font-black text-sm" style={{ fontFamily: FONT_MONO }}>{a.title}</p>
                  <p className="text-slate-500 text-xs" style={{ fontFamily: FONT_MONO }}>{a.desc}</p>
                </div>
                <div className="ml-auto text-green-400 text-lg">✓</div>
              </div>
            ))}
          </>
        )}

        {locked.length > 0 && (
          <>
            <p className="text-xs text-slate-600 mt-2 mb-1" style={{ fontFamily: FONT_MONO }}>BLOQUEADAS</p>
            {locked.map(a => (
              <div key={a.id} className="flex items-center gap-3 rounded-2xl border p-4 opacity-40"
                   style={{ borderColor: COLOR.border, background: COLOR.card2 }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 grayscale"
                     style={{ background: COLOR.card }}>
                  {a.emoji}
                </div>
                <div>
                  <p className="text-white font-black text-sm" style={{ fontFamily: FONT_MONO }}>{a.title}</p>
                  <p className="text-slate-500 text-xs" style={{ fontFamily: FONT_MONO }}>{a.desc}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
