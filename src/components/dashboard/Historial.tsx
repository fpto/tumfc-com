"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ORO,
  VERDE,
  PARROQUIAS,
  fmtFecha,
  suma,
  totalReporte,
  type ParroquiaId,
  type Snapshot,
} from "@/data/mfc";

interface Props {
  snapshots: Snapshot[];
  eliminarCorte: (fecha: string) => void;
}

type Serie = "total" | ParroquiaId;

export default function Historial({ snapshots, eliminarCorte }: Props) {
  const [serie, setSerie] = useState<Serie>("total");

  const datos = snapshots.map((s) => ({
    fecha: fmtFecha(s.fecha),
    Matrimonios: serie === "total" ? totalReporte(s.mat) : suma(s.mat[serie] ?? []),
    EBF: serie === "total" ? totalReporte(s.ebf) : suma(s.ebf[serie] ?? []),
  }));

  return (
    <div>
      <h2 className="tablero-display my-1.5 text-2xl font-bold text-mfc-green">
        Evolución de la membresía
      </h2>
      <p className="mt-0 text-[13px] text-[#5b6472]">
        Cada corte guardado desde la pestaña de membresía se registra aquí. Con dos o más
        cortes podrá ver la tendencia.
      </p>

      <div className="mb-3">
        <label className="mr-2 text-[12.5px]">
          Ver:{" "}
          <select
            value={serie}
            onChange={(e) => setSerie(e.target.value as Serie)}
            className="rounded-md border border-[#c3d4c8] bg-white px-2.5 py-1.5 text-[13px]"
          >
            <option value="total">Toda la arquidiócesis</option>
            {PARROQUIAS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.lugar} — {p.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="h-[300px] rounded-[10px] border border-[#e2e2da] bg-white px-2 pb-2 pt-4">
        {snapshots.length < 2 ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-[13px] text-[#8a93a3]">
            Solo hay un corte registrado (
            {snapshots[0] ? fmtFecha(snapshots[0].fecha) : "—"}). Guarde un nuevo corte
            cuando actualice las cifras para comenzar a ver la evolución.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datos} margin={{ top: 6, right: 18, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#eef0ec" />
              <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Matrimonios"
                stroke={VERDE}
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line type="monotone" dataKey="EBF" stroke={ORO} strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <h3 className="tablero-display mb-2 mt-5 text-[19px] font-bold text-mfc-green">
        Cortes registrados
      </h3>
      <div className="rounded-[10px] border border-[#e2e2da] bg-white">
        {[...snapshots].reverse().map((s) => (
          <div
            key={s.fecha}
            className="flex items-center justify-between border-b border-[#f0f0ea] px-3.5 py-2.5 text-[13px]"
          >
            <div>
              <strong>{fmtFecha(s.fecha)}</strong>
              <span className="text-[#5b6472]">
                {" "}
                · {totalReporte(s.mat)} matrimonios · {totalReporte(s.ebf)} EBF
              </span>
            </div>
            <button
              type="button"
              onClick={() => eliminarCorte(s.fecha)}
              className="cursor-pointer rounded-md border border-[#d9d9cf] px-2.5 py-1 text-xs text-[#9B3B3B] transition-colors hover:bg-[#FAF4F4]"
            >
              Eliminar
            </button>
          </div>
        ))}
        {snapshots.length === 0 && (
          <div className="p-4 text-[13px] text-[#8a93a3]">Aún no hay cortes guardados.</div>
        )}
      </div>
    </div>
  );
}
