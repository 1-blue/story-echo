# GitHub Actions CI

PR 및 `main`/`master` push 시 [ci.yml](./ci.yml)이 실행됩니다.

## Jobs

| Job                | 설명                                | DB/Supabase |
| ------------------ | ----------------------------------- | ----------- |
| `quality`          | lint, tsc, generate:api             | 불필요      |
| `test-unit`        | Vitest — schemas + lib + components | 불필요      |
| `test-integration` | Vitest — Route Handler fetch 테스트 | **필수**    |
| `test-e2e`         | Playwright — 19 pages               | **필수**    |

CI는 **DB seed를 실행하지 않습니다.** E2E/integration은 migrate deploy 후 **이미 seed된 `development` 스키마**와 GitHub Secrets(`E2E_ADMIN_*`)를 전제합니다. 로컬에서 `pnpm db:seed` / `pnpm db:seed:prod`를 수동 실행하세요.

## Postgres 스키마 (단일 Supabase 프로젝트)

| 스키마        | CI / 로컬                       | Vercel Production      |
| ------------- | ------------------------------- | ---------------------- |
| `development` | Secrets에 `&schema=development` | —                      |
| `public`      | —                               | `schema` 파라미터 없음 |

## Repository Secrets

| Secret                          | 용도                                                   |
| ------------------------------- | ------------------------------------------------------ |
| `DATABASE_URL`                  | `story-echo` pooler + **`&schema=development`**        |
| `DIRECT_URL`                    | direct + **`?schema=development`** (migrate deploy)    |
| `NEXT_PUBLIC_SUPABASE_URL`      | `story-echo` project URL                               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key                                               |
| `SUPABASE_SERVICE_ROLE_KEY`     | Auth admin (seed)                                      |
| `E2E_ADMIN_EMAIL`               | **`admin-dev@test.com`** (실섭 admin과 분리)           |
| `E2E_ADMIN_PASSWORD`            | dev Auth 비밀번호                                      |
| `SEED_ADMIN_EMAIL`              | (선택) integration fallback — **`admin-dev@test.com`** |
| `SEED_ADMIN_PASSWORD`           | (선택) dev Auth 비밀번호                               |

**Vercel Production** env: `DATABASE_URL`에 `schema` 없음 (= `public`), admin은 `admin@test.com`.

## 로컬 실행

```bash
pnpm install
pnpm generate:api

# Unit + component (DB 불필요)
pnpm --filter @storyecho/schemas test:unit
pnpm --filter web test:unit

# Integration — apps/web/.env + packages/database/.env (Development 블록 활성)
pnpm --filter web build
pnpm --filter web test:integration
# · development 스키마: pnpm db:seed (최초 1회 migrate deploy + seed)
# · public 시드: Production 블록 활성 → pnpm db:seed:prod

# E2E
pnpm --filter web build
pnpm --filter web exec playwright install chromium
pnpm --filter web test:e2e
```
