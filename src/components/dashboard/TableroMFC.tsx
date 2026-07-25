"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  PARROQUIAS,
  SEED_EBF,
  SEED_MAT,
  SNAPSHOT_SEED,
  STORAGE_KEY,
  clone,
  diasHasta,
  fmtFecha,
  hoyISO,
  totalReporte,
  type DatosTablero,
  type EstadoJornada,
  type Jornada,
  type ParroquiaId,
  type Reporte,
  type Snapshot,
} from "@/data/mfc";
import Panorama from "./Panorama";
import Historial from "./Historial";
import Jornadas from "./Jornadas";

type Tab = "panorama" | "historial" | "jornadas";
type Metrica = "ebf" | "mat";

const TABS: [Tab, string][] = [
  ["panorama", "Membresía"],
  ["historial", "Historial"],
  ["jornadas", "Jornadas conyugales"],
];

export default function TableroMFC() {
  const [cargando, setCargando] = useState(true);
  const [tab, setTab] = useState<Tab>("panorama");
  const [ebf, setEbf] = useState<Reporte>(() => clone(SEED_EBF));
  const [mat, setMat] = useState<Reporte>(() => clone(SEED_MAT));
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [aviso, setAviso] = useState("");

  // Cargar del navegador. El primer render (servidor y cliente) muestra
  // "Cargando…", y el estado real entra tras montar, de forma asíncrona,
  // para que el HTML de hidratación coincida.
  useEffect(() => {
    let activo = true;
    (async () => {
      const raw = await Promise.resolve().then(() => {
        try {
          return localStorage.getItem(STORAGE_KEY);
        } catch {
          return null;
        }
      });
      if (!activo) return;
      if (raw) {
        try {
          const d = JSON.parse(raw) as Partial<DatosTablero>;
          setEbf(d.ebf ?? clone(SEED_EBF));
          setMat(d.mat ?? clone(SEED_MAT));
          setSnapshots(d.snapshots ?? []);
          setJornadas(d.jornadas ?? []);
        } catch {
          seedInicial();
        }
      } else {
        seedInicial();
      }
      setCargando(false);
    })();

    function seedInicial() {
      const s = [clone(SNAPSHOT_SEED)];
      setSnapshots(s);
      guardar({ ebf: clone(SEED_EBF), mat: clone(SEED_MAT), snapshots: s, jornadas: [] });
    }
    return () => {
      activo = false;
    };
  }, []);

  function guardar(datos: DatosTablero) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    } catch {
      setAviso("No se pudo guardar. Intente de nuevo.");
      setTimeout(() => setAviso(""), 4000);
    }
  }

  const persistir = (patch: Partial<DatosTablero>) =>
    guardar({ ebf, mat, snapshots, jornadas, ...patch });

  // ---------- Ediciones de membresía ----------
  function setCelda(tipo: Metrica, pid: ParroquiaId, nivel: number, valor: string) {
    const n = valor === "" ? null : Math.max(0, parseInt(valor, 10) || 0);
    if (tipo === "ebf") {
      const nx = { ...ebf, [pid]: ebf[pid].map((v, i) => (i === nivel ? n : v)) };
      setEbf(nx);
      persistir({ ebf: nx });
    } else {
      const nx = { ...mat, [pid]: mat[pid].map((v, i) => (i === nivel ? n : v)) };
      setMat(nx);
      persistir({ mat: nx });
    }
  }

  function guardarCorte() {
    const fecha = hoyISO();
    const nuevo: Snapshot = { fecha, ebf: clone(ebf), mat: clone(mat) };
    const nx = [...snapshots.filter((s) => s.fecha !== fecha), nuevo].sort((a, b) =>
      a.fecha.localeCompare(b.fecha),
    );
    setSnapshots(nx);
    persistir({ snapshots: nx });
    setAviso(`Corte guardado — ${fmtFecha(fecha)}`);
    setTimeout(() => setAviso(""), 3000);
  }

  function eliminarCorte(fecha: string) {
    const nx = snapshots.filter((s) => s.fecha !== fecha);
    setSnapshots(nx);
    persistir({ snapshots: nx });
  }

  // ---------- Jornadas ----------
  function agregarJornada(j: Omit<Jornada, "id">) {
    const nx = [...jornadas, { ...j, id: Date.now().toString(36) }];
    setJornadas(nx);
    persistir({ jornadas: nx });
  }
  function actualizarJornada(id: string, patch: { estado: EstadoJornada }) {
    const nx = jornadas.map((j) => (j.id === id ? { ...j, ...patch } : j));
    setJornadas(nx);
    persistir({ jornadas: nx });
  }
  function eliminarJornada(id: string) {
    const nx = jornadas.filter((j) => j.id !== id);
    setJornadas(nx);
    persistir({ jornadas: nx });
  }

  // ---------- Totales ----------
  const totEbf = useMemo(() => totalReporte(ebf), [ebf]);
  const totMat = useMemo(() => totalReporte(mat), [mat]);
  const proximaJornada = useMemo(() => {
    const futuras = jornadas
      .filter((j) => j.estado === "programada" && diasHasta(j.fecha) >= 0)
      .sort((a, b) => a.fecha.localeCompare(b.fecha));
    return futuras[0] ?? null;
  }, [jornadas]);

  if (cargando) {
    return (
      <div className="tablero-display flex min-h-screen items-center justify-center bg-mfc-papel text-mfc-azul">
        Cargando tablero…
      </div>
    );
  }

  return (
    <div className="tablero-cuerpo min-h-screen bg-mfc-papel text-mfc-tinta">
      {/* Encabezado */}
      <header className="bg-mfc-azul px-5 pb-4 pt-5 text-white">
        <div className="mx-auto max-w-[980px]">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[11px] uppercase tracking-[.18em] text-[#C9B36A]">
              Movimiento Familiar Cristiano · Arquidiócesis de San Pedro Sula
            </div>
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-1 text-xs text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Volver al sitio
            </Link>
          </div>
          <h1 className="tablero-display mb-0.5 mt-1 text-3xl font-bold">
            Área I — El MFC y su Mística
          </h1>
          <div className="text-[13px] text-[#c7cfe0]">
            Responsables: Fabricio y Estéfany Puerto · Ciclo Básico de Formación 2026–2029
          </div>
          <div className="mt-3.5 flex flex-wrap gap-6">
            <Indicador etiqueta="Matrimonios en CBF" valor={String(totMat)} />
            <Indicador etiqueta="Equipos (EBF)" valor={String(totEbf)} />
            <Indicador
              etiqueta="Próxima jornada conyugal"
              valor={proximaJornada ? fmtFecha(proximaJornada.fecha) : "Sin programar"}
              sub={
                proximaJornada
                  ? PARROQUIAS.find((p) => p.id === proximaJornada.parroquia)?.lugar
                  : undefined
              }
              chico
            />
          </div>
        </div>
      </header>

      {/* Pestañas */}
      <nav className="border-b border-[#ddd] bg-white">
        <div className="mx-auto flex max-w-[980px] gap-6 px-5">
          {TABS.map(([id, titulo]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id ? "page" : undefined}
              className={`cursor-pointer border-b-2 px-1 py-2.5 text-xs font-semibold uppercase tracking-[.04em] transition-colors ${
                tab === id
                  ? "border-mfc-oro text-mfc-azul"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {titulo}
            </button>
          ))}
        </div>
      </nav>

      {aviso && (
        <div className="mx-auto mt-3 max-w-[980px] px-5">
          <div
            className="rounded-md border border-mfc-oro bg-[#EFE7CF] px-3 py-2 text-[13px]"
            role="status"
          >
            {aviso}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-[980px] px-5 pb-16 pt-5">
        {tab === "panorama" && (
          <Panorama ebf={ebf} mat={mat} setCelda={setCelda} guardarCorte={guardarCorte} />
        )}
        {tab === "historial" && <Historial snapshots={snapshots} eliminarCorte={eliminarCorte} />}
        {tab === "jornadas" && (
          <Jornadas
            jornadas={jornadas}
            agregar={agregarJornada}
            actualizar={actualizarJornada}
            eliminar={eliminarJornada}
          />
        )}
      </main>
    </div>
  );
}

function Indicador({
  etiqueta,
  valor,
  sub,
  chico,
}: {
  etiqueta: string;
  valor: string;
  sub?: string;
  chico?: boolean;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[.12em] text-[#9fb0d0]">{etiqueta}</div>
      <div
        className={`${chico ? "tablero-cuerpo text-lg" : "tablero-display text-[28px]"} font-bold leading-tight text-white`}
      >
        {valor}
      </div>
      {sub ? <div className="text-xs text-[#c7cfe0]">{sub}</div> : null}
    </div>
  );
}
