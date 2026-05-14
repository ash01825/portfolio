import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getContentBySlug, getContentFile, getAllContent } from "@/lib/content";
import { mdxComponents } from "@/components/mdx-components";
import rehypePrettyCode from "rehype-pretty-code";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const content = getAllContent();
  return content.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getContentBySlug(slug);
  if (!entry) return { title: "Not found" };

  return {
    title: `${entry.frontmatter.title} — Arsh Tulshyan`,
    description: entry.frontmatter.summary ?? "",
  };
}

export default async function ReadingPage({ params }: Props) {
  const { slug } = await params;
  const entry = getContentBySlug(slug);
  const filePath = getContentFile(slug);

  if (!entry || !filePath) notFound();

  const fs = await import("fs");
  const raw = fs.readFileSync(filePath, "utf-8");

  const { title, date, type } = entry.frontmatter;
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-dvh pt-32 pb-24 px-6 md:px-12">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs tracking-[0.2em] uppercase text-text-subtle">
              {type}
            </span>
            <span className="text-text-subtle">·</span>
            <time className="text-sm text-text-subtle">{formattedDate}</time>
          </div>
          <h1 className="text-4xl md:text-5xl tracking-tighter leading-none text-text-primary">
            {title}
          </h1>
        </header>

        <div className="prose-custom">
          <MDXRemote
            source={raw}
            components={mdxComponents}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  [
                    rehypePrettyCode,
                    {
                      theme: "github-light",
                    },
                  ],
                ],
              },
            }}
          />
        </div>
      </article>
    </div>
  );
}
