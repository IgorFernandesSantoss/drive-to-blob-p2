const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente ausente: ${name}`);
  return value;
};

// Lido sob demanda (não no import) para o `next build` funcionar sem segredos.
export const env = () => ({
  // JSON puro ou base64 do JSON da Service Account (base64 facilita colar no painel do Render).
  googleServiceAccountJson: required("GOOGLE_SERVICE_ACCOUNT_JSON"),
  driveFolderId: required("GOOGLE_DRIVE_FOLDER_ID"),
  // Azure: BlobSASURL (preferida, permissão limitada e com validade) ou Connection String, ambas do enunciado.
  azureSasUrl: process.env.AZURE_BLOB_SAS_URL,
  storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  // "Aluno_xxx" é inválido no Azure (só minúsculas, números e hífen).
  blobContainerName: process.env.AZURE_BLOB_CONTAINER_NAME ?? "aluno-igorfernandes",
});
