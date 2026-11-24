import { BlobServiceClient } from "@azure/storage-blob";

import { env } from "@/lib/env";
import type { DestinationBlob } from "@/lib/types";

const container = async () => {
  const c = BlobServiceClient.fromConnectionString(
    env().storageConnectionString,
  ).getContainerClient(env().blobContainerName);
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
