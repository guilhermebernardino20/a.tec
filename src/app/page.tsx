import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Platform from "@/components/Platform";
import AreaCards from "@/components/AreaCards";
import Specialties from "@/components/Specialties";
import AtecMatrix from "@/components/AtecMatrix";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Judiciary from "@/components/Judiciary";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import TextRevealRoot from "@/components/TextRevealRoot";

export default function Home() {
  return (
    <>
      <Header />
      <TextRevealRoot />
      <main className="flex-1">
        <Hero />
        <AtecMatrix />
        <Platform />
        <AreaCards />
        <Specialties />
        <Marquee />
        <About />
        <Judiciary />
        <BeforeAfterSlider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
