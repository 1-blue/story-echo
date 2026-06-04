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
} as const;

export const DEFAULT_SITEMAP = {
  changefreq: "weekly" as const,
  priority: 0.8,
};
