export const ROUTES = {
  home: { url: "/", label: "오늘의 질문" },
  drawer: { url: "/drawer", label: "서랍" },
  capsule: { url: "/capsule", label: "타임캡슐" },
  community: { url: "/community", label: "커뮤니티" },
  settings: { url: "/settings", label: "설정" },
  write: { url: "/write", label: "이야기하기" },
  login: { url: "/settings/login", label: "로그인" },
  signup: { url: "/settings/signup", label: "회원가입" },
  publicStory: { url: "/public", label: "공개 이야기" },
  about: { url: "/about", label: "서비스 소개" },
  questions: { url: "/questions", label: "질문 모아보기" },
  privacyPolicy: {
    url: "https://thrilling-mapusaurus-f24.notion.site/37ab6aeed4018055a905f26c6ab2741f",
    label: "개인정보처리방침",
    external: true,
  },
  termsOfService: {
    url: "https://thrilling-mapusaurus-f24.notion.site/37ab6aeed401805cbdd9d9889446cfd2",
    label: "서비스 이용약관",
    external: true,
  },
  openKakao: {
    url: "https://open.kakao.com/o/prZWLQyi",
    label: "오픈카톡방",
    external: true,
  },
  contact: {
    url: "mailto:developer98.ninja@gmail.com",
    label: "문의하기",
    external: true,
  },
} as const;

export function questionDetailRoute(id: string) {
  return { url: `/questions/${id}`, label: "질문 상세" } as const;
}

export const SETTINGS_INFO_ROUTES = [
  ROUTES.about,
  ROUTES.questions,
  ROUTES.privacyPolicy,
  ROUTES.termsOfService,
  ROUTES.openKakao,
  ROUTES.contact,
] as const;

export function openRoute(url: string) {
  if (url.startsWith("mailto:")) {
    window.location.href = url;
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

export const DEFAULT_SITEMAP = {
  changefreq: "weekly" as const,
  priority: 0.8,
};
