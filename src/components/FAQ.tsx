"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "¿Debemos estar casados por la Iglesia para participar?",
    answer:
      "No necesariamente. El MFC recibe a parejas en cualquier estado de su relación: novios, casados por lo civil, casados por la Iglesia, o en unión libre. Lo importante es el deseo de crecer juntos como familia. Te acompañamos sin juzgar.",
  },
  {
    question: "¿Tiene algún costo participar?",
    answer:
      "La participación en las reuniones regulares no tiene costo. Algunos eventos especiales como retiros o convivencias pueden tener un aporte voluntario para cubrir gastos logísticos, pero siempre se busca que sea accesible para todos.",
  },
  {
    question: "¿Hay límite de edad para participar?",
    answer:
      "No hay límite de edad. Tenemos parejas jóvenes recién casadas y matrimonios con décadas de experiencia. La diversidad de edades es una de nuestras mayores riquezas, porque todos aprendemos de todos.",
  },
  {
    question: "¿Necesitamos tener experiencia religiosa previa?",
    answer:
      "Para nada. Muchas parejas llegan sin ser muy practicantes y descubren aquí una fe accesible y significativa. No hacemos preguntas sobre tu pasado religioso. Solo necesitas apertura y ganas de crecer.",
  },
  {
    question: "¿Qué tipo de actividades realizan?",
    answer:
      "Realizamos reuniones de equipo semanales o quincenales, retiros de parejas, talleres de comunicación, convivencias familiares, jornadas de oración, celebraciones especiales y actividades de servicio comunitario.",
  },
  {
    question: "¿Con qué frecuencia se reúnen los equipos?",
    answer:
      "Los equipos generalmente se reúnen cada semana o cada quince días, según acuerden los miembros. Las reuniones suelen durar entre 1.5 y 2 horas, en horarios cómodos para las parejas. Muchas son en las casas de los participantes.",
  },
  {
    question: "¿Podemos asistir primero a conocer y luego decidir?",
    answer:
      "¡Por supuesto! De hecho, eso es lo que recomendamos. Te invitamos a conocernos sin compromiso. Ven a una reunión, conoce a las parejas, siente el ambiente y luego decides si es para ti. Sin presión alguna.",
  },
];

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-6 text-left transition-colors hover:text-mfc-red"
        aria-expanded={isOpen}
      >
        <span className="text-base sm:text-lg font-semibold text-mfc-black pr-8">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-mfc-red" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-mfc-black/60 leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 sm:py-32 bg-mfc-gray-light" ref={ref}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-mfc-red uppercase tracking-widest mb-4">
            Resuelve tus dudas
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-mfc-black leading-tight">
            Preguntas{" "}
            <span className="text-mfc-red">frecuentes</span>
          </h2>
          <p className="mt-6 text-lg text-mfc-black/60">
            Sabemos que dar el primer paso puede generar dudas. Aquí
            respondemos las más comunes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100"
        >
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-mfc-black/50">
            ¿Tienes otra pregunta?{" "}
            <a
              href="#contacto"
              className="text-mfc-red font-semibold hover:text-mfc-red-dark transition-colors"
            >
              Escríbenos →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
