/**
 * Play Store / App Store listing SSOT (한국어).
 * Play Console: 제목·짧은/긴 설명에 붙여넣기 (별도 키워드 필드 없음).
 * App Store: store.config.json → eas metadata:push
 */

export const STORE_URLS = {
  privacyPolicy: "https://thrilling-mapusaurus-f24.notion.site/37ab6aeed4018055a905f26c6ab2741f",
  termsOfService: "https://thrilling-mapusaurus-f24.notion.site/37ab6aeed401805cbdd9d9889446cfd2",
  supportEmail: "mailto:developer98.ninja@gmail.com",
  marketing: "https://story-echo.vercel.app/about",
} as const;

/** 웹 SEO·스토어 검색어 공통 (브랜드 + 핵심 + 기능) */
export const STORE_SEO_KEYWORDS = [
  "이야기해줘",
  "StoryEcho",
  "이야기",
  "일기",
  "질문 일기",
  "매일 질문",
  "오늘의 질문",
  "타임캡슐",
  "Echo",
  "자기성찰",
  "감성 일기",
  "회고",
  "365일 질문",
  "저널링",
  "다이어리",
  "공개 이야기",
  "커뮤니티",
] as const;

/** App Store Connect 숨김 keywords (100자 이내, 쉼표 구분·공백 없음) */
export const APP_STORE_KEYWORDS = [
  "이야기",
  "일기",
  "질문일기",
  "매일질문",
  "오늘의질문",
  "타임캡슐",
  "Echo",
  "자기성찰",
  "감성일기",
  "회고",
  "저널링",
  "다이어리",
  "StoryEcho",
] as const;

export const APP_STORE_KEYWORDS_STRING = APP_STORE_KEYWORDS.join(",");

const FULL_DESCRIPTION = `이야기해줘(StoryEcho)는 매일 하나의 질문을 받고, 원하면 나만의 이야기를 남기는 자기성찰·질문 일기 앱이에요. 답을 쓰지 않아도 괜찮아요. 잠시 멈춰 생각하는 시간만으로도 충분해요.

【이런 분께】
· 매일 짧게 일기·회고를 쓰고 싶은 분
· 감성 일기, 저널링, 다이어리 대신 질문으로 시작하고 싶은 분
· 1년 뒤 같은 질문에 다시 답하며 성장을 비교하고 싶은 분

【핵심 기능】
· 오늘의 질문 — KST 기준 하루에 질문 하나, 365일 질문 아카이브
· 서랍 — 나만 보는 이야기를 모아두고, 검색하고, 다시 읽어요
· 타임캡슐 — 정해진 날까지 봉인된 이야기를 미래의 나에게 전달해요
· 공개 이야기 — 질문에 대한 이야기를 커뮤니티와 나눌 수 있어요
· Echo — 1년 뒤 같은 날짜에 같은 질문을 다시 받고, 과거와 지금을 비교해요

【이야기 규칙】
· 하루에 하나의 질문이 배정돼요. 같은 날, 같은 질문에는 이야기를 하나만 남길 수 있어요.
· 이야기는 질문이 주어진 그날에만 새로 작성할 수 있어요. 날짜가 지나면 수정하거나 삭제만 가능해요.
· 로그인 없이 게스트로 시작할 수 있어요. 공개 글·댓글은 이메일 인증이 필요해요.

질문 일기로 오늘의 나를 기록해 보세요.`;

export const playStoreListing = {
  /** Play Console 앱 이름 (≤30자) */
  title: "이야기해줘 - 질문 일기",
  /** 짧은 설명 (≤80자) */
  shortDescription:
    "매일 하나의 질문으로 이야기를 남기는 자기성찰 일기. 서랍, 타임캡슐, Echo, 커뮤니티.",
  /** 긴 설명 (≤4000자) */
  fullDescription: FULL_DESCRIPTION,
} as const;

export const appStoreListing = {
  title: "이야기해줘",
  subtitle: "매일 질문, 나만의 이야기",
  description: FULL_DESCRIPTION,
  keywords: APP_STORE_KEYWORDS,
  keywordsString: APP_STORE_KEYWORDS_STRING,
  privacyPolicyUrl: STORE_URLS.privacyPolicy,
  supportUrl: STORE_URLS.supportEmail,
  marketingUrl: STORE_URLS.marketing,
} as const;

export const koreanStoreListing = {
  playStore: playStoreListing,
  appStore: appStoreListing,
  seoKeywords: STORE_SEO_KEYWORDS,
} as const;
