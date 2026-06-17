import { useState, useMemo } from 'react';
import { FLASHCARDS } from '@/data/flashcards';
import { WORLDS } from '@/data/worlds';
import type { Screen, Flashcard, FlashcardProgressMap } from '@/types';
import { FONT_MONO, FONT_SANS, COLOR } from '@/styles/tokens';

const STORAGE_KEY = 'automata-flashcard-progress';

function loadProgress(): FlashcardProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveProgress(p: FlashcardProgressMap) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}

interface Props { onNavigate: (s: Screen) => void; }

type Phase = 'setup' | 'session' | 'done';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function TrainingModeScreen({ onNavigate }: Props) {
  const [phase, setPhase] = useState<Phase>('setup');
  const [filterWorld, setFilterWorld] = useState<number | 'all'>('all');
  const [progress, setProgress] = useState<FlashcardProgressMap>(loadProgress);

  // ── Session state ─────────────────────────────────────────────
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [masteredThisSession, setMasteredThisSession] = useState<string[]>([]);

  const filteredCards = useMemo(
    () => filterWorld === 'all' ? FLASHCARDS : FLASHCARDS.filter(f => f.world === filterWorld),
    [filterWorld],
  );

  const startSession = () => {
    // Prioritize unmastered cards; shuffle
    const unmastered = filteredCards.filter(f => !progress[f.id]?.mastered);
    const mastered   = filteredCards.filter(f =>  progress[f.id]?.mastered);
    const ordered = [...shuffle(unmastered), ...shuffle(mastered)];
    setQueue(ordered);
    setCurrentIdx(0);
    setFlipped(false);
    setSessionCorrect(0);
    setSessionTotal(0);
    setMasteredThisSession([]);
    setPhase('session');
  };

  const resetAllProgress = () => {
    const empty: FlashcardProgressMap = {};
    setProgress(empty);
    saveProgress(empty);
  };

  const current = queue[currentIdx];

  const handleAnswer = (correct: boolean) => {
    if (!current) return;

    const prev = progress[current.id] ?? { mastered: false, timesSeen: 0, timesCorrect: 0 };
    const newTimesSeen    = prev.timesSeen + 1;
    const newTimesCorrect = prev.timesCorrect + (correct ? 1 : 0);
    // mastered = correct 2+ times in a row (simplification: timesCorrect >= 2 with current correct)
    const mastered = correct && newTimesCorrect >= 2;

    const updated: FlashcardProgressMap = {
      ...progress,
      [current.id]: { mastered, timesSeen: newTimesSeen, timesCorrect: newTimesCorrect },
    };
    setProgress(updated);
    saveProgress(updated);

    if (correct) setSessionCorrect(c => c + 1);
    setSessionTotal(t => t + 1);

    if (mastered && !masteredThisSession.includes(current.id)) {
      setMasteredThisSession(p => [...p, current.id]);
    }

    const remaining = queue.filter((_, i) => i !== currentIdx);

    if (!correct) {
      // put back at end of queue
      setQueue([...remaining, current]);
      setCurrentIdx(Math.min(currentIdx, remaining.length - 1));
    } else {
      if (remaining.length === 0) {
        setPhase('done');
        return;
      }
      setQueue(remaining);
      setCurrentIdx(Math.min(currentIdx, remaining.length - 1));
    }

    setFlipped(false);
  };

  const masteredCount = filteredCards.filter(f => progress[f.id]?.mastered).length;

  // ─── Setup screen ─────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: COLOR.base, fontFamily: FONT_SANS }}>
        <div className="px-4 pt-4 pb-3 border-b flex items-center gap-3" style={{ borderColor: COLOR.border }}>
          <button onClick={() => onNavigate('flashcards')}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center text-slate-400 hover:text-white"
                  style={{ borderColor: COLOR.border }}>←</button>
          <div>
            <h1 className="text-white font-black text-lg" style={{ fontFamily: FONT_MONO }}>🎯 Modo Treino</h1>
            <p className="text-slate-500 text-xs" style={{ fontFamily: FONT_MONO }}>Repita até dominar todos os cartões</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 p-4 max-w-lg mx-auto w-full">
          {/* Progress overview */}
          <div className="rounded-2xl border p-4" style={{ borderColor: COLOR.border, background: COLOR.card }}>
            <p className="text-xs text-slate-500 mb-2" style={{ fontFamily: FONT_MONO }}>SEU PROGRESSO GERAL</p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-black text-white" style={{ fontFamily: FONT_MONO }}>
                {Math.round((masteredCount / FLASHCARDS.length) * 100)}%
              </span>
              <span className="text-slate-500 text-sm pb-1" style={{ fontFamily: FONT_MONO }}>
                {masteredCount}/{FLASHCARDS.length} dominados
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(masteredCount / FLASHCARDS.length) * 100}%`,
                  background: 'linear-gradient(90deg,#6EE7B7,#34D399)',
                }}
              />
            </div>
          </div>

          {/* World filter */}
          <div>
            <p className="text-xs text-slate-500 mb-2" style={{ fontFamily: FONT_MONO }}>FILTRAR POR MUNDO:</p>
            <div className="flex flex-col gap-2">
              {[{ id: 'all' as const, emoji: '🌐', name: 'Todos os mundos', color: '#94A3B8' },
                ...WORLDS.map(w => ({ id: w.id as number | 'all', emoji: w.emoji, name: `${w.name} — ${w.subtitle}`, color: w.color }))
              ].map(opt => {
                const count = opt.id === 'all'
                  ? FLASHCARDS.length
                  : FLASHCARDS.filter(f => f.world === opt.id).length;
                const dom = opt.id === 'all'
                  ? FLASHCARDS.filter(f => progress[f.id]?.mastered).length
                  : FLASHCARDS.filter(f => f.world === opt.id && progress[f.id]?.mastered).length;
                return (
                  <button
                    key={String(opt.id)}
                    onClick={() => setFilterWorld(opt.id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all"
                    style={{
                      borderColor: filterWorld === opt.id ? opt.color : COLOR.border,
                      background: filterWorld === opt.id ? `${opt.color}18` : COLOR.card2,
                    }}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-bold" style={{ fontFamily: FONT_MONO }}>{opt.name}</p>
                      <p className="text-slate-500 text-xs" style={{ fontFamily: FONT_MONO }}>{dom}/{count} dominados</p>
                    </div>
                    {filterWorld === opt.id && (
                      <span style={{ color: opt.color, fontFamily: FONT_MONO }} className="text-sm">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={startSession}
            className="w-full py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ fontFamily: FONT_MONO, background: 'linear-gradient(135deg,#6EE7B7,#34D399)', color: '#020817' }}
          >
            🚀 INICIAR TREINO ({filteredCards.length} cartões)
          </button>

          {masteredCount > 0 && (
            <button
              onClick={resetAllProgress}
              className="text-xs text-slate-600 hover:text-slate-400 text-center transition-colors"
              style={{ fontFamily: FONT_MONO }}
            >
              ↺ Resetar todo o progresso
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── Done screen ──────────────────────────────────────────────
  if (phase === 'done') {
    const pct = Math.round((sessionCorrect / Math.max(sessionTotal, 1)) * 100);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6"
           style={{ background: COLOR.base, fontFamily: FONT_SANS }}>
        <div className="text-6xl mb-4">
          {pct === 100 ? '🏆' : pct >= 70 ? '🎉' : '💪'}
        </div>
        <h2 className="text-white font-black text-2xl mb-1" style={{ fontFamily: FONT_MONO }}>
          Sessão Concluída!
        </h2>
        <p className="text-slate-500 text-sm mb-6" style={{ fontFamily: FONT_MONO }}>
          {sessionCorrect}/{sessionTotal} acertos nesta sessão
        </p>

        <div className="w-full max-w-sm rounded-2xl border p-5 mb-6" style={{ borderColor: COLOR.border, background: COLOR.card }}>
          <div className="text-center mb-4">
            <span className="text-5xl font-black" style={{ fontFamily: FONT_MONO, color: pct >= 80 ? '#34D399' : pct >= 50 ? '#FCD34D' : '#F87171' }}>
              {pct}%
            </span>
            <p className="text-slate-500 text-xs mt-1" style={{ fontFamily: FONT_MONO }}>taxa de acerto</p>
          </div>
          {masteredThisSession.length > 0 && (
            <div className="text-center p-3 rounded-xl" style={{ background: '#064E3B22', border: '1px solid #34D39933' }}>
              <p className="text-green-400 text-xs font-bold" style={{ fontFamily: FONT_MONO }}>
                ✓ {masteredThisSession.length} cartão(ns) dominado(s) nesta sessão!
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button
            onClick={startSession}
            className="w-full py-4 rounded-2xl font-black text-sm transition-all hover:scale-[1.02]"
            style={{ fontFamily: FONT_MONO, background: 'linear-gradient(135deg,#6EE7B7,#34D399)', color: '#020817' }}
          >
            🔄 TREINAR NOVAMENTE
          </button>
          <button
            onClick={() => setPhase('setup')}
            className="w-full py-3 rounded-2xl border text-sm font-bold transition-all"
            style={{ fontFamily: FONT_MONO, borderColor: COLOR.border, color: COLOR.dim }}
          >
            ← Voltar ao Menu de Treino
          </button>
        </div>
      </div>
    );
  }

  // ─── Session screen ───────────────────────────────────────────
  if (!current) return null;

  const world = WORLDS.find(w => w.id === current.world)!;
  const cardProgress = progress[current.id];
  const remaining = queue.length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: COLOR.base, fontFamily: FONT_SANS }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: COLOR.border }}>
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => setPhase('setup')}
            className="w-8 h-8 rounded-lg border flex items-center justify-center text-slate-400"
            style={{ borderColor: COLOR.border }}
          >✕</button>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-500 mb-1" style={{ fontFamily: FONT_MONO }}>
              <span>{remaining} restantes</span>
              <span>{sessionCorrect} acertos</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(masteredThisSession.length / filteredCards.length) * 100}%`,
                  background: 'linear-gradient(90deg,#6EE7B7,#34D399)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div
          onClick={() => setFlipped(f => !f)}
          className="w-full max-w-md rounded-3xl border p-6 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] min-h-[220px] flex flex-col justify-between"
          style={{
            borderColor: flipped ? world.color : COLOR.borderMid,
            background: flipped ? `${world.color}11` : COLOR.card,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ fontFamily: FONT_MONO, background: `${world.color}22`, color: world.color }}>
              {world.emoji} {world.subtitle}
            </span>
            {cardProgress && (
              <span className="text-xs text-slate-600" style={{ fontFamily: FONT_MONO }}>
                {cardProgress.timesCorrect}/{cardProgress.timesSeen} ✓
              </span>
            )}
          </div>

          {!flipped ? (
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-white font-black text-xl leading-tight" style={{ fontFamily: FONT_MONO }}>
                {current.term}
              </p>
              <p className="text-slate-600 text-xs mt-4" style={{ fontFamily: FONT_MONO }}>
                toque para ver a definição ↓
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center gap-3">
              <p className="text-slate-200 text-sm leading-relaxed">{current.definition}</p>
              {current.example && (
                <div className="px-3 py-2 rounded-xl"
                     style={{ background: `${world.color}15`, borderLeft: `3px solid ${world.color}` }}>
                  <p className="text-slate-400 text-xs" style={{ fontFamily: FONT_MONO }}>
                    {current.example}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Answer buttons — only shown after flip */}
        {flipped && (
          <div className="flex gap-3 mt-6 w-full max-w-md">
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 py-4 rounded-2xl border font-black text-sm transition-all hover:scale-[1.01] active:scale-[0.98]"
              style={{ fontFamily: FONT_MONO, borderColor: '#7F1D1D', background: '#7F1D1D22', color: '#F87171' }}
            >
              ✗ Errei
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 py-4 rounded-2xl font-black text-sm transition-all hover:scale-[1.01] active:scale-[0.98]"
              style={{ fontFamily: FONT_MONO, background: 'linear-gradient(135deg,#064E3B,#065F46)', color: '#34D399', border: '1px solid #34D39933' }}
            >
              ✓ Acertei
            </button>
          </div>
        )}

        {!flipped && (
          <p className="text-slate-600 text-xs mt-6" style={{ fontFamily: FONT_MONO }}>
            Cartão {currentIdx + 1} de {queue.length}
          </p>
        )}
      </div>
    </div>
  );
}
