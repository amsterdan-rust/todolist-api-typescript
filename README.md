# Todo List API

REST API de Todo List construída com TypeScript, Bun, Hono, Better Auth, Drizzle ORM e Clean Architecture.

O objetivo deste projeto é demonstrar uma arquitetura desacoplada, onde regras de negócio, banco de dados, autenticação e camada HTTP são separados de forma clara.

A aplicação foi pensada para permitir trocar implementações com baixo impacto, por exemplo:

* trocar repository in-memory por repository Drizzle;
* trocar SQLite local por Cloudflare D1;
* trocar Hono por outro framework HTTP no futuro;
* reutilizar os mesmos use cases em diferentes entradas, como HTTP, Worker ou CLI.

## Stack

* TypeScript
* Bun
* Hono
* Better Auth
* Drizzle ORM
* SQLite local
* Cloudflare Workers
* Cloudflare D1
* Zod
* OpenAPI / Scalar

## Arquitetura

O projeto segue Clean Architecture com organização por feature.

As features ficam em `src/features`.

Cada feature é dividida em camadas:

```txt
domain
→ entidades, schemas e regras centrais

app
→ use cases e contratos de repositories

infra
→ implementações externas, como HTTP e repositories
```

Exemplo:

```txt
src/features/todo/task
├── domain
├── app
│  ├── repositories
│  └── use-cases
└── infra
   ├── http
   └── repositories
```

## Estrutura principal

```txt
src
├── app
│  ├── composition
│  ├── database
│  ├── http
│  ├── runtimes
│  └── test-support
├── features
│  ├── auth
│  └── todo
└── shared
```

## `src/app`

A pasta `src/app` é responsável pela composição da aplicação.

Ela não contém regra de negócio de Todo ou Auth. Ela junta as partes da aplicação para cada ambiente.

### `composition`

```txt
src/app/composition
├── make-app-container.ts
├── make-in-memory-container.ts
└── make-local-container.ts
```

Responsável por montar os containers da aplicação.

#### `make-app-container.ts`

Factory central que recebe repositories e monta os use cases.

Ela não decide qual banco será usado.

#### `make-in-memory-container.ts`

Container usado por testes unitários e testes HTTP que ainda usam repositories em memória.

Usa:

```txt
InMemoryTaskRepository
InMemoryCategoryRepository
```

#### `make-local-container.ts`

Container usado pelo runtime local com Bun.

Usa:

```txt
DrizzleTaskRepository
DrizzleCategoryRepository
SQLite local
```

### `database`

```txt
src/app/database
├── local
├── worker
├── schemas
└── schema.ts
```

Responsável pela configuração de banco e schemas Drizzle.

#### `database/local`

Banco usado em ambiente local e testes.

```txt
src/app/database/local
├── database-url.ts
├── db.ts
└── sqlite.ts
```

Usa `bun:sqlite` e `drizzle-orm/bun-sqlite`.

Bancos locais:

```txt
app.sqlite       → desenvolvimento local
app.test.sqlite  → testes automatizados
```

#### `database/worker`

Banco usado no Cloudflare Worker.

```txt
src/app/database/worker/d1.ts
```

Usa `drizzle-orm/d1` com o binding `env.DB` do Cloudflare D1.

#### `database/schemas`

Schemas Drizzle compartilhados entre SQLite local e D1.

```txt
src/app/database/schemas
├── auth.schema.ts
├── category.schema.ts
└── task.schema.ts
```

### `http`

```txt
src/app/http/hono
├── make-hono-app.ts
└── hono-error-handler.ts
```

Contém a factory HTTP baseada em Hono.

`make-hono-app.ts` recebe um container pronto e registra:

* health check;
* documentação OpenAPI;
* Scalar UI;
* rotas de auth;
* rotas de tasks;
* rotas de categories;
* middlewares;
* error handler.

Essa camada não decide qual banco ou repository será usado.

### `runtimes`

```txt
src/app/runtimes
├── local-app.ts
└── worker-app.ts
```

Entrypoints da aplicação.

#### `local-app.ts`

Runtime local com Bun.

Usa:

```txt
makeLocalContainer()
makeHonoApp()
```

É usado pelo script:

```bash
bun run dev
```

#### `worker-app.ts`

Runtime do Cloudflare Worker.

Atualmente usado para validar Worker + D1 + Drizzle.

Expõe rotas temporárias de debug, como:

```txt
/debug/db
/debug/drizzle
/debug/tables
```

Essas rotas servem apenas para validar a integração com Cloudflare D1 durante o desenvolvimento.

### `test-support`

```txt
src/app/test-support/http
├── http-auth-test-helpers.ts
├── http-test-helpers.ts
└── http-test-types.ts
```

Helpers usados apenas por testes.

Essa pasta existe para evitar misturar código de runtime com suporte de teste.

## Runtimes

A aplicação possui dois runtimes principais.

### Runtime local

Usado durante desenvolvimento com Bun.

```txt
Bun
→ Hono
→ makeLocalContainer
→ Drizzle repositories
→ SQLite local
```

Arquivo principal:

```txt
src/app/runtimes/local-app.ts
```

Rodar localmente:

```bash
bun run dev
```

### Runtime Cloudflare Worker

Usado para deploy na Cloudflare.

```txt
Cloudflare Worker
→ D1 binding
→ Drizzle D1
```

Arquivo principal:

```txt
src/app/runtimes/worker-app.ts
```

Configuração:

```txt
wrangler.jsonc
```

Rodar localmente com Wrangler:

```bash
bunx wrangler dev
```

Deploy:

```bash
bunx wrangler deploy
```

## Banco de dados

O projeto usa Drizzle ORM com schemas compartilhados.

### Desenvolvimento local

Banco:

```txt
app.sqlite
```

Sincronizar schema local:

```bash
bun run db:push:dev
```

### Testes

Banco:

```txt
app.test.sqlite
```

O banco de teste é recriado antes da suíte.

Rodar testes:

```bash
bun run test
```

Com coverage:

```bash
bun run test:coverage
```

### Cloudflare D1

O banco D1 é configurado no `wrangler.jsonc` usando o binding:

```txt
DB
```

Aplicar migrations localmente no D1:

```bash
bunx wrangler d1 migrations apply todolist-api-db --local
```

Aplicar migrations no D1 remoto:

```bash
bunx wrangler d1 migrations apply todolist-api-db --remote
```

## Testes

O projeto possui diferentes tipos de teste.

### Testes de domínio

Testam regras puras das entidades.

Não usam banco.

Exemplo:

```txt
src/features/todo/task/domain/task.test.ts
```

### Testes de use case

Testam regras de aplicação.

Usam repositories in-memory.

Exemplo:

```txt
src/features/todo/task/app/use-cases/create-task.test.ts
```

### Testes de repository Drizzle

Testam persistência real usando Drizzle e SQLite de teste.

Exemplo:

```txt
src/features/todo/task/infra/repositories/drizzle-task-repository/drizzle-task.repository.test.ts
```

### Testes HTTP

Testam rotas Hono, validação, auth e integração com use cases.

Atualmente usam containers de teste/in-memory em parte dos cenários, com suporte de autenticação real via Better Auth.

Helpers compartilhados ficam em:

```txt
src/app/test-support/http
```

## Scripts

### Instalar dependências

```bash
bun install
```

### Rodar em desenvolvimento

```bash
bun run dev
```

### Gerar migration Drizzle

```bash
bun run db:generate
```

### Sincronizar banco local

```bash
bun run db:push:dev
```

### Preparar banco de teste

```bash
bun run db:test:prepare
```

### Rodar testes

```bash
bun run test
```

### Rodar testes com coverage

```bash
bun run test:coverage
```

### Rodar Worker local

```bash
bunx wrangler dev
```

### Deploy para Cloudflare Workers

```bash
bunx wrangler deploy
```

## Autenticação

A autenticação usa Better Auth.

Rotas como signup, signin, signout e session são fornecidas pelo Better Auth em:

```txt
/auth/*
```

Exemplos:

```txt
POST /auth/sign-up/email
POST /auth/sign-in/email
POST /auth/sign-out
GET  /auth/get-session
```

A aplicação também possui uma rota própria:

```txt
GET /me
```

Ela retorna o usuário autenticado atual com base na sessão.

## Documentação HTTP

A API expõe documentação OpenAPI em:

```txt
/doc
```

E interface Scalar em:

```txt
/docs
```

## Health check

```txt
GET /health
```

Resposta:

```json
{
  "status": "ok"
}
```

## Observações

* `app.sqlite` e `app.test.sqlite` são bancos locais e não devem ser versionados.
* `.wrangler/` é gerado pelo Wrangler e não deve ser versionado.
* O runtime local usa Bun SQLite.
* O runtime Worker usa Cloudflare D1.
* Os schemas Drizzle são compartilhados entre os dois ambientes.
