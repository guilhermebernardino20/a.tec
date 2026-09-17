import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import { BLOG_POSTS, getPostBySlug } from "@/data/blog-data";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artigo não encontrado" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter(
    (p) => p.category === post.category && p.slug !== post.slug,
  ).slice(0, 2);

  return (
    <>
      <Header />
      <main className="w-full max-w-full flex-1 overflow-x-clip">
        <article className="bg-paper py-20 md:py-32">
          <Container>
            <div className="mx-auto max-w-3xl">
              <Link
                href="/blog"
                className="inline-flex min-h-[48px] items-center text-sm text-ink-mute transition-colors hover:text-ink"
              >
                ← Voltar ao blog
              </Link>

              <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-mono uppercase text-olive-brand">
                <span>{post.category}</span>
                <span className="text-ink-mute">·</span>
                <span className="text-ink-mute">{post.publishedAt}</span>
                <span className="text-ink-mute">·</span>
                <span className="text-ink-mute">{post.readTime}</span>
              </div>

              <h1 className="text-title mt-6 text-balance font-light leading-[1.08] tracking-tight text-ink">
                {post.title}
              </h1>
              <p className="mt-4 text-sm text-ink-mute">{post.author}</p>

              <div
                className="prose-atec mt-12 max-w-none text-body leading-relaxed text-ink-soft"
                // conteúdo estático, redigido pela própria equipe (src/data/blog-data.ts)
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* CTA de conversão ao final do artigo */}
              <div className="mt-16 flex flex-col items-start gap-6 rounded-2xl border border-white/10 bg-dark-card p-8 text-paper md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-heading font-light">
                    Precisa de parecer técnico para um caso similar?
                  </p>
                  <p className="mt-2 max-w-[46ch] text-sm text-paper/70">
                    Envie o caso e receba a leitura técnica da equipe a.tec.
                  </p>
                </div>
                <Link
                  href="/empresas#contato"
                  className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-olive px-6 py-3 text-sm font-medium text-dark transition-colors duration-300 hover:bg-olive-light"
                >
                  Agendar análise técnica
                </Link>
              </div>

              {related.length > 0 ? (
                <div className="mt-16 border-t border-ink/10 pt-10">
                  <Mono className="text-ink-mute">Artigos relacionados</Mono>
                  <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {related.map((r) => (
                      <li key={r.id}>
                        <Link
                          href={`/blog/${r.slug}`}
                          className="flex min-h-[48px] flex-col rounded-2xl border border-ink/10 p-5 transition-colors duration-300 hover:border-olive-brand/40"
                        >
                          <span className="text-body font-light text-ink">
                            {r.title}
                          </span>
                          <span className="mt-2 text-xs text-ink-mute">
                            {r.readTime}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </Container>
        </article>
      </main>
      <Footer />
    </>
  );
}
