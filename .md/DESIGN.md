---
version: alpha
name: StoryEcho-design-system
description: StoryEcho(이야기해줘)는 매일 하나의 질문과 개인 이야기, 1년 Echo, 타임캡슐, 커뮤니티를 담는 자기성찰 PWA입니다. 따뜻한 종이(cream canvas) 위에 여백을 넉넉히 두고, 질문은 세리프로 읽기 좋게, UI는 산세리프로 조용하게 처리합니다. 핵심 액센트는 terracotta({colors.primary}) — 이야기의 온기. Echo는 muted teal({colors.echo}), 타임캡슐은 soft lavender({colors.capsule})로 기능별 색을 구분합니다. 모바일 퍼스트, 4탭(홈·서랍·커뮤니티·설정), 광고 배너는 하단 고정.

colors:
  primary: "#C4714A"
  primary-pressed: "#A85F3D"
  primary-soft: "#F5E6DE"
  on-primary: "#FFFFFF"
  echo: "#4A8B8B"
  echo-soft: "#E3F0F0"
  capsule: "#7B6BA8"
  capsule-soft: "#EDE8F5"
  community: "#5B8A72"
  community-soft: "#E5F2EB"
  canvas: "#FAF7F2"
  surface: "#F3EDE4"
  surface-elevated: "#FFFFFF"
  hairline: "#E8E0D4"
  hairline-strong: "#D4C9BA"
  ink: "#2C2419"
  charcoal: "#4A4035"
  slate: "#6B6258"
  stone: "#9A9188"
  muted: "#B8AFA5"
  on-dark: "#FAF7F2"
  on-dark-muted: "#C4BAB0"
  semantic-success: "#4A8B6B"
  semantic-warning: "#C4924A"
  semantic-error: "#C44A4A"
  ad-banner: "#EDE8E0"

typography:
  question-display:
    fontFamily: "Lora, Noto Serif KR, Georgia, serif"
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: -0.3px
  question-display-lg:
    fontFamily: "Lora, Noto Serif KR, Georgia, serif"
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.40
    letterSpacing: -0.5px
  heading-1:
    fontFamily: "Pretendard, Noto Sans KR, Inter, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.30
    letterSpacing: -0.3px
  heading-2:
    fontFamily: "Pretendard, Noto Sans KR, Inter, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.2px
  heading-3:
    fontFamily: "Pretendard, Noto Sans KR, Inter, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.40
  body-lg:
    fontFamily: "Pretendard, Noto Sans KR, Inter, sans-serif"
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.65
  body-md:
    fontFamily: "Pretendard, Noto Sans KR, Inter, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.60
  body-sm:
    fontFamily: "Pretendard, Noto Sans KR, Inter, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
  body-sm-medium:
    fontFamily: "Pretendard, Noto Sans KR, Inter, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.55
  caption:
    fontFamily: "Pretendard, Noto Sans KR, Inter, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.45
  caption-bold:
    fontFamily: "Pretendard, Noto Sans KR, Inter, sans-serif"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.45
  button-md:
    fontFamily: "Pretendard, Noto Sans KR, Inter, sans-serif"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.30
  tab-label:
    fontFamily: "Pretendard, Noto Sans KR, Inter, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 0.2px

rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  screen-x: 20px
  screen-bottom-safe: 88px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "14px 24px"
    minHeight: 48px
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.charcoal}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: "14px 24px"
    border: "1px solid {colors.hairline-strong}"
    minHeight: 48px
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.slate}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  question-card:
    backgroundColor: "{colors.surface-elevated}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xxl} {spacing.xl}"
    border: "1px solid {colors.hairline}"
  story-card:
    backgroundColor: "{colors.surface-elevated}"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.lg}"
    border: "1px solid {colors.hairline}"
  echo-comparison-panel:
    backgroundColor: "{colors.echo-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "1px solid {colors.hairline}"
  capsule-sealed-card:
    backgroundColor: "{colors.capsule-soft}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
    border: "1px dashed {colors.capsule}"
  text-input:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
    border: "1px solid {colors.hairline-strong}"
    minHeight: 48px
  text-area:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
    border: "1px solid {colors.hairline}"
    minHeight: 200px
  bottom-tab-bar:
    backgroundColor: "{colors.surface-elevated}"
    height: 64px
    border: "1px solid {colors.hairline}"
  bottom-tab-active:
    textColor: "{colors.primary}"
    typography: "{typography.tab-label}"
  bottom-tab-inactive:
    textColor: "{colors.stone}"
    typography: "{typography.tab-label}"
  badge-echo:
    backgroundColor: "{colors.echo-soft}"
    textColor: "{colors.echo}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-capsule:
    backgroundColor: "{colors.capsule-soft}"
    textColor: "{colors.capsule}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-community:
    backgroundColor: "{colors.community-soft}"
    textColor: "{colors.community}"
    typography: "{typography.caption-bold}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  visibility-toggle-private:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.slate}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    border: "1px solid {colors.hairline}"
  visibility-toggle-community:
    backgroundColor: "{colors.community-soft}"
    textColor: "{colors.community}"
    typography: "{typography.body-sm-medium}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  photo-thumbnail:
    rounded: "{rounded.sm}"
    aspectRatio: "1/1"
  ad-banner-slot:
    backgroundColor: "{colors.ad-banner}"
    height: 50px
    border: "1px solid {colors.hairline}"
---

## Overview

StoryEcho(이야기해줘)는 **조용한 저널링 앱**입니다. 화면은 종이 같은 cream canvas({colors.canvas}) 위에 질문 한 장, 이야기 한 편이 중심이 됩니다. 마케팅 랜딩이 아니라 **매일 쓰는 앱 UI**를 전제로 합니다.

홈(P2)은 화면 중앙에 오늘의 질문 카드(`question-card`) — 세리프 `{typography.question-display}` — 와 [이야기 쓰기] / [나중에] 두 버튼만 둡니다. 서랍(P6)은 날짜별 private 이야기 리스트. 커뮤니티(P9)는 공개 feed 카드 + 검색. Echo(P5)는 좌우(모바일: 상하) 2열 비교 패널. 타임캡슐(P7)은 봉인 카드(`capsule-sealed-card`)에 자물쇠 아이콘 + 해제일.

**Key Characteristics:**

- Cream paper canvas — 차가운 pure white 지양
- 질문 = 세리프(Lora / Noto Serif KR), UI = 산세리프(Pretendard)
- Terracotta primary({colors.primary}) — CTA·활성 탭·브랜드 온기
- Echo teal / Capsule lavender / Community sage — 기능별 pastel 구분
- Pill 버튼({rounded.full}) + 16px 카드 — 부드럽고 손에 닿는 느낌
- 모바일 퍼스트, 하단 4탭, Free 사용자 하단 광고 배너
- 질문·본문 읽기에 여백과 line-height 1.6+ 우선

## Colors

### Brand & Primary

- **Terracotta** ({colors.primary}): 메인 CTA, 활성 탭, 브랜드 포인트. "이야기 쓰기" 버튼.
- **Terracotta Pressed** ({colors.primary-pressed}): pressed state
- **Terracotta Soft** ({colors.primary-soft}): 온보딩·강조 배경 tint

### Feature Accents

- **Echo Teal** ({colors.echo}): 1년 Echo 배지·비교 UI
- **Echo Soft** ({colors.echo-soft}): Echo 비교 패널 배경
- **Capsule Lavender** ({colors.capsule}): 타임캐슐 봉인 상태
- **Capsule Soft** ({colors.capsule-soft}): 타임캡슐 카드 배경
- **Community Sage** ({colors.community}): 공개 범위·커뮤니티 배지
- **Community Soft** ({colors.community-soft}): 공개 선택 활성 tint

### Surface

- **Canvas** ({colors.canvas}): 앱 전체 배경 — warm cream
- **Surface** ({colors.surface}): 섹션·서랍 리스트 배경
- **Surface Elevated** ({colors.surface-elevated}): 카드·입력 필드 — white
- **Hairline** ({colors.hairline}): 1px 구분선
- **Hairline Strong** ({colors.hairline-strong}): 입력·버튼 outline

### Text

- **Ink** ({colors.ink}): 본문·이야기 텍스트
- **Charcoal** ({colors.charcoal}): 제목·강조
- **Slate** ({colors.slate}): 보조 설명
- **Stone** ({colors.stone}): 날짜·메타
- **Muted** ({colors.muted}): placeholder·비활성

### Semantic

- **Success** ({colors.semantic-success}): 저장 완료
- **Warning** ({colors.semantic-warning}): 일반 경고 안내
- **Error** ({colors.semantic-error}): 폼 오류

## Typography

### Font Families

- **질문·Echo 비교 본문**: Lora + Noto Serif KR (serif) — 사색·읽기감
- **UI·설정·탭·버튼**: Pretendard + Noto Sans KR + Inter (sans)

### Hierarchy

| Token                              | Size | Weight | Line Height | Use                             |
| ---------------------------------- | ---- | ------ | ----------- | ------------------------------- |
| `{typography.question-display-lg}` | 32px | 500    | 1.40        | 홈 오늘의 질문 (대)             |
| `{typography.question-display}`    | 28px | 500    | 1.45        | 질문 카드 기본                  |
| `{typography.heading-1}`           | 24px | 600    | 1.30        | 페이지 제목 (서랍, 설정)        |
| `{typography.heading-2}`           | 20px | 600    | 1.35        | 섹션 (타임캡슐, Echo)           |
| `{typography.body-lg}`             | 18px | 400    | 1.65        | 이야기 작성·읽기 (대 글자 모드) |
| `{typography.body-md}`             | 16px | 400    | 1.60        | 기본 본문                       |
| `{typography.body-sm}`             | 14px | 400    | 1.55        | feed 미리보기                   |
| `{typography.caption}`             | 12px | 400    | 1.45        | 날짜, 닉네임                    |
| `{typography.button-md}`           | 15px | 500    | 1.30        | 버튼                            |
| `{typography.tab-label}`           | 11px | 500    | 1.30        | 하단 탭                         |

### 글자 크기 설정 (F13)

- **소**: body-md 14px, question-display 24px
- **중** (기본): body-md 16px, question-display 28px
- **대**: body-lg 18px, question-display 32px

## Layout

### Spacing System

- Base unit: 4px
- Screen horizontal padding: `{spacing.screen-x}` (20px)
- Card internal padding: `{spacing.lg}`–`{spacing.xxl}`
- Bottom safe area: 탭바(64px) + 광고(50px, Free) = `{spacing.screen-bottom-safe}`

### Grid & Container

- Mobile-first: max-width 480px centered (PWA phone frame)
- Tablet: 480–768px, feed 2-column optional
- Question card: full-width minus screen padding

### Whitespace Philosophy

한 화면에 **하나의 초점** — 질문 또는 이야기. 리스트는 날짜 그룹 헤더 + 카드 간 `{spacing.sm}`. Echo 비교는 두 패널 사이 `{spacing.md}` gap.

## Elevation & Depth

| Level   | Treatment                           | Use                    |
| ------- | ----------------------------------- | ---------------------- |
| 0       | border only `{colors.hairline}`     | story-card, list items |
| 1       | `rgba(44, 36, 25, 0.04) 0 2px 8px`  | question-card          |
| 2       | `rgba(44, 36, 25, 0.08) 0 8px 24px` | Echo modal, onboarding |
| overlay | `rgba(44, 36, 25, 0.40)`            | 타임캡슐 봉인 오버레이 |

그림자는 절제. warmth는 color tint로 표현.

## Shapes

| Token            | Value | Use                                |
| ---------------- | ----- | ---------------------------------- |
| `{rounded.sm}`   | 8px   | photo thumbnail                    |
| `{rounded.md}`   | 12px  | inputs, story-card                 |
| `{rounded.lg}`   | 16px  | question-card, echo panel          |
| `{rounded.full}` | pill  | buttons, badges, visibility toggle |

## Components

> Per the no-hover policy, hover states are NOT documented.

### Buttons

- **`button-primary`**: [이야기 쓰기], [저장] — terracotta pill, min 48px height
- **`button-secondary`**: [나중에], [취소] — outline pill
- **`button-ghost`**: 설정 링크, [신고]

### Cards

- **`question-card`**: 홈 오늘의 질문. white, 16px radius, centered serif text
- **`story-card`**: 서랍·feed 한 줄. left: date caption, center: question preview + body excerpt
- **`echo-comparison-panel`**: Echo teal-soft bg. label "1년 전" / "지금"
- **`capsule-sealed-card`**: dashed border, lock icon, unlock date caption

### Inputs

- **`text-area`**: 이야기 작성 — borderless feel, generous padding, placeholder `{colors.muted}`
- **`text-input`**: 로그인 email/password, 검색
- **`visibility-toggle-private`** / **`visibility-toggle-community`**: 저장 시 공개 범위 segmented pill

### Navigation

- **`bottom-tab-bar`**: 홈 | 서랍 | 커뮤니티 | 설정. icons + `{typography.tab-label}`. active = `{colors.primary}`
- Top bar: back chevron + page title `{typography.heading-2}`, no heavy chrome

### Badges

- **`badge-echo`**: "1년 Echo" on home when applicable
- **`badge-capsule`**: "타임캡슐" on sealed stories
- **`badge-community`**: feed public indicator

### Monetization

- **`ad-banner-slot`**: Free only, fixed bottom above tab bar, neutral bg — content never hidden behind it

## Screen-Specific Notes

### P1 온보딩

- Full cream canvas, logo wordmark "StoryEcho", 한 줄 카피 "매일 하나의 질문. 오늘의 이야기, 나중에 다시 읽기."
- Illustration: soft line drawing of open journal (optional, muted terracotta stroke)
- Single primary CTA [시작하기], secondary link for 알림 (1회)

### P2 홈

- Date caption top-left `{typography.caption}` stone color
- Center `question-card` with today's question
- If Echo day: `badge-echo` above card + tap opens P5
- Bottom: `button-primary` [이야기 쓰기] + `button-secondary` [나중에]

### P3 이야기 쓰기

- Question repeated smaller at top (serif, slate)
- `text-area` full width
- Photo grid max 8, `photo-thumbnail` 72px, + button dashed border
- Row: visibility toggles + capsule option (date picker sheet)
- Sticky bottom: [저장] primary

### P5 1년 Echo

- Split view: left `{echo-comparison-panel}` past story (read-only), right current empty or draft
- Divider label "1년 전" | "오늘"
- CTA [새 이야기 쓰기]

### P9 커뮤니티

- Search `text-input` sticky top
- Feed: `story-card` without private stories. nickname + date + question excerpt
- No avatars in MVP — nickname text only

## Do's and Don'ts

### Do

- 질문·이야기 본문에 serif + 넉넉한 line-height 사용
- cream canvas 유지 — pure #FFFFFF 전체 배경 금지
- CTA는 terracotta pill 하나만 강조
- Echo/Capsule/Community 색을 기능에만 쓰기
- 터치 타겟 최소 44px (버튼 48px)
- Free 사용자 광고 영역 예약 — 콘텐츠와 겹치지 않게 padding-bottom

### Don't

- neon, glassmorphism, dark mode 기본 테마 사용 금지 (MVP)
- 질문 영역에 sans-serif만 쓰지 않기 — 저널링 감성 약화
- feed에 좋아요·댓글·팔로우 UI 넣지 않기 (MVP 범위 밖)
- primary terracotta를 대面积 background로 쓰지 않기
- 카드마다 다른 accent 색 남발 금지

## Responsive Behavior

### Breakpoints

| Name        | Width     | Changes                         |
| ----------- | --------- | ------------------------------- |
| Mobile      | < 480px   | Single column, default target   |
| Tablet      | 480–768px | Echo side-by-side if space      |
| Desktop PWA | > 768px   | max-width 480px centered column |

### Touch Targets

- Buttons: 48px min height
- Tab bar items: 44px tap area
- Photo add/remove: 44px hit area

### Collapsing

- Echo comparison: side-by-side → stacked on narrow screens
- Photo grid: 4 columns → 3 on small phones

## Agent Prompt Guide

### Quick Reference

- Background: `{colors.canvas}` (#FAF7F2)
- Primary CTA: `{colors.primary}` (#C4714A) pill
- Question font: Lora / Noto Serif KR, 28px
- UI font: Pretendard / Noto Sans KR
- Card radius: 16px, button radius: pill

### Example Prompts for Stitch

**홈 — 오늘의 질문**

> StoryEcho mobile app home screen. Warm cream background #FAF7F2. Center card with serif question "오늘 가장 기억에 남는 순간은?" in Lora 28px. Terracotta pill button "이야기 쓰기" and outline "나중에". Bottom tab bar: 홈 서랍 커뮤니티 설정. Minimal, calm journaling app. No clutter.

**이야기 쓰기**

> StoryEcho write story screen. Cream background, white textarea with generous padding, photo grid up to 8 thumbnails, toggle pills "나만 보기" / "커뮤니티 공개", optional time capsule date. Sticky terracotta Save button. Korean UI labels.

**1년 Echo 비교**

> StoryEcho Echo comparison screen. Two soft panels side by side — left teal-tint "1년 전" with past story text, right white "오늘" empty or new draft. Warm minimal mobile UI.

**서랍**

> StoryEcho drawer/archive screen. Date-grouped list of private story cards on cream background. Each card shows date, question preview, one line excerpt. Calm diary archive aesthetic.

## Known Gaps

- Dark mode tokens: post-MVP
- Custom app icon / wordmark SVG: separate asset
- Animation: recommend 200ms ease for sheet/modal
- Illustration style for onboarding: line art, terracotta stroke, no stock photos
