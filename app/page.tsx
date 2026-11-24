"use client";

import { useState } from "react";

import type { DestinationBlob, SourceFile, TransferStatus } from "@/lib/types";

type Busy = "source" | "destination" | "migrate" | null;

const fmtSize = (n: number | null) => (n === null ? "-" : `${n.toLocaleString("pt-BR")} B`);

function Table({ title, head, rows }: { title: string; head: string[]; rows: (string | React.ReactNode)[][] | null }) {
  if (!rows) return null;
  return (
    <section>
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p className="empty">Nenhum item.</p>
      ) : (
        <table>
          <thead>
            <tr>{head.map((h) => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default function Home() {
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<SourceFile[] | null>(null);
  const [destination, setDestination] = useState<DestinationBlob[] | null>(null);
  const [results, setResults] = useState<TransferStatus[] | null>(null);

  const run = async <T,>(kind: Exclude<Busy, null>, path: string, method: string, set: (v: T) => void) => {
    setBusy(kind);
    setError(null);
    try {
      const res = await fetch(path, { method });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? res.statusText);
      set(body as T);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  };

  const migrateAll = async () => {
    await run<TransferStatus[]>("migrate", "/api/migrate", "POST", setResults);
    await run<DestinationBlob[]>("destination", "/api/destination", "GET", setDestination);
  };

  return (
    <main>
      <h1>Google Drive para Azure Blob</h1>
      <p className="sub">Copia os arquivos de uma pasta do Drive para o contêiner aluno-igorfernandes.</p>

      <div className="actions">
        <button className="secondary" disabled={!!busy} onClick={() => run<SourceFile[]>("source", "/api/source", "GET", setSource)}>
          {busy === "source" ? "Listando..." : "Listar origem (Drive)"}
        </button>
        <button className="secondary" disabled={!!busy} onClick={() => run<DestinationBlob[]>("destination", "/api/destination", "GET", setDestination)}>
          {busy === "destination" ? "Listando..." : "Listar destino (Blob)"}
        </button>
        <button disabled={!!busy} onClick={migrateAll}>
          {busy === "migrate" ? "Migrando..." : "Migrar"}
        </button>
      </div>

      {error && <div className="alert">{error}</div>}

      <Table
        title="Resultado da migração"
        head={["Arquivo", "Tamanho", "Status", "Detalhe"]}
        rows={results && results.map((r) => [r.name, fmtSize(r.size), <span key="s" className={r.status}>{r.status === "ok" ? "Sucesso" : "Erro"}</span>, r.message])}
      />
      <Table
        title="Origem: Google Drive"
        head={["Arquivo", "Tipo", "Tamanho"]}
        rows={source && source.map((f) => [f.name, f.mimeType, fmtSize(f.size)])}
      />
      <Table
        title="Destino: Azure Blob Storage"
        head={["Blob", "Tamanho", "Modificado em"]}
        rows={destination && destination.map((b) => [b.name, fmtSize(b.size), b.lastModified ? new Date(b.lastModified).toLocaleString("pt-BR") : "-"])}
      />
    </main>
  );
}
