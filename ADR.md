# Decisões de arquitetura

## ADR-001: Aplicação web com Next.js
A prova pede interface gráfica e URL publicada, então usei Next.js com TypeScript e bun, a mesma base do P1. A tela chama três rotas (`/api/source`, `/api/destination`, `/api/migrate`) que usam as funções de `lib/`.

## ADR-002: Autenticação
- **Azure:** BlobSASURL do enunciado (tem validade e permissões limitadas) ou Connection String.
- **Google:** chave de API para pasta compartilhada com "qualquer pessoa com o link", ou Service Account para pasta privada.
- Todas as credenciais ficam em variáveis de ambiente, nunca no código.

## ADR-003: Nome do contêiner
O enunciado pede `Aluno_xxx`, mas o Azure só aceita letras minúsculas, números e hífen. Usei `aluno-igorfernandes`.

## ADR-004: Google Docs, Sheets e Slides viram PDF
Esses arquivos não têm conteúdo para baixar direto, então são exportados como PDF.

## ADR-005: Escopo simples
Copia só a primeira pasta (sem subpastas), sem login e sem tentar de novo em caso de erro. Cada arquivo é lido inteiro na memória.

## ADR-006: Publicação no Render
Docker no Render, com o código no GitHub, como no P1.
