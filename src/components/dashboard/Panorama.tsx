"use client";

import {
  COLOR_NIVEL,
  NIVELES,
  PARROQUIAS,
  TINTA,
  suma,
  type ParroquiaId,
  type Reporte,
} from "@/data/mfc";

interface Props {
  ebf: Reporte;
  mat: Reporte;
  setCelda: (tipo: "ebf" | "mat", pid: ParroquiaId, nivel: number, valor: string) => void;
  guardarCorte: () => void;
}

export default function Panorama({ ebf, mat, setCelda, guardarCorte }: Props) {
  const maxMat = Math.max(...PARROQUIAS.map((p) => suma(mat[p.id])), 1);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="tablero-display my-1.5 text-2xl font-bold text-mfc-green">
          Matrimonios por parroquia y nivel
        </h2>
        <button
          type="button"
          onClick={guardarCorte}
          className="cursor-pointer rounded-md bg-mfc-green px-3.5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Guardar corte de hoy
        </button>
      </div>
      <p className="mt-0 text-[13px] text-[#5b6472]">
        Toque cualquier número para editarlo. Al terminar una actualización, use
        &ldquo;Guardar corte de hoy&rdquo; para registrar el estado en el historial.
      </p>

      {/* Barras apiladas */}
      <div className="mb-6 rounded-[10px] border border-[#e2e2da] bg-white px-4.5 py-4">
        {PARROQUIAS.map((p) => {
          const vals = mat[p.id];
          const total = suma(vals);
          return (
            <div
              key={p.id}
              className="grid items-center gap-2.5 border-b border-[#f0f0ea] py-[7px] sm:grid-cols-[170px_1fr_44px]"
            >
              <div className="text-[12.5px] leading-tight">
                <div className="font-semibold">{p.lugar}</div>
                <div className="text-[11px] text-[#8a93a3]">{p.nombre}</div>
              </div>
              <div className="flex h-5 overflow-hidden rounded bg-[#eef0ec]">
                {vals.map((v, i) =>
                  v ? (
                    <div
                      key={i}
                      title={`${NIVELES[i]}: ${v}`}
                      className="flex items-center justify-center text-[10.5px] font-semibold"
                      style={{
                        width: `${(v / maxMat) * 100}%`,
                        background: COLOR_NIVEL[i],
                        color: i < 2 ? TINTA : "#fff",
                      }}
                    >
                      {v}
                    </div>
                  ) : null,
                )}
              </div>
              <div className="text-right font-bold text-mfc-green">{total}</div>
            </div>
          );
        })}
        <div className="mt-3 flex flex-wrap gap-4">
          {NIVELES.map((n, i) => (
            <span
              key={n}
              className="inline-flex items-center gap-1.5 text-[11.5px] text-[#5b6472]"
            >
              <span
                className="inline-block h-3 w-3 rounded-[3px]"
                style={{ background: COLOR_NIVEL[i] }}
                aria-hidden="true"
              />
              {n}
            </span>
          ))}
        </div>
      </div>

      <Tabla titulo="Matrimonios en el CBF" tipo="mat" datos={mat} setCelda={setCelda} />
      <Tabla
        titulo="Equipos Básicos de Formación (EBF)"
        tipo="ebf"
        datos={ebf}
        setCelda={setCelda}
      />
    </div>
  );
}

function Tabla({
  titulo,
  tipo,
  datos,
  setCelda,
}: {
  titulo: string;
  tipo: "ebf" | "mat";
  datos: Reporte;
  setCelda: Props["setCelda"];
}) {
  const totalesNivel = [0, 1, 2, 3].map((n) =>
    suma(PARROQUIAS.map((p) => datos[p.id][n] ?? 0)),
  );

  return (
    <div className="mb-6">
      <h3 className="tablero-display mb-2 text-xl font-bold text-mfc-green">{titulo}</h3>
      <div className="overflow-x-auto rounded-[10px] border border-[#e2e2da] bg-white">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#F0EFE8] text-center">
              <th className="px-3 py-2 text-left font-semibold">Parroquia</th>
              {NIVELES.map((n) => (
                <th key={n} className="px-1.5 py-2 font-semibold">
                  {n}
                </th>
              ))}
              <th className="px-2.5 py-2 font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            {PARROQUIAS.map((p) => (
              <tr key={p.id} className="border-t border-[#f0f0ea]">
                <td className="px-3 py-[7px]">
                  <span className="font-semibold">{p.lugar}</span>
                  <span className="text-[11.5px] text-[#8a93a3]"> · {p.nombre}</span>
                </td>
                {[0, 1, 2, 3].map((n) => (
                  <td key={n} className="p-1 text-center">
                    <input
                      className="celda-num tabular-nums"
                      inputMode="numeric"
                      value={datos[p.id][n] ?? ""}
                      placeholder="—"
                      onChange={(e) => setCelda(tipo, p.id, n, e.target.value)}
                      aria-label={`${p.lugar} ${NIVELES[n]}`}
                    />
                  </td>
                ))}
                <td className="text-center font-bold tabular-nums text-mfc-green">
                  {suma(datos[p.id])}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-[#d9d9cf] bg-[#FAF9F4] font-bold">
              <td className="px-3 py-2">Total arquidiócesis</td>
              {totalesNivel.map((t, i) => (
                <td key={i} className="text-center tabular-nums">
                  {t}
                </td>
              ))}
              <td className="text-center tabular-nums text-mfc-green">{suma(totalesNivel)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-1.5 text-[11.5px] text-[#8a93a3]">
        Una celda vacía indica dato aún no reportado, no un valor de cero.
      </p>
    </div>
  );
}
