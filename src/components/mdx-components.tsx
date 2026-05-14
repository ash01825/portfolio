import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl md:text-4xl tracking-tight leading-tight text-text-primary mt-16 mb-6 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl tracking-tight leading-tight text-text-primary mt-14 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl md:text-2xl tracking-tight leading-snug text-text-primary mt-10 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-base md:text-lg leading-relaxed text-text-secondary my-5 max-w-[65ch]">
      {children}
    </p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-text-primary underline underline-offset-2 decoration-border hover:decoration-text-subtle transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 my-5 space-y-2 text-text-secondary text-base md:text-lg leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 my-5 space-y-2 text-text-secondary text-base md:text-lg leading-relaxed">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-medium text-text-primary">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-border pl-5 my-6 text-text-subtle italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-border" />,
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-xl border border-border bg-surface p-5 text-sm font-mono leading-relaxed">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="font-mono text-sm bg-border/40 rounded-md px-1.5 py-0.5">
      {children}
    </code>
  ),
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      className="rounded-xl my-8 w-full"
      loading="lazy"
      alt={props.alt ?? ""}
    />
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse text-sm text-text-secondary">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-border px-4 py-2 text-left font-medium text-text-primary">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border px-4 py-2">{children}</td>
  ),
};
