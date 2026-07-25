// Persistencia del tablero en Postgres (Neon, la base de datos del
// marketplace de Vercel). El documento completo del tablero se guarda como
// una sola fila JSONB — es un documento pequeño editado por pocas personas.
//
// Configuración en Vercel: Storage → Create Database → Neon (Postgres) y
// conectar al proyecto; eso define DATABASE_URL automáticamente.

import { Pool } from "pg";
import type { DatosTablero } from "@/data/mfc";

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

export const dbConfigurada = (): boolean => Boolean(url);

let pool: Pool | null = null;
let tablaLista = false;

async function conexion(): Promise<Pool> {
  if (!url) throw new Error("Base de datos sin configurar");
  if (!pool) {
    pool = new Pool({ connectionString: url, max: 5 });
  }
  if (!tablaLista) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tablero_mfc (
        id text PRIMARY KEY,
        datos jsonb NOT NULL,
        actualizado timestamptz NOT NULL DEFAULT now()
      )
    `);
    tablaLista = true;
  }
  return pool;
}

export async function leerTablero(): Promise<DatosTablero | null> {
  const db = await conexion();
  const res = await db.query("SELECT datos FROM tablero_mfc WHERE id = 'principal'");
  return (res.rows[0]?.datos as DatosTablero | undefined) ?? null;
}

export async function escribirTablero(datos: DatosTablero): Promise<void> {
  const db = await conexion();
  await db.query(
    `INSERT INTO tablero_mfc (id, datos, actualizado)
     VALUES ('principal', $1::jsonb, now())
     ON CONFLICT (id) DO UPDATE SET datos = EXCLUDED.datos, actualizado = now()`,
    [JSON.stringify(datos)],
  );
}
