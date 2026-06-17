import { useState } from 'react';
import type { QuizActivity } from '@/types';
import { FONT_MONO } from '@/styles/tokens';

interface Props {
  activity: QuizActivity;
  worldColor: string;
  onResult: (correct: boolean) => void;
  locked: boolean;
}

export function QuizActivityView({ activity, worldColor, onResult, locked }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (opt: string) => {
    if (locked || selected !== null) return;
    const correct = opt.toLowerCase().trim() === activity.answer.toLowerCase().trim();
    setSelected(opt);
    setIsCorrect(correct);
    if (correct) {
      setTimeout(() => onResult(true), 700);
    } else {
      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
        onResult(false);
      }, 800);
    }
  };

  const optionStyle = (opt: string) => {
    const sel = selected === opt;
    if (sel && isCorrect === true) return { borderColor: '#34D399', background: '#064E3B22', color: '#34D399' };
    if (sel && isCorrect === false) return { borderColor: '#F87171', background: '#7F1D1D22', color: '#F87171' };
    return { borderColor: '#1E293B', background: '#0A0F1A', color: '#94A3B8' };
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl px-4 py-3 border border-slate-800 bg-slate-900/50">
        <div className="text-xs font-bold mb-1" style={{ fontFamily: FONT_MONO, color: worldColor }}>
          ❓ QUESTÃO
        </div>
        <p className="text-white text-sm font-medium leading-relaxed">{activity.question}</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-slate-500 mb-1" style={{ fontFamily: FONT_MONO }}>
          ESCOLHA SUA RESPOSTA:
        </div>
        {activity.options.map((opt, oi) => (
          <button
            key={oi}
            onClick={() => handleAnswer(opt)}
            disabled={locked || selected !== null}
            className="w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 text-sm
                       hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed"
            style={{ fontFamily: FONT_MONO, ...optionStyle(opt) }}
          >
            <span className="mr-2 opacity-50">{String.fromCharCode(65 + oi)}.</span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
