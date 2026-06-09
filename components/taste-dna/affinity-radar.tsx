import type { TasteDnaAffinity } from "@/lib/taste-dna/page-data";

type AffinityRadarProps = {
  affinities: TasteDnaAffinity[];
};

export function AffinityRadar({ affinities }: AffinityRadarProps) {
  const axes = affinities.slice(0, 6);

  if (axes.length < 3) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-[#cfc7b9] px-8 text-center text-sm text-[#657074]">
        Choose at least three categories to unlock the full affinity graph.
      </div>
    );
  }

  const center = 160;
  const radius = 105;
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const points = axes.map((affinity, index) =>
    polarPoint(center, radius * (affinity.value / 100), index, axes.length)
  );

  return (
    <div className="mx-auto aspect-square w-full max-w-[360px]">
      <svg
        viewBox="0 0 320 320"
        role="img"
        aria-label="Category affinity radar chart"
        className="h-full w-full overflow-visible"
      >
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={axes
              .map((_, index) =>
                polarPoint(center, radius * level, index, axes.length)
              )
              .map(pointString)
              .join(" ")}
            fill="none"
            stroke="#d8d0c2"
            strokeWidth="1"
          />
        ))}
        {axes.map((_, index) => {
          const point = polarPoint(center, radius, index, axes.length);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="#d8d0c2"
              strokeWidth="1"
            />
          );
        })}
        <polygon
          points={points.map(pointString).join(" ")}
          fill="#3c6e7140"
          stroke="#3c6e71"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <circle
            key={axes[index].label}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#b85c38"
            stroke="#fff"
            strokeWidth="2"
          />
        ))}
        {axes.map((affinity, index) => {
          const point = polarPoint(center, radius + 28, index, axes.length);
          return (
            <text
              key={affinity.label}
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[#344347] text-[10px] font-semibold"
            >
              {shortLabel(affinity.label)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function polarPoint(
  center: number,
  radius: number,
  index: number,
  total: number
) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  };
}

function pointString(point: { x: number; y: number }) {
  return `${point.x},${point.y}`;
}

function shortLabel(label: string) {
  return label.length > 14 ? `${label.slice(0, 12)}...` : label;
}
