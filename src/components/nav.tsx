"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Nav() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto mt-6 mx-4 sm:mx-auto w-auto sm:w-max rounded-full border border-border bg-surface/80 backdrop-blur-xl px-4 sm:px-5 py-2 sm:py-2.5 flex items-center gap-3 sm:gap-6 text-sm text-text-secondary">
        <a href="/" className="text-text-primary font-medium shrink-0">
          Arsh
        </a>

        <div className="hidden sm:block w-px h-4 bg-border" />

        <div className="hidden sm:flex items-center gap-4">
          <a
            href="https://github.com/ash01825"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-primary transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com/ash01825"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-primary transition-colors"
          >
            Twitter
          </a>
          <a
            href="https://linkedin.com/in/arsh-tulshyan"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-primary transition-colors"
          >
            LinkedIn
          </a>
        </div>

        <div className="hidden sm:block w-px h-4 bg-border" />

        {mounted && (
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-1 rounded-md hover:bg-border/50 transition-colors shrink-0"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1M12.95 3.05l-1.06 1.06M4.11 11.89l-1.06 1.06M12.95 12.95l-1.06-1.06M4.11 4.11L3.05 3.05" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 10.5a6.5 6.5 0 01-8-8C2.5 3 2 4.5 2 6a6 6 0 008 8c1.5 0 3-.5 4.5-1.5a6.5 6.5 0 01-1-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
