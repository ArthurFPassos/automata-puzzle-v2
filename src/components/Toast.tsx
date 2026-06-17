import { useEffect } from 'react';
import { FONT_MONO } from '@/styles/tokens';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

interface Props {
  msg: string;
  type?: ToastType;
  onDone: () => void;
  duration?: number;
}

const ICONS: Record<ToastType, string> = {
  info:    'ℹ️',
  success: '✅',
  error:   '❌',
  warning: '⚠️',
};

const BG: Record<ToastType, string> = {
  info:    '#3B82F6',
  success: '#34D399',
  error:   '#F87171',
  warning: '#FBBF24',
};

export function Toast({ msg, type = 'info', onDone, duration = 2400 }: Props) {
  useEffect(() => {
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [onDone, duration]);

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl
                 shadow-2xl text-white text-sm font-bold flex items-center gap-2
                 animate-bounce-in"
      style={{
        background: BG[type],
        fontFamily: FONT_MONO,
        minWidth: 220,
        maxWidth: 320,
        textAlign: 'center',
      }}
    >
      <span>{ICONS[type]}</span>
      <span>{msg}</span>
    </div>
  );
}
