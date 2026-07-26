// Datos de seguimiento del MFC — Área I: El MFC y su Mística
// Arquidiócesis de San Pedro Sula · Equipo Coordinador Nacional 2026–2029
//
// Semilla: "Formato Provisional del Ciclo Básico de Formación",
// corte del 2 de julio de 2026 (versión más completa del informe).
// El tablero guarda las ediciones y cortes posteriores en localStorage.

export const NIVELES = ["Nivel 0", "Nivel 1", "Nivel 2", "Nivel 3"] as const;

// Rampa ordinal azul (claro→oscuro) para Nivel 0 → Nivel 3. El extremo claro
// se oscureció respecto a la referencia (#C4D0E6 → #A2B7D8) para cumplir el
// contraste mínimo de 2:1 sobre superficie blanca; validada con el
// verificador de paletas.
export const COLOR_NIVEL = ["#A2B7D8", "#8CA3CE", "#51709F", "#233A66"] as const;

export const AZUL = "#233A66";
export const ORO = "#A98428";
export const PAPEL = "#F6F5F1";
export const TINTA = "#1B2436";

export type ParroquiaId =
  | "chamelecon"
  | "choloma"
  | "interparroquial"
  | "puertocortes"
  | "villanueva"
  | "lopezarellano"
  | "santacruz";

export interface Parroquia {
  id: ParroquiaId;
  nombre: string;
  lugar: string;
}

export const PARROQUIAS: Parroquia[] = [
  { id: "chamelecon", nombre: "Ntra. Sra. de Suyapa", lugar: "Chamelecón" },
  { id: "choloma", nombre: "Ntra. Sra. de Lourdes", lugar: "Choloma" },
  { id: "interparroquial", nombre: "Interparroquial", lugar: "San Pedro Sula" },
  { id: "puertocortes", nombre: "Sagrado Corazón de Jesús", lugar: "Puerto Cortés" },
  { id: "villanueva", nombre: "Ntra. Sra. de la Visitación", lugar: "Villanueva" },
  { id: "lopezarellano", nombre: "Ntra. Sra. de Suyapa", lugar: "López Arellano" },
  { id: "santacruz", nombre: "La Santa Cruz (en desarrollo)", lugar: "San Pedro Sula" },
];

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
  realizada: { etiqueta: "Realizada", color: "#3A6B4A" },
  cancelada: { etiqueta: "Cancelada", color: "#9B3B3B" },
};

export interface Jornada {
  id: string;
  parroquia: ParroquiaId;
  fecha: string; // ISO
  notas: string;
  estado: EstadoJornada;
}

// Registro de asistencia de matrimonios a una sesión del CBF.
// niveles = asistentes por nivel [N0, N1, N2, N3]; null = ese nivel no sesionó.
export interface Asistencia {
  id: string;
  parroquia: ParroquiaId;
  fecha: string; // ISO
  niveles: (number | null)[];
}

export interface DatosTablero {
  ebf: Reporte;
  mat: Reporte;
  snapshots: Snapshot[];
  jornadas: Jornada[];
  asistencias: Asistencia[];
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
