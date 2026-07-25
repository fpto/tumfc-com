import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { SNAPSHOT_ACTUAL, formatFecha } from "@/data/mfc";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Tablero de Seguimiento — MFC San Pedro Sula",
  description:
    "Tablero interno de seguimiento del Ciclo Básico de Formación: membresía por parroquia y nivel, historial y jornadas conyugales.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-mfc-gray-light/60">
      <header className="bg-gradient-to-br from-mfc-brown via-mfc-black to-mfc-brown">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al sitio
          </Link>
          <div className="mt-6 flex items-center gap-2">
            <Heart className="h-4 w-4 fill-mfc-red text-mfc-red" aria-hidden="true" />
            <span className="text-sm font-medium text-white/80">
              Movimiento Familiar Cristiano · Arquidiócesis de San Pedro Sula
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tablero de Seguimiento
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            Área I: El MFC y su Mística · Ciclo Básico de Formación · Última
            actualización: {formatFecha(SNAPSHOT_ACTUAL.fecha)}
          </p>
        </div>
      </header>

      <main className="-mt-0 pt-8">
        <DashboardClient />
      </main>
    </div>
  );
}
