import type { Metadata } from "next";
import Header from "@/components/Header";
import TextRevealRoot from "@/components/TextRevealRoot";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import { CONTACT } from "@/lib/content";

export const metadata: Metadata = {
  title: "Política de Privacidade e Termo de Consentimento (LGPD)",
  description:
    "Como a a.tec coleta, usa e protege os dados pessoais, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).",
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. Quem somos (controlador)",
    body: [
      "A a.tec — Assistência Técnica Judicial é a controladora dos dados pessoais tratados por este site, nos termos da Lei nº 13.709/2018 (LGPD). Endereço: " +
        CONTACT.address +
        ". Contato para assuntos de privacidade: " +
        CONTACT.email +
        ".",
    ],
  },
  {
    title: "2. Quais dados coletamos",
    body: [
      "Dados que você nos informa nos formulários de contato, orçamento online, triagem e candidatura: nome, sobrenome, e-mail, telefone/WhatsApp, mensagem e relato do caso.",
      "Documentos que você anexar (petições, laudos, prontuários, exames, currículo). Eles podem conter dados pessoais sensíveis, como dados de saúde, tratados com cuidado reforçado.",
      "Dados técnicos de navegação (endereço IP, dispositivo, páginas acessadas), coletados de forma automática para segurança e funcionamento do site.",
    ],
  },
  {
    title: "3. Para que usamos seus dados (finalidades)",
    body: [
      "Responder ao seu contato e elaborar orçamento ou proposta de assistência técnica.",
      "Analisar a viabilidade técnica do caso e prestar os serviços contratados.",
      "Avaliar candidaturas de profissionais interessados em integrar a rede de assistentes técnicos.",
      "Cumprir obrigações legais e regulatórias e exercer direitos em processos judiciais, administrativos ou arbitrais.",
    ],
  },
  {
    title: "4. Base legal",
    body: [
      "Tratamos seus dados com base no seu consentimento (art. 7º, I), na execução de procedimentos preliminares relacionados a contrato do qual você é parte (art. 7º, V), no cumprimento de obrigação legal (art. 7º, II) e no exercício regular de direitos em processo judicial (art. 7º, VI). Dados sensíveis são tratados mediante seu consentimento específico (art. 11, I) ou para o exercício regular de direitos em processo (art. 11, II, \"d\").",
    ],
  },
  {
    title: "5. Compartilhamento",
    body: [
      "Não vendemos seus dados. Podemos compartilhá-los apenas com: profissionais e peritos envolvidos no seu caso, sob dever de sigilo; prestadores de serviço de tecnologia (hospedagem, envio de e-mail e comunicação), que tratam os dados em nosso nome; e autoridades, quando houver obrigação legal ou ordem judicial.",
    ],
  },
  {
    title: "6. Armazenamento e segurança",
    body: [
      "Adotamos medidas técnicas e organizacionais para proteger os dados contra acessos não autorizados, perda ou alteração. Os dados são mantidos pelo tempo necessário às finalidades acima e aos prazos legais aplicáveis, e depois eliminados ou anonimizados.",
    ],
  },
  {
    title: "7. Seus direitos (art. 18 da LGPD)",
    body: [
      "Você pode solicitar, a qualquer momento: confirmação da existência de tratamento; acesso, correção ou atualização dos dados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade; informação sobre compartilhamento; e revogação do consentimento, sem prejuízo do tratamento já realizado.",
      "Para exercer seus direitos, escreva para " + CONTACT.email + ".",
    ],
  },
  {
    title: "8. Cookies",
    body: [
      "Este site utiliza apenas os recursos técnicos necessários ao seu funcionamento. Caso passem a ser usados cookies de análise ou publicidade, esta política será atualizada e o consentimento será solicitado.",
    ],
  },
  {
    title: "9. Termo de consentimento",
    body: [
      "Ao marcar a caixa de consentimento em um dos formulários do site e enviá-lo, você declara que leu esta Política e autoriza a a.tec a tratar os dados pessoais informados, inclusive documentos que contenham dados sensíveis, para as finalidades descritas acima.",
    ],
  },
  {
    title: "10. Alterações",
    body: [
      "Esta política pode ser atualizada a qualquer momento. A versão vigente estará sempre disponível nesta página.",
    ],
  },
];

export default function PoliticaDePrivacidade() {
  return (
    <>
      <Header />
      <TextRevealRoot />
      <main className="w-full max-w-full flex-1 overflow-x-clip bg-paper pb-24 pt-32 text-ink md:pt-40">
        <Container>
          <article className="mx-auto max-w-[72ch]">
            <p className="font-mono text-mono uppercase text-ink-mute">
              LGPD · Lei nº 13.709/2018
            </p>
            <h1 className="text-title mt-4 font-light leading-[1.08]">
              Política de Privacidade e Termo de Consentimento
            </h1>
            <p className="mt-6 text-body text-ink-soft">
              Última atualização: outubro de 2026.
            </p>
            {SECTIONS.map((s) => (
              <section key={s.title} className="mt-12">
                <h2 className="text-heading font-light">{s.title}</h2>
                {s.body.map((p) => (
                  <p key={p} className="mt-4 text-body text-ink-soft">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
