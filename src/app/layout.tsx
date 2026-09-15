import type { Metadata } from "next";
import { Geist_Mono, Urbanist } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Grain from "@/components/ui/Grain";
import AmbientGlow from "@/components/AmbientGlow";
import "./globals.css";

// títulos e corpo: Urbanist (variável, todos os pesos)
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

// variável: cobre todos os pesos, do 200 dos números grandes ao 500 dos rótulos
const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://atec.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "a.tec | Assistência Técnica Judicial",
    template: "%s · a.tec",
  },
  description:
    "Assistência técnica para quando o processo vai além do direito. Perícias e pareceres em Medicina, Psicologia, Engenharias e Avaliações Imobiliárias.",
  keywords: [
    "assistência técnica judicial",
    "perícia judicial",
    "parecer técnico",
    "assistente técnico",
    "erro médico",
    "avaliação imobiliária",
    "Curitiba",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "a.tec",
    title: "a.tec | Assistência Técnica Judicial",
    description:
      "Transformamos técnica em estratégia. Assistência técnica pericial em Medicina, Psicologia, Engenharias e Avaliações Imobiliárias.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${urbanist.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <SmoothScroll>{children}</SmoothScroll>
        <AmbientGlow />
        <Grain />
      </body>
    </html>
  );
}
