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

export default function Home() {
  return (
    <div className={`${cormorant.variable} ${archivo.variable}`}>
      <TableroMFC />
    </div>
  );
}
