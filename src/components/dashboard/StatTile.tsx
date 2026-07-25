"use client";

interface StatTileProps {
  label: string;
  value: string;
  sublabel?: string;
  delta?: { value: number; label: string };
  spark?: (number | null)[];
}

function Sparkline({ points }: { points: (number | null)[] }) {
  const values = points.filter((v): v is number => v !== null);
  if (values.length < 2) return null;

  const w = 96;
  const h = 28;
  const pad = 4;
  const min = Math.min(...values, 0);
  const max = Math.max(...values);
  const range = max - min || 1;

  const coords = points
    .map((v, i) =>
      v === null
        ? null
        : {
            x: pad + (i / (points.length - 1)) * (w - pad * 2),
            y: h - pad - ((v - min) / range) * (h - pad * 2),
          },
    )
    .filter((c): c is { x: number; y: number } => c !== null);

  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(" ");
  const last = coords[coords.length - 1];

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d={path}
        fill="none"
        stroke="#B3B5B6"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last.x} cy={last.y} r={4} fill="#CF152D" stroke="#ffffff" strokeWidth={2} />
    </svg>
  );
}

export default function StatTile({ label, value, sublabel, delta, spark }: StatTileProps) {
  return (
    <div className="rounded-2xl border border-mfc-gray-medium bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-neutral-500">{label}</div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="text-3xl font-semibold text-neutral-900">{value}</div>
        {spark && <Sparkline points={spark} />}
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold ${
              delta.value >= 0
                ? "bg-mfc-green/10 text-mfc-green-dark"
                : "bg-mfc-red/10 text-mfc-red-dark"
            }`}
          >
            {delta.value >= 0 ? "+" : "−"}
            {Math.abs(delta.value)}
            <span className="font-normal text-neutral-500">{delta.label}</span>
          </span>
        )}
        {sublabel && <span className="text-neutral-500">{sublabel}</span>}
      </div>
    </div>
  );
}
