"use client";

import { useState } from "react";
import {
  METRICA_LABEL,
  PARROQUIAS,
  SNAPSHOTS,
  serieHistorial,
  type Metrica,
  type ParroquiaId,
} from "@/data/mfc";

interface Props {
  metrica: Metrica;
  seleccion: ParroquiaId | "todas";
}

const W = 640;
const H = 240;
const M = { top: 16, right: 20, bottom: 30, left: 40 };

function escalaTicks(max: number): number[] {
  const pasos = [1, 2, 5, 10, 20, 25, 50, 100, 200];
  const paso = pasos.find((p) => max / p <= 4) ?? 200;
  const tope = Math.ceil(max / paso) * paso;
  const ticks: number[] = [];
  for (let v = 0; v <= tope; v += paso) ticks.push(v);
  return ticks;
}

export default function HistorialChart({ metrica, seleccion }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const serie = serieHistorial(metrica, seleccion);
  const valores = serie.filter((v): v is number => v !== null);
  const maxVal = Math.max(...valores, 1);
  const ticks = escalaTicks(maxVal);
  const yMax = ticks[ticks.length - 1];

  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;
  const x = (i: number) => M.left + (i / (SNAPSHOTS.length - 1)) * plotW;
  const y = (v: number) => M.top + plotH - (v / yMax) * plotH;

  // Segmentos de línea entre puntos consecutivos reportados; un corte sin
  // reporte deja un hueco en lugar de interpolar un valor inexistente.
  const segmentos: string[] = [];
  let actual: string[] = [];
  serie.forEach((v, i) => {
    if (v === null) {
      if (actual.length > 1) segmentos.push(actual.join(" "));
      actual = [];
    } else {
      actual.push(`${actual.length === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`);
    }
  });
  if (actual.length > 1) segmentos.push(actual.join(" "));

  let ultimoIdx = -1;
  for (let i = 0; i < serie.length; i++) if (serie[i] !== null) ultimoIdx = i;
  const ultimoValor = ultimoIdx >= 0 ? serie[ultimoIdx] : null;
  const nombre =
    seleccion === "todas"
      ? "Total arquidiócesis"
      : PARROQUIAS.find((p) => p.id === seleccion)?.nombre ?? "";

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Historial de ${METRICA_LABEL[metrica].toLowerCase()} — ${nombre}`}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={M.left}
              x2={W - M.right}
              y1={y(t)}
              y2={y(t)}
              stroke="#ECECEC"
              strokeWidth={1}
            />
            <text
              x={M.left - 8}
              y={y(t) + 3.5}
              textAnchor="end"
              fontSize={11}
              fill="#8a8a8a"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {t}
            </text>
          </g>
        ))}

        {segmentos.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#CF152D"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {serie.map((v, i) =>
          v === null ? null : (
            <circle
              key={i}
              cx={x(i)}
              cy={y(v)}
              r={hover === i ? 6 : 5}
              fill="#CF152D"
              stroke="#ffffff"
              strokeWidth={2}
            />
          ),
        )}

        {ultimoValor !== null && (
          <text
            x={x(ultimoIdx)}
            y={y(ultimoValor) - 12}
            textAnchor="middle"
            fontSize={12}
            fontWeight={600}
            fill="#1a1a1a"
          >
            {ultimoValor}
          </text>
        )}

        {SNAPSHOTS.map((s, i) => (
          <text
            key={s.version}
            x={x(i)}
            y={H - 8}
            textAnchor="middle"
            fontSize={11}
            fill={hover === i ? "#1a1a1a" : "#8a8a8a"}
          >
            {s.label}
          </text>
        ))}

        {SNAPSHOTS.map((_, i) => (
          <rect
            key={i}
            x={x(i) - plotW / (SNAPSHOTS.length - 1) / 2}
            y={0}
            width={plotW / (SNAPSHOTS.length - 1)}
            height={H}
            fill="transparent"
            tabIndex={0}
            className="outline-none"
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onBlur={() => setHover(null)}
          />
        ))}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg"
          style={{ left: `${(x(hover) / W) * 100}%` }}
          role="status"
        >
          <div className="font-semibold">{SNAPSHOTS[hover].label}</div>
          <div className="text-neutral-300">
            {serie[hover] === null
              ? "No reportado"
              : `${serie[hover]} ${METRICA_LABEL[metrica].toLowerCase()}`}
          </div>
        </div>
      )}
    </div>
  );
}
