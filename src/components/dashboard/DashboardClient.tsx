"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Table2, BarChart3 } from "lucide-react";
import {
  METRICA_LABEL,
  PARROQUIAS,
  SNAPSHOT_ACTUAL,
  celdasSinReportar,
  serieHistorial,
  totalReporte,
  type Metrica,
  type ParroquiaId,
} from "@/data/mfc";
import StatTile from "./StatTile";
import MembresiaChart, { LeyendaNiveles } from "./MembresiaChart";
import NivelesChart from "./NivelesChart";
import HistorialChart from "./HistorialChart";
import JornadasBoard from "./JornadasBoard";
import TablaDatos from "./TablaDatos";

type Seleccion = ParroquiaId | "todas";

function deltaUltimoCorte(serie: (number | null)[]): number | null {
  const reportados = serie.filter((v): v is number => v !== null);
  if (reportados.length < 2) return null;
  return reportados[reportados.length - 1] - reportados[reportados.length - 2];
}

const seccion = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4 },
};

export default function DashboardClient() {
  const [metrica, setMetrica] = useState<Metrica>("matrimonios");
  const [seleccion, setSeleccion] = useState<Seleccion>("todas");
  const [verTabla, setVerTabla] = useState(false);

  const serieMatrimonios = serieHistorial("matrimonios", "todas");
  const serieEbf = serieHistorial("ebf", "todas");
  const sinReportar = celdasSinReportar(SNAPSHOT_ACTUAL);
  const deltaMat = deltaUltimoCorte(serieMatrimonios);
  const deltaEbf = deltaUltimoCorte(serieEbf);

  const detalleSinReportar = sinReportar.detalle
    .map((d) => {
      const p = PARROQUIAS.find((x) => x.id === d.parroquiaId)!;
      return `${p.ciudad} · ${METRICA_LABEL[d.metrica]}${
        d.nivel !== null ? ` · Nivel ${d.nivel}` : ""
      }`;
    })
    .join("; ");

  const nombreSeleccion =
    seleccion === "todas"
      ? "Total arquidiócesis"
      : `${PARROQUIAS.find((p) => p.id === seleccion)?.nombre}, ${
          PARROQUIAS.find((p) => p.id === seleccion)?.ciudad
        }`;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-20 sm:px-6 lg:px-8">
      {/* Indicadores */}
      <motion.section {...seccion} className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Matrimonios en CBF"
          value={String(totalReporte(SNAPSHOT_ACTUAL.matrimonios))}
          delta={deltaMat !== null ? { value: deltaMat, label: "vs corte anterior" } : undefined}
          spark={serieMatrimonios}
        />
        <StatTile
          label="Equipos Básicos de Formación"
          value={String(totalReporte(SNAPSHOT_ACTUAL.ebf))}
          delta={deltaEbf !== null ? { value: deltaEbf, label: "vs corte anterior" } : undefined}
          spark={serieEbf}
        />
        <StatTile
          label="Parroquias activas"
          value={String(PARROQUIAS.length)}
          sublabel={`${PARROQUIAS.filter((p) => p.enDesarrollo).length} en desarrollo`}
        />
        <StatTile
          label="Datos sin reportar"
          value={String(sinReportar.total)}
          sublabel={sinReportar.total > 0 ? detalleSinReportar : "Reporte completo"}
        />
      </motion.section>

      {/* Filtros — una sola fila que aplica a todas las gráficas */}
      <motion.div
        {...seccion}
        className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-mfc-gray-medium bg-white p-4 shadow-sm"
      >
        <div
          className="inline-flex rounded-full border border-mfc-gray-medium bg-mfc-gray-light p-1"
          role="group"
          aria-label="Métrica"
        >
          {(["matrimonios", "ebf"] as Metrica[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMetrica(m)}
              aria-pressed={metrica === m}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                metrica === m
                  ? "bg-mfc-red text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {METRICA_LABEL[m]}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-600">
          Parroquia
          <select
            value={seleccion}
            onChange={(e) => setSeleccion(e.target.value as Seleccion)}
            className="rounded-lg border border-mfc-gray-medium bg-white px-3 py-1.5 text-sm text-neutral-800 focus:border-mfc-red focus:outline-none"
          >
            <option value="todas">Todas las parroquias</option>
            {PARROQUIAS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} — {p.ciudad}
              </option>
            ))}
          </select>
        </label>
      </motion.div>

      {/* Membresía actual */}
      <motion.section {...seccion} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-mfc-gray-medium bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                {METRICA_LABEL[metrica]} por parroquia
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                Ciclo Básico de Formación · {SNAPSHOT_ACTUAL.label} (último)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setVerTabla((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-mfc-gray-medium px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-mfc-gray-light"
            >
              {verTabla ? (
                <>
                  <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" /> Ver gráfica
                </>
              ) : (
                <>
                  <Table2 className="h-3.5 w-3.5" aria-hidden="true" /> Ver tabla
                </>
              )}
            </button>
          </div>

          {verTabla ? (
            <TablaDatos metrica={metrica} />
          ) : (
            <>
              <div className="mb-4">
                <LeyendaNiveles />
              </div>
              <MembresiaChart metrica={metrica} seleccion={seleccion} />
            </>
          )}
        </div>

        <div className="rounded-2xl border border-mfc-gray-medium bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-900">Totales por nivel</h2>
          <p className="mb-5 mt-0.5 text-xs text-neutral-500">{METRICA_LABEL[metrica]}</p>
          <NivelesChart metrica={metrica} seleccion={seleccion} />
        </div>
      </motion.section>

      {/* Historial */}
      <motion.section
        {...seccion}
        className="rounded-2xl border border-mfc-gray-medium bg-white p-6 shadow-sm"
      >
        <h2 className="text-base font-semibold text-neutral-900">
          Historial de {METRICA_LABEL[metrica].toLowerCase()}
        </h2>
        <p className="mb-5 mt-0.5 text-xs text-neutral-500">
          {nombreSeleccion} · cortes sucesivos del informe del CBF
        </p>
        <HistorialChart metrica={metrica} seleccion={seleccion} />
      </motion.section>

      {/* Jornadas conyugales */}
      <motion.section {...seccion}>
        <h2 className="text-base font-semibold text-neutral-900">Jornadas conyugales</h2>
        <p className="mb-4 mt-0.5 text-xs text-neutral-500">
          Pesca de nuevos matrimonios · próximas fechas por parroquia
        </p>
        <JornadasBoard />
      </motion.section>
    </div>
  );
}
