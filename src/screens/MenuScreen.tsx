import { useEffect, useRef, useState } from 'react';
import type { Screen, ProgressMap } from '@/types';
import { FONT_MONO, FONT_SANS, COLOR } from '@/styles/tokens';
import { ALL_LEVELS } from '@/data/levels';

interface Props {
  progress: ProgressMap;
  onNavigate: (s: Screen) => void;
}

// ─── Animated SVG background ─────────────────────────────────────────────────
function AutomatonBg() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.13 }}
      aria-hidden
    >
      <defs>
        <marker id="bgArrow" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#6EE7B7" />
        </marker>
        <filter id="bgGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Transition arrows */}
      <line x1="160" y1="200" x2="310" y2="200" stroke="#6EE7B7" strokeWidth="1.5" markerEnd="url(#bgArrow)" />
      <line x1="360" y1="200" x2="510" y2="200" stroke="#93C5FD" strokeWidth="1.5" markerEnd="url(#bgArrow)" />
      <line x1="560" y1="200" x2="660" y2="200" stroke="#FCA5A5" strokeWidth="1.5" markerEnd="url(#bgArrow)" />
      <line x1="335" y1="230" x2="335" y2="350" stroke="#6EE7B7" strokeWidth="1.5" markerEnd="url(#bgArrow)" />
      <line x1="535" y1="230" x2="420" y2="350" stroke="#93C5FD" strokeWidth="1.5" markerEnd="url(#bgArrow)" />
      <path d="M 670 230 Q 720 300 670 370" stroke="#FCA5A5" strokeWidth="1.5" fill="none" markerEnd="url(#bgArrow)" />

      {/* Labels on arrows */}
      <text x="230" y="190" fill="#6EE7B7" fontSize="11" fontFamily="monospace" textAnchor="middle">a</text>
      <text x="430" y="190" fill="#93C5FD" fontSize="11" fontFamily="monospace" textAnchor="middle">b</text>
      <text x="610" y="190" fill="#FCA5A5" fontSize="11" fontFamily="monospace" textAnchor="middle">a,b</text>

      {/* States */}
      {/* q0 - initial */}
      <polygon points="115,200 130,208 130,192" fill="#6EE7B7" />
      <circle cx="145" cy="200" r="30" fill="#0D2A1A" stroke="#6EE7B7" strokeWidth="1.5" filter="url(#bgGlow)" />
      <text x="145" y="205" fill="#6EE7B7" fontSize="12" fontFamily="monospace" textAnchor="middle">q₀</text>

      {/* q1 */}
      <circle cx="335" cy="200" r="30" fill="#0D1F3A" stroke="#93C5FD" strokeWidth="1.5" />
      <text x="335" y="205" fill="#93C5FD" fontSize="12" fontFamily="monospace" textAnchor="middle">q₁</text>

      {/* q2 */}
      <circle cx="535" cy="200" r="30" fill="#0D1F3A" stroke="#93C5FD" strokeWidth="1.5" />
      <text x="535" y="205" fill="#93C5FD" fontSize="12" fontFamily="monospace" textAnchor="middle">q₂</text>

      {/* q3 - accept (double ring) */}
      <circle cx="670" cy="200" r="30" fill="#0D2A1A" stroke="#6EE7B7" strokeWidth="1.5" filter="url(#bgGlow)" />
      <circle cx="670" cy="200" r="24" fill="none" stroke="#6EE7B7" strokeWidth="1" />
      <text x="670" y="205" fill="#6EE7B7" fontSize="12" fontFamily="monospace" textAnchor="middle">q₃</text>

      {/* q4 */}
      <circle cx="335" cy="380" r="30" fill="#0D1F3A" stroke="#93C5FD" strokeWidth="1.5" />
      <text x="335" y="385" fill="#93C5FD" fontSize="12" fontFamily="monospace" textAnchor="middle">q₄</text>

      {/* q5 - error */}
      <circle cx="420" cy="380" r="30" fill="#2A0D0D" stroke="#FCA5A5" strokeWidth="1.5" />
      <text x="420" y="385" fill="#FCA5A5" fontSize="12" fontFamily="monospace" textAnchor="middle">qₑ</text>

      {/* Dot grid */}
      {Array.from({ length: 18 }, (_, r) =>
        Array.from({ length: 24 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={c * 36 + 18} cy={r * 36 + 18} r={1} fill="#334155" />
        ))
      )}
    </svg>
  );
}

// ─── Floating particle dots ───────────────────────────────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 4,
    duration: Math.random() * 6 + 6,
    color: ['#6EE7B7', '#93C5FD', '#FCA5A5', '#FCD34D'][i % 4],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: 0.5,
            animation: `float-particle ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated logo letters ────────────────────────────────────────────────────
function AnimatedLogo() {
  const title = 'AUTOMATA';
  const sub   = 'PUZZLE';
  return (
    <div className="text-center select-none">
      <div className="flex justify-center gap-[2px] mb-1">
        {title.split('').map((ch, i) => (
          <span
            key={i}
            className="text-4xl sm:text-5xl font-black"
            style={{
              fontFamily: FONT_MONO,
              color: ['#6EE7B7', '#93C5FD', '#FCA5A5', '#FCD34D', '#6EE7B7', '#93C5FD', '#FCA5A5', '#FCD34D'][i % 4],
              display: 'inline-block',
              animation: `logo-letter 2s ${i * 0.07}s ease-in-out infinite alternate`,
              textShadow: `0 0 20px ${['#6EE7B740', '#93C5FD40', '#FCA5A540', '#FCD34D40'][i % 4]}`,
            }}
          >
            {ch}
          </span>
        ))}
      </div>
      <div className="flex justify-center gap-[3px]">
        {sub.split('').map((ch, i) => (
          <span
            key={i}
            className="text-2xl sm:text-3xl font-black tracking-[0.2em]"
            style={{
              fontFamily: FONT_MONO,
              color: '#475569',
              display: 'inline-block',
              animation: `logo-letter 2.5s ${0.56 + i * 0.09}s ease-in-out infinite alternate`,
            }}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Typing tagline ───────────────────────────────────────────────────────────
function TypingTagline() {
  const lines = [
    'Aprenda autômatos finitos.',
    'Um estado de cada vez.',
    'Domine a teoria.',
  ];
  const [lineIdx, setLineIdx] = useState(0);
  const [text, setText]       = useState('');
  const [deleting, setDeleting] = useState(false);
  const [charIdx, setCharIdx]   = useState(0);

  useEffect(() => {
    const current = lines[lineIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => {
        setText(current.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      }, 55);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setText(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      }, 28);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setLineIdx(l => (l + 1) % lines.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, lineIdx]);

  return (
    <p
      className="text-sm sm:text-base text-center min-h-[1.5em]"
      style={{ fontFamily: FONT_MONO, color: '#64748B' }}
    >
      {text}
      <span className="inline-block w-[2px] h-[1em] ml-0.5 align-middle animate-pulse"
            style={{ background: '#6EE7B7', verticalAlign: 'middle' }} />
    </p>
  );
}

// ─── Main MenuScreen ──────────────────────────────────────────────────────────
export function MenuScreen({ progress, onNavigate }: Props) {
  const totalLevels    = ALL_LEVELS.length;
  const completed      = Object.values(progress).filter(p => p.completed).length;
  const hasProgress    = completed > 0;
  const pct            = Math.round((completed / totalLevels) * 100);
  const totalStars     = Object.values(progress).reduce((s, p) => s + (p.stars ?? 0), 0);
  const maxStars       = totalLevels * 3;

  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between overflow-hidden relative"
      style={{ background: COLOR.base, fontFamily: FONT_SANS }}
    >
      {/* Ambient background automaton diagram */}
      <AutomatonBg />
      <FloatingParticles />

      {/* Dark gradient overlays for readability */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, #020817cc 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
           style={{ background: 'linear-gradient(to top, #020817 0%, transparent 100%)' }} />

      {/* ── Top badge ── */}
      <div
        className="relative z-10 mt-6 px-3 py-1 rounded-full border text-[10px] font-bold tracking-widest"
        style={{
          fontFamily: FONT_MONO,
          borderColor: '#1E293B',
          color: '#475569',
          background: '#0A0F1A',
          opacity: entered ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        BNCC · EF09CO03 · Autômatos Finitos
      </div>

      {/* ── Center content ── */}
      <div
        className="relative z-10 flex flex-col items-center gap-6 px-6 flex-1 justify-center"
        style={{
          transform: entered ? 'translateY(0)' : 'translateY(24px)',
          opacity: entered ? 1 : 0,
          transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Robot icon */}
        <div
          className="text-6xl"
          style={{ animation: 'robot-float 3s ease-in-out infinite' }}
        >
          🤖
        </div>

        {/* Logo */}
        <AnimatedLogo />

        {/* Typing tagline */}
        <TypingTagline />

        {/* Progress badge (only if has saves) */}
        {hasProgress && (
          <div
            className="w-full max-w-xs rounded-2xl border p-4 flex flex-col gap-2"
            style={{ borderColor: '#1E293B', background: '#0A0F1A' }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500" style={{ fontFamily: FONT_MONO }}>Progresso salvo</span>
              <span className="text-xs font-bold" style={{ fontFamily: FONT_MONO, color: '#6EE7B7' }}>
                {completed}/{totalLevels} fases · ⭐ {totalStars}/{maxStars}
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#1E293B' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #6EE7B7, #60A5FA, #F87171)',
                }}
              />
            </div>
          </div>
        )}

        {/* Main action buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
          <button
            onClick={() => onNavigate('worlds')}
            className="w-full py-4 rounded-2xl font-black text-lg transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{
              fontFamily: FONT_MONO,
              background: 'linear-gradient(135deg, #065F46 0%, #064E3B 100%)',
              color: '#6EE7B7',
              border: '2px solid #34D399',
              boxShadow: '0 0 32px #34D39944, 0 4px 16px #00000088',
            }}
          >
            {hasProgress ? '▶ CONTINUAR' : '▶ JOGAR'}
          </button>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onNavigate('flashcards')}
              className="py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.97] flex flex-col items-center gap-1"
              style={{
                fontFamily: FONT_MONO,
                background: '#0A0F1A',
                color: '#94A3B8',
                border: '1px solid #1E293B',
              }}
            >
              <span className="text-lg">📚</span>
              <span className="text-[10px]">Flashcards</span>
            </button>
            <button
              onClick={() => onNavigate('training')}
              className="py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.97] flex flex-col items-center gap-1"
              style={{
                fontFamily: FONT_MONO,
                background: '#0A0F1A',
                color: '#94A3B8',
                border: '1px solid #1E293B',
              }}
            >
              <span className="text-lg">🎯</span>
              <span className="text-[10px]">Treino</span>
            </button>
            <button
              onClick={() => onNavigate('achievements')}
              className="py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.03] active:scale-[0.97] flex flex-col items-center gap-1"
              style={{
                fontFamily: FONT_MONO,
                background: '#0A0F1A',
                color: '#94A3B8',
                border: '1px solid #1E293B',
              }}
            >
              <span className="text-lg">🏅</span>
              <span className="text-[10px]">Conquistas</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        className="relative z-10 pb-6 text-center"
        style={{
          opacity: entered ? 1 : 0,
          transition: 'opacity 1s ease 0.5s',
        }}
      >
        <p className="text-[10px] text-slate-700" style={{ fontFamily: FONT_MONO }}>
          6 mundos · 30 fases · Autômatos Finitos Determinísticos
        </p>
      </div>
    </div>
  );
}
