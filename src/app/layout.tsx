import type { Metadata } from "next";
import { Prompt, Roboto_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

const mono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const siteUrl = "https://atec.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "a.tec — Assistência Técnica Judicial",
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
    title: "a.tec — Assistência Técnica Judicial",
    description:
      "Transformamos técnica em estratégia. Assistência técnica pericial em Medicina, Psicologia, Engenharias e Avaliações Imobiliárias.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${prompt.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
