// Persistencia del tablero en Neon Postgres (la base de datos del
// marketplace de Vercel). El documento completo del tablero se guarda como
// una sola fila JSONB — es un documento pequeño editado por pocas personas.
//
// Se usa el driver serverless de Neon, que consulta por HTTPS (puerto 443):
// ideal para funciones serverless de Vercel y sin límites de conexiones TCP.
//
// Configuración en Vercel: variable de entorno DATABASE_URL con la cadena
// de conexión de Neon (la integración de Vercel Storage la define sola).

import { neon } from "@neondatabase/serverless";
import type { DatosTablero } from "@/data/mfc";

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

export const dbConfigurada = (): boolean => Boolean(url);

let tablaLista = false;

async function conexion() {
  if (!url) throw new Error("Base de datos sin configurar");
  const sql = neon(url);
  if (!tablaLista) {
    await sql`
      CREATE TABLE IF NOT EXISTS tablero_mfc (
        id text PRIMARY KEY,
        datos jsonb NOT NULL,
        actualizado timestamptz NOT NULL DEFAULT now()
      )
    `;
    tablaLista = true;
  }
  return sql;
}

export async function leerTablero(): Promise<DatosTablero | null> {
  const sql = await conexion();
  const filas = await sql`SELECT datos FROM tablero_mfc WHERE id = 'principal'`;
  return (filas[0]?.datos as DatosTablero | undefined) ?? null;
}

export async function escribirTablero(datos: DatosTablero): Promise<void> {
  const sql = await conexion();
  await sql`
    INSERT INTO tablero_mfc (id, datos, actualizado)
    VALUES ('principal', ${JSON.stringify(datos)}::jsonb, now())
    ON CONFLICT (id) DO UPDATE SET datos = EXCLUDED.datos, actualizado = now()
  `;
}
