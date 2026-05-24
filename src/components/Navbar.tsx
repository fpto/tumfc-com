"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";

const navLinks = [
  { href: "#que-es", label: "¿Qué es el MFC?" },
  { href: "#beneficios", label: "Beneficios" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#faq", label: "Preguntas" },
  { href: "#contacto", label: "Inscríbete" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
                scrolled ? "bg-mfc-red" : "bg-white/20 backdrop-blur-sm"
              }`}
            >
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span
              className={`text-lg font-bold tracking-tight transition-colors duration-300 ${
                scrolled ? "text-mfc-black" : "text-white"
              }`}
            >
              MFC Honduras
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 hover:text-mfc-red ${
                  scrolled ? "text-mfc-black/70" : "text-white/90"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contacto"
              className="rounded-full bg-mfc-red px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-mfc-red/25 transition-all hover:bg-mfc-red-dark hover:shadow-xl hover:shadow-mfc-red/30 hover:-translate-y-0.5"
            >
              Únete Ahora
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-mfc-black" : "text-white"
            }`}
            aria-label="Menú de navegación"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-mfc-black/80 rounded-lg hover:bg-mfc-gray-light hover:text-mfc-red transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contacto"
                onClick={() => setMobileOpen(false)}
                className="block mt-3 text-center rounded-full bg-mfc-red px-5 py-3 text-sm font-semibold text-white shadow-lg"
              >
                Únete Ahora
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
