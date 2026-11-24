import { uploadBlob } from "@/lib/blob";
import { destinationName, downloadFile, isGoogleDoc, listSourceFiles } from "@/lib/drive";
import { handle } from "@/lib/http";
import { migrate } from "@/lib/migrate";

export const dynamic = "force-dynamic";

export const POST = () =>
  handle(async () =>
    migrate(await listSourceFiles(), {
      download: downloadFile,
      upload: (file, data) =>
        uploadBlob(destinationName(file), data, isGoogleDoc(file) ? "application/pdf" : file.mimeType),
    }),
  );
