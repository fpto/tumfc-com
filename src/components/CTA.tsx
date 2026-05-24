"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Heart } from "lucide-react";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 sm:py-32 bg-white" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-mfc-brown via-mfc-black to-mfc-brown p-12 sm:p-16 lg:p-20"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 20% 50%, rgba(207,21,45,0.2) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(184,156,17,0.15) 0%, transparent 50%)",
            }}
          />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mfc-red/20 mb-8"
            >
              <Heart className="w-8 h-8 text-mfc-red fill-mfc-red" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Tu hogar puede ser{" "}
              <span className="bg-gradient-to-r from-mfc-gold-light to-mfc-gold bg-clip-text text-transparent">
                diferente
              </span>
            </h2>

            <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed">
              Miles de familias ya descubrieron que el amor se puede renovar,
              que la comunicación se puede sanar y que juntos se llega más
              lejos. El siguiente paso es tuyo.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contacto"
                className="group inline-flex items-center gap-2 rounded-full bg-mfc-red px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-mfc-red/30 transition-all hover:bg-mfc-red-dark hover:shadow-mfc-red/40 hover:-translate-y-0.5"
              >
                Da el primer paso
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <p className="mt-6 text-sm text-white/40">
              Sin compromiso. Sin presión. Solo amor y comunidad.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
