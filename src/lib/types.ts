export type ContentType = "project" | "blog" | "writeup" | "idea" | "experiment" | "curiosity";

export interface ContentFrontmatter {
  title: string;
  type: ContentType;
  tags: string[];
  connectedNodes: string[];
  bannerImage?: string;
  date: string;
  summary?: string;
}

export interface ContentEntry {
  slug: string;
  frontmatter: ContentFrontmatter;
}

export interface GraphNode {
  id: string;
  type: ContentType;
  label: string;
  slug: string;
  summary?: string;
  tags: string[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
