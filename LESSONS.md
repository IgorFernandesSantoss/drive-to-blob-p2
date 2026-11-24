# LESSONS - Lições aprendidas

## 1. Nome de contêiner do enunciado é inválido no Azure
- **Evidência:** enunciado pede `Aluno_xxx`; regras do Azure exigem minúsculas/números/hífen.
- **Onde:** `lib/env.ts` (`blobContainerName`), ADR-003.
- **Solução:** `aluno-igorfernandes`, configurável por variável.

## 2. Container escutava na porta 3000, não na exposta
- **Evidência:** `podman run -p 10100:10000` retornava conexão recusada; o log mostrava `Local: http://localhost:3000`.
- **Onde:** `Dockerfile` (o P1 dependia do `PORT` injetado pelo Render).
- **Solução:** `ENV PORT=10000` no runner, para funcionar também fora do Render.

## 3. Short-name de imagem falha no podman
- **Evidência:** `short-name "oven/bun:1-slim" did not resolve to an alias and no unqualified-search registries are defined`.
- **Onde:** `Dockerfile`.
- **Solução:** `FROM docker.io/oven/bun:...` (nome totalmente qualificado).

## 4. `bun add -d typescript` instalou a v7
- **Evidência:** `package.json` ficou com `typescript ^7.0.2`, incompatível com o Next 16.
- **Solução:** fixar `typescript@5` e `@types/bun` para o `bun:test`.

## 5. `package.json` e `Dockerfile` do P1 estavam vazios no disco
- **Evidência:** `wc -c` deu 0 e 1 byte; o conteúdo existia só no commit (`git show HEAD:...`).
- **Solução:** copiados do `HEAD` do P1. Verificar o P1 antes de reutilizá-lo.

## 6. Erro de credencial do Google ilegível
- **Evidência:** `/api/source` com chave inválida retornava `Unexpected token 'D'...`.
- **Onde:** `lib/drive.ts` (`parseCredentials`).
- **Solução:** mensagem clara pedindo JSON ou base64.

## 7. Enunciado já traz as credenciais do Azure; só o Google exigia setup
- **Evidência:** o `gcloud` local só tinha a conta corporativa (sessão expirada), e a prova entrega Connection String e BlobSASURL do Azure.
- **Onde:** `lib/blob.ts` (SAS URL ou Connection String), `lib/drive.ts` (chave de API ou Service Account).
- **Solução:** usar as credenciais do Word (SAS testada com criar/enviar/listar/apagar) e permitir chave de API para a pasta pública do Drive, sem criar nada na conta corporativa.

## 8. Build do Docker quebraria no Render: `public/` vazia não vai para o git
- **Evidência:** `git ls-files public` retornava 0 arquivos; o `Dockerfile` faz `COPY --from=builder /app/public ./public`. O build local passava só porque a pasta vazia existia no disco.
- **Onde:** `public/.gitkeep`, `Dockerfile`.
- **Solução:** versionar `public/.gitkeep` e validar com um clone limpo do repositório + `podman build`.
