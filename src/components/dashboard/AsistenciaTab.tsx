"use client";

import { useState } from "react";
import {
  NIVELES,
  PARROQUIAS,
  fmtFecha,
  hoyISO,
  suma,
  type Asistencia,
  type ParroquiaId,
  type Reporte,
} from "@/data/mfc";

interface Props {
  asistencias: Asistencia[];
  mat: Reporte;
  agregar: (a: Omit<Asistencia, "id">) => void;
  eliminar: (id: string) => void;
}

const inputEstilo =
  "rounded-md border border-[#cbd2e0] bg-white px-2.5 py-2 text-[13px] font-[inherit]";

const labelEstilo =
  "mb-1 block text-[11.5px] font-semibold uppercase tracking-[.06em] text-[#5b6472]";

function porcentaje(asistentes: number, esperados: number): string {
  if (esperados <= 0) return "—";
  return `${Math.round((asistentes / esperados) * 100)}%`;
}

export default function AsistenciaTab({ asistencias, mat, agregar, eliminar }: Props) {
  const [parroquia, setParroquia] = useState<ParroquiaId>(PARROQUIAS[0].id);
  const [fecha, setFecha] = useState(hoyISO());
  const [niveles, setNiveles] = useState<string[]>(["", "", "", ""]);

  const hayAsistentes = niveles.some((v) => v !== "");

  function registrar() {
    if (!fecha || !hayAsistentes) return;
    agregar({
      parroquia,
      fecha,
      niveles: niveles.map((v) => (v === "" ? null : Math.max(0, parseInt(v, 10) || 0))),
    });
    setNiveles(["", "", "", ""]);
  }

  const ordenadas = [...asistencias].sort(
    (a, b) => b.fecha.localeCompare(a.fecha) || b.id.localeCompare(a.id),
  );

  // Resumen: última sesión registrada por parroquia.
  const conRegistros = PARROQUIAS.filter((p) => ordenadas.some((a) => a.parroquia === p.id));

  return (
    <div>
      <h2 className="tablero-display my-1.5 text-2xl font-bold text-mfc-azul">
        Control de asistencia
      </h2>
      <p className="mt-0 text-[13px] text-[#5b6472]">
        Registre la asistencia de matrimonios a las sesiones del CBF por parroquia y nivel.
        El porcentaje se calcula contra los matrimonios en el CBF de esa parroquia.
      </p>

      {/* Formulario */}
      <div className="mb-6 rounded-[10px] border border-[#e2e2da] bg-white p-4">
        <div className="flex flex-wrap items-end gap-2.5">
          <div className="min-w-[220px] flex-1">
            <label className={labelEstilo} htmlFor="asis-parroquia">
              Parroquia
            </label>
            <select
              id="asis-parroquia"
              value={parroquia}
              onChange={(e) => setParroquia(e.target.value as ParroquiaId)}
              className={`${inputEstilo} w-full`}
            >
              {PARROQUIAS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.lugar} — {p.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelEstilo} htmlFor="asis-fecha">
              Fecha
            </label>
            <input
              id="asis-fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className={inputEstilo}
            />
          </div>
          <div>
            <span className={labelEstilo}>Asistentes por nivel</span>
            <div className="flex gap-1.5">
              {NIVELES.map((n, i) => (
                <input
                  key={n}
                  inputMode="numeric"
                  placeholder={n.replace("Nivel ", "N")}
                  value={niveles[i]}
                  onChange={(e) =>
                    setNiveles(niveles.map((v, j) => (j === i ? e.target.value : v)))
                  }
                  aria-label={`Asistentes ${n}`}
                  className={`${inputEstilo} w-14 text-center tabular-nums`}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={registrar}
            disabled={!fecha || !hayAsistentes}
            className={`rounded-md px-4 py-2 text-[13px] font-semibold text-white ${
              fecha && hayAsistentes ? "cursor-pointer bg-mfc-azul hover:opacity-90" : "bg-[#b5bccb]"
            }`}
          >
            Registrar
          </button>
        </div>
        <p className="mb-0 mt-2 text-[11.5px] text-[#8a93a3]">
          Deje en blanco los niveles que no sesionaron.
        </p>
      </div>

      {/* Resumen por parroquia */}
      {conRegistros.length > 0 && (
        <>
          <h3 className="tablero-display mb-2 text-[19px] font-bold text-mfc-azul">
            Última sesión por parroquia
          </h3>
          <div className="mb-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {conRegistros.map((p) => {
              const ultima = ordenadas.find((a) => a.parroquia === p.id)!;
              const asistentes = suma(ultima.niveles);
              const esperados = suma(mat[p.id]);
              const pct = esperados > 0 ? Math.min(asistentes / esperados, 1) : 0;
              return (
                <div
                  key={p.id}
                  className="rounded-[10px] border border-[#e2e2da] bg-white px-3.5 py-3"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-[13px] font-bold">{p.lugar}</div>
                    <div className="text-[11.5px] text-[#8a93a3]">{fmtFecha(ultima.fecha)}</div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2.5">
                    <div
                      className="h-2 flex-1 overflow-hidden rounded-full bg-[#eef0ec]"
                      role="img"
                      aria-label={`${asistentes} de ${esperados} matrimonios asistieron`}
                    >
                      <div
                        className="h-full rounded-full bg-mfc-azul"
                        style={{ width: `${pct * 100}%` }}
                      />
                    </div>
                    <div className="text-[12.5px] font-bold tabular-nums text-mfc-azul">
                      {asistentes}/{esperados}
                      <span className="ml-1 font-semibold text-[#5b6472]">
                        ({porcentaje(asistentes, esperados)})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Registros */}
      <h3 className="tablero-display mb-2 text-[19px] font-bold text-mfc-azul">
        Sesiones registradas
      </h3>
      {ordenadas.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#cbd2e0] bg-white p-4.5 text-[13px] text-[#8a93a3]">
          Aún no hay sesiones registradas. Use el formulario de arriba para registrar la primera.
        </div>
      ) : (
        <div className="rounded-[10px] border border-[#e2e2da] bg-white">
          {ordenadas.map((a) => {
            const p = PARROQUIAS.find((x) => x.id === a.parroquia);
            const asistentes = suma(a.niveles);
            const esperados = suma(mat[a.parroquia]);
            return (
              <div
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[#f0f0ea] px-3.5 py-2.5 text-[13px]"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <strong>{fmtFecha(a.fecha)}</strong>
                  <span>
                    {p?.lugar}
                    <span className="text-[11.5px] text-[#8a93a3]"> · {p?.nombre}</span>
                  </span>
                  <span className="flex gap-1.5">
                    {a.niveles.map((v, i) =>
                      v === null ? null : (
                        <span
                          key={i}
                          className="rounded-full bg-[#eef0ec] px-2 py-0.5 text-[11.5px] tabular-nums text-[#3d4656]"
                        >
                          {NIVELES[i].replace("Nivel ", "N")}: {v}
                        </span>
                      ),
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold tabular-nums text-mfc-azul">
                    {asistentes}
                    <span className="ml-1 font-semibold text-[#5b6472]">
                      de {esperados} ({porcentaje(asistentes, esperados)})
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => eliminar(a.id)}
                    className="cursor-pointer rounded-md border border-[#d9d9cf] px-2.5 py-1 text-xs text-[#8a93a3] transition-colors hover:bg-neutral-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
