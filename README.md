# Drive para Azure Blob (P2 - Computação em Nuvem II)

Aplicação Next.js que copia os arquivos de uma pasta do Google Drive para um contêiner do Azure Blob Storage.

- **Origem:** Google Drive, autenticação por Service Account (`lib/drive.ts`, `listSourceFiles`).
- **Destino:** Azure Blob Storage, autenticação por BlobSASURL (preferida) ou Connection String, ambas fornecidas no Word da prova (`lib/blob.ts`, `listDestinationBlobs`).
- **Migração:** `lib/migrate.ts` imprime `[OK]` ou `[ERRO]` no console para cada arquivo; um erro não interrompe os demais.
- **Interface:** botões "Listar origem (Drive)", "Listar destino (Blob)" e "Migrar", com tabela de status por arquivo.
- Google Docs, Sheets e Slides são exportados para PDF (ganham `.pdf`). Subpastas são ignoradas.

URL publicada: _preencher após o deploy no Render_ (ver seção Publicação).

## Configuração do Google (uma vez)

1. No Google Cloud Console (conta pessoal), crie um projeto e ative a **Google Drive API**.
2. Em IAM > Contas de serviço, crie uma Service Account e gere uma **chave JSON**.
3. No Google Drive, crie a pasta, coloque arquivos e **compartilhe como Leitor** com o e-mail da Service Account (`...@...iam.gserviceaccount.com`).
4. O ID da pasta é o trecho final da URL (`drive.google.com/drive/folders/<ID>`).

Via `gcloud` (logado na conta pessoal):

```bash
gcloud projects create <id-do-projeto>
gcloud services enable drive.googleapis.com --project <id-do-projeto>
gcloud iam service-accounts create p2-drive-reader --project <id-do-projeto>
gcloud iam service-accounts keys create ~/p2-key.json \
  --iam-account p2-drive-reader@<id-do-projeto>.iam.gserviceaccount.com
```

## Rodar local

```bash
cp .env.example .env.local   # preencher as variáveis (Azure: SAS URL ou Connection String do Word)
bun install
bun dev                      # http://localhost:3000
bun test && bun run typecheck && bun run lint
```

Para `GOOGLE_SERVICE_ACCOUNT_JSON` use o JSON da chave ou o base64 dele (`base64 -w0 ~/p2-key.json`).
O contêiner padrão é `aluno-igorfernandes` (`Aluno_xxx` do enunciado não é um nome válido no Azure; ver `ADR.md`).

## Container

```bash
podman build -t p2-drive-blob .
podman run --rm -p 10000:10000 --env-file .env.local p2-drive-blob
```

## Publicação (Render)

New > Web Service > repositório `IgorFernandesSantoss/drive-to-blob-p2` > Runtime **Docker** > defina as variáveis de ambiente (`GOOGLE_*` e `AZURE_BLOB_SAS_URL`).
O Render injeta `PORT`; o `Dockerfile` usa 10000 por padrão.

## Segurança

Chave da Service Account e Connection String ficam só em variáveis de ambiente (`.env*` está no `.gitignore`).
A URL pública não tem login: quem a abrir pode listar e disparar a cópia (idempotente, sobrescreve os mesmos blobs). Para uso real, colocar autenticação na frente.
