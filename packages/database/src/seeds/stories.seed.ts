import { QUESTION_SEEDS } from "./questions.data";
import type { SeedFn } from "./types";

const DAYS_BACK = 380;
const STORY_ID_PREFIX = "20000001-0000-4000-8000-";

const BODY_SNIPPETS = [
  "아침에 창밖을 바라보니 하늘이 유난히 맑았다. 그 순간 마음이 조용히 가라앉았다.",
  "오늘은 평소보다 천천히 걸었다. 작은 것들이 더 선명하게 느껴졌다.",
  "따뜻한 차 한 잔과 함께 하루를 정리했다. 생각이 정리되는 시간이 필요했다.",
  "오랜만에 연락한 친구와 짧게 통화했다. 짧았지만 마음이 한결 가벼워졌다.",
  "책 한 페이지를 읽다가 문장 하나에 오래 머물렀다. 나에게 필요한 말이었다.",
  "저녁 노을을 보며 오늘의 감정을 돌아봤다. 복잡했지만 괜찮은 하루였다.",
  "작은 실수가 있었지만, 스스로를 너무 탓하지 않기로 했다.",
  "산책길에서 들은 새소리가 유난히 크게 들렸다. 계절이 바뀌고 있구나 싶었다.",
  "오늘은 조용히 혼자만의 시간을 보냈다. 그 시간이 나를 다시 채워주었다.",
  "감사한 마음을 적어보니 생각보다 많은 것들이 있었다.",
  "바쁜 하루였지만, 잠시 멈춰 숨을 고르는 순간이 있었다.",
  "오늘의 나는 어제보다 조금 더 솔직해진 것 같다.",
  "따뜻한 말 한마디가 하루 전체를 바꿔놓았다.",
  "별일 없는 하루였지만, 그 평범함이 고맙게 느껴졌다.",
  "내일은 조금 더 나은 선택을 해보고 싶다는 생각이 들었다.",
];

function storyIdFor(sequence: number): string {
  return `${STORY_ID_PREFIX}${sequence.toString(16).padStart(12, "0")}`;
}

/** 결정론적 0~1 난수 (시드 재실행 시 동일 분포) */
function unitRandom(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

function storiesPerDay(dayOffset: number): number {
  const roll = unitRandom(dayOffset);

  if (roll < 0.12) return 0;
  if (roll < 0.52) return 1;
  if (roll < 0.82) return 2;
  return 3;
}

function pickQuestionId(dayOffset: number, index: number): string {
  const questionIndex = (dayOffset + index * 7) % QUESTION_SEEDS.length;
  return QUESTION_SEEDS[questionIndex]!.id;
}

function pickBody(dayOffset: number, index: number): string {
  const snippetIndex = (dayOffset * 3 + index) % BODY_SNIPPETS.length;
  const dayLabel = dayOffset === 0 ? "오늘" : `${dayOffset}일 전`;
  return `[${dayLabel}] ${BODY_SNIPPETS[snippetIndex]}`;
}

function atUtcNoon(daysAgo: number, minuteOffset: number): Date {
  const date = new Date();
  date.setUTCHours(12, minuteOffset % 60, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
}

type StorySeedRow = {
  id: string;
  userId: string;
  questionId: string;
  bodyText: string;
  photoUrls: string[];
  visibility: "private";
  isCapsule: false;
  isCapsuleActive: false;
  isBookmarked: boolean;
  createdAt: Date;
};

function buildStoryRows(userId: string): StorySeedRow[] {
  const rows: StorySeedRow[] = [];
  let sequence = 0;

  for (let dayOffset = DAYS_BACK; dayOffset >= 0; dayOffset -= 1) {
    const count = storiesPerDay(dayOffset);

    for (let index = 0; index < count; index += 1) {
      sequence += 1;
      const bookmarkRoll = unitRandom(dayOffset * 100 + index + 5000);

      rows.push({
        id: storyIdFor(sequence),
        userId,
        questionId: pickQuestionId(dayOffset, index),
        bodyText: pickBody(dayOffset, index),
        photoUrls: [],
        visibility: "private",
        isCapsule: false,
        isCapsuleActive: false,
        isBookmarked: bookmarkRoll < 0.14,
        createdAt: atUtcNoon(dayOffset, sequence),
      });
    }
  }

  return rows;
}

const CHUNK_SIZE = 200;

export const seedStories: SeedFn = async (ctx) => {
  const userId = ctx.adminUserId;
  if (!userId) {
    throw new Error("[stories] adminUserId 없음 — seedUsers를 먼저 실행하세요");
  }

  const rows = buildStoryRows(userId);

  const deleted = await ctx.prisma.story.deleteMany({ where: { userId } });

  for (let offset = 0; offset < rows.length; offset += CHUNK_SIZE) {
    const chunk = rows.slice(offset, offset + CHUNK_SIZE);
    await ctx.prisma.story.createMany({ data: chunk, skipDuplicates: true });
  }

  const activeDays = new Set(rows.map((row) => row.createdAt.toISOString().slice(0, 10))).size;
  const bookmarked = rows.filter((row) => row.isBookmarked).length;

  console.log(
    `[stories] ${rows.length}건 생성 (관리자, ${DAYS_BACK + 1}일 범위, 활동일 ${activeDays}일, 북마크 ${bookmarked}건, 기존 시드 ${deleted.count}건 삭제)`,
  );
  console.log("[stories] 잔디 UI 확인: 관리자로 로그인 후 /app/drawer");
};
