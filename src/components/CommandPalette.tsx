"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, File } from "lucide-react";
import { useVault } from "../context/VaultContext";

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeFileId: string | null;
  onFileSelect: (id: string) => void;
}

export default function CommandPalette({ isOpen, setIsOpen, activeFileId, onFileSelect }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { allFiles } = useVault();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim() === "" 
    ? allFiles 
    : allFiles.filter(f => f.name.toLowerCase().includes(query.toLowerCase()) || f.content.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-[var(--color-bg-panel-solid)] border border-[var(--color-border-subtle)] shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden flex flex-col mx-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-4 border-b border-[var(--color-border-subtle)]">
          <Search size={20} className="text-[var(--color-text-secondary)] mr-4" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search notes, projects, and logs..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-lg text-[var(--color-text-primary)] focus:outline-none placeholder:text-[var(--color-text-tertiary)]"
          />
          <div className="text-[10px] font-mono font-medium text-[var(--color-text-tertiary)] bg-[var(--color-bg-base)] px-2 py-1 rounded border border-[var(--color-border-subtle)]">
            ESC
          </div>
        </div>
        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar p-2">
          {results.length > 0 ? (
            results.map(file => (
              <div 
                key={file.id}
                onClick={() => {
                  onFileSelect(file.id);
                  setIsOpen(false);
                }}
                className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${activeFileId === file.id ? 'bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-base)] hover:text-[var(--color-text-primary)]'}`}
              >
                <File size={14} className="mr-3 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{file.name}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-[var(--color-text-tertiary)]">
              No results found for "<span className="text-[var(--color-text-primary)]">{query}</span>"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
