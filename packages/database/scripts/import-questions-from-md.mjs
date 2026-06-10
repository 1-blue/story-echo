/**
 * .cursor/질문-365.md → questions.data 월별 TS + assignments.json
 * node packages/database/scripts/import-questions-from-md.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const MD_PATH = join(ROOT, ".cursor/질문-365.md");
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "../src/seeds/questions.data");

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const MONTH_THEMES = {
  1: ["newyear", "goal", "reflection", "memory", "daily", "hope"],
  2: ["relationship", "winter", "memory", "daily", "self"],
  3: ["spring", "growth", "daily", "routine", "nature", "self"],
  4: ["spring", "daily", "relationship", "hobby", "nature", "hope"],
  5: ["spring", "daily", "relationship", "hobby", "nature", "future"],
  6: ["summer", "body", "activity", "daily", "nature"],
  7: ["summer", "body", "activity", "travel", "daily"],
  8: ["summer", "body", "activity", "music", "relationship"],
  9: ["autumn", "work", "change", "reflection", "daily"],
  10: ["autumn", "work", "change", "reflection", "gratitude"],
  11: ["gratitude", "forgiveness", "solitude", "memory", "relationship"],
  12: ["echo", "future", "gratitude", "hope", "timecapsule", "reflection"],
};

const TAG_RULES = [
  ["echo", /1년|작년 이맘|타임캡슐|Echo|같은 질문|1년 뒤|1년 전|미래의 나에게|훗날의 나/],
  ["timecapsule", /타임캡슐|봉인|편지를|서랍에 남/],
  ["newyear", /올해|새해|내년|다짐|목표/],
  ["goal", /목표|꿈|버킷|10년|5년|노후/],
  ["spring", /봄|꽃|새싹|햇살|피는/],
  ["summer", /여름|더위|바다|시원/],
  ["autumn", /가을|단풍|선선/],
  ["winter", /겨울|눈 오|차가|추억 속/],
  ["nature", /계절|바람|하늘|자연|풍경|날씨|창밖|바다|산/],
  ["relationship", /친구|가족|연애|사랑|사람|부모|함께|연락|이별/],
  ["gratitude", /고마|감사|감동/],
  ["forgiveness", /용서|후회|미안|실수/],
  ["solitude", /외로|고독|혼자/],
  ["daily", /오늘|하루|루틴|아침|저녁|주말|잠들/],
  ["routine", /루틴|습관|매일|의식/],
  ["body", /몸|운동|건강|산책|춤|피곤|수면/],
  ["activity", /운동|활동|여행|모험/],
  ["music", /음악|노래|가사|콘서트|악기/],
  ["work", /일|학업|퇴근|하교|업무|동료|직업/],
  ["hope", /희망|괜찮|위로|믿/],
  ["memory", /추억|어릴|과거|옛날|학창|사진|기억/],
  ["future", /미래|내년|10년|5년|상상|꿈/],
  ["self", /나다움|강점|자신|표현|나는 어떤/],
  ["growth", /성장|배우|도전|용기|깨달/],
  ["anxiety", /불안|걱정|스트레스|두려/],
  ["reflection", /돌아보|의미|가치|깨달|변화/],
  ["food", /음식|먹/],
  ["home", /집|방|공간/],
];

/** month-day → md question number (1-based) */
const FIXED_ANCHORS = {
  "1-1": 1,
  "1-2": 10,
  "2-14": 212,
  "3-1": 45,
  "3-20": 131,
  "4-1": 335,
  "4-15": 132,
  "5-5": 135,
  "6-1": 77,
  "7-1": 340,
  "8-15": 169,
  "9-1": 47,
  "10-1": 356,
  "11-11": 86,
  "12-1": 68,
  "12-15": 188,
  "12-24": 349,
  "12-25": 350,
  "12-26": 351,
  "12-27": 360,
  "12-28": 361,
  "12-29": 362,
  "12-30": 364,
  "12-31": 365,
};

function parseQuestions(md) {
  const questions = [];
  for (const line of md.split("\n")) {
    const m = line.match(/^(\d+)\.\s+(.+)$/);
    if (m) questions.push({ num: +m[1], text: m[2].trim() });
  }
  if (questions.length !== 365) {
    throw new Error(`Expected 365 questions, got ${questions.length}`);
  }
  return questions;
}

function tagQuestion(text) {
  const tags = new Set();
  for (const [tag, re] of TAG_RULES) {
    if (re.test(text)) tags.add(tag);
  }
  if (tags.size === 0) tags.add("daily");
  return [...tags];
}

function scoreMatch(questionTags, monthThemes) {
  let score = 0;
  for (const t of questionTags) {
    const idx = monthThemes.indexOf(t);
    if (idx >= 0) score += monthThemes.length - idx;
    if (monthThemes.includes(t)) score += 2;
  }
  return score;
}

function dayOfYear(month, day) {
  let doy = day;
  for (let i = 0; i < month - 1; i++) doy += DAYS_IN_MONTH[i];
  return doy;
}

function buildAssignments(questions) {
  const tagged = questions.map((q) => ({ ...q, tags: tagQuestion(q.text) }));
  const assignments = {};
  const used = new Set();

  for (const [key, num] of Object.entries(FIXED_ANCHORS)) {
    assignments[key] = num;
    used.add(num);
  }

  const slots = [];
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= DAYS_IN_MONTH[month - 1]; day++) {
      const key = `${month}-${day}`;
      if (!assignments[key]) slots.push({ month, day, key, themes: MONTH_THEMES[month] });
    }
  }

  for (const slot of slots) {
    let best = null;
    let bestScore = -1;
    for (const q of tagged) {
      if (used.has(q.num)) continue;
      const s = scoreMatch(q.tags, slot.themes);
      if (s > bestScore) {
        bestScore = s;
        best = q;
      }
    }
    if (!best) {
      best = tagged.find((q) => !used.has(q.num));
    }
    if (!best) throw new Error(`No question left for slot ${slot.key}`);
    assignments[slot.key] = best.num;
    used.add(best.num);
  }

  if (used.size !== 365) throw new Error(`Assignment incomplete: ${used.size}/365`);
  return assignments;
}

function generateMonthFiles(questions, assignments) {
  mkdirSync(OUT_DIR, { recursive: true });

  const byNum = new Map(questions.map((q) => [q.num, q.text]));

  for (let month = 1; month <= 12; month++) {
    const days = DAYS_IN_MONTH[month - 1];
    const lines = [];
    for (let day = 1; day <= days; day++) {
      const num = assignments[`${month}-${day}`];
      const text = byNum.get(num);
      if (!text) throw new Error(`Missing text for question #${num}`);
      lines.push(`  { month: ${month}, day: ${day}, text: ${JSON.stringify(text)} },`);
    }
    const themeNote =
      month === 1
        ? "새해·고요"
        : month === 12
          ? "마무리·Echo"
          : month <= 2
            ? "겨울"
            : month <= 5
              ? "봄"
              : month <= 8
                ? "여름"
                : month <= 10
                  ? "가을"
                  : "감사·회고";
    const fileName = `${String(month).padStart(2, "0")}-${MONTH_NAMES[month - 1]}.ts`;
    writeFileSync(
      join(OUT_DIR, fileName),
      `/** ${month}월 — ${days}일 (${themeNote}) */\nexport const MONTH_${month}_SEEDS = [\n${lines.join("\n")}\n] as const;\n`,
      "utf8",
    );
  }

  const indexContent = `import { assertQuestionSeedsValid, questionIdForMonthDay } from "../../question-calendar";
import type { QuestionSeed } from "../types";
${Array.from({ length: 12 }, (_, i) => {
  const m = i + 1;
  return `import { MONTH_${m}_SEEDS } from "./${String(m).padStart(2, "0")}-${MONTH_NAMES[i]}";`;
}).join("\n")}

const RAW = [
${Array.from({ length: 12 }, (_, i) => `  ...MONTH_${i + 1}_SEEDS,`).join("\n")}
];

export const QUESTION_SEEDS: QuestionSeed[] = RAW.map((row) => ({
  id: questionIdForMonthDay(row.month, row.day),
  text: row.text,
  month: row.month,
  day: row.day,
}));

assertQuestionSeedsValid(QUESTION_SEEDS);
`;
  writeFileSync(join(OUT_DIR, "index.ts"), indexContent, "utf8");
}

const md = readFileSync(MD_PATH, "utf8");
const questions = parseQuestions(md);
const assignments = buildAssignments(questions);

writeFileSync(
  join(OUT_DIR, "assignments.json"),
  JSON.stringify(assignments, null, 2) + "\n",
  "utf8",
);

generateMonthFiles(questions, assignments);

console.log(`Imported 365 questions from ${MD_PATH}`);
console.log(`Wrote assignments.json + 12 month files + index.ts`);
