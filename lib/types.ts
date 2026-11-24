export type SourceFile = {
  id: string;
  name: string;
  mimeType: string;
  size: number | null;
};

export type DestinationBlob = {
  name: string;
  size: number;
  lastModified: string | null;
};

export type TransferStatus = {
  name: string;
  size: number | null;
  status: "ok" | "error";
  message: string;
};
