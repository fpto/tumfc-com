// Datos de seguimiento del MFC — Área I: El MFC y su Mística
// Arquidiócesis de San Pedro Sula · Equipo Coordinador Nacional 2026–2029
//
// Fuente: "Formato Provisional del Ciclo Básico de Formación",
// fecha de actualización 2 de julio de 2026 (versiones sucesivas del informe).
//
// Para actualizar el tablero, edita este archivo:
//  - Nuevo corte de membresía → agrega un elemento a SNAPSHOTS.
//  - Jornadas conyugales → edita JORNADAS con las fechas reales.

export const NIVELES = ["Nivel 0", "Nivel 1", "Nivel 2", "Nivel 3"] as const;

// Rampa ordinal (un solo tono, claro→oscuro) para Nivel 0 → Nivel 3.
// Validada con el verificador de paletas (monotonía de luminosidad,
// contraste del extremo claro ≥ 2:1 sobre superficie blanca).
export const COLOR_NIVEL = ["#ED8B95", "#E14F5E", "#CF152D", "#8F1021"] as const;

export type ParroquiaId =
  | "chamelecon"
  | "choloma"
  | "interparroquial"
  | "puerto-cortes"
  | "villanueva"
  | "lopez-arellano"
  | "santa-cruz";

export interface Parroquia {
  id: ParroquiaId;
  nombre: string;
  ciudad: string;
  enDesarrollo?: boolean;
}

export const PARROQUIAS: Parroquia[] = [
  { id: "chamelecon", nombre: "Nuestra Señora de Suyapa", ciudad: "Chamelecón" },
  { id: "choloma", nombre: "Nuestra Señora de Lourdes", ciudad: "Choloma" },
  { id: "interparroquial", nombre: "Interparroquial", ciudad: "San Pedro Sula" },
  { id: "puerto-cortes", nombre: "Sagrado Corazón de Jesús", ciudad: "Puerto Cortés" },
  { id: "villanueva", nombre: "Nuestra Señora de la Visitación", ciudad: "Villanueva" },
  { id: "lopez-arellano", nombre: "Nuestra Señora de Suyapa", ciudad: "López Arellano" },
  { id: "santa-cruz", nombre: "La Santa Cruz", ciudad: "San Pedro Sula", enDesarrollo: true },
];

export type Metrica = "matrimonios" | "ebf";

export const METRICA_LABEL: Record<Metrica, string> = {
  matrimonios: "Matrimonios",
  ebf: "Equipos (EBF)",
};

// Conteo por nivel [N0, N1, N2, N3]. null = dato aún no reportado.
export type Conteo = [number | null, number | null, number | null, number | null];

// null en la parroquia = la parroquia no reportó nada en ese corte.
export type Reporte = Record<ParroquiaId, Conteo | null>;

export interface Snapshot {
  version: number;
  label: string;
  fecha: string; // ISO
  ebf: Reporte;
  matrimonios: Reporte;
}

const SIN_REPORTE: Reporte = {
  chamelecon: null,
  choloma: null,
  interparroquial: null,
  "puerto-cortes": null,
  villanueva: null,
  "lopez-arellano": null,
  "santa-cruz": null,
};

export const SNAPSHOTS: Snapshot[] = [
  {
    version: 1,
    label: "Corte 1",
    fecha: "2026-07-02",
    ebf: {
      chamelecon: null,
      choloma: [1, 3, 0, 0],
      interparroquial: [4, 7, 6, 3],
      "puerto-cortes": [0, 2, 1, 1],
      villanueva: [0, 0, 0, 2],
      "lopez-arellano": [0, 1, 2, 0],
      "santa-cruz": null,
    },
    matrimonios: SIN_REPORTE,
  },
  {
    version: 2,
    label: "Corte 2",
    fecha: "2026-07-02",
    ebf: {
      chamelecon: null,
      choloma: [1, 3, 0, 0],
      interparroquial: [4, 7, 6, 3],
      "puerto-cortes": [0, 2, 1, 1],
      villanueva: [0, 0, 0, 2],
      "lopez-arellano": [0, 1, 2, 0],
      "santa-cruz": [3, 0, 0, 0],
    },
    matrimonios: SIN_REPORTE,
  },
  {
    version: 3,
    label: "Corte 3",
    fecha: "2026-07-02",
    ebf: {
      chamelecon: [0, 0, 2, 2],
      choloma: [1, 3, 0, 0],
      interparroquial: [4, 7, 6, 3],
      "puerto-cortes": [0, 2, 1, 1],
      villanueva: [0, 0, 0, 2],
      "lopez-arellano": [0, 1, 2, 0],
      "santa-cruz": [3, 0, 0, 0],
    },
    matrimonios: {
      chamelecon: [0, 0, 8, 5],
      choloma: null,
      interparroquial: [19, 34, 24, 11],
      "puerto-cortes": [0, 8, 4, 5],
      villanueva: null,
      "lopez-arellano": null,
      "santa-cruz": [12, 0, 0, 0],
    },
  },
  {
    version: 4,
    label: "Corte 4",
    fecha: "2026-07-02",
    ebf: {
      chamelecon: [0, 0, 2, 2],
      choloma: [1, 3, 0, 0],
      interparroquial: [4, 7, 6, 3],
      "puerto-cortes": [0, 2, 1, 1],
      villanueva: [0, 0, 0, 2],
      "lopez-arellano": [0, 1, 2, 0],
      "santa-cruz": [3, 0, 0, 0],
    },
    matrimonios: {
      chamelecon: [0, 0, 8, 5],
      choloma: [19, 19, 0, 0],
      interparroquial: [26, 34, 24, 11],
      "puerto-cortes": [0, 8, 4, 5],
      villanueva: null,
      "lopez-arellano": [0, 3, 6, 0],
      "santa-cruz": [12, 0, 0, 0],
    },
  },
  {
    version: 5,
    label: "Corte 5",
    fecha: "2026-07-02",
    ebf: {
      chamelecon: [0, 0, 2, 2],
      choloma: [1, 3, 0, 1],
      interparroquial: [4, 7, 6, 3],
      "puerto-cortes": [0, 2, 1, 1],
      villanueva: [0, 0, 0, 2],
      "lopez-arellano": [0, 1, 2, 0],
      "santa-cruz": [3, 0, 0, 0],
    },
    matrimonios: {
      chamelecon: [0, 0, 8, 5],
      choloma: [4, 19, 0, 3],
      interparroquial: [26, 34, 24, 11],
      "puerto-cortes": [0, 8, 4, 5],
      villanueva: [0, 0, 0, null],
      "lopez-arellano": [0, 3, 6, 0],
      "santa-cruz": [12, 0, 0, 0],
    },
  },
];

export type EstadoJornada = "confirmada" | "por-confirmar" | "sin-programar";

export interface Jornada {
  parroquiaId: ParroquiaId;
  fecha: string | null; // ISO, null si no hay fecha
  lugar: string | null;
  estado: EstadoJornada;
  // Marca las entradas de muestra para que el tablero las señale
  // visiblemente hasta que se reemplacen con fechas reales.
  ejemplo?: boolean;
}

export const JORNADAS: Jornada[] = [
  {
    parroquiaId: "interparroquial",
    fecha: "2026-08-15",
    lugar: "Casa de Retiros, San Pedro Sula",
    estado: "confirmada",
    ejemplo: true,
  },
  {
    parroquiaId: "choloma",
    fecha: "2026-09-12",
    lugar: "Salón parroquial, Choloma",
    estado: "por-confirmar",
    ejemplo: true,
  },
  {
    parroquiaId: "puerto-cortes",
    fecha: "2026-10-03",
    lugar: "Salón parroquial, Puerto Cortés",
    estado: "por-confirmar",
    ejemplo: true,
  },
  { parroquiaId: "chamelecon", fecha: null, lugar: null, estado: "sin-programar" },
  { parroquiaId: "villanueva", fecha: null, lugar: null, estado: "sin-programar" },
  { parroquiaId: "lopez-arellano", fecha: null, lugar: null, estado: "sin-programar" },
  { parroquiaId: "santa-cruz", fecha: null, lugar: null, estado: "sin-programar" },
];

// ---------- Utilidades ----------

export function totalConteo(conteo: Conteo | null): number | null {
  if (conteo === null) return null;
  const reportados = conteo.filter((v): v is number => v !== null);
  if (reportados.length === 0) return null;
  return reportados.reduce((a, b) => a + b, 0);
}

export function totalReporte(reporte: Reporte): number {
  return PARROQUIAS.reduce((sum, p) => sum + (totalConteo(reporte[p.id]) ?? 0), 0);
}

export function totalesPorNivel(reporte: Reporte): number[] {
  return NIVELES.map((_, nivel) =>
    PARROQUIAS.reduce((sum, p) => sum + (reporte[p.id]?.[nivel] ?? 0), 0),
  );
}

export function serieHistorial(
  metrica: Metrica,
  parroquiaId: ParroquiaId | "todas",
): (number | null)[] {
  return SNAPSHOTS.map((s) => {
    const reporte = s[metrica];
    if (parroquiaId === "todas") {
      const algunReporte = PARROQUIAS.some((p) => reporte[p.id] !== null);
      return algunReporte ? totalReporte(reporte) : null;
    }
    return totalConteo(reporte[parroquiaId]);
  });
}

export function celdasSinReportar(snapshot: Snapshot): {
  total: number;
  detalle: { parroquiaId: ParroquiaId; metrica: Metrica; nivel: number | null }[];
} {
  const detalle: { parroquiaId: ParroquiaId; metrica: Metrica; nivel: number | null }[] = [];
  for (const metrica of ["ebf", "matrimonios"] as Metrica[]) {
    for (const p of PARROQUIAS) {
      const conteo = snapshot[metrica][p.id];
      if (conteo === null) {
        detalle.push({ parroquiaId: p.id, metrica, nivel: null });
      } else {
        conteo.forEach((v, nivel) => {
          if (v === null) detalle.push({ parroquiaId: p.id, metrica, nivel });
        });
      }
    }
  }
  return { total: detalle.length, detalle };
}

export const SNAPSHOT_ACTUAL = SNAPSHOTS[SNAPSHOTS.length - 1];

export function formatFecha(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${d} de ${meses[m - 1]} de ${y}`;
}
