"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Mono from "@/components/ui/Mono";
import { cn } from "@/lib/utils";
import type { BlogCategory, BlogPost } from "@/data/blog-data";

const CATEGORIES: BlogCategory[] = [
  "Medicina Legal",
  "Engenharia",
  "Psicologia",
  "Avaliações",
  "Estratégia Processual",
];

export default function BlogPageContent({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState<"Todos" | BlogCategory>("Todos");
  const featured = posts[0];
  const rest = posts.slice(1);

  const filtered = useMemo(
    () =>
      category === "Todos" ? rest : rest.filter((p) => p.category === category),
    [rest, category],
  );

  return (
    <section className="bg-paper py-20 md:py-32">
      <Container>
        <Mono className="text-ink-mute">Central editorial a.tec</Mono>
        <h1 className="text-title mt-6 max-w-[18ch] text-balance font-light leading-[1.08] text-ink">
          Blog
        </h1>

        {/* destaque principal */}
        {featured ? (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-12 grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-dark-card p-8 text-paper transition-colors duration-300 hover:border-[#7F9970]/40 md:grid-cols-2 md:gap-10 md:p-12"
            data-surface="dark"
          >
            <div className="flex flex-col justify-center">
              <span className="font-mono text-mono uppercase text-[#7F9970]">
                {featured.category}
              </span>
              <h2 className="text-heading mt-4 text-balance font-light leading-[1.12]">
                {featured.title}
              </h2>
              <p className="mt-4 text-body text-paper/70">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-3 font-mono text-mono uppercase text-paper/45">
                <span>{featured.publishedAt}</span>
                <span>·</span>
                <span>{featured.readTime}</span>
              </div>
              <span className="mt-6 inline-flex min-h-[48px] w-fit items-center gap-2 rounded-full bg-olive px-6 py-3 text-sm font-medium text-dark transition-colors duration-300 group-hover:bg-olive-light">
                Ler artigo →
              </span>
            </div>
            <div className="hidden items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center font-mono text-mono uppercase text-paper/30 md:flex">
              a.tec
            </div>
          </Link>
        ) : null}

        {/* categorias */}
        <div className="mt-14 flex flex-wrap gap-2">
          {(["Todos", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                "min-h-[48px] rounded-full border px-4 py-2.5 text-sm transition-all duration-300 active:scale-[0.99]",
                category === c
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 text-ink-soft hover:border-olive-brand/40 hover:text-ink",
              )}
            >
              [ {c} ]
            </button>
          ))}
        </div>

        {/* grid de artigos */}
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {filtered.map((post) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                data-surface="dark"
                className="flex h-full min-h-[48px] flex-col rounded-2xl border border-white/10 bg-dark-card p-6 text-paper transition-all duration-300 hover:border-[#7F9970]/40 hover:bg-white/[0.03]"
              >
                <span className="font-mono text-mono uppercase text-[#7F9970]">
                  {post.category}
                </span>
                <h3 className="text-heading mt-4 text-balance text-[1.35rem] font-light leading-[1.15]">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm text-paper/70">
                  {post.excerpt}
                </p>
                <div className="mt-5 flex items-center gap-3 font-mono text-mono uppercase text-paper/45">
                  <span>{post.publishedAt}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {filtered.length === 0 ? (
          <p className="mt-8 text-sm text-ink-mute">
            Nenhum artigo nessa categoria por enquanto.
          </p>
        ) : null}
      </Container>
    </section>
  );
}
