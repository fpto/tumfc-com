"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Llegamos al MFC en un momento difícil de nuestro matrimonio. Hoy, después de 3 años, podemos decir que salvó nuestra relación. Aprendimos a comunicarnos, a perdonar y a volver a soñar juntos.",
    names: "Carlos y María Elena",
    detail: "12 años de casados · Tegucigalpa",
    initials: "CM",
  },
  {
    quote:
      "Pensábamos que ya lo teníamos todo resuelto como pareja. El MFC nos mostró que siempre hay más profundidad por descubrir. Las amistades que hemos formado aquí son para toda la vida.",
    names: "Roberto y Ana Lucía",
    detail: "8 años de casados · San Pedro Sula",
    initials: "RA",
  },
  {
    quote:
      "Como padres jóvenes, nos sentíamos perdidos. El MFC nos dio herramientas reales para criar a nuestros hijos con amor y firmeza. La comunidad se convirtió en nuestra segunda familia.",
    names: "José Luis y Daniela",
    detail: "5 años de casados · Comayagua",
    initials: "JD",
  },
  {
    quote:
      "No éramos muy practicantes cuando llegamos. Nos sorprendió lo acogedores y modernos que son. Aquí encontramos una fe que tiene sentido en nuestra vida cotidiana.",
    names: "Fernando y Patricia",
    detail: "15 años de casados · La Ceiba",
    initials: "FP",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="testimonios"
      className="py-24 sm:py-32 bg-white"
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
            Historias reales
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-mfc-black leading-tight">
            Familias que ya{" "}
            <span className="text-mfc-red">viven la transformación</span>
          </h2>
          <p className="mt-6 text-lg text-mfc-black/60">
            Cada testimonio es una historia de esperanza. Parejas reales que
            encontraron en el MFC el camino para fortalecer su hogar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.names}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="relative bg-mfc-gray-light rounded-2xl p-8 border border-gray-100"
            >
              <Quote className="w-10 h-10 text-mfc-red/15 mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-mfc-gold fill-mfc-gold"
                  />
                ))}
              </div>
              <p className="text-mfc-black/70 leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-mfc-red text-white font-bold text-sm">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-mfc-black">
                    {t.names}
                  </div>
                  <div className="text-sm text-mfc-black/50">{t.detail}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
