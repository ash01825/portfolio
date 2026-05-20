"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownViewProps {
  content: string;
  onLinkClick: (id: string) => void;
}

export default function MarkdownView({ content, onLinkClick }: MarkdownViewProps) {
  const processedContent = content.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
    return `[${p1}](#${p1.toLowerCase().replace(/ /g, "-")})`;
  });

  return (
    <div className="w-full h-full p-8 md:p-16 overflow-y-auto custom-scrollbar bg-transparent">
      <div className="max-w-3xl mx-auto">
        <article className="text-[var(--color-text-primary)] leading-7">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
            components={{
              a: ({ node, ...props }) => {
                if (props.href?.startsWith("#")) {
                  const targetId = props.href.substring(1);
                  return (
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        onLinkClick(targetId);
                      }}
                      className="text-[var(--color-accent-primary)] font-medium bg-[var(--color-accent-primary)]/10 px-1.5 py-0.5 rounded-md hover:bg-[var(--color-accent-primary)]/20 transition-colors"
                    >
                      {props.children}
                    </a>
                  );
                }
                return <a target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-accent-primary)] hover:underline transition-colors" {...props} />;
              },
              h1: ({node, ...props}) => <h1 className="text-3xl tracking-tight mb-8 font-bold text-[var(--color-text-primary)]" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl tracking-tight mt-10 mb-5 border-b border-[var(--color-border-subtle)] pb-2 text-[var(--color-text-primary)]" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl tracking-tight mt-8 mb-4 font-semibold text-[var(--color-text-primary)]" {...props} />,
              p: ({node, ...props}) => <p className="mb-6 text-[15px] text-[var(--color-text-secondary)]" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 text-[15px] text-[var(--color-text-secondary)] space-y-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 text-[15px] text-[var(--color-text-secondary)] space-y-2" {...props} />,
              li: ({node, ...props}) => <li className="" {...props} />,
              table: ({node, ...props}) => (
                <div className="overflow-x-auto mb-8 rounded-xl border border-[var(--color-border-subtle)]">
                  <table className="w-full text-left text-[14px] border-collapse" {...props} />
                </div>
              ),
              thead: ({node, ...props}) => <thead className="bg-[var(--color-bg-panel)]/80 text-[var(--color-text-primary)]" {...props} />,
              th: ({node, ...props}) => <th className="p-3 border-b border-[var(--color-border-subtle)] font-semibold" {...props} />,
              td: ({node, ...props}) => <td className="p-3 border-b border-[var(--color-border-subtle)] text-[var(--color-text-secondary)]" {...props} />,
              img: ({node, ...props}) => (
                <img 
                  className="rounded-xl shadow-lg border border-[var(--color-border-subtle)] w-full object-cover mb-6" 
                  {...props} 
                />
              ),
              blockquote: ({node, ...props}) => (
                <blockquote 
                  className="border-l-4 border-[var(--color-accent-primary)] bg-[var(--color-bg-panel)]/50 py-3 px-5 mb-6 text-[15px] text-[var(--color-text-tertiary)] rounded-r-lg"
                  {...props} 
                />
              ),
              hr: ({node, ...props}) => <hr className="border-t border-[var(--color-border-subtle)] my-10" {...props} />,
              code: ({node, className, children, ...props}: any) => {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !match && !className;
                return isInline ? (
                  <code className="bg-[var(--color-bg-panel)] px-1.5 py-0.5 rounded-md text-[var(--color-accent-secondary)] font-mono text-[13px]" {...props}>
                    {children}
                  </code>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              pre: ({node, ...props}) => (
                <pre className="bg-[var(--color-bg-panel)] p-4 rounded-xl overflow-x-auto mb-6 text-[13px] border border-[var(--color-border-subtle)] font-mono text-[var(--color-text-secondary)]" {...props} />
              ),
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
