---
name: storyecho-policy
description: >-
  StoryEcho 서비스·페이지·기능 정책 SSOT. 기능 구현, API 검증, 사용자 facing
  카피, moderation, 이메일 인증·작성 제한 변경 시 .md/정책.md를 따른다.
---

# StoryEcho 정책 워크플로

## 문서 역할

| 문서                                   | 역할                                              |
| -------------------------------------- | ------------------------------------------------- |
| [`.md/정책.md`](../../.md/정책.md)     | **페이지·기능별 운영 규칙 SSOT** (Notion·CS·심사) |
| [`.md/기획.md`](../../.md/기획.md)     | 로드맵·기능 목록·구현 상태                        |
| [`.md/개발.md`](../../.md/개발.md)     | API·기술·배포·AdSense 연동                        |
| [`.md/DESIGN.md`](../../.md/DESIGN.md) | UI 토큰·레이아웃                                  |

## 언제 이 skill을 사용하는가

- 페이지/기능 **비즈니스 규칙** 추가·변경
- Route Handler **검증 로직** (이메일 인증, 1일 1Story, 신고 등)
- 사용자 facing 카피 (`service-policies.ts`, welcome-post, about)
- moderation·신고·숨김 정책
- 스토어 Data safety·CS 답변 근거

API 스키마·openapi 파이프라인은 [storyecho-api](../storyecho-api/SKILL.md) skill을 따른다. **비즈니스 규칙은 본 skill(정책.md) 우선.**

## 수정 체크리스트

1. [`.md/정책.md`](../../.md/정책.md) 해당 **페이지 H2** 섹션 갱신
2. 코드 SSOT 동기화:
   - `apps/web/lib/content/service-policies.ts` (about·사용자 카피)
   - `apps/web/lib/story-write-policy.ts` (Story 작성 검증)
   - `packages/schemas` (길이·개수 제한)
   - Route Handler 검증 (`EMAIL_NOT_VERIFIED`, `QUESTION_NOT_TODAY` 등)
3. 필요 시 `packages/database/src/seeds/welcome-post.content.ts`
4. `pnpm --filter web test:unit` 및 해당 integration test

## 페이지 빠른 참조

| Route                  | 정책.md 섹션       |
| ---------------------- | ------------------ |
| `/`                    | 홈                 |
| `/write`               | 이야기 작성        |
| `/drawer`              | 서랍               |
| `/capsule`             | 타임캡슐           |
| `/community`           | 커뮤니티 토론      |
| `/public/[id]`         | 공개 Story         |
| `/notifications`       | 알림               |
| `/settings`            | 설정               |
| `/about`, `/questions` | 소개·질문 아카이브 |

## 공통 규칙 (자주 쓰는 것)

- KST 하루 1질문 · 같은 날 같은 질문에 Story 1개
- community·댓글: **emailVerified** 필수
- 신고 **3건** → `hiddenFromFeed`
- 본문 **5,000자**, 사진 **8장**
- 공개 Story vs CommunityPost **이원화** — 혼동 금지
