import { NextResponse } from "next/server";
import { dbConfigurada, escribirTablero, leerTablero } from "@/lib/db";
import type { DatosTablero } from "@/data/mfc";

// El tablero siempre debe leer el estado vigente de la base de datos.
export const dynamic = "force-dynamic";

const LIMITE_BYTES = 200_000;

function esDatosTablero(x: unknown): x is DatosTablero {
  if (typeof x !== "object" || x === null) return false;
  const d = x as Record<string, unknown>;
  return (
    typeof d.ebf === "object" &&
    d.ebf !== null &&
    typeof d.mat === "object" &&
    d.mat !== null &&
    Array.isArray(d.snapshots) &&
    Array.isArray(d.jornadas) &&
    Array.isArray(d.asistencias)
  );
}

// Si TABLERO_CLAVE está definida en Vercel, las escrituras exigen esa clave.
function claveValida(req: Request): boolean {
  const clave = process.env.TABLERO_CLAVE;
  if (!clave) return true;
  return req.headers.get("x-tablero-clave") === clave;
}

export async function GET() {
  if (!dbConfigurada()) {
    return NextResponse.json({ error: "sin-configurar" }, { status: 503 });
  }
  try {
    const datos = await leerTablero();
    return NextResponse.json({ datos });
  } catch {
    return NextResponse.json({ error: "error-db" }, { status: 502 });
  }
}

export async function PUT(req: Request) {
  if (!dbConfigurada()) {
    return NextResponse.json({ error: "sin-configurar" }, { status: 503 });
  }
  if (!claveValida(req)) {
    return NextResponse.json({ error: "clave-invalida" }, { status: 401 });
  }
  let cuerpo: unknown;
  try {
    const texto = await req.text();
    if (texto.length > LIMITE_BYTES) {
      return NextResponse.json({ error: "demasiado-grande" }, { status: 413 });
    }
    cuerpo = JSON.parse(texto);
  } catch {
    return NextResponse.json({ error: "json-invalido" }, { status: 400 });
  }
  if (!esDatosTablero(cuerpo)) {
    return NextResponse.json({ error: "formato-invalido" }, { status: 400 });
  }
  try {
    await escribirTablero(cuerpo);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "error-db" }, { status: 502 });
  }
}
