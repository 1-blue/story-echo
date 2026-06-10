---
name: storyecho-api
description: >-
  StoryEcho API 계약·Route Handler 수정 워크플로. zod SSOT → openapi.json → orval
  파이프라인을 따른다. API 추가/변경, openapi.json, orval 훅, Route Handler,
  packages/schemas 수정 시 이 skill을 따른다. 비즈니스 규칙·페이지 정책은
  storyecho-policy skill(.md/정책.md)을 참조한다.
---

# StoryEcho API 수정 워크플로

## SSOT 파이프라인

```
packages/schemas (zod)     ← API 계약 원본 (수정 ✅)
        ↓ pnpm generate:openapi
openapi.json               ← 자동 생성 (수동 편집 ❌)
        ↓ orval
packages/api-client/src/generated/**  ← 자동 생성 (수동 편집 ❌)
        ↓ import
apps/web/app/api/**/route.ts          ← 구현 (zod parse + Prisma)
apps/web/features/*/types.ts          ← Pick/Omit 파생 타입만
```

Route Handler만 바꿔도 openapi/orval은 **자동 갱신되지 않는다.** 스키마·registerPath 변경 후 `pnpm generate:api` 필수.

## 수정 유형별 체크리스트

### A. 요청/응답 필드 변경

- [ ] `packages/schemas/src/*.ts` zod 수정 (`.openapi("Name")` 유지)
- [ ] Prisma 필드와 다르면 `apps/web/lib/*-mapper.ts` DTO 매핑 수정
- [ ] `apps/web/app/api/**/route.ts` — 동일 zod로 `safeParse` / `parse`
- [ ] `pnpm generate:api`
- [ ] `apps/web/features/<domain>/types.ts` — orval 타입에서 `Pick`/`Omit`만
- [ ] `pnpm --filter web exec tsc --noEmit`

### B. 새 엔드포인트 추가

1. zod: request/response 스키마 in `packages/schemas`, `packages/schemas/src/index.ts` export
2. `scripts/generate-openapi.ts`: `registry.register(...)` + `registry.registerPath({ method, path, ... })`
3. `apps/web/app/api/v1/<resource>/route.ts` 구현
4. `pnpm generate:api` → `useGetApiV1*` / `useGetApiV1*Suspense` 훅 확인
5. Suspense 훅: `orval.config.ts` — `override.query.useSuspenseQuery: true`

### C. DB만 변경 (API 노출 없음)

- [ ] `packages/database/prisma/schema.prisma`
- [ ] `pnpm db:migrate`
- Prisma 타입은 Route Handler에서 `@storyecho/database` import — 별도 interface 금지

## Route Handler 규칙

- mutation/GET body: **항상** `@storyecho/schemas` zod parse 후 Prisma
- 응답: zod `Schema.parse({ data: ... })`로 shape 검증 권장
- 에러: `{ message, code? }` — `ErrorResponseSchema`와 일치
- `packages/api-client/src/generated/**` 직접 수정 금지

## 생성 명령

```bash
pnpm generate:openapi   # openapi.json만
pnpm generate:api       # openapi + orval (권장)
# postinstall에서도 generate:api 실행됨
```

## 금지

| ❌                                       | ✅                         |
| ---------------------------------------- | -------------------------- |
| `openapi.json` 수동 편집                 | zod + generate-openapi.ts  |
| `generated/**` 수동 편집                 | `pnpm generate:api`        |
| 화면마다 Story interface 재정의          | `Pick<Story, 'id' \| ...>` |
| API 전용 zod + 프론트 전용 zod 이중 정의 | `packages/schemas` 단일    |

## 검증

```bash
pnpm --filter web exec tsc --noEmit
pnpm --filter @storyecho/database exec tsc --noEmit  # DB 연관 시
curl http://localhost:3000/api/v1/health
```

## 참고 파일

- 계약: `packages/schemas/src/`
- OpenAPI 생성: `scripts/generate-openapi.ts`
- orval: `orval.config.ts`
- SSOT 원칙: `개발.md` §2 · 비즈니스 규칙: `정책.md` · [storyecho-policy](../storyecho-policy/SKILL.md)
