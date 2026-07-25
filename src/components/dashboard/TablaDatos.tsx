"use client";

import {
  METRICA_LABEL,
  NIVELES,
  PARROQUIAS,
  SNAPSHOT_ACTUAL,
  totalConteo,
  totalesPorNivel,
  totalReporte,
  type Metrica,
} from "@/data/mfc";

export default function TablaDatos({ metrica }: { metrica: Metrica }) {
  const reporte = SNAPSHOT_ACTUAL[metrica];
  const porNivel = totalesPorNivel(reporte);
  const granTotal = totalReporte(reporte);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <caption className="sr-only">
          {METRICA_LABEL[metrica]} en el Ciclo Básico de Formación por parroquia y nivel
        </caption>
        <thead>
          <tr className="border-b border-mfc-gray-medium text-left text-xs uppercase tracking-wide text-neutral-500">
            <th scope="col" className="py-2 pr-4 font-semibold">
              Parroquia
            </th>
            {NIVELES.map((nivel) => (
              <th key={nivel} scope="col" className="px-3 py-2 text-right font-semibold">
                {nivel}
              </th>
            ))}
            <th scope="col" className="py-2 pl-3 text-right font-semibold">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {PARROQUIAS.map((p) => {
            const conteo = reporte[p.id];
            const total = totalConteo(conteo);
            return (
              <tr key={p.id} className="border-b border-neutral-100">
                <th scope="row" className="py-2.5 pr-4 text-left font-medium text-neutral-800">
                  {p.nombre}
                  <span className="font-normal text-neutral-500">, {p.ciudad}</span>
                </th>
                {NIVELES.map((nivel, i) => (
                  <td key={nivel} className="px-3 py-2.5 text-right tabular-nums">
                    {conteo === null || conteo[i] === null ? (
                      <span className="text-xs font-medium text-mfc-red">No rep.</span>
                    ) : (
                      conteo[i]
                    )}
                  </td>
                ))}
                <td className="py-2.5 pl-3 text-right font-semibold tabular-nums">
                  {total === null ? (
                    <span className="text-xs font-medium text-mfc-red">No rep.</span>
                  ) : (
                    total
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="text-neutral-900">
            <th scope="row" className="py-2.5 pr-4 text-left font-semibold">
              Total
            </th>
            {porNivel.map((v, i) => (
              <td key={i} className="px-3 py-2.5 text-right font-semibold tabular-nums">
                {v}
              </td>
            ))}
            <td className="py-2.5 pl-3 text-right font-semibold tabular-nums">{granTotal}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
