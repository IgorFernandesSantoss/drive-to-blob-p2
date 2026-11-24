import { BlobServiceClient } from "@azure/storage-blob";

import { env } from "@/lib/env";
import type { DestinationBlob } from "@/lib/types";

const service = () => {
  const { azureSasUrl, storageConnectionString } = env();
  if (azureSasUrl) return new BlobServiceClient(azureSasUrl);
  if (storageConnectionString) return BlobServiceClient.fromConnectionString(storageConnectionString);
  throw new Error("Defina AZURE_BLOB_SAS_URL ou AZURE_STORAGE_CONNECTION_STRING.");
};

const container = async () => {
  const c = service().getContainerClient(env().blobContainerName);
  await c.createIfNotExists();
  return c;
};

export const listDestinationBlobs = async (): Promise<DestinationBlob[]> => {
  const blobs: DestinationBlob[] = [];
  for await (const b of (await container()).listBlobsFlat()) {
    blobs.push({
      name: b.name,
      size: b.properties.contentLength ?? 0,
      lastModified: b.properties.lastModified?.toISOString() ?? null,
    });
  }
  return blobs;
};

export const uploadBlob = async (name: string, data: Buffer, contentType: string) => {
  await (await container())
    .getBlockBlobClient(name)
    .uploadData(data, { blobHTTPHeaders: { blobContentType: contentType } });
};
