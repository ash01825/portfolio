"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, Search } from "lucide-react";
import { useVault } from "../context/VaultContext";
import { VaultFolder, VaultFile } from "../data/content/types";

interface SidebarProps {
  activeFileId: string | null;
  onFileSelect: (id: string) => void;
  onOpenSearch: () => void;
}

export default function Sidebar({ activeFileId, onFileSelect, onOpenSearch }: SidebarProps) {
  const { vaultData, allFiles } = useVault();
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
          className={`flex items-center py-1.5 px-2 mx-2 my-0.5 rounded-lg cursor-pointer text-sm font-medium transition-all duration-200 ${
            isActive ? "bg-[var(--color-bg-base)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)] shadow-sm" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-base)]/50 hover:text-[var(--color-text-primary)] border border-transparent"
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
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
            className="flex items-center py-1.5 px-2 mx-2 my-1 rounded-lg cursor-pointer text-sm text-[var(--color-text-primary)] font-semibold hover:bg-[var(--color-bg-base)]/50 transition-colors duration-200"
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
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
    <div className="w-56 h-full bg-[var(--color-bg-panel)] backdrop-blur-xl border-r border-[var(--color-border-subtle)] flex flex-col flex-shrink-0 z-20">
      <div className="p-4 pt-6">
        <div 
          className="relative group cursor-pointer"
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
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
        <div className="px-5 text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-3 mt-2">
          Portfolio
        </div>
        
        <div
          className={`flex items-center py-1.5 px-2 mx-2 my-0.5 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
            activeFileId === "graph" ? "bg-[var(--color-bg-base)] text-[var(--color-text-primary)] border border-[var(--color-border-strong)] shadow-sm" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-base)]/50 hover:text-[var(--color-text-primary)] border border-transparent"
          }`}
          onClick={() => onFileSelect("graph")}
        >
          <div className="mr-1 w-3.5" />
          <span className={`mr-2 flex-shrink-0 ${activeFileId === "graph" ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-tertiary)]"}`}>⚗️</span>
          <span className="truncate">Global Graph</span>
        </div>

        <div className="mt-4">
          {vaultData.filter(item => item.id !== "me").map(item => renderItem(item))}
        </div>
      </div>
    </div>
  );
}
