"use client";

import { useState } from "react";
import {
  ESTADO_JORNADA,
  PARROQUIAS,
  diasHasta,
  fmtFecha,
  type EstadoJornada,
  type Jornada,
  type ParroquiaId,
} from "@/data/mfc";

interface Props {
  jornadas: Jornada[];
  agregar: (j: Omit<Jornada, "id">) => void;
  actualizar: (id: string, patch: { estado: EstadoJornada }) => void;
  eliminar: (id: string) => void;
}

const inputEstilo =
  "rounded-md border border-[#cbd2e0] bg-white px-2.5 py-2 text-[13px] font-[inherit]";

const labelEstilo =
  "mb-1 block text-[11.5px] font-semibold uppercase tracking-[.06em] text-[#5b6472]";

export default function Jornadas({ jornadas, agregar, actualizar, eliminar }: Props) {
  const [form, setForm] = useState<{ parroquia: ParroquiaId; fecha: string; notas: string }>({
    parroquia: PARROQUIAS[0].id,
    fecha: "",
    notas: "",
  });

  function enviar() {
    if (!form.fecha) return;
    agregar({ ...form, estado: "programada" });
    setForm({ parroquia: PARROQUIAS[0].id, fecha: "", notas: "" });
  }

  const ordenadas = [...jornadas].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const proximas = ordenadas.filter((j) => j.estado === "programada" && diasHasta(j.fecha) >= 0);
  const pasadas = ordenadas
    .filter((j) => !(j.estado === "programada" && diasHasta(j.fecha) >= 0))
    .reverse();

  return (
    <div>
      <h2 className="tablero-display my-1.5 text-2xl font-bold text-mfc-azul">
        Jornadas conyugales — pescas de nuevos matrimonios
      </h2>
      <p className="mt-0 text-[13px] text-[#5b6472]">
        Programe aquí las jornadas por parroquia y márquelas como realizadas al concluir.
      </p>

      {/* Formulario */}
      <div className="mb-6 rounded-[10px] border border-[#e2e2da] bg-white p-4">
        <div className="flex flex-wrap items-end gap-2.5">
          <div className="min-w-[220px] flex-1">
            <label className={labelEstilo} htmlFor="jornada-parroquia">
              Parroquia
            </label>
            <select
              id="jornada-parroquia"
              value={form.parroquia}
              onChange={(e) => setForm({ ...form, parroquia: e.target.value as ParroquiaId })}
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
            <label className={labelEstilo} htmlFor="jornada-fecha">
              Fecha
            </label>
            <input
              id="jornada-fecha"
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              className={inputEstilo}
            />
          </div>
          <div className="min-w-[240px] flex-[2]">
            <label className={labelEstilo} htmlFor="jornada-notas">
              Notas (opcional)
            </label>
            <input
              id="jornada-notas"
              type="text"
              value={form.notas}
              placeholder="Lugar, hora, equipo responsable…"
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              className={`${inputEstilo} w-full`}
            />
          </div>
          <button
            type="button"
            onClick={enviar}
            disabled={!form.fecha}
            className={`rounded-md px-4 py-2 text-[13px] font-semibold text-white ${
              form.fecha ? "cursor-pointer bg-mfc-azul hover:opacity-90" : "bg-[#b5bccb]"
            }`}
          >
            Programar jornada
          </button>
        </div>
      </div>

      <h3 className="tablero-display mb-2 text-[19px] font-bold text-mfc-azul">Próximas</h3>
      {proximas.length === 0 ? (
        <div className="mb-6 rounded-[10px] border border-dashed border-[#cbd2e0] bg-white p-4.5 text-[13px] text-[#8a93a3]">
          No hay jornadas programadas. Use el formulario de arriba para agregar la primera.
        </div>
      ) : (
        <div className="mb-6 grid gap-2.5">
          {proximas.map((j) => (
            <TarjetaJornada key={j.id} j={j} actualizar={actualizar} eliminar={eliminar} proxima />
          ))}
        </div>
      )}

      {pasadas.length > 0 && (
        <>
          <h3 className="tablero-display mb-2 text-[19px] font-bold text-mfc-azul">
            Realizadas y anteriores
          </h3>
          <div className="grid gap-2.5">
            {pasadas.map((j) => (
              <TarjetaJornada key={j.id} j={j} actualizar={actualizar} eliminar={eliminar} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TarjetaJornada({
  j,
  actualizar,
  eliminar,
  proxima,
}: {
  j: Jornada;
  actualizar: Props["actualizar"];
  eliminar: Props["eliminar"];
  proxima?: boolean;
}) {
  const p = PARROQUIAS.find((x) => x.id === j.parroquia);
  const dias = diasHasta(j.fecha);
  const est = ESTADO_JORNADA[j.estado] ?? ESTADO_JORNADA.programada;

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#e2e2da] bg-white px-3.5 py-3"
      style={{ borderLeft: `4px solid ${est.color}` }}
    >
      <div>
        <div className="text-sm font-bold">
          {p?.lugar}{" "}
          <span className="text-[12.5px] font-normal text-[#8a93a3]">· {p?.nombre}</span>
        </div>
        <div className="mt-0.5 text-[13px] text-[#3d4656]">
          {fmtFecha(j.fecha)}
          {proxima && dias >= 0 && (
            <span className="ml-2 rounded-full bg-[#EFE7CF] px-2.5 py-0.5 text-[11.5px] font-semibold text-[#7a5f1c]">
              {dias === 0 ? "Hoy" : dias === 1 ? "Mañana" : `En ${dias} días`}
            </span>
          )}
          <span className="ml-2 text-xs font-semibold" style={{ color: est.color }}>
            {est.etiqueta}
          </span>
        </div>
        {j.notas && <div className="mt-1 text-[12.5px] text-[#5b6472]">{j.notas}</div>}
      </div>
      <div className="flex gap-2">
        {j.estado === "programada" && (
          <button
            type="button"
            onClick={() => actualizar(j.id, { estado: "realizada" })}
            className="cursor-pointer rounded-md border border-[#3A6B4A] px-2.5 py-1 text-xs font-semibold text-[#3A6B4A] transition-colors hover:bg-[#F2F7F3]"
          >
            Marcar realizada
          </button>
        )}
        {j.estado === "programada" && (
          <button
            type="button"
            onClick={() => actualizar(j.id, { estado: "cancelada" })}
            className="cursor-pointer rounded-md border border-[#d9d9cf] px-2.5 py-1 text-xs text-[#9B3B3B] transition-colors hover:bg-[#FAF4F4]"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={() => eliminar(j.id)}
          className="cursor-pointer rounded-md border border-[#d9d9cf] px-2.5 py-1 text-xs text-[#8a93a3] transition-colors hover:bg-neutral-50"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
