# ADR - Architecture Decision Records

## ADR-001: Aplicação web Next.js em vez de script de linha de comando
- **Contexto:** o enunciado pede interface gráfica (1 ponto) e URL publicada (1 ponto), além do status no console.
- **Decisão:** Next.js (App Router) + TypeScript strict + bun, a mesma stack do P1. Três rotas finas (`/api/source`, `/api/destination`, `/api/migrate`) sobre `lib/`. O log `[OK]`/`[ERRO]` é feito no servidor (`lib/migrate.ts`) e o mesmo resultado aparece na tabela.
- **Consequência:** reaproveita Dockerfile e fluxo de deploy do P1.

## ADR-002: Autenticação
- **Google:** dois modos. (1) `GOOGLE_API_KEY` com pasta pública "qualquer pessoa com o link", escolhido pelo aluno por ser o mais simples (sem Service Account); (2) Service Account com escopo `drive.readonly` em `GOOGLE_SERVICE_ACCOUNT_JSON` (JSON ou base64), para pasta privada. Sem OAuth de usuário. A chave de API tem prioridade.
- **Azure:** BlobSASURL do enunciado em `AZURE_BLOB_SAS_URL` (preferida: SAS tem validade e permissões limitadas, não expõe a chave da conta) ou Connection String em `AZURE_STORAGE_CONNECTION_STRING`. Testado com a SAS: criar contêiner, enviar, listar e apagar funcionam.
- **Segredos:** só em variáveis de ambiente; nunca no git nem no zip.

## ADR-003: Nome do contêiner `aluno-igorfernandes`
- O enunciado pede `Aluno_xxx`, mas o Azure só aceita minúsculas, números e hífen (3 a 63 caracteres). `_` e maiúsculas são recusados. Usado `aluno-igorfernandes`; configurável por `AZURE_BLOB_CONTAINER_NAME`.

## ADR-004: Google Docs/Sheets/Slides exportados para PDF
- Esses arquivos não têm bytes para baixar (`alt=media` falha). Exportados como PDF e gravados com `.pdf`.

## ADR-005: Escopo reduzido (ponytail)
- Fora: subpastas recursivas, sincronização incremental, retry, login de usuário, streaming. Arquivos ficam em memória (`shortcut:` em `lib/drive.ts`).

## ADR-006: Deploy no Render (Docker) com repositório na conta pessoal IgorFernandesSantoss
- Mesmo caminho do P1. A conta de trabalho `ifernandes-amp` não é usada.
