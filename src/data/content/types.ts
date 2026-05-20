export type VaultFile = {
  id: string;
  name: string;
  content: string;
  tags?: string[];
  links?: string[];
  type: "file";
};

export type VaultFolder = {
  id: string;
  name: string;
  children: (VaultFile | VaultFolder)[];
  type: "folder";
};
