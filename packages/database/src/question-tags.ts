/** 질문 태그 key — SSOT: .md/질문.md Tag legend */
export const QUESTION_TAG_KEYS = [
  "memory",
  "experience",
  "emotion",
  "relationship",
  "goal",
  "growth",
  "gratitude",
  "daily",
  "future",
  "self",
  "reflection",
  "hope",
  "place",
  "food",
  "scent",
  "weather",
  "sound",
  "object",
  "echo",
  "timecapsule",
] as const;

export type QuestionTagKey = (typeof QUESTION_TAG_KEYS)[number];

export const QUESTION_TAG_LABELS: Record<QuestionTagKey, string> = {
  memory: "기억",
  experience: "경험",
  emotion: "감정",
  relationship: "관계",
  goal: "목표·버킷",
  growth: "성장",
  gratitude: "감사",
  daily: "일상",
  future: "미래",
  self: "나",
  reflection: "돌아보기",
  hope: "위로·희망",
  place: "장소",
  food: "음식",
  scent: "향",
  weather: "날씨",
  sound: "소리",
  object: "물건",
  echo: "Echo",
  timecapsule: "타임캡슐",
};

export function isQuestionTagKey(value: string): value is QuestionTagKey {
  return (QUESTION_TAG_KEYS as readonly string[]).includes(value);
}

export function parseQuestionTagsQuery(raw: string | undefined): QuestionTagKey[] | null {
  if (!raw?.trim()) return null;
  const keys = raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (keys.length === 0) return null;
  for (const key of keys) {
    if (!isQuestionTagKey(key)) return null;
  }
  return keys as QuestionTagKey[];
}
