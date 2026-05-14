import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ContentEntry, ContentFrontmatter, GraphNode, GraphEdge, GraphData } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getAllContent(): ContentEntry[] {
  const entries: ContentEntry[] = [];

  if (!fs.existsSync(CONTENT_DIR)) return entries;

  const files = walkDir(CONTENT_DIR).filter(
    (f) => f.endsWith(".mdx") || f.endsWith(".md")
  );

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    const frontmatter = data as ContentFrontmatter;

    const relativePath = path.relative(CONTENT_DIR, filePath);
    const slug = relativePath.replace(/\.mdx?$/, "").replace(/\\/g, "/");

    if (frontmatter.title && frontmatter.type && frontmatter.date) {
      entries.push({ slug, frontmatter });
    }
  }

  return entries.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

export function getContentBySlug(slug: string): ContentEntry | null {
  const all = getAllContent();
  return all.find((e) => e.slug === slug) ?? null;
}

export function getContentFile(slug: string): string | null {
  const candidatePaths = [
    path.join(CONTENT_DIR, `${slug}.mdx`),
    path.join(CONTENT_DIR, `${slug}.md`),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }

  const all = getAllContent();
  const entry = all.find((e) => e.slug === slug);
  if (entry) return path.join(CONTENT_DIR, `${entry.slug}.mdx`);

  return null;
}

export function buildGraph(): GraphData {
  const entries = getAllContent();

  const nodes: GraphNode[] = entries.map((entry) => ({
    id: entry.slug,
    type: entry.frontmatter.type,
    label: entry.frontmatter.title,
    slug: entry.slug,
    summary: entry.frontmatter.summary,
    tags: entry.frontmatter.tags ?? [],
  }));

  const slugSet = new Set(nodes.map((n) => n.id));
  const edges: GraphEdge[] = [];

  for (const entry of entries) {
    const connected = entry.frontmatter.connectedNodes ?? [];
    for (const target of connected) {
      if (slugSet.has(target)) {
        edges.push({
          id: `${entry.slug}->${target}`,
          source: entry.slug,
          target,
        });
      }
    }
  }

  return { nodes, edges };
}

function walkDir(dir: string): string[] {
  const results: string[] = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }

  return results;
}
