import React from "react";
import VaultClient from "../components/VaultClient";
import { getVaultData } from "../lib/content";

export default async function Home() {
  const fileSystemData = await getVaultData();

  return (
    <VaultClient initialData={fileSystemData} />
  );
}
