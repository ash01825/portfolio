"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import GraphView from "./GraphView";
import MarkdownView from "./MarkdownView";
import ProfileHeader from "./ProfileHeader";
import CommandPalette from "./CommandPalette";
import { VaultProvider, useVault } from "../context/VaultContext";
import { VaultFolder, VaultFile } from "../data/content/types";

function VaultApp() {
  const [activeFileId, setActiveFileId] = useState<string>("graph");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { allFiles } = useVault();

  const activeFile = allFiles.find(f => f.id === activeFileId);

  const handleLinkClick = (id: string) => {
    const searchId = id.toLowerCase();
    const exactMatch = allFiles.find(f => f.id.toLowerCase() === searchId);
    
    if (exactMatch) {
      setActiveFileId(exactMatch.id);
    } else {
      const found = allFiles.find(f => 
        f.id.toLowerCase().includes(searchId) || 
        searchId.includes(f.id.toLowerCase())
      );
      if (found) {
        setActiveFileId(found.id);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-primary)] font-sans">
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        setIsOpen={setCommandPaletteOpen} 
        activeFileId={activeFileId === "graph" ? null : activeFileId} 
        onFileSelect={(id) => setActiveFileId(id)} 
      />
      <Sidebar 
        activeFileId={activeFileId} 
        onFileSelect={setActiveFileId} 
        onOpenSearch={() => setCommandPaletteOpen(true)} 
      />
      
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Profile Header appears on the root Graph view */}
        {activeFileId === "graph" && (
          <div className="absolute top-12 left-0 right-0 z-10 pointer-events-none">
            <div className="pointer-events-auto">
              <ProfileHeader />
            </div>
            <div className="h-32 w-full bg-gradient-to-b from-[var(--color-bg-base)]/60 to-transparent backdrop-blur-[1px]" />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {activeFileId === "graph" ? (
            <div className="flex-1 pt-20 w-full h-full absolute inset-0">
               <GraphView onNodeClick={setActiveFileId} />
            </div>
          ) : activeFile ? (
            <div className="flex-1 w-full h-full overflow-y-auto">
              <MarkdownView content={activeFile.content} onLinkClick={handleLinkClick} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-[var(--color-text-secondary)]">
              File not found
            </div>
          )}
        </div>
      </main>

      <RightSidebar activeFileId={activeFileId} />
    </div>
  );
}

export default function VaultClient({ initialData }: { initialData: (VaultFolder | VaultFile)[] }) {
  return (
    <VaultProvider initialData={initialData}>
      <VaultApp />
    </VaultProvider>
  );
}
