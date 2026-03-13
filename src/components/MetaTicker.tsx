type MetaTickerProps = {
  items: string[];
};

export function MetaTicker({ items }: MetaTickerProps) {
  return (
    <div className="animate-shimmer-text flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span>·</span>}
          {item}
        </span>
      ))}
    </div>
  );
}
