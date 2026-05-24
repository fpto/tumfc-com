"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Send,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ShieldCheck,
  Heart,
  CheckCircle2,
} from "lucide-react";

interface FormData {
  nombre: string;
  nombrePareja: string;
  telefono: string;
  ciudad: string;
  correo: string;
  tiempoRelacion: string;
  comentarios: string;
}

export default function ContactForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    nombrePareja: "",
    telefono: "",
    ciudad: "",
    correo: "",
    tiempoRelacion: "",
    comentarios: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contacto" className="py-24 sm:py-32 bg-white" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block text-sm font-semibold text-mfc-red uppercase tracking-widest mb-4">
              Inscríbete
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-mfc-black leading-tight">
              El primer paso hacia una{" "}
              <span className="text-mfc-red">familia más fuerte</span>
            </h2>
            <p className="mt-6 text-lg text-mfc-black/60 leading-relaxed">
              Completa el formulario y nos pondremos en contacto contigo para
              invitarte a una reunión. Sin compromiso, sin presión — solo el
              inicio de algo hermoso para tu familia.
            </p>

            <div className="mt-10 space-y-6">
              {[
                {
                  icon: Heart,
                  title: "Te contactamos personalmente",
                  desc: "Un matrimonio del MFC se comunicará contigo para conocerte y responder tus preguntas.",
                },
                {
                  icon: ShieldCheck,
                  title: "Tu información es confidencial",
                  desc: "Respetamos tu privacidad. Tu información solo será usada para contactarte.",
                },
                {
                  icon: CheckCircle2,
                  title: "Sin obligación alguna",
                  desc: "Puedes asistir a conocer primero y luego decidir con total libertad.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-mfc-red/10 text-mfc-red">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-mfc-black">
                      {item.title}
                    </h4>
                    <p className="text-sm text-mfc-black/50 mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center bg-mfc-gray-light rounded-2xl p-12 text-center"
              >
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-mfc-green/10 mb-6">
                  <CheckCircle2 className="w-10 h-10 text-mfc-green" />
                </div>
                <h3 className="text-2xl font-bold text-mfc-black mb-4">
                  ¡Gracias por tu interés!
                </h3>
                <p className="text-mfc-black/60 max-w-md">
                  Hemos recibido tu información. Un matrimonio del MFC se
                  pondrá en contacto contigo muy pronto. ¡Estamos emocionados
                  de conocerte!
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-mfc-gray-light rounded-2xl p-8 sm:p-10 border border-gray-100"
              >
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-semibold text-mfc-black mb-2"
                    >
                      Tu nombre completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mfc-gray" />
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3.5 text-sm text-mfc-black placeholder:text-mfc-gray focus:outline-none focus:ring-2 focus:ring-mfc-red/20 focus:border-mfc-red transition-all"
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="nombrePareja"
                      className="block text-sm font-semibold text-mfc-black mb-2"
                    >
                      Nombre de tu pareja
                    </label>
                    <div className="relative">
                      <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mfc-gray" />
                      <input
                        type="text"
                        id="nombrePareja"
                        name="nombrePareja"
                        required
                        value={formData.nombrePareja}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3.5 text-sm text-mfc-black placeholder:text-mfc-gray focus:outline-none focus:ring-2 focus:ring-mfc-red/20 focus:border-mfc-red transition-all"
                        placeholder="Ej: María López"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="telefono"
                        className="block text-sm font-semibold text-mfc-black mb-2"
                      >
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mfc-gray" />
                        <input
                          type="tel"
                          id="telefono"
                          name="telefono"
                          required
                          value={formData.telefono}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3.5 text-sm text-mfc-black placeholder:text-mfc-gray focus:outline-none focus:ring-2 focus:ring-mfc-red/20 focus:border-mfc-red transition-all"
                          placeholder="+504 9999-9999"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="ciudad"
                        className="block text-sm font-semibold text-mfc-black mb-2"
                      >
                        Ciudad
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mfc-gray" />
                        <input
                          type="text"
                          id="ciudad"
                          name="ciudad"
                          required
                          value={formData.ciudad}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3.5 text-sm text-mfc-black placeholder:text-mfc-gray focus:outline-none focus:ring-2 focus:ring-mfc-red/20 focus:border-mfc-red transition-all"
                          placeholder="Tegucigalpa"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="correo"
                      className="block text-sm font-semibold text-mfc-black mb-2"
                    >
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mfc-gray" />
                      <input
                        type="email"
                        id="correo"
                        name="correo"
                        required
                        value={formData.correo}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3.5 text-sm text-mfc-black placeholder:text-mfc-gray focus:outline-none focus:ring-2 focus:ring-mfc-red/20 focus:border-mfc-red transition-all"
                        placeholder="tu@correo.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="tiempoRelacion"
                      className="block text-sm font-semibold text-mfc-black mb-2"
                    >
                      Tiempo de relación
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mfc-gray" />
                      <select
                        id="tiempoRelacion"
                        name="tiempoRelacion"
                        required
                        value={formData.tiempoRelacion}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3.5 text-sm text-mfc-black focus:outline-none focus:ring-2 focus:ring-mfc-red/20 focus:border-mfc-red transition-all appearance-none"
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="novios">Novios</option>
                        <option value="0-2">0 a 2 años de casados</option>
                        <option value="3-5">3 a 5 años de casados</option>
                        <option value="6-10">6 a 10 años de casados</option>
                        <option value="11-20">11 a 20 años de casados</option>
                        <option value="20+">Más de 20 años de casados</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="comentarios"
                      className="block text-sm font-semibold text-mfc-black mb-2"
                    >
                      Comentarios{" "}
                      <span className="font-normal text-mfc-gray">
                        (opcional)
                      </span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-mfc-gray" />
                      <textarea
                        id="comentarios"
                        name="comentarios"
                        rows={3}
                        value={formData.comentarios}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3.5 text-sm text-mfc-black placeholder:text-mfc-gray focus:outline-none focus:ring-2 focus:ring-mfc-red/20 focus:border-mfc-red transition-all resize-none"
                        placeholder="¿Hay algo que quieras contarnos o preguntar?"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-mfc-red px-8 py-4 text-base font-semibold text-white shadow-lg shadow-mfc-red/20 transition-all hover:bg-mfc-red-dark hover:shadow-xl hover:shadow-mfc-red/30 hover:-translate-y-0.5"
                  >
                    Quiero conocer el MFC
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <p className="text-xs text-center text-mfc-black/40 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Tu información es confidencial y solo será usada para
                    contactarte.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
