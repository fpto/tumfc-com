"use client";

import { useSyncExternalStore } from "react";
import { CalendarCheck, CalendarClock, CalendarPlus, MapPin } from "lucide-react";
import {
  JORNADAS,
  PARROQUIAS,
  formatFecha,
  type EstadoJornada,
  type Jornada,
} from "@/data/mfc";

const ESTADO: Record<
  EstadoJornada,
  { label: string; icon: typeof CalendarCheck; badge: string }
> = {
  confirmada: {
    label: "Confirmada",
    icon: CalendarCheck,
    badge: "bg-mfc-green/10 text-mfc-green-dark",
  },
  "por-confirmar": {
    label: "Por confirmar",
    icon: CalendarClock,
    badge: "bg-mfc-gold/15 text-[#7a6708]",
  },
  "sin-programar": {
    label: "Sin programar",
    icon: CalendarPlus,
    badge: "bg-neutral-100 text-neutral-500",
  },
};

function diasRestantes(fecha: string, hoy: Date): number {
  const [y, m, d] = fecha.split("-").map(Number);
  const objetivo = new Date(y, m - 1, d);
  const base = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  return Math.round((objetivo.getTime() - base.getTime()) / 86_400_000);
}

function TarjetaJornada({ jornada, hoy }: { jornada: Jornada; hoy: Date | null }) {
  const parroquia = PARROQUIAS.find((p) => p.id === jornada.parroquiaId)!;
  const estado = ESTADO[jornada.estado];
  const Icono = estado.icon;
  const dias = jornada.fecha && hoy ? diasRestantes(jornada.fecha, hoy) : null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-mfc-gray-medium bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-neutral-900">
            {parroquia.nombre}
          </div>
          <div className="truncate text-xs text-neutral-500">{parroquia.ciudad}</div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${estado.badge}`}
        >
          <Icono className="h-3.5 w-3.5" aria-hidden="true" />
          {estado.label}
        </span>
      </div>

      {jornada.fecha ? (
        <div>
          <div className="text-lg font-semibold text-neutral-900">
            {formatFecha(jornada.fecha)}
          </div>
          {dias !== null && (
            <div className="mt-0.5 text-sm text-neutral-500">
              {dias > 1 && `En ${dias} días`}
              {dias === 1 && "Mañana"}
              {dias === 0 && "Hoy"}
              {dias < 0 && `Hace ${Math.abs(dias)} días`}
            </div>
          )}
          {jornada.lugar && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{jornada.lugar}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-neutral-400">
          Aún no hay jornada conyugal en el calendario.
        </div>
      )}

      {jornada.ejemplo && (
        <div className="rounded-lg border border-dashed border-mfc-gold/60 bg-mfc-gold/5 px-2.5 py-1.5 text-[11px] font-medium text-[#7a6708]">
          Ejemplo — reemplazar con la fecha real en src/data/mfc.ts
        </div>
      )}
    </div>
  );
}

// La cuenta regresiva depende de la fecha del navegador; en el servidor se
// omite (snapshot null) para que el HTML del servidor y del cliente coincidan.
const HOY_CLIENTE = typeof window === "undefined" ? null : new Date();
const suscribirNada = () => () => {};

export default function JornadasBoard() {
  const hoy = useSyncExternalStore(
    suscribirNada,
    () => HOY_CLIENTE,
    () => null,
  );

  const ordenadas = [...JORNADAS].sort((a, b) => {
    if (a.fecha && b.fecha) return a.fecha.localeCompare(b.fecha);
    if (a.fecha) return -1;
    if (b.fecha) return 1;
    return 0;
  });

  const programadas = ordenadas.filter((j) => j.fecha).length;

  return (
    <div>
      <p className="mb-4 text-sm text-neutral-500">
        {programadas} de {JORNADAS.length} parroquias con jornada en el calendario.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ordenadas.map((j) => (
          <TarjetaJornada key={j.parroquiaId} jornada={j} hoy={hoy} />
        ))}
      </div>
    </div>
  );
}
