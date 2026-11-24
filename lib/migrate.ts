import type { SourceFile, TransferStatus } from "@/lib/types";

type Deps = {
  download: (file: SourceFile) => Promise<Buffer>;
  upload: (file: SourceFile, data: Buffer) => Promise<void>;
  log?: (line: string) => void;
};

// Um erro em um arquivo é registrado e a migração segue para o próximo.
export const migrate = async (
  files: SourceFile[],
  { download, upload, log = console.log }: Deps,
): Promise<TransferStatus[]> => {
  const results: TransferStatus[] = [];
  for (const file of files) {
    try {
      const data = await download(file);
      await upload(file, data);
      results.push({ name: file.name, size: data.length, status: "ok", message: "copiado" });
      log(`[OK]   ${file.name} (${data.length} bytes)`);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      results.push({ name: file.name, size: file.size, status: "error", message });
      log(`[ERRO] ${file.name}: ${message}`);
    }
  }
  return results;
};
