import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ResourcesCta from "@/components/ResourcesCta";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import TextRevealRoot from "@/components/TextRevealRoot";

/** Portal de entrada: a escolha entre Pessoa Física e Empresas. */
export default function Home() {
  return (
    <>
      <Header />
      <TextRevealRoot />
      <main className="w-full max-w-full flex-1 overflow-x-clip">
        <Hero />
        <About />
        <ResourcesCta />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
