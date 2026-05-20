import fs from "fs";
import path from "path";
import { VaultFolder, VaultFile } from "../data/content/types";

const contentDir = path.join(process.cwd(), "src/content");

function getFileNameWithoutExt(filename: string) {
  return filename.replace(/\.md$/, "");
}

function extractLinks(content: string): string[] {
  const matches = [...content.matchAll(/\[\[(.*?)\]\]/g)];
  return matches.map(m => m[1].toLowerCase().replace(/ /g, "-"));
}

function processDirectory(dirPath: string, folderName: string, folderId: string): VaultFolder {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const children: (VaultFolder | VaultFile)[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      children.push(processDirectory(fullPath, entry.name, `${folderId}-${entry.name}`));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const id = getFileNameWithoutExt(entry.name);
      const name = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ");
      const content = fs.readFileSync(fullPath, "utf-8");
      const links = extractLinks(content);
      
      children.push({
        id,
        name,
        type: "file",
        content,
        links,
      });
    }
  }

  return {
    id: folderId,
    name: folderName.charAt(0).toUpperCase() + folderName.slice(1).replace(/-/g, " "),
    type: "folder",
    children,
  };
}

export function getVaultData(): (VaultFolder | VaultFile)[] {
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  
  const entries = fs.readdirSync(contentDir, { withFileTypes: true });
  const data: (VaultFolder | VaultFile)[] = [];
  
  for (const entry of entries) {
    const fullPath = path.join(contentDir, entry.name);
    if (entry.isDirectory()) {
      data.push(processDirectory(fullPath, entry.name, entry.name));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const id = getFileNameWithoutExt(entry.name);
      const name = id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ");
      const content = fs.readFileSync(fullPath, "utf-8");
      const links = extractLinks(content);
      data.push({
        id,
        name,
        type: "file",
        content,
        links,
      });
    }
  }
  
  return data;
}
