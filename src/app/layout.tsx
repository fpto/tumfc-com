import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MFC Honduras — Movimiento Familiar Cristiano | Fortalecemos Familias",
  description:
    "El Movimiento Familiar Cristiano de Honduras fortalece matrimonios y familias a través de comunidad, formación espiritual y acompañamiento. Únete y transforma tu hogar.",
  keywords: [
    "MFC Honduras",
    "Movimiento Familiar Cristiano",
    "matrimonios católicos",
    "familias Honduras",
    "espiritualidad familiar",
    "comunidad católica",
    "fortalecimiento matrimonial",
  ],
  openGraph: {
    title: "MFC Honduras — Fortalecemos Familias",
    description:
      "Únete al Movimiento Familiar Cristiano y descubre una comunidad que transforma matrimonios y familias.",
    type: "website",
    locale: "es_HN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
