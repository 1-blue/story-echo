export const ROUTES = {
  home: { url: "/", label: "홈" },
  app: { url: "/app", label: "오늘의 질문" },
  drawer: { url: "/app/drawer", label: "서랍" },
  capsule: { url: "/app/capsule", label: "타임캡슐" },
  community: { url: "/app/community", label: "커뮤니티" },
  settings: { url: "/app/settings", label: "설정" },
  write: { url: "/app/write", label: "이야기하기" },
  login: { url: "/app/settings/login", label: "로그인" },
  signup: { url: "/app/settings/signup", label: "회원가입" },
  publicStory: { url: "/app/public", label: "공개 이야기" },
} as const;

export const DEFAULT_SITEMAP = {
  changefreq: "weekly" as const,
  priority: 0.8,
};
