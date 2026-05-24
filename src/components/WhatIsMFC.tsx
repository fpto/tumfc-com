"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, BookOpen, Users, Sparkles } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Amor que transforma",
    description:
      "Un movimiento de parejas y familias que buscan vivir el amor de manera plena, auténtica y comprometida.",
  },
  {
    icon: Users,
    title: "Comunidad real",
    description:
      "Grupos pequeños donde compartes experiencias, te sientes acompañado y construyes amistades profundas.",
  },
  {
    icon: BookOpen,
    title: "Formación integral",
    description:
      "Talleres, retiros y encuentros diseñados para fortalecer tu matrimonio y tu vida familiar.",
  },
  {
    icon: Sparkles,
    title: "Espiritualidad viva",
    description:
      "Una fe cercana y accesible que ilumina tu día a día y da sentido profundo a tu vida en familia.",
  },
];

export default function WhatIsMFC() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="que-es" className="py-24 sm:py-32 bg-white" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-sm font-semibold text-mfc-red uppercase tracking-widest mb-4">
              Descubre el MFC
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-mfc-black leading-tight">
              Más que un movimiento,{" "}
              <span className="text-mfc-red">una familia</span>
            </h2>
            <p className="mt-6 text-lg text-mfc-black/60 leading-relaxed">
              El Movimiento Familiar Cristiano (MFC) es una comunidad de
              matrimonios y familias católicas que caminan juntos en la fe, el
              amor y el compromiso. Desde hace más de 50 años, acompañamos a
              parejas de Honduras en su camino hacia un hogar más fuerte,
              unido y lleno de propósito.
            </p>
            <p className="mt-4 text-lg text-mfc-black/60 leading-relaxed">
              No importa en qué etapa estés. Ya sea que lleves meses o décadas
              de matrimonio, aquí encontrarás herramientas, inspiración y una
              comunidad que te sostiene.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 rounded-full bg-mfc-red px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-mfc-red/20 transition-all hover:bg-mfc-red-dark hover:-translate-y-0.5"
              >
                Quiero ser parte
              </a>
              <a
                href="#beneficios"
                className="inline-flex items-center gap-2 text-sm font-semibold text-mfc-red transition-colors hover:text-mfc-red-dark"
              >
                Ver beneficios →
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="group relative p-6 rounded-2xl bg-mfc-gray-light border border-gray-100 transition-all hover:shadow-lg hover:shadow-mfc-red/5 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-mfc-red/10 text-mfc-red mb-4 transition-colors group-hover:bg-mfc-red group-hover:text-white">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-mfc-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-mfc-black/60 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
