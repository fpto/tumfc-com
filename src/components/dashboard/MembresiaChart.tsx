"use client";

import { useRef, useState } from "react";
import {
  COLOR_NIVEL,
  METRICA_LABEL,
  NIVELES,
  PARROQUIAS,
  SNAPSHOT_ACTUAL,
  totalConteo,
  type Metrica,
  type ParroquiaId,
} from "@/data/mfc";

interface Props {
  metrica: Metrica;
  seleccion: ParroquiaId | "todas";
}

interface TooltipState {
  x: number;
  y: number;
  titulo: string;
  detalle: string;
}

export function LeyendaNiveles() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {NIVELES.map((nivel, i) => (
        <span key={nivel} className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: COLOR_NIVEL[i] }}
            aria-hidden="true"
          />
          {nivel}
        </span>
      ))}
    </div>
  );
}

export default function MembresiaChart({ metrica, seleccion }: Props) {
  const contRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const reporte = SNAPSHOT_ACTUAL[metrica];
  const totales = PARROQUIAS.map((p) => totalConteo(reporte[p.id]));
  const max = Math.max(...totales.map((t) => t ?? 0), 1);

  const mostrarTooltip = (
    e: React.MouseEvent | React.FocusEvent,
    titulo: string,
    detalle: string,
  ) => {
    const cont = contRef.current;
    if (!cont) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const contRect = cont.getBoundingClientRect();
    setTooltip({
      x: rect.left - contRect.left + rect.width / 2,
      y: rect.top - contRect.top,
      titulo,
      detalle,
    });
  };

  return (
    <div ref={contRef} className="relative">
      <div className="space-y-3">
        {PARROQUIAS.map((p, idx) => {
          const conteo = reporte[p.id];
          const total = totales[idx];
          const atenuada = seleccion !== "todas" && seleccion !== p.id;

          return (
            <div
              key={p.id}
              className={`grid grid-cols-1 items-center gap-x-3 gap-y-1 transition-opacity sm:grid-cols-[190px_1fr] ${
                atenuada ? "opacity-35" : ""
              }`}
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-neutral-800">{p.nombre}</div>
                <div className="truncate text-xs text-neutral-500">
                  {p.ciudad}
                  {p.enDesarrollo ? " · en desarrollo" : ""}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {conteo === null || total === null ? (
                  <span className="text-xs italic text-neutral-400">No reportado</span>
                ) : total === 0 ? (
                  <span className="text-sm font-semibold tabular-nums text-neutral-400">0</span>
                ) : (
                  <>
                    <div
                      className="flex h-5 items-center gap-[2px]"
                      style={{ width: `${(total / max) * 100}%`, minWidth: "8px" }}
                      role="img"
                      aria-label={`${p.nombre}, ${p.ciudad}: ${total} ${METRICA_LABEL[
                        metrica
                      ].toLowerCase()} en total`}
                    >
                      {conteo.map((valor, nivel) => {
                        if (valor === null || valor === 0) return null;
                        const esUltimo =
                          conteo.slice(nivel + 1).every((v) => v === null || v === 0);
                        return (
                          <div
                            key={nivel}
                            tabIndex={0}
                            className={`h-full min-w-[3px] outline-offset-2 outline-mfc-red focus-visible:outline-2 ${
                              esUltimo ? "rounded-r-[4px]" : ""
                            }`}
                            style={{
                              flexGrow: valor,
                              flexBasis: 0,
                              backgroundColor: COLOR_NIVEL[nivel],
                            }}
                            onMouseEnter={(e) =>
                              mostrarTooltip(
                                e,
                                `${p.nombre} · ${p.ciudad}`,
                                `${NIVELES[nivel]}: ${valor} de ${total}`,
                              )
                            }
                            onFocus={(e) =>
                              mostrarTooltip(
                                e,
                                `${p.nombre} · ${p.ciudad}`,
                                `${NIVELES[nivel]}: ${valor} de ${total}`,
                              )
                            }
                            onMouseLeave={() => setTooltip(null)}
                            onBlur={() => setTooltip(null)}
                          />
                        );
                      })}
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-neutral-800">
                      {total}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y - 6 }}
          role="status"
        >
          <div className="font-semibold">{tooltip.titulo}</div>
          <div className="text-neutral-300">{tooltip.detalle}</div>
        </div>
      )}
    </div>
  );
}
