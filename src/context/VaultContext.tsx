"use client";

import React, { createContext, useContext, useMemo } from "react";
import { VaultFolder, VaultFile } from "../data/content/types";

interface VaultContextType {
  vaultData: (VaultFolder | VaultFile)[];
  allFiles: VaultFile[];
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export function VaultProvider({ 
  children, 
  initialData 
}: { 
  children: React.ReactNode; 
  initialData: (VaultFolder | VaultFile)[];
}) {
  
  // Flatten files for search and quick access
  const allFiles = useMemo(() => {
    const files: VaultFile[] = [];
    const traverse = (items: (VaultFolder | VaultFile)[]) => {
      items.forEach((item) => {
        if (item.type === "file") {
          files.push(item);
        } else if (item.type === "folder") {
          traverse(item.children);
        }
      });
    };
    traverse(initialData);
    return files;
  }, [initialData]);

  return (
    <VaultContext.Provider value={{ vaultData: initialData, allFiles }}>
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (context === undefined) {
    throw new Error("useVault must be used within a VaultProvider");
  }
  return context;
}
