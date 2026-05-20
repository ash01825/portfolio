"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, Search, UserRound } from "lucide-react";
import { useVault } from "../context/VaultContext";
import { VaultFolder, VaultFile } from "../data/content/types";
import CalendarCard from "./CalendarCard";

interface SidebarProps {
  activeFileId: string | null;
  onFileSelect: (id: string) => void;
  onOpenSearch: () => void;
}

export default function Sidebar({ activeFileId, onFileSelect, onOpenSearch }: SidebarProps) {
  const { vaultData } = useVault();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "projects": true,
    "knowledge": true,
  });

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderItem = (item: VaultFolder | VaultFile, depth = 0) => {
    if (item.type === "file") {
      const isActive = activeFileId === item.id;
      return (
        <div
          key={item.id}
          className={`flex items-center py-2 px-2 mx-2 my-1 rounded-xl cursor-pointer text-[13px] font-medium transition-fluid haptic-press ${
            isActive ? "bg-white/10 text-[var(--color-text-primary)] shadow-sm ring-1 ring-white/10" : "text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]"
          }`}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
          onClick={() => onFileSelect(item.id)}
        >
          <File size={14} className={`mr-2 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-[var(--color-accent-secondary)]' : 'text-[var(--color-text-tertiary)]'}`} />
          <span className="truncate">{item.name}</span>
        </div>
      );
    } else {
      const isExpanded = expandedFolders[item.id];
      return (
        <div key={item.id}>
          <div
            className="flex items-center py-2 px-2 mx-2 my-1.5 rounded-xl cursor-pointer text-[13px] text-[var(--color-text-primary)] font-semibold hover:bg-white/5 transition-fluid haptic-press"
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
            onClick={() => toggleFolder(item.id)}
          >
            {isExpanded ? (
              <ChevronDown size={14} className="mr-1 flex-shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-200" />
            ) : (
              <ChevronRight size={14} className="mr-1 flex-shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-200" />
            )}
            <Folder size={14} className="mr-2 flex-shrink-0 text-[var(--color-accent-gold)]" />
            <span className="truncate">{item.name}</span>
          </div>
          {isExpanded && item.children.map(child => renderItem(child, depth + 1))}
        </div>
      );
    }
  };

  return (
    <div className="mobile-drawer-panel w-64 h-full glass-panel glass-panel-inner rounded-[2rem] flex flex-col flex-shrink-0 z-20 overflow-hidden shadow-2xl">
      <div className="p-4 pt-6">
        <button
          type="button"
          aria-label="Search notes"
          className="relative group cursor-pointer block w-full text-left"
          onClick={onOpenSearch}
        >
          <Search size={14} className="absolute left-3 top-3 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-colors duration-200" />
          <div className="w-full flex items-center bg-[var(--color-bg-base)] text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] text-xs rounded-xl border border-[var(--color-border-subtle)] group-hover:border-[var(--color-border-strong)] pl-9 pr-8 py-2.5 transition-all shadow-inner">
            Search...
          </div>
          <div className="absolute right-3 top-2.5 pointer-events-none">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-sans font-bold text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] group-hover:border-[var(--color-text-primary)] transition-colors bg-[var(--color-bg-panel)] border border-[var(--color-border-strong)] rounded-md shadow-sm">
              ⌘K
            </kbd>
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
        <div className="lg:hidden px-4 pb-5">
          <div className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-3">
            Book a Meet
          </div>
          <CalendarCard />
        </div>

        <div className="px-5 text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-3 mt-2">
          Portfolio
        </div>
        
        <div
          className={`flex items-center py-2 px-2 mx-2 my-1 rounded-xl cursor-pointer text-[13px] font-medium transition-fluid haptic-press ${
            activeFileId === "graph" ? "bg-white/10 text-[var(--color-text-primary)] shadow-sm ring-1 ring-white/10" : "text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]"
          }`}
          onClick={() => onFileSelect("graph")}
        >
          <div className="mr-1 w-3.5" />
          <span className={`mr-2 flex-shrink-0 ${activeFileId === "graph" ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-tertiary)]"}`}>⚗️</span>
          <span className="truncate">Global Graph</span>
        </div>

        <div
          className={`flex items-center py-2 px-2 mx-2 my-1 rounded-xl cursor-pointer text-[13px] font-medium transition-fluid haptic-press ${
            activeFileId === "me" ? "bg-white/10 text-[var(--color-text-primary)] shadow-sm ring-1 ring-white/10" : "text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]"
          }`}
          onClick={() => onFileSelect("me")}
        >
          <div className="mr-1 w-3.5" />
          <UserRound size={14} className={`mr-2 flex-shrink-0 transition-colors duration-200 ${activeFileId === "me" ? "text-[var(--color-accent-secondary)]" : "text-[var(--color-text-tertiary)]"}`} />
          <span className="truncate">Me</span>
        </div>

        <div className="mt-4">
          {vaultData.filter(item => item.id !== "me").map(item => renderItem(item))}
        </div>
      </div>
    </div>
  );
}
