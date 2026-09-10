import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Judiciary from "@/components/Judiciary";
import AtecAjuda from "@/components/AtecAjuda";
import AtecMatrix from "@/components/AtecMatrix";
import Platform from "@/components/Platform";
import AreaCards from "@/components/AreaCards";
import Specialties from "@/components/Specialties";
import Marquee from "@/components/Marquee";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import TextRevealRoot from "@/components/TextRevealRoot";

export default function Home() {
  return (
    <>
      <Header />
      <TextRevealRoot />
      <main className="flex-1">
        {/* 01 · visão geral */}
        <Hero />
        {/* 02 · métricas e o peso da prova */}
        <Judiciary />
        {/* 03 · metodologia: as cinco etapas */}
        <AtecAjuda />
        {/* 04 · central de inteligência pericial */}
        <AtecMatrix />
        {/* 05 · áreas e especialidades */}
        <Platform />
        <AreaCards />
        <Specialties />
        <Marquee />
        {/* 06 · comparativo */}
        <BeforeAfterSlider />
        {/* fecho institucional, antes do contato */}
        <About />
        {/* 07 · contato */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
