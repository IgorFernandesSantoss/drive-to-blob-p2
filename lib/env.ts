// Lido sob demanda (não no import) para o `next build` funcionar sem segredos.
export const env = () => ({
  // Google: chave de API (pasta pública, "qualquer pessoa com o link") OU Service Account
  // (JSON puro ou base64 dele; base64 facilita colar no painel do Render).
  googleApiKey: process.env.GOOGLE_API_KEY,
  googleServiceAccountJson: process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
  driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
  // Azure: BlobSASURL (preferida, permissão limitada e com validade) ou Connection String, ambas do enunciado.
  azureSasUrl: process.env.AZURE_BLOB_SAS_URL,
  storageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  // "Aluno_xxx" é inválido no Azure (só minúsculas, números e hífen).
  blobContainerName: process.env.AZURE_BLOB_CONTAINER_NAME ?? "aluno-igorfernandes",
});
