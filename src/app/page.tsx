import { buildGraph } from "@/lib/content";
import GraphCanvas from "@/components/graph/graph-canvas";

export default function Home() {
  const graphData = buildGraph();

  return (
    <div className="flex flex-col min-h-dvh">
      {/* ── Intro ── */}
      <section className="flex flex-col items-start gap-8 pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full md:flex-row md:items-center md:justify-between md:gap-16 md:pt-40 md:pb-20">
        <div className="flex flex-col gap-5 max-w-xl">
          <h1 className="text-5xl md:text-7xl tracking-tighter leading-none text-text-primary">
            Arsh Tulshyan
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-text-secondary max-w-[65ch]">
            Hi, I&rsquo;m Arsh — a junior CS grad into AI/ML. I build models
            and systems for fun. I read, I play, I occasionally think about
            Codeforces problems. Currently deep in distributed systems and
            inference optimization.
          </p>
          <div className="flex items-center gap-5 text-text-subtle">
            <a
              href="https://github.com/ash01825"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors"
              aria-label="GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
            </a>
            <a
              href="https://twitter.com/ash01825"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors"
              aria-label="Twitter"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4"/></svg>
            </a>
            <a
              href="https://linkedin.com/in/arsh-tulshyan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/></svg>
            </a>
          </div>
        </div>

        <div className="shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-border overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-text-subtle text-sm">
              Photo
            </div>
          </div>
        </div>
      </section>

      {/* ── Knowledge Graph ── */}
      <section className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16">
        <div className="w-full min-h-[50vh] md:min-h-[60vh] rounded-2xl border border-border bg-surface overflow-hidden">
          <GraphCanvas data={graphData} />
        </div>
      </section>
    </div>
  );
}
