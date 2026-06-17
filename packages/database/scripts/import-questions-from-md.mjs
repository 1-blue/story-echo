/**
 * .md/질문.md → questions.data 월별 TS
 * node packages/database/scripts/import-questions-from-md.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const MD_PATH = join(ROOT, ".md/질문.md");
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

const VALID_TAGS = new Set([
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
]);

function monthDayFromDayOfYear(doy) {
  if (doy < 1 || doy > 365) throw new Error(`Invalid day of year: ${doy}`);
  let remaining = doy;
  for (let month = 1; month <= 12; month += 1) {
    const days = DAYS_IN_MONTH[month - 1];
    if (remaining <= days) return { month, day: remaining };
    remaining -= days;
  }
  throw new Error(`Invalid day of year: ${doy}`);
}

function parseQuestions(md) {
  const questions = [];
  const texts = new Set();

  for (const line of md.split("\n")) {
    const m = line.match(/^(\d+)\.\s*\[([\w,]+)\]\s*(.+)$/);
    if (!m) continue;

    const num = +m[1];
    const tags = m[2].split(",").map((t) => t.trim()).filter(Boolean);
    const text = m[3].trim();

    if (tags.length < 1 || tags.length > 3) {
      throw new Error(`Question #${num}: expected 1-3 tags, got ${tags.length}`);
    }
    for (const tag of tags) {
      if (!VALID_TAGS.has(tag)) throw new Error(`Question #${num}: invalid tag "${tag}"`);
    }
    if (text.length < 8) throw new Error(`Question #${num}: text too short`);
    if (texts.has(text)) throw new Error(`Duplicate text at #${num}`);
    texts.add(text);

    const { month, day } = monthDayFromDayOfYear(num);
    questions.push({ num, month, day, tags, text });
  }

  if (questions.length !== 365) {
    throw new Error(`Expected 365 questions, got ${questions.length}`);
  }

  return questions;
}

function formatSeedRow(row) {
  const tagsJson = JSON.stringify(row.tags);
  return `  { month: ${row.month}, day: ${row.day}, text: ${JSON.stringify(row.text)}, tags: ${tagsJson} },`;
}

function generateMonthFiles(questions) {
  mkdirSync(OUT_DIR, { recursive: true });

  const byMonth = new Map();
  for (const q of questions) {
    if (!byMonth.has(q.month)) byMonth.set(q.month, []);
    byMonth.get(q.month).push(q);
  }

  for (let month = 1; month <= 12; month++) {
    const days = DAYS_IN_MONTH[month - 1];
    const rows = byMonth.get(month) ?? [];
    if (rows.length !== days) {
      throw new Error(`Month ${month}: expected ${days} questions, got ${rows.length}`);
    }

    const lines = rows.sort((a, b) => a.day - b.day).map(formatSeedRow);
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
  tags: [...row.tags],
}));

assertQuestionSeedsValid(QUESTION_SEEDS);
`;
  writeFileSync(join(OUT_DIR, "index.ts"), indexContent, "utf8");
}

const md = readFileSync(MD_PATH, "utf8");
const questions = parseQuestions(md);
generateMonthFiles(questions);

console.log(`Imported 365 questions from ${MD_PATH}`);
console.log(`Wrote 12 month files + index.ts`);
