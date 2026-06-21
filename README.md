# StoryEcho

매일 하나의 질문. 오늘의 이야기, 나중에 다시 읽기.

## Stack

- **Web**: Next.js 16 + shadcn/ui + Serwist PWA
- **Mobile**: Expo WebView shell (`EXPO_PUBLIC_WEB_URL` → `/app`)
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

# 3. Environment — 3개 `.env` (gitignore, 레포 루트·web·database)
#    Supabase story-echo 1개 · Postgres development/public 주석 블록으로 전환
#    로컬 기본: Development 블록 활성 (&schema=development, admin-dev@test.com)
#    · /.env
#    · apps/web/.env
#    · packages/database/.env

# 4. Database
pnpm exec prisma migrate deploy --schema=packages/database/prisma/schema.prisma
pnpm db:seed        # development 스키마 + dev 프로필
# pnpm db:seed:prod # public — Production 블록 활성 후

# 5. Run web
pnpm --filter web dev
```

### 관리자 로그인 (시드·잔디 UI 테스트)

비밀번호는 **Supabase Auth**(`auth.users`)에 저장됩니다. Prisma `users` 테이블에는 password 컬럼이 없습니다.

1. `packages/database/.env` Development 블록에 `SEED_ADMIN_*` · `admin-dev@test.com` 설정
2. `pnpm db:seed` → `[users] Supabase Auth 관리자 생성/갱신` 확인 (`public`은 Production 블록 + `pnpm db:seed:prod`)
3. `/app/settings/login`에서 위 이메일·비밀번호로 로그인
4. `/app/drawer`에서 잔디·이야기 목록 확인

## Scripts

| Command                    | Description                                                               |
| -------------------------- | ------------------------------------------------------------------------- |
| `pnpm dev`                 | Turbo dev (web + mobile)                                                  |
| `pnpm generate:api`        | zod → openapi.json → orval                                                |
| `pnpm db:migrate`          | Prisma migrate dev                                                        |
| `pnpm db:seed`             | dev 프로필 시드 (관리자·365 질문·환영 커뮤니티 글)                        |
| `pnpm db:seed:prod`        | prod 프로필 시드                                                          |
| `pnpm db:reset`            | migrate reset — **활성 env 블록**의 Postgres 스키마 초화 + seed           |
| `pnpm --filter web dev`    | Next.js only                                                              |
| `pnpm --filter mobile dev` | Expo WebView shell (see [apps/mobile/README.md](./apps/mobile/README.md)) |
| `pnpm test:unit`           | Vitest unit + component                                                   |
| `pnpm test:integration`    | API integration (web)                                                     |
| `pnpm test:e2e`            | Playwright E2E                                                            |

## Testing

Vitest (unit/integration/component) + Playwright (E2E). PR 시 GitHub Actions [`.github/workflows/ci.yml`](.github/workflows/ci.yml) 자동 실행.

```bash
pnpm --filter @storyecho/schemas test:unit
pnpm --filter web test:unit
pnpm --filter web build && pnpm --filter web test:integration  # DATABASE_URL + Supabase 필요
pnpm --filter web exec playwright install chromium
pnpm --filter web test:e2e
```

CI Secrets 설정: [`.github/workflows/README.md`](.github/workflows/README.md)

## SSOT

- **DB**: `packages/database/prisma/schema.prisma`
- **API**: `packages/schemas` (zod) → orval
- **UI types**: `Pick`/`Omit` from orval types — see `apps/web/features/*/types.ts`
- **Design**: [DESIGN.md](./DESIGN.md) → `apps/web/app/globals.css`

## Docs

- [기획.md](./.md/기획.md)
- [개발.md](./.md/개발.md)
- [정책.md](./.md/정책.md)
- [DESIGN.md](./.md/DESIGN.md)
