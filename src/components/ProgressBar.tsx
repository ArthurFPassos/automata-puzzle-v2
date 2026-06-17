interface Props {
  value: number;
  max: number;
  color?: string;
  height?: number;
}

export function ProgressBar({
  value,
  max,
  color = '#60A5FA',
  height = 4,
}: Props) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, background: '#1E293B' }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}
