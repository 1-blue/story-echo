/**
 * questions.data 월별 TS 파일 생성 (1회성·재실행 가능)
 * node packages/database/scripts/generate-questions-data.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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

const CORE = [
  "오늘 가장 기억에 남는 순간은?",
  "오늘 나를 웃게 만든 것은?",
  "오늘 감사한 사람 한 명은?",
  "오늘 나에게 해주고 싶은 말은?",
  "오늘 새롭게 배운 것이 있다면?",
  "오늘의 나를 한 단어로 표현한다면?",
  "오늘 누군가에게 전하고 싶은 말은?",
  "오늘 내 마음의 날씨는?",
  "오늘 작은 성취 하나는?",
  "오늘 가장 행복했던 5분은?",
  "오늘 아쉬웠던 점은?",
  "지금 이 순간 가장 필요한 것은?",
  "오늘 나를 성장시킨 경험은?",
  "오늘 가장 많이 느낀 감정은?",
  "오늘 놓치지 않아서 다행인 것은?",
  "오늘 가장 편안했던 순간은?",
  "오늘 용기를 냈던 일이 있나요?",
  "오늘 가장 맛있었던 것은?",
  "오늘 내가 사랑받고 있다고 느낀 순간은?",
  "오늘 가장 아름다웠던 장면은?",
  "오늘 나를 자랑스럽게 만든 행동은?",
  "오늘 처음 해본 것이 있나요?",
  "오늘 가장 고마웠던 순간은?",
  "오늘 내가 누군가에게 준 것은?",
  "오늘 나를 설레게 한 것은?",
  "오늘 가장 소중하게 여긴 것은?",
  "오늘 가장 많이 웃은 이유는?",
  "오늘 가장 따뜻했던 순간은?",
  "오늘 가장 집중했던 순간은?",
  "오늘 내가 느낀 연결감은?",
  "오늘 가장 듣고 싶은 말은?",
  "오늘 하루를 색깔로 표현한다면?",
  "오늘 가장 만족스러웠던 일은?",
  "오늘 나를 위로해준 것은?",
  "오늘 가장 오래 기억하고 싶은 대화는?",
  "오늘 가장 평화로웠던 순간은?",
  "오늘 나를 놀라게 한 것은?",
  "오늘 가장 필요했던 휴식은?",
  "오늘 내가 진심으로 원하는 것은?",
  "오늘 하루를 한 문장으로 요약한다면?",
  "오늘 가장 의미 있었던 선택은?",
  "오늘 내가 스스로에게 인정해주고 싶은 것은?",
  "오늘 가장 그리웠던 사람이나 장소는?",
  "오늘 내가 느낀 자유로움은?",
  "오늘 가장 배려받았다고 느낀 순간은?",
  "내일의 나에게 오늘의 한마디를 남긴다면?",
  "오늘 바깥에서 본 나는 어떤 사람 같았나요?",
  "요즘 마음에 남는 영화·책·음악이 있나요?",
  "오늘 나를 편안하게 해준 장소나 순간은?",
  "지금 마음에 두는 작은 목표가 있나요?",
  "그때의 나에게 지금 건네고 싶은 말은?",
  "최근 나를 웃게 한 일이 떠오르나요?",
  "오늘 조용히 혼자만의 시간을 보냈나요?",
  "오늘 몸이 보내는 신호는 무엇이었나요?",
  "오늘 창밖 풍경이 전해준 느낌은?",
  "오늘 나를 지친하게 한 것은?",
  "오늘 미루었던 일, 그 이유는?",
  "오늘 가장 많은 시간을 쓴 것은?",
  "오늘 하루를 영화 제목으로 짓는다면?",
  "오늘 가장 많이 생각한 주제는?",
  "오늘 내가 변화시킨 것은?",
  "오늘 가장 필요했던 용기는?",
  "오늘 나를 차분하게 만든 것은?",
  "오늘 작은 친절을 받았나요?",
  "오늘 작은 친절을 건넸나요?",
  "오늘의 나에게 어제의 조언을 한다면?",
  "오늘 하루를 다시 살 수 있다면 바꾸고 싶은 것은?",
  "오늘 가장 조용했던 순간, 무엇을 생각했나요?",
  "오늘 내가 포기한 것과 선택한 것은?",
  "오늘 내가 두려워했던 것은?",
  "오늘 내가 변화하고 싶은 습관은?",
  "오늘 가장 기대되는 내일의 한 가지는?",
];

const SEASONAL = [
  [], // jan - handled below
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
];

const MONTH_EXTRA = {
  1: [
    "새해 첫날, 마음에 새기고 싶은 말은?",
    "겨울 아침, 오늘의 작은 다짐은?",
    "차가운 공기 속에서 느낀 감정은?",
    "올해 나에게 바라는 한 가지는?",
    "따뜻한 실내에서 머문 시간은?",
  ],
  2: [
    "짧은 겨울 날, 나를 녹여준 것은?",
    "바람 부는 날, 마음은 어디에 있었나요?",
    "연말의 여운처럼 남은 감정은?",
  ],
  3: [
    "봄기운이 느껴지는 순간이 있었나요?",
    "새로운 시작을 떠올리게 한 것은?",
    "햇살 아래 걸으며 생각한 것은?",
  ],
  4: [
    "꽃피는 계절, 마음도 함께 피웠나요?",
    "가벼운 기대를 품게 한 일은?",
    "봄비 뒤 맑아진 하늘을 보며 느낀 것은?",
  ],
  5: [
    "초여름 바람, 어디로 가고 싶었나요?",
    "활력을 주었던 사람이나 장소는?",
    "녹음이 짙어지는 길에서 생각한 것은?",
  ],
  6: [
    "긴 낮, 오늘 가장 밝았던 순간은?",
    "여름 초입, 나를 설레게 한 것은?",
    "시원한 것이 필요했던 순간은?",
  ],
  7: [
    "한여름, 더위 속에서도 좋았던 것은?",
    "휴식이 필요했던 이유는?",
    "밤하늘을 보며 떠올린 것은?",
  ],
  8: [
    "여름밤, 바람이 전해준 느낌은?",
    "친구·가족과 나눈 따뜻한 순간은?",
    "바다·강·호수를 떠올리게 한 것은?",
  ],
  9: [
    "가을빛이 스며든 순간이 있었나요?",
    "변화를 느끼게 한 작은 일은?",
    "돌아보게 만든 하루의 장면은?",
  ],
  10: [
    "선선한 공기, 마음은 어땠나요?",
    "취향을 다시 발견한 것이 있나요?",
    "책·음악·영화가 건네준 말은?",
  ],
  11: [
    "늦가을, 그리움이 스친 순간은?",
    "정리하고 싶어진 것이 있나요?",
    "고마움을 전하고 싶은 사람은?",
  ],
  12: [
    "연말 분위기, 마음은 어디에 있었나요?",
    "올해를 돌아보며 고마웠던 것은?",
    "내년의 나에게 건네고 싶은 말은?",
    "한 해의 마무리, 오늘의 색은?",
  ],
};

function dayOfYear(month, day) {
  let doy = day;
  for (let i = 0; i < month - 1; i++) doy += DAYS_IN_MONTH[i];
  return doy;
}

function questionId(doy) {
  return `10000000-0000-4000-8000-${doy.toString(16).padStart(12, "0")}`;
}

function pickText(month, day) {
  const doy = dayOfYear(month, day);
  const extras = MONTH_EXTRA[month] ?? [];
  const pool = [...CORE, ...extras];
  let text = pool[(doy * 17 + month * 31 + day) % pool.length];
  const used = new Set();
  let attempt = 0;
  while (used.has(text) && attempt < pool.length) {
    text = pool[(doy + attempt * 13) % pool.length];
    attempt++;
  }
  if (used.has(text)) {
    text = `오늘 하루, ${month}월 ${day}일의 나는 어떤가요?`;
  }
  return text;
}

const allTexts = new Set();
const outDir = join(dirname(fileURLToPath(import.meta.url)), "../src/seeds/questions.data");
mkdirSync(outDir, { recursive: true });

for (let month = 1; month <= 12; month++) {
  const days = DAYS_IN_MONTH[month - 1];
  const lines = [];
  for (let day = 1; day <= days; day++) {
    const doy = dayOfYear(month, day);
    let text = pickText(month, day);
    let suffix = 0;
    while (allTexts.has(text)) {
      suffix++;
      text = `${pickText(month, day).replace(/\?$/, "")} (${suffix})?`;
    }
    allTexts.add(text);
    lines.push(`  { month: ${month}, day: ${day}, text: ${JSON.stringify(text)} },`);
  }

  const fileName = `${String(month).padStart(2, "0")}-${MONTH_NAMES[month - 1]}.ts`;
  const content = `/** ${month}월 — ${days}일 */\nexport const MONTH_${month}_SEEDS = [\n${lines.join("\n")}\n] as const;\n`;
  writeFileSync(join(outDir, fileName), content, "utf8");
}

const indexContent = `import type { QuestionSeed } from "../types";
import {
  assertQuestionSeedsValid,
  questionIdForMonthDay,
} from "../../question-calendar";
${Array.from({ length: 12 }, (_, i) => {
  const m = i + 1;
  const name = MONTH_NAMES[i];
  return `import { MONTH_${m}_SEEDS } from "./${String(m).padStart(2, "0")}-${name}";`;
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

writeFileSync(join(outDir, "index.ts"), indexContent, "utf8");
console.log(`Generated 12 month files + index.ts (${allTexts.size} unique texts)`);
