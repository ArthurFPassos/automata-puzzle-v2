import { useEffect } from 'react';
import type { Achievement } from '@/types';
import { FONT_MONO } from '@/styles/tokens';

interface Props {
  achievement: Achievement;
  onDone: () => void;
}

export function AchievementPopup({ achievement: ach, onDone }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl shadow-2xl
                 px-5 py-4 flex items-center gap-3 border animate-bounce-in"
      style={{
        background: 'linear-gradient(135deg, #1C1917, #292524)',
        borderColor: 'rgba(217,119,6,0.4)',
        minWidth: 240,
      }}
    >
      <span className="text-4xl">{ach.emoji}</span>
      <div>
        <div
          className="text-yellow-400 text-xs font-bold mb-0.5"
          style={{ fontFamily: FONT_MONO }}
        >
          🏅 CONQUISTA DESBLOQUEADA!
        </div>
        <div className="text-white font-bold text-sm">{ach.title}</div>
        <div className="text-slate-400 text-xs">{ach.desc}</div>
      </div>
    </div>
  );
}
