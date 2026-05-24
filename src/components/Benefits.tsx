"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  HeartHandshake,
  Users,
  Church,
  BookOpen,
  HandHeart,
  PartyPopper,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    icon: HeartHandshake,
    title: "Fortalecimiento matrimonial",
    description:
      "Herramientas prácticas y acompañamiento para reavivar la conexión, mejorar la comunicación y profundizar el amor en tu relación.",
  },
  {
    icon: Users,
    title: "Comunidad y amistades",
    description:
      "Conoce parejas que comparten tus valores. Forma amistades reales que van más allá de lo superficial.",
  },
  {
    icon: Church,
    title: "Crecimiento espiritual",
    description:
      "Vive tu fe de manera profunda y cercana. Retiros, oraciones y momentos que transforman tu relación con Dios.",
  },
  {
    icon: BookOpen,
    title: "Formación para padres",
    description:
      "Aprende a educar con amor, establecer límites sanos y construir un hogar donde tus hijos florezcan.",
  },
  {
    icon: HandHeart,
    title: "Acompañamiento cercano",
    description:
      "Nunca estarás solo. Un equipo de matrimonios con experiencia te guía y apoya en cada etapa del camino.",
  },
  {
    icon: PartyPopper,
    title: "Actividades familiares",
    description:
      "Convivencias, encuentros y celebraciones que integran a toda la familia en un ambiente de alegría y fe.",
  },
  {
    icon: ShieldCheck,
    title: "Sentido de pertenencia",
    description:
      "Forma parte de algo más grande que tú. Una misión que da propósito y llena de sentido tu vida familiar.",
  },
];

export default function Benefits() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="beneficios"
      className="py-24 sm:py-32 bg-mfc-gray-light"
      ref={ref}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-mfc-red uppercase tracking-widest mb-4">
            ¿Por qué unirte?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-mfc-black leading-tight">
            Todo lo que el MFC tiene{" "}
            <span className="text-mfc-red">para tu familia</span>
          </h2>
          <p className="mt-6 text-lg text-mfc-black/60">
            Más que actividades, ofrecemos una experiencia de transformación
            que toca todas las áreas de tu vida familiar.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className={`group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:shadow-mfc-red/5 hover:-translate-y-1 ${
                i === 6 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-mfc-red/10 to-mfc-gold/10 text-mfc-red mb-6 transition-all group-hover:from-mfc-red group-hover:to-mfc-red-dark group-hover:text-white group-hover:shadow-lg group-hover:shadow-mfc-red/20">
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-mfc-black mb-3">
                {benefit.title}
              </h3>
              <p className="text-sm text-mfc-black/60 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
