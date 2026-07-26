// Datos de seguimiento del MFC — Área I: El MFC y su Mística
// Arquidiócesis de San Pedro Sula · Equipo Coordinador Nacional 2026–2029
//
// Semilla: "Formato Provisional del Ciclo Básico de Formación",
// corte del 2 de julio de 2026 (versión más completa del informe).
// El tablero guarda las ediciones y cortes posteriores en localStorage.

export const NIVELES = ["Nivel 0", "Nivel 1", "Nivel 2", "Nivel 3"] as const;

// Paleta oficial del logo MFC Matrimonios, según el Manual de Uso de Marca
// (Art. Nº 2 — Logo y Estandartes, Reglamentos del MFC de Honduras).
export const PALETA_MFC = {
  dorado: "#B89C11", // PMS 125 C
  cafe: "#492F25", // PMS 470 C
  rojo: "#CF152D", // PMS 186 C
  verde: "#196A39", // PMS 349 C
  negro: "#010101", // PMS Black C
  rojoSecundario: "#C9151C", // PMS 186 C
  amarillo: "#F7E602", // PMS 109 C
  verdeLima: "#B5CC00", // PMS 376 C
  terracota: "#B4383E", // PMS 202 C
  gris: "#B3B5B6", // PMS Cool Gray 5 C
  naranjaRojo: "#DC2F28", // PMS 1788 C
  cian: "#0BB5D2", // PMS 312 C
} as const;

// Colores de marca por nivel del CBF (Nivel 0 → Nivel 3), culminando en el
// verde institucional para el nivel más alto. Combinación verificada para
// visión normal y deficiencias de color; el par rojo↔verde se apoya en los
// separadores entre segmentos y las etiquetas directas de la barra.
export const COLOR_NIVEL = [
  PALETA_MFC.cian,
  PALETA_MFC.dorado,
  PALETA_MFC.rojo,
  PALETA_MFC.verde,
] as const;

export const VERDE = PALETA_MFC.verde;
export const ORO = PALETA_MFC.dorado;
export const CIAN = PALETA_MFC.cian;
export const ROJO = PALETA_MFC.rojo;
export const PAPEL = "#F6F5F1";
export const TINTA = "#16231B";

// Tinta legible sobre cada color de nivel (oscura sobre cian/dorado,
// blanca sobre rojo/verde).
export const INK_NIVEL = [TINTA, TINTA, "#ffffff", "#ffffff"] as const;

export type ParroquiaId =
  | "chamelecon"
  | "choloma"
  | "interparroquial"
  | "puertocortes"
  | "villanueva"
  | "lopezarellano"
  | "santacruz";

// Zonas pastorales de la Arquidiócesis de San Pedro Sula, según
// "Estructuras y organismos de comunión" (4 zonas, 38 parroquias).
// "Interzonal" agrupa las obras que no están amarradas a una zona
// específica, como el Interparroquial de San Pedro Sula.
export type ZonaId = "medalla" | "pablovi" | "sanpablo" | "subirana" | "interzonal";

export interface Zona {
  id: ZonaId;
  nombre: string;
}

export const ZONAS: Zona[] = [
  { id: "medalla", nombre: "Zona Medalla Milagrosa" },
  { id: "pablovi", nombre: "Zona Pablo VI" },
  { id: "sanpablo", nombre: "Zona San Pablo" },
  { id: "subirana", nombre: "Zona Subirana" },
  { id: "interzonal", nombre: "Interzonal" },
];

export interface Parroquia {
  id: ParroquiaId;
  nombre: string;
  lugar: string;
  zona: ZonaId;
}

// Ordenadas por zona pastoral (mismo orden que ZONAS).
export const PARROQUIAS: Parroquia[] = [
  // Zona Medalla Milagrosa
  { id: "choloma", nombre: "Ntra. Sra. de Lourdes", lugar: "Choloma", zona: "medalla" },
  { id: "lopezarellano", nombre: "Ntra. Sra. de Suyapa", lugar: "López Arellano", zona: "medalla" },
  { id: "puertocortes", nombre: "Sagrado Corazón de Jesús", lugar: "Puerto Cortés", zona: "medalla" },
  // Zona Pablo VI
  { id: "santacruz", nombre: "La Santa Cruz (en desarrollo)", lugar: "San Pedro Sula", zona: "pablovi" },
  // Zona San Pablo
  { id: "chamelecon", nombre: "Ntra. Sra. de Suyapa", lugar: "Chamelecón", zona: "sanpablo" },
  // Zona Subirana
  { id: "villanueva", nombre: "Ntra. Sra. de la Visitación", lugar: "Villanueva", zona: "subirana" },
  // Interzonal
  { id: "interparroquial", nombre: "Interparroquial", lugar: "San Pedro Sula", zona: "interzonal" },
];

export const parroquiasDeZona = (z: ZonaId): Parroquia[] =>
  PARROQUIAS.filter((p) => p.zona === z);

// Conteo por nivel [N0, N1, N2, N3]. null = dato aún no reportado.
export type Conteo = (number | null)[];
export type Reporte = Record<ParroquiaId, Conteo>;

export const SEED_EBF: Reporte = {
  chamelecon: [0, 0, 2, 2],
  choloma: [1, 3, 0, 1],
  interparroquial: [4, 7, 6, 3],
  puertocortes: [0, 2, 1, 1],
  villanueva: [0, 0, 0, 2],
  lopezarellano: [0, 1, 2, 0],
  santacruz: [3, 0, 0, 0],
};

export const SEED_MAT: Reporte = {
  chamelecon: [0, 0, 8, 5],
  choloma: [4, 19, 0, 3],
  interparroquial: [26, 34, 24, 11],
  puertocortes: [0, 8, 4, 5],
  villanueva: [0, 0, 0, null],
  lopezarellano: [0, 3, 6, 0],
  santacruz: [12, 0, 0, 0],
};

export interface Snapshot {
  fecha: string; // ISO
  ebf: Reporte;
  mat: Reporte;
}

export const SNAPSHOT_SEED: Snapshot = {
  fecha: "2026-07-02",
  ebf: SEED_EBF,
  mat: SEED_MAT,
};

export type EstadoJornada = "programada" | "realizada" | "cancelada";

export const ESTADO_JORNADA: Record<EstadoJornada, { etiqueta: string; color: string }> = {
  programada: { etiqueta: "Programada", color: ORO },
  realizada: { etiqueta: "Realizada", color: VERDE },
  cancelada: { etiqueta: "Cancelada", color: ROJO },
};

export interface Jornada {
  id: string;
  parroquia: ParroquiaId;
  fecha: string; // ISO
  notas: string;
  estado: EstadoJornada;
  // Matrimonios que asistieron a la jornada; null = aún sin registrar.
  asistentes?: number | null;
}

export interface DatosTablero {
  ebf: Reporte;
  mat: Reporte;
  snapshots: Snapshot[];
  jornadas: Jornada[];
}

export const STORAGE_KEY = "mfc-tablero-v1";

// ---------- Utilidades ----------

export const clone = <T,>(o: T): T => JSON.parse(JSON.stringify(o));

export const suma = (arr: Conteo): number => arr.reduce<number>((a, b) => a + (b ?? 0), 0);

export const totalReporte = (r: Reporte): number =>
  PARROQUIAS.reduce((acc, p) => acc + suma(r[p.id] ?? []), 0);

export const hoyISO = (): string => new Date().toISOString().slice(0, 10);

export function fmtFecha(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d} ${meses[m - 1]} ${y}`;
}

export function diasHasta(iso: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [y, m, d] = iso.split("-").map(Number);
  const f = new Date(y, m - 1, d);
  return Math.round((f.getTime() - hoy.getTime()) / 86_400_000);
}
