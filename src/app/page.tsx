import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatIsMFC from "@/components/WhatIsMFC";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatIsMFC />
        <Benefits />
        <Testimonials />
        <FAQ />
        <CTA />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
