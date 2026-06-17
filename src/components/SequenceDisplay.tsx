import { FONT_MONO } from '@/styles/tokens';

interface Props {
  sequence: string[];
}

export function SequenceDisplay({ sequence }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span
        className="text-xs text-slate-500"
        style={{ fontFamily: FONT_MONO }}
      >
        Sequência:
      </span>

      {sequence.map((evt, i) => (
        <span
          key={i}
          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs
                     font-bold border"
          style={{
            fontFamily:  FONT_MONO,
            background:  '#0F172A',
            borderColor: '#334155',
            color:       '#94A3B8',
          }}
        >
          {evt}
        </span>
      ))}

      <span className="text-xs text-slate-600" style={{ fontFamily: FONT_MONO }}>
        → estado final?
      </span>
    </div>
  );
}
