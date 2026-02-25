type SparklineProps = {
  points: number[];
  symbol: string;
  color?: "up" | "down" | "primary";
  className?: string;
};

const colorMap = {
  primary: "rgb(var(--color-primary))",
  up: "rgb(var(--color-up))",
  down: "rgb(var(--color-down))",
};

export function Sparkline({ points, symbol, color = "primary", className }: SparklineProps) {
  if (points.length === 0) return null;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  const coords = points.map((point, index) => ({
    x: (index / (points.length - 1)) * 100,
    y: 24 - ((point - min) / range) * 24,
  }));

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const areaPath = `${linePath} L100,32 L0,32 Z`;
  const gradientId = `spark-gradient-${symbol}-${color}`;
  const strokeColor = colorMap[color];

  return (
    <div className={`h-8 w-24 border-b-[2px] border-border pb-1 ${className ?? ""}`}>
      <svg viewBox="0 0 100 32" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke={strokeColor} strokeWidth="2" shapeRendering="crispEdges" />
      </svg>
    </div>
  );
}
