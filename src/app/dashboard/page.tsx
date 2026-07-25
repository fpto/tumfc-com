import type { Metadata } from "next";
import { Archivo, Cormorant_Garamond } from "next/font/google";
import TableroMFC from "@/components/dashboard/TableroMFC";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tablero de Seguimiento — MFC San Pedro Sula",
  description:
    "Tablero interno de seguimiento del Ciclo Básico de Formación: membresía por parroquia y nivel, historial de cortes y jornadas conyugales.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className={`${cormorant.variable} ${archivo.variable}`}>
      <TableroMFC />
    </div>
  );
}
