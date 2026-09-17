import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPageContent from "@/components/BlogPageContent";
import { BLOG_POSTS } from "@/data/blog-data";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos técnicos da a.tec sobre medicina legal, engenharia, psicologia jurídica, avaliações e estratégia processual.",
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="w-full max-w-full flex-1 overflow-x-clip">
        <BlogPageContent posts={BLOG_POSTS} />
      </main>
      <Footer />
    </>
  );
}
