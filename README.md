# Drive para Azure Blob

Aplicação da P2 de Computação em Nuvem II. Copia os arquivos de uma pasta do Google Drive para um contêiner do Azure Blob Storage.

- Aplicação publicada: https://drive-to-blob-p2.onrender.com
- Código: https://github.com/IgorFernandesSantoss/drive-to-blob-p2
- Contêiner de destino: `aluno-igorfernandes`

## Como funciona

A página tem três botões:

- **Listar origem (Drive):** mostra os arquivos da pasta do Google Drive.
- **Listar destino (Blob):** mostra os arquivos do contêiner no Azure.
- **Migrar:** copia cada arquivo do Drive para o contêiner e mostra o status (sucesso ou erro) de cada um. O mesmo status aparece no console como `[OK]` ou `[ERRO]`.

Arquivos do Google (Docs, Sheets, Slides) são salvos como PDF. Subpastas não são copiadas.

## Código

- `lib/drive.ts`: lista e baixa os arquivos do Google Drive.
- `lib/blob.ts`: lista e envia arquivos para o Azure Blob.
- `lib/migrate.ts`: copia os arquivos e registra o status de cada um.
- `app/page.tsx`: tela com os botões e a tabela de status.
- `app/api/*`: rotas que a tela chama.

## Configuração

Copie `.env.example` para `.env.local` e preencha:

| Variável | O que é |
| --- | --- |
| `AZURE_BLOB_SAS_URL` | BlobSASURL do enunciado (ou use `AZURE_STORAGE_CONNECTION_STRING`) |
| `AZURE_BLOB_CONTAINER_NAME` | `aluno-igorfernandes` |
| `GOOGLE_DRIVE_FOLDER_ID` | ID da pasta (final da URL da pasta no Drive) |
| `GOOGLE_API_KEY` | Chave de API do Google, para pasta compartilhada com "qualquer pessoa com o link" |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Alternativa à chave: JSON da Service Account, com a pasta compartilhada com o e-mail dela |

Para pegar a chave: no Google Cloud Console, ative a Google Drive API e crie uma Chave de API em Credenciais.

## Rodar

```bash
bun install
bun dev
```

Abra http://localhost:3000. Testes: `bun test`.

Com container:

```bash
podman build -t drive-to-blob .
podman run --rm -p 10000:10000 --env-file .env.local drive-to-blob
```

## Publicação

Publicado no Render como Web Service com Docker, usando este repositório. As variáveis da tabela acima são configuradas no painel do Render.
