"use client";

import { motion } from "framer-motion";
import { ArrowDown, Heart, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-mfc-brown via-mfc-black to-mfc-brown" />
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(207,21,45,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(184,156,17,0.1) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 mb-8"
          >
            <Heart className="w-4 h-4 text-mfc-red fill-mfc-red" />
            <span className="text-sm text-white/80 font-medium">
              Movimiento Familiar Cristiano de Honduras
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
          >
            Tu familia merece{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-mfc-gold-light to-mfc-gold bg-clip-text text-transparent">
                algo extraordinario
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 sm:mt-8 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            Descubre una comunidad que transforma matrimonios, fortalece
            hogares y acompaña a familias en su camino de fe y amor. Porque
            juntos, todo es posible.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#contacto"
              className="group relative inline-flex items-center gap-2 rounded-full bg-mfc-red px-8 py-4 text-base font-semibold text-white shadow-2xl shadow-mfc-red/30 transition-all hover:bg-mfc-red-dark hover:shadow-mfc-red/40 hover:-translate-y-0.5"
            >
              Quiero conocer el MFC
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a
              href="#que-es"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-medium text-white transition-all hover:bg-white/10 hover:border-white/30"
            >
              <Users className="w-4 h-4" />
              Conoce más
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 sm:mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { number: "50+", label: "Años de historia" },
              { number: "1,000+", label: "Familias impactadas" },
              { number: "100+", label: "Equipos activos" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-mfc-gold">
                  {stat.number}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-white/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
