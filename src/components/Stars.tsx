interface Props {
  count: number;
  max?: number;
  size?: string;
}

export function Stars({ count, max = 3, size = 'text-xl' }: Props) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`${size} transition-all duration-300 ${
            i < count ? 'opacity-100' : 'opacity-20'
          }`}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
