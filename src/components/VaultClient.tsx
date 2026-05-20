"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import GraphView from "./GraphView";
import MarkdownView from "./MarkdownView";
import ProfileHeader from "./ProfileHeader";
import CommandPalette from "./CommandPalette";
import { VaultProvider, useVault } from "../context/VaultContext";
import { VaultFolder, VaultFile } from "../data/content/types";

function VaultApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileParam = searchParams.get("file");
  const activeFileId = fileParam ?? "graph";

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { allFiles } = useVault();

  const activeFile = allFiles.find((f) => f.id === activeFileId);

  const navigate = (id: string) => {
    if (id === "graph") {
      router.push("/", { scroll: false });
    } else {
      router.push(`/?file=${encodeURIComponent(id)}`, { scroll: false });
    }
    setMobileMenuOpen(false);
  };

  const handleLinkClick = (id: string) => {
    const searchId = id.toLowerCase();
    const exactMatch = allFiles.find((f) => f.id.toLowerCase() === searchId);
    if (exactMatch) {
      navigate(exactMatch.id);
      return;
    }
    const found = allFiles.find(
      (f) =>
        f.id.toLowerCase().includes(searchId) ||
        searchId.includes(f.id.toLowerCase())
    );
    if (found) navigate(found.id);
  };

  return (
    <div className="relative flex h-[100dvh] w-screen overflow-hidden bg-[var(--color-bg-base)] text-[var(--color-text-primary)] font-sans">
      <div className="bg-ambient-mesh" />
      <div className="bg-noise" />

      <CommandPalette
        isOpen={commandPaletteOpen}
        setIsOpen={setCommandPaletteOpen}
        activeFileId={activeFileId === "graph" ? null : activeFileId}
        onFileSelect={navigate}
      />

      <div className="relative z-10 flex h-full w-full p-2 md:p-4 gap-2 md:gap-4">
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/35 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar — hidden on mobile unless mobileMenuOpen */}
        <div
          className={`
            fixed md:relative inset-y-0 left-0 z-40 md:z-20
            transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
            md:translate-x-0
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            md:flex
            p-2 md:p-0
          `}
        >
          <Sidebar
            activeFileId={activeFileId}
            onFileSelect={navigate}
            onOpenSearch={() => {
              setMobileMenuOpen(false);
              setCommandPaletteOpen(true);
            }}
          />
        </div>

        <main className="flex-1 flex flex-col h-full min-w-0 relative glass-panel glass-panel-inner rounded-[2rem] overflow-hidden">
          {/* Mobile top bar */}
          <div className="md:hidden flex items-center px-4 pt-4 pb-2 z-10 relative">
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] haptic-press transition-fluid"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span className="ml-3 text-sm font-semibold text-[var(--color-text-secondary)] truncate">
              {activeFileId === "graph"
                ? "arsh's vault"
                : activeFile?.name ?? "not found"}
            </span>
          </div>

          {/* Profile Header — graph view only */}
          {activeFileId === "graph" && (
            <div className="absolute top-0 md:top-12 left-0 right-0 z-10 pointer-events-none hidden md:block">
              <div className="pointer-events-auto">
                <ProfileHeader />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            {activeFileId === "graph" ? (
              <div className="flex-1 w-full h-full relative overflow-hidden">
                <div className="absolute inset-0 pt-36 md:pt-20">
                  <GraphView onNodeClick={navigate} />
                </div>
                <div className="relative z-10 md:hidden pointer-events-none">
                  <div className="pointer-events-auto">
                    <ProfileHeader compact />
                  </div>
                </div>
              </div>
            ) : activeFile ? (
              <div className="flex-1 w-full h-full overflow-y-auto custom-scrollbar">
                <MarkdownView
                  content={activeFile.content}
                  onLinkClick={handleLinkClick}
                />
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
    </div>
  );
}

// Wrap in Suspense — required by Next.js when using useSearchParams in a client component
function VaultAppWithSuspense() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[100dvh] w-screen items-center justify-center bg-[var(--color-bg-base)] text-[var(--color-text-secondary)] text-sm">
          Loading…
        </div>
      }
    >
      <VaultApp />
    </Suspense>
  );
}

export default function VaultClient({
  initialData,
}: {
  initialData: (VaultFolder | VaultFile)[];
}) {
  return (
    <VaultProvider initialData={initialData}>
      <VaultAppWithSuspense />
    </VaultProvider>
  );
}
