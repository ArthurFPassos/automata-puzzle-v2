import { useState, useEffect } from 'react';
import type { Level, Screen, ProgressMap, World } from '@/types';
import { ActivityRenderer } from '@/components/activities/ActivityRenderer';
import { AutomatonViz } from '@/components/AutomatonViz';
import { Stars } from '@/components/Stars';
import { Particles } from '@/components/Particles';
import { FONT_MONO, FONT_SANS, COLOR } from '@/styles/tokens';

interface Props {
  level: Level;
  world: World;
  progress: ProgressMap;
  onComplete: (levelId: number, score: number, stars: number, noHint: boolean) => void;
  onBack: () => void;
  onNavigate: (s: Screen) => void;
}

type GamePhase = 'intro' | 'play' | 'result';

export function GameScreen({ level, world, onComplete, onBack }: Props) {
  const [phase, setPhase]         = useState<GamePhase>('intro');
  const [score, setScore]         = useState(100);
  const [errors, setErrors]       = useState(0);
  const [hintUsed, setHintUsed]   = useState(false);
  const [showHint, setShowHint]   = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isFullscreen, setIsFullscreen]   = useState(false);
  const [locked, setLocked]       = useState(false);
  const [introCountdown, setIntroCountdown] = useState(2);
  const [feedbackGif, setFeedbackGif] = useState<'correct' | 'wrong' | null>(null);

  // non-build levels show the diagram; build levels handle their own canvas
  const showDiagram = level.states.length > 0 &&
    level.activity.type !== 'build-automaton';

  // ── Intro countdown ──────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'intro') return;
    if (introCountdown <= 0) { setPhase('play'); return; }
    const t = setTimeout(() => setIntroCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, introCountdown]);

  // GIF pools for feedback
  const CORRECT_GIFS = [
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWdjbmd0czlheWN1aHl1aWExNW9pa2g2NTZzaTY4djVzdHB2N2hwdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26u4cqiYI30juCOGY/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzA2eWU3dHlsZGc0ZHM4bWFzaXozaXVsMGYzcGFoNTdtZHBhZnA5eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/artj92V8o75VPL7AeQ/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXZ2aGl5OGViZzdsMnZnYnY4ejR0NzE0NzM3YWJmeGI1MGRmcDlkbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif',
  ];
  const WRONG_GIFS = [
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmdjYXVkeTdlcWY4anVubHFmOThpMmkwZWNhcGpmNGllMWVzaWt3eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKP9ln2Dr6ze6f6/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMm0yaGJrczk5NzBkMGVxNW50aW9hOHphcWFhbW5nbGljN2ZkcjF6dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufnwz3wDUli7GU0/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjl4ZHBnbm1oNW5zZGh2cXNsMGhneTlhNDFuZGl1czFzaGRlMXhvZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l1J9wJ6ZSONO96eca/giphy.gif',
  ];

  // ── Handle activity result ───────────────────────────────────
  const handleResult = (correct: boolean) => {
    if (locked) return;
    if (correct) {
      setShowParticles(true);
      setLocked(true);
      setFeedbackGif('correct');
      setTimeout(() => {
        setShowParticles(false);
        setFeedbackGif(null);
        setPhase('result');
      }, 2000);
    } else {
      const penalty = hintUsed ? 20 : 30;
      setScore(s => Math.max(10, s - penalty));
      setErrors(e => e + 1);
      setFeedbackGif('wrong');
      setTimeout(() => setFeedbackGif(null), 1800);
    }
  };

  const handleHint = () => {
    if (!hintUsed) {
      setHintUsed(true);
      setScore(s => Math.max(10, s - 20));
    }
    setShowHint(h => !h);
  };

  const stars = score >= 90 ? 3 : score >= 60 ? 2 : 1;

  const handleFinish = () => {
    onComplete(level.id, score, stars, !hintUsed);
  };

  // ─── INTRO ────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6"
           style={{ background: COLOR.base, fontFamily: FONT_SANS }}>
        <div className="w-full max-w-lg">
          {/* World badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{world.emoji}</span>
            <span className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{ fontFamily: FONT_MONO, background: `${world.color}22`, color: world.color }}>
              {world.name} · Fase {level.id}
            </span>
          </div>

          <h2 className="text-white font-black text-2xl mb-2" style={{ fontFamily: FONT_MONO }}>
            {level.name}
          </h2>

          {/* Story card */}
          <div className="rounded-2xl border p-4 mb-5" style={{ borderColor: COLOR.border, background: COLOR.card }}>
            <p className="text-xs font-bold mb-1" style={{ fontFamily: FONT_MONO, color: world.color }}>
              📖 CONTEXTO
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">{level.story}</p>
          </div>

          {/* Concept badge */}
          <div className="rounded-xl border px-4 py-2 mb-6" style={{ borderColor: `${world.color}44`, background: `${world.color}11` }}>
            <span className="text-xs font-bold" style={{ fontFamily: FONT_MONO, color: world.color }}>
              🧠 {level.concept}
            </span>
          </div>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-black"
                 style={{ borderColor: world.color, color: world.color, fontFamily: FONT_MONO }}>
              {introCountdown}
            </div>
            <p className="text-slate-500 text-sm" style={{ fontFamily: FONT_MONO }}>
              {introCountdown > 0 ? 'iniciando...' : 'pronto!'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULT ───────────────────────────────────────────────────
  if (phase === 'result') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6"
           style={{ background: COLOR.base, fontFamily: FONT_SANS }}>
        <div className="w-full max-w-lg flex flex-col items-center gap-5">
          <Stars count={stars} size="text-4xl" />

          <h2 className="text-white font-black text-2xl text-center" style={{ fontFamily: FONT_MONO }}>
            {stars === 3 ? '🏆 Perfeito!' : stars === 2 ? '⭐ Muito bem!' : '✓ Concluído!'}
          </h2>

          {/* Score card */}
          <div className="w-full rounded-2xl border p-5" style={{ borderColor: COLOR.border, background: COLOR.card }}>
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              {[
                { label: 'PONTUAÇÃO', value: score },
                { label: 'ERROS', value: errors },
                { label: 'ESTRELAS', value: `${stars}/3` },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-black" style={{ fontFamily: FONT_MONO, color: world.color }}>{s.value}</div>
                  <div className="text-[10px] text-slate-500" style={{ fontFamily: FONT_MONO }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Pedagogy note */}
            <div className="border-t pt-3" style={{ borderColor: COLOR.border }}>
              <p className="text-[10px] font-bold mb-1" style={{ fontFamily: FONT_MONO, color: world.color }}>
                💡 O QUE VOCÊ APRENDEU
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">{level.pedagogy}</p>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ fontFamily: FONT_MONO, background: `linear-gradient(135deg,${world.color}DD,${world.accent}AA)`, color: '#020817' }}
          >
            CONTINUAR →
          </button>

          <button onClick={onBack} className="text-slate-600 text-xs hover:text-slate-400" style={{ fontFamily: FONT_MONO }}>
            ← Voltar ao mapa
          </button>
        </div>
      </div>
    );
  }

  // ─── PLAY ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: COLOR.base, fontFamily: FONT_SANS }}>
      {showParticles && <Particles />}

      {/* Feedback GIF overlay */}
      {feedbackGif && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          style={{ background: feedbackGif === 'correct' ? 'rgba(6,78,59,0.35)' : 'rgba(127,29,29,0.35)' }}
        >
          <div className="flex flex-col items-center gap-3 animate-pop-in">
            <img
              src={
                feedbackGif === 'correct'
                  ? CORRECT_GIFS[errors % CORRECT_GIFS.length]
                  : WRONG_GIFS[errors % WRONG_GIFS.length]
              }
              alt={feedbackGif === 'correct' ? 'Correto!' : 'Errado!'}
              className="rounded-2xl shadow-2xl"
              style={{ width: 220, height: 220, objectFit: 'cover', border: `3px solid ${feedbackGif === 'correct' ? '#34D399' : '#F87171'}` }}
            />
            <span
              className="text-2xl font-black px-5 py-2 rounded-xl"
              style={{
                fontFamily: 'var(--font-mono)',
                background: feedbackGif === 'correct' ? '#064E3B' : '#7F1D1D',
                color: feedbackGif === 'correct' ? '#34D399' : '#F87171',
                border: `2px solid ${feedbackGif === 'correct' ? '#34D399' : '#F87171'}`,
              }}
            >
              {feedbackGif === 'correct' ? '✓ CORRETO!' : '✗ TENTE NOVAMENTE!'}
            </span>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b"
           style={{ borderColor: COLOR.border, background: COLOR.base }}>
        <button onClick={onBack}
                className="w-8 h-8 rounded-lg border flex items-center justify-center text-slate-400 hover:text-white shrink-0"
                style={{ borderColor: COLOR.border }}>
          ←
        </button>

        {/* Score bar */}
        <div className="flex-1">
          <div className="flex justify-between text-[10px] text-slate-500 mb-0.5" style={{ fontFamily: FONT_MONO }}>
            <span>{world.emoji} {world.name} · {level.name}</span>
            <span>{score} pts</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${score}%`, background: `linear-gradient(90deg,${world.color},${world.accent})` }}
            />
          </div>
        </div>

        {/* Hint button */}
        <button
          onClick={handleHint}
          className="w-8 h-8 rounded-lg border flex items-center justify-center text-sm shrink-0 transition-all"
          style={{
            borderColor: hintUsed ? '#D97706' : COLOR.border,
            background: hintUsed ? '#D9780611' : 'transparent',
            color: hintUsed ? '#FCD34D' : COLOR.muted,
          }}
          title="Ver dica (-20 pts)"
        >
          💡
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4 p-4 pb-8 max-w-2xl mx-auto w-full">
        {/* Hint panel */}
        {showHint && (
          <div className="rounded-2xl border px-4 py-3"
               style={{ borderColor: '#D9780644', background: '#D9780611' }}>
            <p className="text-[10px] font-bold mb-1" style={{ fontFamily: FONT_MONO, color: '#FCD34D' }}>
              💡 DICA (-20 pts)
            </p>
            <p className="text-amber-200 text-sm leading-relaxed">{level.hint}</p>
          </div>
        )}

        {/* Diagram (for non-build activities) */}
        {showDiagram && (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: COLOR.border }}>
            <AutomatonViz
              level={level}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(f => !f)}
              accentColor={world.color}
            />
          </div>
        )}

        {/* Activity */}
        <ActivityRenderer
          activity={level.activity}
          level={level}
          worldColor={world.color}
          onResult={handleResult}
          locked={locked}
        />

        {/* Error count */}
        {errors > 0 && (
          <div className="text-center text-xs text-slate-600" style={{ fontFamily: FONT_MONO }}>
            {errors} erro(s) · {score} pts restantes
          </div>
        )}
      </div>
    </div>
  );
}
