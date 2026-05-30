# StoryEcho

매일 하나의 질문. 오늘의 이야기, 나중에 다시 읽기.

## Stack

- **Web**: Next.js 16 + shadcn/ui + Serwist PWA
- **Mobile**: Expo (expo-router)
- **API**: Next.js Route Handlers + zod (SSOT) + orval
- **DB**: Supabase Postgres + Prisma
- **Auth**: Supabase Email/Password

## Prerequisites

- Node.js >= 20
- pnpm 10

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Generate OpenAPI + orval client
pnpm generate:api

# 3. Environment
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local
# TODO: 입력하기 — DATABASE_URL, Supabase keys 등

# 4. Database (Supabase URL 필요)
cp packages/database/.env.example packages/database/.env
pnpm db:migrate
pnpm db:seed

# 5. Run web
pnpm --filter web dev
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Turbo dev (web + mobile) |
| `pnpm generate:api` | zod → openapi.json → orval |
| `pnpm db:migrate` | Prisma migrate dev |
| `pnpm db:seed` | 시드 (관리자·질문 풀) |
| `pnpm --filter web dev` | Next.js only |

## SSOT

- **DB**: `packages/database/prisma/schema.prisma`
- **API**: `packages/schemas` (zod) → orval
- **UI types**: `Pick`/`Omit` from orval types — see `apps/web/features/*/types.ts`
- **Design**: [DESIGN.md](./DESIGN.md) → `apps/web/app/globals.css`

## Docs

- [기획.md](./기획.md)
- [개발.md](./개발.md)
- [DESIGN.md](./DESIGN.md)
