# GitHub Actions CI

PR 및 `main`/`master` push 시 [ci.yml](./ci.yml)이 실행됩니다.

## Jobs

| Job | 설명 | DB/Supabase |
| --- | --- | --- |
| `quality` | lint, tsc, generate:api | 불필요 |
| `test-unit` | Vitest — schemas + lib + components | 불필요 |
| `test-integration` | Vitest — Route Handler fetch 테스트 | **필수** |
| `test-e2e` | Playwright — 19 pages | **필수** |

## Repository Secrets

| Secret | 용도 |
| --- | --- |
| `DATABASE_URL` | Supabase Postgres (pooler) |
| `DIRECT_URL` | Prisma migrate (direct) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Auth admin |
| `E2E_ADMIN_EMAIL` | emailVerified 회원 (E2E login) |
| `E2E_ADMIN_PASSWORD` | 위 계정 비밀번호 |
| `SEED_ADMIN_EMAIL` | (선택) integration login fallback |
| `SEED_ADMIN_PASSWORD` | (선택) integration login fallback |

## 로컬 실행

```bash
pnpm install
pnpm generate:api

# Unit + component (DB 불필요)
pnpm --filter @storyecho/schemas test:unit
pnpm --filter web test:unit

# Integration (apps/web/.env.local + packages/database/.env)
pnpm --filter web build
pnpm --filter web test:integration

# E2E
pnpm --filter web exec playwright install chromium
pnpm --filter web test:e2e
```
