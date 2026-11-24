# Drive para Azure Blob (P2 - Computação em Nuvem II)

Aplicação Next.js que copia os arquivos de uma pasta do Google Drive para um contêiner do Azure Blob Storage.

- **Origem:** Google Drive, autenticação por chave de API (pasta pública) ou Service Account (`lib/drive.ts`, `listSourceFiles`).
- **Destino:** Azure Blob Storage, autenticação por BlobSASURL (preferida) ou Connection String, ambas fornecidas no Word da prova (`lib/blob.ts`, `listDestinationBlobs`).
- **Migração:** `lib/migrate.ts` imprime `[OK]` ou `[ERRO]` no console para cada arquivo; um erro não interrompe os demais.
- **Interface:** botões "Listar origem (Drive)", "Listar destino (Blob)" e "Migrar", com tabela de status por arquivo.
- Google Docs, Sheets e Slides são exportados para PDF (ganham `.pdf`). Subpastas são ignoradas.

URL publicada: https://drive-to-blob-p2.onrender.com (Render, plano gratuito: a primeira requisição após inatividade demora ~1 min).

## Situação da entrega

- **Verificado de verdade:** Azure com a BlobSASURL do enunciado (criar contêiner, enviar, listar, apagar), interface, build, teste, typecheck, lint e container (inclusive build a partir de clone limpo).
- **Não verificado:** a leitura do Google Drive só passou no typecheck, sem rodar contra uma pasta real.
- **Instância publicada:** tem só as variáveis do Azure. Sem `GOOGLE_API_KEY` e `GOOGLE_DRIVE_FOLDER_ID`, "Listar destino" funciona e "Listar origem"/"Migrar" respondem qual variável falta. Para ativar, siga a seção abaixo e adicione as duas variáveis no painel do Render.

## Configuração do Google (uma vez)

**Opção A: pasta pública + chave de API (mais simples)**

1. No Google Drive, compartilhe a pasta como "Qualquer pessoa com o link" (Leitor). O ID da pasta é o final da URL (`drive.google.com/drive/folders/<ID>`).
2. No Google Cloud Console: crie um projeto, ative a **Google Drive API** e em APIs e serviços > Credenciais crie uma **Chave de API** (restrinja à Drive API).
3. Defina `GOOGLE_API_KEY` e `GOOGLE_DRIVE_FOLDER_ID`.

**Opção B: Service Account (pasta privada)**

1. Crie uma Service Account com chave JSON (IAM > Contas de serviço) e ative a Drive API.
2. Compartilhe a pasta como Leitor com o e-mail da Service Account.
3. Defina `GOOGLE_SERVICE_ACCOUNT_JSON` (JSON ou base64: `base64 -w0 chave.json`) e `GOOGLE_DRIVE_FOLDER_ID`.

Se as duas estiverem definidas, a chave de API tem prioridade.

## Rodar local

```bash
cp .env.example .env.local   # preencher as variáveis (Azure: SAS URL ou Connection String do Word)
bun install
bun dev                      # http://localhost:3000
bun test && bun run typecheck && bun run lint
```

O contêiner padrão é `aluno-igorfernandes` (`Aluno_xxx` do enunciado não é um nome válido no Azure; ver `ADR.md`).

## Container

```bash
podman build -t p2-drive-blob .
podman run --rm -p 10000:10000 --env-file .env.local p2-drive-blob
```

## Publicação (Render)

New > Web Service > repositório `IgorFernandesSantoss/drive-to-blob-p2` > Runtime **Docker** > defina as variáveis de ambiente (`GOOGLE_API_KEY`, `GOOGLE_DRIVE_FOLDER_ID` e `AZURE_BLOB_SAS_URL`).
O Render injeta `PORT`; o `Dockerfile` usa 10000 por padrão.

## Segurança

Chave da Service Account e Connection String ficam só em variáveis de ambiente (`.env*` está no `.gitignore`).
A URL pública não tem login: quem a abrir pode listar e disparar a cópia (idempotente, sobrescreve os mesmos blobs). Para uso real, colocar autenticação na frente.
