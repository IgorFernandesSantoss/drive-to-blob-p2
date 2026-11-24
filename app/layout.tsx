import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Drive para Azure Blob",
  description: "Migração de arquivos do Google Drive para o Azure Blob Storage",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
