"use client";

import {
  COLOR_NIVEL,
  NIVELES,
  PARROQUIAS,
  SNAPSHOT_ACTUAL,
  totalesPorNivel,
  type Metrica,
  type ParroquiaId,
} from "@/data/mfc";

interface Props {
  metrica: Metrica;
  seleccion: ParroquiaId | "todas";
}

const ALTO_PLOT = 150;

export default function NivelesChart({ metrica, seleccion }: Props) {
  const reporte = SNAPSHOT_ACTUAL[metrica];

  const valores: number[] =
    seleccion === "todas"
      ? totalesPorNivel(reporte)
      : NIVELES.map((_, nivel) => reporte[seleccion]?.[nivel] ?? 0);

  const max = Math.max(...valores, 1);
  const nombreSeleccion =
    seleccion === "todas"
      ? "toda la arquidiócesis"
      : PARROQUIAS.find((p) => p.id === seleccion)?.ciudad;

  return (
    <div>
      <div className="flex items-end justify-around gap-4" style={{ height: ALTO_PLOT + 24 }}>
        {valores.map((valor, nivel) => (
          <div key={nivel} className="flex flex-col items-center justify-end self-stretch">
            <span className="mb-1 text-sm font-semibold tabular-nums text-neutral-800">
              {valor}
            </span>
            <div
              className="w-6 rounded-t-[4px]"
              style={{
                height: Math.max((valor / max) * ALTO_PLOT, valor > 0 ? 4 : 2),
                backgroundColor: valor > 0 ? COLOR_NIVEL[nivel] : "#E5E5E5",
              }}
              role="img"
              aria-label={`${NIVELES[nivel]}: ${valor}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-around gap-4 border-t border-mfc-gray-medium pt-2">
        {NIVELES.map((nivel) => (
          <span key={nivel} className="text-xs text-neutral-500">
            {nivel.replace("Nivel ", "N")}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-neutral-400">Distribución por nivel en {nombreSeleccion}.</p>
    </div>
  );
}
