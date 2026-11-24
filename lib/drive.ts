import { auth, drive } from "@googleapis/drive";

import { env } from "@/lib/env";
import type { SourceFile } from "@/lib/types";

const GOOGLE_APPS = "application/vnd.google-apps.";
const FOLDER = `${GOOGLE_APPS}folder`;

const parseCredentials = (raw: string) => {
  const json = raw.trim().startsWith("{")
    ? raw
    : Buffer.from(raw, "base64").toString("utf8");
  try {
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON inválido: use o JSON da chave ou o base64 dele.");
  }
};

// Chave de API lê pastas públicas; Service Account lê pastas compartilhadas com o e-mail dela.
const client = () => {
  const { googleApiKey, googleServiceAccountJson } = env();
  if (googleApiKey) return drive({ version: "v3", auth: googleApiKey });
  if (!googleServiceAccountJson) {
    throw new Error("Defina GOOGLE_API_KEY ou GOOGLE_SERVICE_ACCOUNT_JSON.");
  }
  return drive({
    version: "v3",
    auth: new auth.GoogleAuth({
      credentials: parseCredentials(googleServiceAccountJson),
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    }),
  });
};

export const isGoogleDoc = (file: SourceFile) => file.mimeType.startsWith(GOOGLE_APPS);

// Docs/Sheets/Slides não têm bytes: são exportados para PDF e ganham a extensão .pdf.
export const destinationName = (file: SourceFile) =>
  isGoogleDoc(file) ? `${file.name}.pdf` : file.name;

// shortcut: só o primeiro nível da pasta (sem subpastas), subir para recursivo se for exigido.
export const listSourceFiles = async (): Promise<SourceFile[]> => {
  const drv = client();
  const files: SourceFile[] = [];
  let pageToken: string | undefined;
  do {
    const { data } = await drv.files.list({
      q: `'${env().driveFolderId}' in parents and trashed = false`,
      fields: "nextPageToken, files(id, name, mimeType, size)",
      pageSize: 100,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    for (const f of data.files ?? []) {
      if (!f.id || !f.name || f.mimeType === FOLDER) continue;
      files.push({
        id: f.id,
        name: f.name,
        mimeType: f.mimeType ?? "application/octet-stream",
        size: f.size ? Number(f.size) : null,
      });
    }
    pageToken = data.nextPageToken ?? undefined;
  } while (pageToken);
  return files;
};

// shortcut: o arquivo inteiro fica em memória, trocar por stream se houver arquivos grandes.
export const downloadFile = async (file: SourceFile): Promise<Buffer> => {
  const drv = client();
  const res = isGoogleDoc(file)
    ? await drv.files.export(
        { fileId: file.id, mimeType: "application/pdf" },
        { responseType: "arraybuffer" },
      )
    : await drv.files.get(
        { fileId: file.id, alt: "media", supportsAllDrives: true },
        { responseType: "arraybuffer" },
      );
  return Buffer.from(res.data as ArrayBuffer);
};
