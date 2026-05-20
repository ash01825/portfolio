"use client";

import React from "react";
import { useVault } from "../context/VaultContext";
import CalendarCard from "./CalendarCard";
import { slugifyHeading } from "../lib/slug";

export default function RightSidebar({ activeFileId }: { activeFileId?: string }) {
  const { allFiles } = useVault();

  const scrollToHeading = (text: string) => {
    const target = document.getElementById(slugifyHeading(text));
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Parse Headings for Outline
  const headings: { level: number, text: string }[] = [];
  if (activeFileId && activeFileId !== "graph") {
    const activeFile = allFiles.find(f => f.id === activeFileId);
    if (activeFile && activeFile.content) {
      const lines = activeFile.content.split('\n');
      lines.forEach(line => {
        const match = line.match(/^(#{1,6})\s+(.+)/);
        if (match) {
          headings.push({ level: match[1].length, text: match[2] });
        }
      });
    }
  }

  let totalLinks = 0;
  const allTags = new Set<string>();
  
  allFiles.forEach(f => {
    if (f.links) totalLinks += f.links.length;
    if (f.content) {
      // Find hashtags like #system-design, #ml, but ignore hex codes and headings
      const tags = f.content.match(/(?<=\s|^)#[a-zA-Z0-9_-]+/g);
      if (tags) {
        tags.forEach(t => allTags.add(t.toLowerCase()));
      }
    }
  });
  
  const totalFiles = allFiles.length;
  const totalTags = allTags.size;

  return (
    <div className="w-64 h-full glass-panel glass-panel-inner rounded-[2rem] flex flex-col flex-shrink-0 hidden lg:flex z-20 overflow-hidden shadow-2xl">      
      <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">

        {/* Calendar Section */}
        <div className="mb-6">
          <div className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-3">
            Book a Meet
          </div>
          <CalendarCard />
        </div>

        {/* Outline Section */}
        {activeFileId && activeFileId !== "graph" ? (
          <div>
            <div className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-3">
              Outline
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/5 p-3 space-y-2 shadow-inner">
              {headings.length > 0 ? (
                headings.map((h, i) => (
                  <button
                    type="button"
                    key={i} 
                    onClick={() => scrollToHeading(h.text)}
                    className={`block w-full text-left text-[13px] hover:text-[var(--color-text-primary)] transition-fluid haptic-press truncate ${
                      h.level === 1 ? 'text-[var(--color-text-primary)]' : 
                      h.level === 2 ? 'text-[var(--color-text-secondary)] pl-2' : 
                      'text-[var(--color-text-tertiary)] pl-4'
                    }`}
                  >
                    {h.text}
                  </button>
                ))
              ) : (
                <div className="text-xs text-[var(--color-text-tertiary)] italic">No headings found</div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-3">
              Vault Stats
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/5 p-4 shadow-inner space-y-3">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[var(--color-text-tertiary)]">Files</span>
                <span className="text-[var(--color-text-primary)] font-mono">{totalFiles}</span>
              </div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[var(--color-text-tertiary)]">Links</span>
                <span className="text-[var(--color-text-primary)] font-mono">{totalLinks}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-text-tertiary)]">Tags</span>
                <span className="text-[var(--color-text-primary)] font-mono">{totalTags}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
