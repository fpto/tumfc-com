"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Cloud, CloudOff, KeyRound, LoaderCircle, TriangleAlert } from "lucide-react";
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

// Estado de sincronización con la nube:
//  - "local": sin base de datos configurada; solo se guarda en este navegador
//  - "clave": el servidor exige la clave de edición y aún no la tenemos
type Sync = "guardado" | "guardando" | "error" | "clave" | "local";

const CLAVE_KEY = "mfc-tablero-clave";

const TABS: [Tab, string][] = [
  ["panorama", "Membresía"],
  ["historial", "Historial"],
  ["jornadas", "Jornadas conyugales"],
];

function leerLocal(): Partial<DatosTablero> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<DatosTablero>) : null;
  } catch {
    return null;
  }
}

function escribirLocal(datos: DatosTablero) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
  } catch {
    // sin espacio o modo privado: la copia local es solo un respaldo
  }
}

export default function TableroMFC() {
  const [cargando, setCargando] = useState(true);
  const [tab, setTab] = useState<Tab>("panorama");
  const [ebf, setEbf] = useState<Reporte>(() => clone(SEED_EBF));
  const [mat, setMat] = useState<Reporte>(() => clone(SEED_MAT));
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [aviso, setAviso] = useState("");
  const [sync, setSync] = useState<Sync>("guardado");
  const [claveInput, setClaveInput] = useState("");

  const pendiente = useRef<DatosTablero | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modoLocal = useRef(false);

  // Carga inicial: primero la nube; si la base de datos no está configurada
  // o no responde, se usa la copia de este navegador como respaldo.
  useEffect(() => {
    let activo = true;
    (async () => {
      let datos: Partial<DatosTablero> | null = null;
      let enNube = false;
      try {
        const res = await fetch("/api/tablero");
        if (res.ok) {
          const cuerpo = (await res.json()) as { datos: DatosTablero | null };
          datos = cuerpo.datos;
          enNube = true;
        }
      } catch {
        // sin red o sin API: seguimos con el respaldo local
      }
      if (!activo) return;

      if (!enNube) {
        modoLocal.current = true;
        setSync("local");
        datos = leerLocal();
      }

      if (datos) {
        setEbf(datos.ebf ?? clone(SEED_EBF));
        setMat(datos.mat ?? clone(SEED_MAT));
        setSnapshots(datos.snapshots ?? []);
        setJornadas(datos.jornadas ?? []);
      } else {
        // Primera vez: sembrar con el corte del informe del 2 de julio.
        const semilla: DatosTablero = {
          ebf: clone(SEED_EBF),
          mat: clone(SEED_MAT),
          snapshots: [clone(SNAPSHOT_SEED)],
          jornadas: [],
        };
        setSnapshots(semilla.snapshots);
        guardar(semilla);
      }
      setCargando(false);
    })();
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Guardado ----------

  function guardar(datos: DatosTablero) {
    escribirLocal(datos);
    if (modoLocal.current) return;
    pendiente.current = datos;
    setSync("guardando");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void enviar(), 600);
  }

  async function enviar() {
    const datos = pendiente.current;
    if (!datos) return;
    try {
      const cabeceras: Record<string, string> = { "Content-Type": "application/json" };
      const clave = localStorage.getItem(CLAVE_KEY);
      if (clave) cabeceras["x-tablero-clave"] = clave;
      const res = await fetch("/api/tablero", {
        method: "PUT",
        headers: cabeceras,
        body: JSON.stringify(datos),
      });
      if (res.status === 401) {
        setSync("clave");
        return;
      }
      if (res.status === 503) {
        modoLocal.current = true;
        setSync("local");
        return;
      }
      if (!res.ok) {
        setSync("error");
        return;
      }
      pendiente.current = null;
      setSync("guardado");
    } catch {
      setSync("error");
    }
  }

  function guardarClave() {
    if (!claveInput.trim()) return;
    try {
      localStorage.setItem(CLAVE_KEY, claveInput.trim());
    } catch {
      // sin almacenamiento: la clave se usará solo en este envío
    }
    setClaveInput("");
    setSync("guardando");
    void enviar();
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
            <ChipSync sync={sync} reintentar={() => void enviar()} />
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

      {sync === "clave" && (
        <div className="mx-auto mt-3 max-w-[980px] px-5">
          <div className="flex flex-wrap items-center gap-2.5 rounded-md border border-mfc-oro bg-[#EFE7CF] px-3 py-2 text-[13px]">
            <KeyRound className="h-4 w-4 shrink-0 text-[#7a5f1c]" aria-hidden="true" />
            <span>
              Para guardar cambios en la nube, ingrese la clave de edición del equipo:
            </span>
            <input
              type="password"
              value={claveInput}
              onChange={(e) => setClaveInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && guardarClave()}
              className="rounded-md border border-[#cbd2e0] bg-white px-2.5 py-1 text-[13px]"
              aria-label="Clave de edición"
            />
            <button
              type="button"
              onClick={guardarClave}
              className="cursor-pointer rounded-md bg-mfc-azul px-3 py-1 text-xs font-semibold text-white"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

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

function ChipSync({ sync, reintentar }: { sync: Sync; reintentar: () => void }) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold";
  switch (sync) {
    case "guardando":
      return (
        <span className={`${base} bg-white/10 text-white/70`} role="status">
          <LoaderCircle className="h-3 w-3 animate-spin" aria-hidden="true" />
          Guardando…
        </span>
      );
    case "guardado":
      return (
        <span className={`${base} bg-white/10 text-white/70`} role="status">
          <Cloud className="h-3 w-3" aria-hidden="true" />
          Guardado en la nube
        </span>
      );
    case "error":
      return (
        <button
          type="button"
          onClick={reintentar}
          className={`${base} cursor-pointer bg-[#9B3B3B]/80 text-white`}
        >
          <TriangleAlert className="h-3 w-3" aria-hidden="true" />
          Error al guardar — reintentar
        </button>
      );
    case "clave":
      return (
        <span className={`${base} bg-mfc-oro/30 text-[#EFE7CF]`} role="status">
          <KeyRound className="h-3 w-3" aria-hidden="true" />
          Falta clave de edición
        </span>
      );
    case "local":
      return (
        <span
          className={`${base} bg-white/10 text-white/60`}
          title="La base de datos no está configurada; los cambios solo se guardan en este dispositivo."
          role="status"
        >
          <CloudOff className="h-3 w-3" aria-hidden="true" />
          Solo en este dispositivo
        </span>
      );
  }
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
