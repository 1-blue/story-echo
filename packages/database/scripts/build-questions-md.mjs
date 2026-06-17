/**
 * StoryEcho 365 일일 질문 → .md/질문.md 생성
 * node packages/database/scripts/build-questions-md.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const OUT_PATH = join(ROOT, ".md/질문.md");

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

/** @type {{ tags: string[], text: string }[]} */
const FIXED_FIRST_38 = [
  { tags: ["memory"], text: "기억에 남는 하루에 대해 이야기해주세요" },
  {
    tags: ["goal", "experience"],
    text: "버킷리스트 중 이뤘던 것 가운데 기억에 남는 것에 대해 이야기해주세요",
  },
  {
    tags: ["growth", "reflection"],
    text: "당신의 가치관이 바뀌게 된 사건에 대해 이야기해주세요",
  },
  {
    tags: ["emotion"],
    text: "당신은 지금 행복한가요? 지금의 마음을 이야기해주세요",
  },
  { tags: ["goal"], text: "올해의 목표에 대해 이야기해주세요" },
  {
    tags: ["goal", "experience"],
    text: "목표를 이뤄서 기억에 남는 순간에 대해 이야기해주세요",
  },
  { tags: ["goal"], text: "올해 꼭 해보고 싶은 일에 대해 이야기해주세요" },
  {
    tags: ["relationship", "hope"],
    text: "누군가에게 위로받았던 순간에 대해 이야기해주세요",
  },
  {
    tags: ["relationship", "memory"],
    text: "오랜 친구와의 추억에 대해 이야기해주세요",
  },
  {
    tags: ["relationship", "experience"],
    text: "낯선 사람에게 친절을 받았던 기억에 대해 이야기해주세요",
  },
  {
    tags: ["memory", "place"],
    text: "특정 장소와 연결된 기억에 대해 이야기해주세요",
  },
  {
    tags: ["memory", "scent"],
    text: "특정 향기와 연결된 기억에 대해 이야기해주세요",
  },
  {
    tags: ["memory", "food"],
    text: "특정 음식과 연결된 기억에 대해 이야기해주세요",
  },
  {
    tags: ["memory", "weather"],
    text: "눈 오는 날의 기억에 대해 이야기해주세요",
  },
  {
    tags: ["relationship", "self"],
    text: "친구들은 당신을 어떤 사람이라고 말하나요? 그 말을 떠올려 이야기해주세요",
  },
  {
    tags: ["relationship"],
    text: "당신이 좋아하는 사람들의 특징은 어떤 게 있는지 이야기해주세요",
  },
  {
    tags: ["gratitude", "relationship"],
    text: "지금 고마운 사람 한 명을 떠올릴 수 있나요? 왜 고마운지 이야기해주세요",
  },
  {
    tags: ["relationship", "emotion"],
    text: "사랑하거나 좋아하는 사람에게 하고 싶은 말이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["emotion", "experience"],
    text: "최근에 웃었던 기억에 대해 이야기해주세요",
  },
  {
    tags: ["self", "emotion"],
    text: "혼자 있을 때의 나와 다른 사람 앞의 나, 어떤 차이가 있나요? 그 차이를 이야기해주세요",
  },
  {
    tags: ["emotion", "memory"],
    text: "사람들 사이에서도 외로웠던 기억에 대해 이야기해주세요",
  },
  {
    tags: ["growth", "experience"],
    text: "책이나 사람에게서 받은 기억에 남는 조언이 있나요? 그 조언을 이야기해주세요",
  },
  {
    tags: ["hope", "growth"],
    text: "다시 시작하고 싶은 것이 있나요? 왜 그런지 이야기해주세요",
  },
  {
    tags: ["daily"],
    text: "요즘 하루는 보통 어떻게 흘러가나요? 요즘의 루틴을 이야기해주세요",
  },
  {
    tags: ["daily", "reflection"],
    text: "당신의 하루를 한 문장으로 표현한다면 무엇인가요? 그 문장을 고른 이유를 이야기해주세요",
  },
  {
    tags: ["daily", "emotion"],
    text: "오늘 하루를 한 단어로 표현한다면 무엇인가요? 그 단어를 고른 이유를 이야기해주세요",
  },
  {
    tags: ["growth", "experience"],
    text: "최근에 어떤 도전을 했는지 이야기해주세요",
  },
  { tags: ["growth"], text: "요즘 배우고 있는 것에 대해 이야기해주세요" },
  {
    tags: ["growth", "reflection"],
    text: "후회했지만 그 덕분에 성장했다고 느낀 경험이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["growth", "experience"],
    text: "용기를 내야 했던 순간이 있었나요? 그때의 순간을 이야기해주세요",
  },
  {
    tags: ["hope", "relationship"],
    text: "누군가에게 용기를 받았던 적이 있나요? 그때의 순간을 이야기해주세요",
  },
  {
    tags: ["emotion", "daily"],
    text: "요즘 머릿속에서 가장 많이 했던 생각은 무엇인가요? 그 생각을 이야기해주세요",
  },
  {
    tags: ["emotion", "experience"],
    text: "최근에 행복했던 순간이 있었나요? 그때의 순간을 이야기해주세요",
  },
  {
    tags: ["memory", "weather"],
    text: "좋아하는 계절이 있나요? 그 계절과 연결된 기억을 이야기해주세요",
  },
  {
    tags: ["emotion", "hope"],
    text: "생각만 해도 행복해지는 것은 어떤 게 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["daily", "hope"],
    text: "휴식이 되는 것은 어떤 게 있나요? 그것이 왜 쉬게 하는지 이야기해주세요",
  },
  {
    tags: ["emotion", "self"],
    text: "당신이 진심으로 좋아하는 것은 무엇인가요? 그것을 이야기해주세요",
  },
  {
    tags: ["growth", "experience"],
    text: "결국 해냈던 이야기를 해주세요",
  },
];

/** 39–59 Feb: relationship, winter memory, hope */
const FEB = [
  {
    tags: ["relationship", "memory", "weather"],
    text: "겨울밤에 함께 걸었던 사람이 떠오르나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["hope", "relationship"],
    text: "멀어졌지만 여전히 마음에 남는 사람이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["memory", "weather"],
    text: "추운 날 몸을 녹여준 순간이 있나요? 그때의 기억을 이야기해주세요",
  },
  {
    tags: ["relationship"],
    text: "가족에게 받았던 따뜻한 말이 떠오르나요? 그 말을 이야기해주세요",
  },
  {
    tags: ["hope", "self"],
    text: "지금 품고 있는 작은 기대가 있나요? 그 기대를 이야기해주세요",
  },
  {
    tags: ["relationship", "memory"],
    text: "오래 연락하지 않았지만 생각나는 사람이 있나요? 그 사람과의 기억을 이야기해주세요",
  },
  {
    tags: ["weather", "memory"],
    text: "겨울에 기억에 남는 풍경이 있나요? 그 풍경을 이야기해주세요",
  },
  {
    tags: ["relationship", "gratitude"],
    text: "조용히 곁을 지켜준 사람이 있었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["hope", "reflection"],
    text: "기다림이 의미 있었던 적이 있나요? 그때의 마음을 이야기해주세요",
  },
  {
    tags: ["relationship", "experience"],
    text: "처음 만났을 때의 인상이 아직도 남아 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["memory", "scent"],
    text: "겨울 공기와 함께 기억나는 향이 있나요? 그 향과 연결된 기억을 이야기해주세요",
  },
  {
    tags: ["relationship", "emotion"],
    text: "마음을 편하게 해준 대화가 있었나요? 그 대화를 이야기해주세요",
  },
  {
    tags: ["hope", "future"],
    text: "조금씩 다가오고 있다고 느끼는 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["relationship", "memory"],
    text: "함께 웃었던 겨울의 하루를 떠올릴 수 있나요? 그 하루를 이야기해주세요",
  },
  {
    tags: ["weather", "place"],
    text: "따뜻한 실내로 들어섰던 순간이 기억나나요? 그 장소와 순간을 이야기해주세요",
  },
  {
    tags: ["relationship", "hope"],
    text: "다시 안부를 전하고 싶은 사람이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["memory", "emotion"],
    text: "조용히 위로받았던 겨울의 날이 있나요? 그 날을 이야기해주세요",
  },
  {
    tags: ["relationship", "self"],
    text: "누군가에게서 배운 나만의 방식이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["hope", "experience"],
    text: "어려운 계절을 지나온 기억이 있나요? 그때의 순간을 이야기해주세요",
  },
  {
    tags: ["relationship", "food"],
    text: "함께 나눴던 따뜻한 음식이 떠오르나요? 그 기억을 이야기해주세요",
  },
  {
    tags: ["memory", "hope"],
    text: "겨울 끝자락에 새롭게 시작하고 싶은 마음이 있나요? 그 마음을 이야기해주세요",
  },
];

/** 60–90 Mar: growth, spring */
const MAR = [
  {
    tags: ["growth", "hope"],
    text: "봄기운을 느꼈던 날이 있었나요? 그날의 느낌을 이야기해주세요",
  },
  {
    tags: ["growth", "experience"],
    text: "익숙한 것에서 벗어나 새로 시도했던 경험이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["weather", "memory"],
    text: "햇살이 길어지는 계절에 떠오르는 기억이 있나요? 그 기억을 이야기해주세요",
  },
  {
    tags: ["growth", "reflection"],
    text: "어른이 되면서 달라진 생각이 있나요? 그 변화를 이야기해주세요",
  },
  {
    tags: ["hope", "experience"],
    text: "꽃이 피는 시기를 기다린 적이 있나요? 그때의 마음을 이야기해주세요",
  },
  {
    tags: ["growth", "daily"],
    text: "매일 꾸준히 하고 있는 것이 있나요? 그 습관을 이야기해주세요",
  },
  {
    tags: ["experience", "place"],
    text: "봄날 산책하며 마음이 가벼워졌던 길이 있나요? 그 장소를 이야기해주세요",
  },
  {
    tags: ["growth", "self"],
    text: "아직 찾지 못한 나의 모습이 있나요? 그 모습을 상상하며 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "작년 이맘때와 비교했을 때 달라진 점이 있나요? 그 변화를 이야기해주세요",
  },
  {
    tags: ["growth", "experience"],
    text: "실패에서 배운 교훈이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["weather", "emotion"],
    text: "바람 부는 날 마음이 어디로 향했는지 이야기해주세요",
  },
  {
    tags: ["growth", "hope"],
    text: "처음으로 스스로를 자랑스러워했던 순간이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["experience", "object"],
    text: "오래 간직하고 있는 물건이 있나요? 그 물건과 연결된 이야기를 해주세요",
  },
  {
    tags: ["growth", "reflection"],
    text: "경험이 쌓이면서 바뀐 가치관이 있나요? 그 변화를 이야기해주세요",
  },
  {
    tags: ["daily", "hope"],
    text: "햇살 좋은 날 하고 싶었던 일이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["growth", "experience"],
    text: "끝까지 해냈던 경험이 있나요? 그때의 순간을 이야기해주세요",
  },
  {
    tags: ["hope", "future"],
    text: "언젠가 꼭 가보고 싶은 곳이 있나요? 그곳에 대한 마음을 이야기해주세요",
  },
  {
    tags: ["growth", "emotion"],
    text: "최근에 새롭게 알게 된 것이 있나요? 그 깨달음을 이야기해주세요",
  },
  {
    tags: ["memory", "scent"],
    text: "봄비 뒤 공기와 함께 떠오르는 향이 있나요? 그 기억을 이야기해주세요",
  },
  {
    tags: ["growth", "self"],
    text: "잘하고 있다고 느끼는 영역이 있나요? 그 이유를 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "새싹이 돋는 풍경을 보며 느꼈던 감정이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["growth", "reflection"],
    text: "인생에서 가장 큰 깨달음을 받았던 순간이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["hope", "experience"],
    text: "작은 친절에 마음이 움직였던 적이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["growth", "daily"],
    text: "요즘 빠져 있는 취미가 있나요? 그 취미에 대해 이야기해주세요",
  },
  {
    tags: ["weather", "place"],
    text: "봄에 자주 가고 싶어지는 장소가 있나요? 그 장소를 이야기해주세요",
  },
  {
    tags: ["growth", "experience"],
    text: "익숙함을 벗어난 선택을 한 적이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "책이나 글 중 마음에 남은 한 구절이 있나요? 그 구절을 이야기해주세요",
  },
  {
    tags: ["growth", "hope"],
    text: "언젠가 꼭 해보고 싶은 말 한마디가 있나요? 그 말을 이야기해주세요",
  },
  {
    tags: ["experience", "self"],
    text: "성장했다고 느낀 순간은 언제였나요? 그때의 순간을 이야기해주세요",
  },
  {
    tags: ["emotion", "reflection"],
    text: "계절이 바뀔 때마다 달라지는 기분이 있나요? 그 기분을 이야기해주세요",
  },
  {
    tags: ["growth", "future"],
    text: "시간이 더 주어진다면 무엇을 더 하고 싶나요? 그 마음을 이야기해주세요",
  },
];

/** 91–120 Apr: daily beauty, nature, relationship */
const APR = [
  {
    tags: ["daily", "emotion"],
    text: "최근에 마음이 편안해졌던 하루가 있었나요? 그 하루를 이야기해주세요",
  },
  {
    tags: ["place", "memory"],
    text: "마음이 끌리는 풍경이 있나요? 그곳과 연결된 기억을 이야기해주세요",
  },
  {
    tags: ["relationship", "gratitude"],
    text: "사랑의 형태는 여러 가지라고 느꼈던 순간이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["daily", "place"],
    text: "요즘 자주 가는 장소가 있나요? 그 장소가 주는 느낌을 이야기해주세요",
  },
  {
    tags: ["weather", "memory"],
    text: "꽃이 피는 계절, 마음도 함께 피웠던 기억이 있나요? 그 기억을 이야기해주세요",
  },
  {
    tags: ["relationship", "reflection"],
    text: "관계에서 배운 가장 큰 교훈이 있나요? 그 교훈을 이야기해주세요",
  },
  {
    tags: ["daily", "hope"],
    text: "소소한 행복 하나를 떠올릴 수 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["place", "emotion"],
    text: "자연 속에서 힐링했던 경험이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["relationship", "experience"],
    text: "다른 사람의 이야기에 깊이 공감했던 적이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["daily", "reflection"],
    text: "하루 중 가장 조용한 시간이 있나요? 그 시간에 무엇을 하는지 이야기해주세요",
  },
  {
    tags: ["weather", "place"],
    text: "하늘을 올려다본 마지막 순간을 떠올릴 수 있나요? 그때의 마음을 이야기해주세요",
  },
  {
    tags: ["relationship", "hope"],
    text: "위로가 필요한 사람에게 해주고 싶은 말이 있나요? 그 말을 이야기해주세요",
  },
  {
    tags: ["daily", "food"],
    text: "혼자 먹어도 행복한 메뉴가 있나요? 그 음식에 대해 이야기해주세요",
  },
  {
    tags: ["memory", "place"],
    text: "고향이나 어릴 적 집을 떠올리면 어떤 장면이 보이나요? 그 기억을 이야기해주세요",
  },
  {
    tags: ["relationship", "emotion"],
    text: "좋아하는 사람의 어떤 점이 마음에 드나요? 그 이유를 이야기해주세요",
  },
  {
    tags: ["daily", "weather"],
    text: "봄비 뒤 맑아진 하늘을 보며 느꼈던 감정이 있나요? 그 감정을 이야기해주세요",
  },
  {
    tags: ["relationship", "memory"],
    text: "함께 살고 싶은 공간의 모습을 상상해 본 적이 있나요? 그 모습을 이야기해주세요",
  },
  {
    tags: ["daily", "self"],
    text: "집이나 방이 어떤 상태일 때 마음이 편한가요? 그 이유를 이야기해주세요",
  },
  {
    tags: ["weather", "experience"],
    text: "바람 맞으며 걸으면 어떤 생각이 드나요? 그 생각을 이야기해주세요",
  },
  {
    tags: ["relationship", "gratitude"],
    text: "누군가의 도움으로 버텼던 순간이 있었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["daily", "place"],
    text: "집에서 가장 편안한 공간은 어디인가요? 그 공간에 대해 이야기해주세요",
  },
  {
    tags: ["memory", "weather"],
    text: "어릴 적 가장 좋아했던 계절이 있나요? 그 계절의 기억을 이야기해주세요",
  },
  {
    tags: ["relationship", "experience"],
    text: "다시 만나고 싶은 사람이 있나요? 그 사람과의 기억을 이야기해주세요",
  },
  {
    tags: ["daily", "emotion"],
    text: "요즘 가장 자주 드는 감정이 있나요? 그 감정을 이야기해주세요",
  },
  {
    tags: ["place", "hope"],
    text: "지금 사는 곳에서 좋아하는 점이 있나요? 그 이유를 이야기해주세요",
  },
  {
    tags: ["relationship", "reflection"],
    text: "당신에게 잘하고 있다고 말해 주고 싶은 사람이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["daily", "scent"],
    text: "좋아하는 향이나 냄새가 있나요? 그 향과 연결된 기억을 이야기해주세요",
  },
  {
    tags: ["weather", "memory"],
    text: "창밖 풍경을 바라보며 쉬는 시간이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["relationship", "daily"],
    text: "일상에서 작은 의식 같은 것이 있나요? 그 의식을 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "행운이라고 느낀 순간이 있나요? 그 순간을 이야기해주세요",
  },
];

/** 121–151 May: experience, change, excitement */
const MAY = [
  {
    tags: ["experience", "emotion"],
    text: "당신을 가장 설레게 하는 일이 있나요? 그 일에 대해 이야기해주세요",
  },
  {
    tags: ["experience", "reflection"],
    text: "작은 선택이 큰 변화를 만든 적이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["experience", "hope"],
    text: "초여름 바람을 맞으며 어디로 가고 싶었는지 이야기해주세요",
  },
  {
    tags: ["experience", "relationship"],
    text: "활력을 주었던 사람이나 장소가 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["experience", "memory"],
    text: "처음 해본 일 중 기억에 남는 것이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["growth", "reflection"],
    text: "일상에 작은 변화를 주면 기분이 달라지나요? 그 변화를 이야기해주세요",
  },
  {
    tags: ["experience", "place"],
    text: "녹음이 짙어지는 길을 걸으며 생각했던 것이 있나요? 그 생각을 이야기해주세요",
  },
  {
    tags: ["experience", "hope"],
    text: "상상만 해도 즐거운 장면이 떠오르나요? 그 장면을 이야기해주세요",
  },
  {
    tags: ["growth", "reflection"],
    text: "앞으로 다가올 변화를 떠올릴 때 어떤 마음이 드나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "설레는 마음을 마지막으로 느낀 때가 있나요? 그때의 순간을 이야기해주세요",
  },
  {
    tags: ["experience", "self"],
    text: "나는 무엇에 감동을 받는 사람인가요? 최근에 감동받은 순간을 이야기해주세요",
  },
  {
    tags: ["daily", "reflection"],
    text: "평소와 다르게 하루를 보낸 적이 있나요? 그 하루를 이야기해주세요",
  },
  {
    tags: ["experience", "future"],
    text: "기발한 아이디어를 떠올린 적이 있나요? 그 아이디어를 이야기해주세요",
  },
  {
    tags: ["experience", "relationship"],
    text: "누군가를 응원하고 싶은 마음이 든 적이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["growth", "reflection"],
    text: "포기했지만 아직 마음에 남아 있는 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["experience", "object"],
    text: "작은 선물을 받았을 때 기억나는 것이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "시간이 멈췄으면 하는 순간이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["growth", "reflection"],
    text: "다시 선택한다면 바꾸고 싶은 순간이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["experience", "daily"],
    text: "새로운 것을 시도했던 날이 있었나요? 그날을 이야기해주세요",
  },
  {
    tags: ["experience", "hope"],
    text: "세상이 조금 더 따뜻해졌으면 하는 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["self", "reflection"],
    text: "새로운 이름이나 별명을 지어 본 적이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["experience", "gratitude"],
    text: "작은 선행을 실천한 적이 있나요? 그때의 마음을 이야기해주세요",
  },
  {
    tags: ["experience", "memory"],
    text: "좋아하는 영화나 드라마 장면이 떠오르나요? 왜 기억에 남는지 이야기해주세요",
  },
  {
    tags: ["growth", "reflection"],
    text: "스스로에게 실망했던 순간이 있었나요? 그때의 마음을 이야기해주세요",
  },
  {
    tags: ["experience", "place"],
    text: "걷기만 해도 생각이 정리되는 길이 있나요? 그 길을 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "가장 행복했던 나이를 떠올릴 수 있나요? 그때의 기억을 이야기해주세요",
  },
  {
    tags: ["hope", "reflection"],
    text: "내일부터 시작하고 싶은 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["experience", "relationship"],
    text: "연애에서 배운 것이 있나요? 그 배움을 이야기해주세요",
  },
  {
    tags: ["experience", "self"],
    text: "칭찬받고 싶은 부분이 있나요? 그 이유를 이야기해주세요",
  },
  {
    tags: ["future", "reflection"],
    text: "만약 다른 길을 선택했다면 어떤 모습일까요? 상상하며 이야기해주세요",
  },
  {
    tags: ["experience", "reflection"],
    text: "성취 후 비어 있는 기분을 느낀 적이 있나요? 그 경험을 이야기해주세요",
  },
];

/** 152–181 Jun: body, summer (light) */
const JUN = [
  {
    tags: ["experience", "emotion"],
    text: "긴 낮, 가장 밝았던 순간이 있었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["daily", "experience"],
    text: "운동이나 산책을 하면 기분이 어떻게 달라지나요? 그 느낌을 이야기해주세요",
  },
  {
    tags: ["experience", "self"],
    text: "좋아하는 운동이나 활동이 있나요? 그 활동에 대해 이야기해주세요",
  },
  {
    tags: ["experience", "relationship"],
    text: "함께 운동하고 싶은 사람이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["daily", "experience"],
    text: "몸을 위해 한 일이 있었나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["growth", "daily"],
    text: "건강을 위해서 어떤 노력을 하고 있나요? 그 노력을 이야기해주세요",
  },
  {
    tags: ["experience", "hope"],
    text: "여름 초입, 나를 설레게 한 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["daily", "experience"],
    text: "요즘 몸과 마음을 위해 각각 하고 있는 일이 있나요? 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "최근에 몸이 가벼워졌다고 느낀 적이 있나요? 그때의 순간을 이야기해주세요",
  },
  {
    tags: ["experience", "memory"],
    text: "몸이 기억하는 즐거운 움직임이 있나요? 그 움직임을 이야기해주세요",
  },
  {
    tags: ["daily", "reflection"],
    text: "수면 습관에서 바꾸고 싶은 점이 있나요? 그 이유를 이야기해주세요",
  },
  {
    tags: ["experience", "daily"],
    text: "시원한 것이 필요했던 순간이 있었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "춤추거나 몸을 풀면 기분이 어떤가요? 그 느낌을 이야기해주세요",
  },
  {
    tags: ["daily", "experience"],
    text: "하루 중 기분이 가장 좋은 시간대가 있나요? 그 시간에 무엇을 하는지 이야기해주세요",
  },
  {
    tags: ["experience", "hope"],
    text: "나만의 컨디션 회복 방법이 있다면 무엇인가요? 그 방법을 이야기해주세요",
  },
  {
    tags: ["experience", "reflection"],
    text: "스트레스가 몸에 어떻게 나타나나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["daily", "experience"],
    text: "한여름, 더위 속에서도 좋았던 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["experience", "self"],
    text: "요즘 몸을 많이 쓰고 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "불안할 때 몸은 어떤 반응을 하나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["daily", "experience"],
    text: "저녁 시간을 어떻게 보내고 있나요? 그 시간에 대해 이야기해주세요",
  },
  {
    tags: ["experience", "memory"],
    text: "밤하늘을 보며 떠올린 것이 있나요? 그 생각을 이야기해주세요",
  },
  {
    tags: ["growth", "daily"],
    text: "건강을 위해 줄이려고 노력하는 것이 있나요? 그 노력을 이야기해주세요",
  },
  {
    tags: ["experience", "weather"],
    text: "여름밤, 바람이 전해준 느낌이 있었나요? 그 느낌을 이야기해주세요",
  },
  {
    tags: ["daily", "reflection"],
    text: "내가 지치고 힘들 때 보통 어떻게 행동하나요? 그 방식을 이야기해주세요",
  },
  {
    tags: ["experience", "place"],
    text: "바다나 강, 호수를 떠올리게 한 순간이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["experience", "relationship"],
    text: "친구나 가족과 나눈 따뜻한 순간이 있었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["daily", "emotion"],
    text: "요즘 마음이 무거울 때 어떻게 버티고 있나요? 그 방법을 이야기해주세요",
  },
  {
    tags: ["experience", "hope"],
    text: "힘든 시기에도 지켜진 것이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["experience", "self"],
    text: "스스로를 다독여 준 적이 있나요? 그때의 마음을 이야기해주세요",
  },
  {
    tags: ["daily", "reflection"],
    text: "휴식이 필요했던 이유가 있었나요? 그 이유를 이야기해주세요",
  },
];

/** 182–212 Jul: travel, adventure, mid-year reflection */
const JUL = [
  {
    tags: ["experience", "memory"],
    text: "잊지 못할 여행이 있나요? 그 여행의 기억을 이야기해주세요",
  },
  {
    tags: ["experience", "hope"],
    text: "모험을 떠나고 싶은 마음이 든 적이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["experience", "relationship"],
    text: "혼자 여행을 가 본 적이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "한 해의 중간, 지금까지의 나를 돌아보며 떠오르는 것이 있나요? 이야기해주세요",
  },
  {
    tags: ["experience", "place"],
    text: "처음 도착했을 때 마음이 편해진 장소가 있나요? 그 장소를 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "낯선 곳에서 느꼈던 설렘이 있었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["reflection", "growth"],
    text: "올해 가장 잘한 선택은 무엇인가요? 그 선택에 대해 이야기해주세요",
  },
  {
    tags: ["experience", "sound"],
    text: "여행지에서 기억에 남는 소리가 있나요? 그 소리를 이야기해주세요",
  },
  {
    tags: ["experience", "food"],
    text: "먼 곳에서 먹었던 음식 중 잊지 못하는 것이 있나요? 그 기억을 이야기해주세요",
  },
  {
    tags: ["reflection", "self"],
    text: "지금 이 나이의 장점은 무엇인가요? 그 장점을 이야기해주세요",
  },
  {
    tags: ["experience", "weather"],
    text: "여행 중 만난 날씨가 기억에 남나요? 그날을 이야기해주세요",
  },
  {
    tags: ["experience", "relationship"],
    text: "소중한 시간을 누구와 보내고 싶나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["reflection", "hope"],
    text: "바쁘다고 느끼는 요즘, 진짜 바쁜가요? 그 생각을 이야기해주세요",
  },
  {
    tags: ["experience", "object"],
    text: "여행에서 가져온 물건이 있나요? 그 물건의 이야기를 해주세요",
  },
  {
    tags: ["experience", "memory"],
    text: "길을 잃었을 때 어떻게 선택했나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["reflection", "daily"],
    text: "여유를 갖기 위해 줄이고 싶은 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["experience", "place"],
    text: "다시 가고 싶은 여행지가 있나요? 그곳에 대한 기억을 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "이동하는 시간에 어떤 생각을 하나요? 그 생각을 이야기해주세요",
  },
  {
    tags: ["reflection", "future"],
    text: "지금의 고민이 1년 뒤에는 어떤 이야기가 될까요? 상상하며 이야기해주세요",
  },
  {
    tags: ["experience", "scent"],
    text: "여행지에서 맡았던 향이 기억나나요? 그 향과 연결된 순간을 이야기해주세요",
  },
  {
    tags: ["experience", "hope"],
    text: "지금 할 수 있는 가장 멋진 일은 무엇일까요? 그 일에 대해 이야기해주세요",
  },
  {
    tags: ["reflection", "gratitude"],
    text: "시간이 빨리 간다고 느낀 적이 있나요? 그때의 기억을 이야기해주세요",
  },
  {
    tags: ["experience", "relationship"],
    text: "여행에서 만난 사람이 기억에 남나요? 그 만남을 이야기해주세요",
  },
  {
    tags: ["reflection", "self"],
    text: "스스로와의 약속, 지키고 있나요? 그 약속을 이야기해주세요",
  },
  {
    tags: ["experience", "memory"],
    text: "출퇴근이나 이동 시간에 무엇을 하나요? 그 시간에 대해 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "두려움을 넘어섰을 때 어떤 기분이었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["reflection", "hope"],
    text: "더 나은 삶이란 당신에게 무엇일까요? 그 의미를 이야기해주세요",
  },
  {
    tags: ["experience", "place"],
    text: "창문 밖 풍경을 좋아하나요? 그 풍경에 대해 이야기해주세요",
  },
  {
    tags: ["experience", "daily"],
    text: "매일 같은 길을 걸으며 생각한 적이 있나요? 그 생각을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "어두운 시기를 지나온 경험이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["experience", "hope"],
    text: "상상만 해도 설레는 계획이 있나요? 그 계획을 이야기해주세요",
  },
];

/** 213–243 Aug: music, taste, relationship */
const AUG = [
  {
    tags: ["experience", "sound"],
    text: "기분에 따라 듣는 음악이 달라지나요? 그 음악에 대해 이야기해주세요",
  },
  {
    tags: ["memory", "sound"],
    text: "노래 가사 중 마음에 남은 한 줄이 있나요? 그 가사를 이야기해주세요",
  },
  {
    tags: ["memory", "sound"],
    text: "옛날 들었던 노래를 들으면 어떤 기분인가요? 그 기분을 이야기해주세요",
  },
  {
    tags: ["experience", "sound"],
    text: "악기를 배워 보고 싶은 적이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["memory", "experience"],
    text: "콘서트나 공연을 본 기억이 있나요? 그날을 이야기해주세요",
  },
  {
    tags: ["experience", "sound"],
    text: "하루를 마무리할 때 듣는 음악이 있나요? 그 음악을 이야기해주세요",
  },
  {
    tags: ["memory", "sound"],
    text: "좋아하는 목소리나 웃음소리가 있나요? 그 소리를 이야기해주세요",
  },
  {
    tags: ["food", "memory"],
    text: "위로가 되는 음식이 있나요? 그 음식과 연결된 기억을 이야기해주세요",
  },
  {
    tags: ["experience", "food"],
    text: "처음 먹어 본 맛이 인상 깊었던 적이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["relationship", "food"],
    text: "누군가와 나눴던 식사가 기억에 남나요? 그 식사를 이야기해주세요",
  },
  {
    tags: ["experience", "sound"],
    text: "소리로 기억되는 순간이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["relationship", "experience"],
    text: "다른 사람의 조언을 따랐던 적이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["relationship", "emotion"],
    text: "외로움을 느낀 적이 있나요? 그때 무엇을 했는지 이야기해주세요",
  },
  {
    tags: ["relationship", "hope"],
    text: "누군가에게 위로받고 싶은 마음이 든 적이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["experience", "food"],
    text: "계절 음식과 연결된 기억이 있나요? 그 기억을 이야기해주세요",
  },
  {
    tags: ["relationship", "reflection"],
    text: "1년 뒤 가족과의 관계를 어떻게 이야기하고 싶나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["experience", "sound"],
    text: "비 오는 날 듣고 싶은 소리가 있나요? 그 소리를 이야기해주세요",
  },
  {
    tags: ["relationship", "gratitude"],
    text: "선물을 받거나 줄 때 어떤 기분인가요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["memory", "food"],
    text: "어머니나 가족이 해 주던 음식이 떠오르나요? 그 기억을 이야기해주세요",
  },
  {
    tags: ["relationship", "memory"],
    text: "옛날 사진을 보면 어떤 기분이 드나요? 그 기분을 이야기해주세요",
  },
  {
    tags: ["experience", "sound"],
    text: "조용한 공간에서 들리는 소리가 좋은 적이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["relationship", "self"],
    text: "혼자 있는 시간이 필요한가요? 그 필요에 대해 이야기해주세요",
  },
  {
    tags: ["experience", "food"],
    text: "맛보고 싶은 음식이 있나요? 그 음식에 대한 기대를 이야기해주세요",
  },
  {
    tags: ["relationship", "emotion"],
    text: "화가 날 때 당신만의 푸는 방법이 있나요? 그 방법을 이야기해주세요",
  },
  {
    tags: ["memory", "sound"],
    text: "어릴 적 자주 들었던 소리가 기억나나요? 그 소리를 이야기해주세요",
  },
  {
    tags: ["relationship", "hope"],
    text: "다시 사랑할 준비가 되어 있다고 느끼나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["experience", "food"],
    text: "카페나 식당에서 기억에 남는 순간이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["relationship", "memory"],
    text: "이별이나 아픔을 겪은 적이 있나요? 그때의 마음을 이야기해주세요",
  },
  {
    tags: ["experience", "sound"],
    text: "좋아하는 앨범이나 플레이리스트가 있나요? 그 음악을 이야기해주세요",
  },
  {
    tags: ["relationship", "place"],
    text: "혼자만의 공간이 있다면 어떤 모습인가요? 그 공간을 이야기해주세요",
  },
  {
    tags: ["experience", "scent"],
    text: "음식 냄새만으로 떠오르는 기억이 있나요? 그 기억을 이야기해주세요",
  },
];

/** 244–273 Sep: work/study, learning, change */
const SEP = [
  {
    tags: ["experience", "growth"],
    text: "일이나 공부에서 보람을 느낀 순간이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["daily", "experience"],
    text: "지금 하는 일에서 좋아하는 점이 있나요? 그 점을 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "퇴근이나 하교 후 기분은 어떤가요? 그 기분을 이야기해주세요",
  },
  {
    tags: ["relationship", "experience"],
    text: "동료나 팀원과의 관계는 어떤가요? 그 관계를 이야기해주세요",
  },
  {
    tags: ["experience", "reflection"],
    text: "업무나 학업 스트레스를 어떻게 풀나요? 그 방법을 이야기해주세요",
  },
  {
    tags: ["growth", "future"],
    text: "바꾸고 싶은 업무나 학습 환경이 있나요? 그 이유를 이야기해주세요",
  },
  {
    tags: ["daily", "reflection"],
    text: "일과 삶의 균형, 지금은 어떤가요? 그 균형에 대해 이야기해주세요",
  },
  {
    tags: ["experience", "self"],
    text: "혼자 있을 때 하는 일 중 좋아하는 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["growth", "experience"],
    text: "작은 성취지만 뿌듯했던 일이 있나요? 그 일을 이야기해주세요",
  },
  {
    tags: ["experience", "reflection"],
    text: "남들은 모르지만 나만 아는 잘한 일이 있나요? 그 일을 이야기해주세요",
  },
  {
    tags: ["growth", "hope"],
    text: "포기하지 않아서 다행인 일이 있나요? 그 일을 이야기해주세요",
  },
  {
    tags: ["future", "reflection"],
    text: "만약 다른 직업을 가진다면 어떤 일을 하고 싶나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["growth", "experience"],
    text: "취미에 쓰는 시간이 충분한가요? 그 시간에 대해 이야기해주세요",
  },
  {
    tags: ["experience", "reflection"],
    text: "타인과 비교하며 힘들었던 적이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["growth", "reflection"],
    text: "실패했지만 다시 일어섰던 경험이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "어떤 불안을 가지고 있나요? 그 불안에 대해 이야기해주세요",
  },
  {
    tags: ["growth", "daily"],
    text: "걱정을 줄이기 위해 하는 일이 있나요? 그 일을 이야기해주세요",
  },
  {
    tags: ["experience", "reflection"],
    text: "결정을 미루는 편인가요? 그 이유를 이야기해주세요",
  },
  {
    tags: ["experience", "hope"],
    text: "어려운 선택을 앞두고 있나요? 그 선택에 대해 이야기해주세요",
  },
  {
    tags: ["growth", "reflection"],
    text: "선택의 순간에 가장 중요하게 여기는 것은 무엇인가요? 그 기준을 이야기해주세요",
  },
  {
    tags: ["experience", "memory"],
    text: "내린 선택 하나를 떠올릴 수 있나요? 그 선택에 대해 이야기해주세요",
  },
  {
    tags: ["growth", "self"],
    text: "스스로에게 너무 엄격했던 적이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["experience", "reflection"],
    text: "통제할 수 없는 것을 놓아본 적이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["growth", "future"],
    text: "중요한 결정을 내릴 때 무엇을 더 많이 믿는 편인가요? 최근의 선택을 이야기해주세요",
  },
  {
    tags: ["experience", "emotion"],
    text: "뉴스나 SNS를 보며 마음이 무거워진 적이 있나요? 그때의 마음을 이야기해주세요",
  },
  {
    tags: ["growth", "hope"],
    text: "다시 일어설 수 있다고 믿나요? 그 믿음에 대해 이야기해주세요",
  },
  {
    tags: ["experience", "reflection"],
    text: "가장 처음 떠오르는 후회되는 일이 있나요? 그 일을 이야기해주세요",
  },
  {
    tags: ["growth", "experience"],
    text: "오래 하고 싶은 취미가 있나요? 그 취미에 대해 이야기해주세요",
  },
  {
    tags: ["experience", "self"],
    text: "당신의 강점은 무엇인가요? 그 강점이 빛났던 순간을 이야기해주세요",
  },
  {
    tags: ["growth", "reflection"],
    text: "실패가 두려워서 멈춘 적이 있나요? 그 경험을 이야기해주세요",
  },
];

/** 274–304 Oct: reflection, gratitude, present */
const OCT = [
  {
    tags: ["reflection", "gratitude"],
    text: "당연하다고 여겼지만 사실 고마운 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["gratitude", "self"],
    text: "스스로에게 고마운 점이 있나요? 그 점을 이야기해주세요",
  },
  {
    tags: ["gratitude", "daily"],
    text: "요즘 세상에서 고마운 존재가 있나요? 그 존재를 이야기해주세요",
  },
  {
    tags: ["gratitude", "relationship"],
    text: "말하지 못한 고마움이 있나요? 그 고마움을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "과거의 나에게 해주고 싶은 말이 있나요? 그 말을 이야기해주세요",
  },
  {
    tags: ["reflection", "self"],
    text: "과거의 나보다 나아졌다고 느끼나요? 그 변화를 이야기해주세요",
  },
  {
    tags: ["gratitude", "experience"],
    text: "감사했던 순간이 있었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["reflection", "hope"],
    text: "내일은 조금 더 나아질 거라고 믿나요? 그 믿음을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "지금 가진 것 중 가장 소중한 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["gratitude", "relationship"],
    text: "듣고 싶은 말이 있다면 무엇인가요? 그 말을 이야기해주세요",
  },
  {
    tags: ["reflection", "experience"],
    text: "내가 결정한 선택 중 가장 잘한 것은 무엇이었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["reflection", "emotion"],
    text: "마음이 복잡할 때 글이나 말로 풀어 본 적이 있나요? 그때의 순간을 이야기해주세요",
  },
  {
    tags: ["gratitude", "memory"],
    text: "작은 빛 같은 순간을 기억하나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["reflection", "self"],
    text: "인생에서 가장 중요하게 여기는 우선순위 세 가지가 있다면 무엇인가요? 이야기해주세요",
  },
  {
    tags: ["gratitude", "daily"],
    text: "혼자만의 작은 의식이 있나요? 그 의식을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "영원히 기억하고 싶은 순간이 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["reflection", "hope"],
    text: "지금도 괜찮다고 스스로에게 말할 수 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["gratitude", "experience"],
    text: "힘들 때 읽거나 듣는 위로가 있나요? 그 위로를 이야기해주세요",
  },
  {
    tags: ["reflection", "future"],
    text: "미래의 나에게 물어보고 싶은 것이 있나요? 그 질문을 이야기해주세요",
  },
  {
    tags: ["gratitude", "relationship"],
    text: "당신을 지탱해 준 말 한마디가 있나요? 그 말을 이야기해주세요",
  },
  {
    tags: ["reflection", "self"],
    text: "나에게 자유란 어떤 의미인가요? 그 의미를 이야기해주세요",
  },
  {
    tags: ["gratitude", "emotion"],
    text: "소소하지만 확실한 행복 한 가지를 떠올릴 수 있나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "어릴 적 상상했던 세계가 있나요? 그 세계를 이야기해주세요",
  },
  {
    tags: ["reflection", "daily"],
    text: "잠들기 전 머릿속을 비우는 방법이 있나요? 그 방법을 이야기해주세요",
  },
  {
    tags: ["gratitude", "hope"],
    text: "희망을 잃지 않으려고 하는 방법이 있나요? 그 방법을 이야기해주세요",
  },
  {
    tags: ["reflection", "experience"],
    text: "처음으로 괜찮다고 느꼈던 순간은 언제였나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["gratitude", "self"],
    text: "스스로에게 잘했다고 말해 주고 싶은 일이 있나요? 그 일을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "어릴 적 방을 떠올리면 어떤 장면이 보이나요? 그 기억을 이야기해주세요",
  },
  {
    tags: ["gratitude", "relationship"],
    text: "내가 힘들 때 어떤 말과 행동이 가장 위로가 되나요? 그것을 이야기해주세요",
  },
  {
    tags: ["reflection", "hope"],
    text: "세상에 믿고 싶은 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["gratitude", "experience"],
    text: "편지를 써 본 적이나 받은 적이 있나요? 그 경험을 이야기해주세요",
  },
];

/** 305–334 Nov: gratitude, forgiveness, memory, relationship */
const NOV = [
  {
    tags: ["gratitude", "memory"],
    text: "올해를 돌아보며 고마웠던 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "스스로를 용서하고 싶은 일이 있나요? 그 일을 이야기해주세요",
  },
  {
    tags: ["reflection", "hope"],
    text: "후회가 남지만 그래도 괜찮아진 일이 있나요? 그 일을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "지나간 일을 붙잡고 있진 않나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["gratitude", "relationship"],
    text: "미안함이 남아 있는 관계가 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["reflection", "growth"],
    text: "과거의 실수에서 배운 것이 있나요? 그 배움을 이야기해주세요",
  },
  {
    tags: ["hope", "reflection"],
    text: "용서받고 싶은 마음이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["memory", "relationship"],
    text: "늦가을, 그리움이 스친 순간이 있었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["gratitude", "daily"],
    text: "집이 편안하다고 느끼나요? 그 편안함에 대해 이야기해주세요",
  },
  {
    tags: ["reflection", "self"],
    text: "정리하고 싶어진 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["gratitude", "relationship"],
    text: "고마움을 전하고 싶은 사람이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["memory", "emotion"],
    text: "조용히 혼자 있을 때 편안한가요? 그 느낌을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "아직 풀지 못한 마음이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["gratitude", "place"],
    text: "집에 돌아오면 기분이 어떻게 달라지나요? 그 변화를 이야기해주세요",
  },
  {
    tags: ["memory", "relationship"],
    text: "누군가의 하루를 대신 살아본다면 누구인가요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["reflection", "experience"],
    text: "거짓말을 해야 했던 순간이 있나요? 그때의 마음을 이야기해주세요",
  },
  {
    tags: ["gratitude", "self"],
    text: "좋아하는 자신의 모습 한 가지가 있나요? 그 모습을 이야기해주세요",
  },
  {
    tags: ["reflection", "self"],
    text: "바꾸고 싶은 습관이 있나요? 그 습관에 대해 이야기해주세요",
  },
  {
    tags: ["memory", "hope"],
    text: "당신에게 나다움이란 무엇인가요? 그 나다움을 이야기해주세요",
  },
  {
    tags: ["gratitude", "relationship"],
    text: "말 대신 행동으로 전한 적이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "진심을 전했을 때 후회한 적이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["memory", "emotion"],
    text: "혼자인 지금, 어떤가요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["gratitude", "experience"],
    text: "고독을 즐기는 편인가요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "최근에 내린 결정 중 후회 없는 것이 있나요? 그 결정을 이야기해주세요",
  },
  {
    tags: ["memory", "relationship"],
    text: "마음속에만 두었던 이야기가 있나요? 지금 꺼내 본다면 무엇인가요? 이야기해주세요",
  },
  {
    tags: ["gratitude", "place"],
    text: "방을 꾸미거나 바꾸고 싶은 마음이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["reflection", "memory"],
    text: "결정 후 후회한 적이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["memory", "self"],
    text: "나를 표현하는 방법은 무엇인가요? 그 방법을 이야기해주세요",
  },
  {
    tags: ["gratitude", "hope"],
    text: "잘 먹고 있다고 스스로에게 말해 줄 수 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["reflection", "future"],
    text: "미래에 대한 불안을 누구에게 털어놓나요? 그 경험을 이야기해주세요",
  },
];

/** 335–365 Dec: echo, year review, future, timecapsule */
const DEC = [
  {
    tags: ["echo", "reflection"],
    text: "올해를 한 단어로 표현한다면 무엇인가요? 그 단어를 고른 이유를 이야기해주세요",
  },
  {
    tags: ["echo", "memory"],
    text: "올해 가장 기억에 남는 하루가 있었나요? 그 하루를 이야기해주세요",
  },
  {
    tags: ["future", "hope"],
    text: "내년 이맘때쯤 어떤 이야기를 하고 싶나요? 그 이야기를 해주세요",
  },
  {
    tags: ["echo", "gratitude"],
    text: "올해 고마웠던 사람 한 명을 떠올릴 수 있나요? 그 이유를 이야기해주세요",
  },
  {
    tags: ["future", "self"],
    text: "1년 뒤의 나에게 하고 싶은 이야기가 있나요? 그 이야기를 해주세요",
  },
  {
    tags: ["echo", "growth"],
    text: "올해 성장했다고 느낀 순간이 있었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["timecapsule", "emotion"],
    text: "타임캡슐에 오늘의 마음을 담는다면 어떤 이야기를 남기고 싶나요? 이야기해주세요",
  },
  {
    tags: ["echo", "experience"],
    text: "올해 처음 해본 일 중 기억에 남는 것이 있나요? 그 경험을 이야기해주세요",
  },
  {
    tags: ["future", "hope"],
    text: "미래에 대한 희망을 한 문장으로 말한다면 무엇인가요? 그 문장을 이야기해주세요",
  },
  {
    tags: ["echo", "reflection"],
    text: "올해의 나를 돌아보며 가장 많이 느낀 감정은 무엇인가요? 그 감정을 이야기해주세요",
  },
  {
    tags: ["timecapsule", "future"],
    text: "훗날의 나에게 보내고 싶은 편지가 있다면 무엇을 전하고 싶나요? 이야기해주세요",
  },
  {
    tags: ["echo", "relationship"],
    text: "올해 관계에서 배운 것이 있나요? 그 배움을 이야기해주세요",
  },
  {
    tags: ["future", "reflection"],
    text: "1년 뒤의 나에게 묻고 싶은 질문이 있다면 무엇인가요? 그 질문을 이야기해주세요",
  },
  {
    tags: ["echo", "memory"],
    text: "올해 가장 조용했던 순간이 있었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["timecapsule", "hope"],
    text: "1년 뒤의 나에게도 전하고 싶은 말이 있나요? 이야기해주세요",
  },
  {
    tags: ["echo", "gratitude"],
    text: "올해 당연하다고 여겼지만 고마웠던 것이 있나요? 그것을 이야기해주세요",
  },
  {
    tags: ["future", "self"],
    text: "지금보다 1년 뒤의 나에게 바라는 모습이 있다면 어떤 모습인가요? 그 모습을 이야기해주세요",
  },
  {
    tags: ["echo", "experience"],
    text: "올해 가장 용기를 냈던 순간이 있었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["timecapsule", "reflection"],
    text: "오늘의 이야기를 서랍에 남긴다면 어떤 한 문장으로 적고 싶나요? 이야기해주세요",
  },
  {
    tags: ["echo", "hope"],
    text: "올해 품었던 희망 중 아직 남아 있는 것이 있나요? 그 희망을 이야기해주세요",
  },
  {
    tags: ["future", "reflection"],
    text: "지금의 선택이 1년 뒤의 나를 바꿀 수 있다고 믿나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["echo", "memory"],
    text: "올해 가장 따뜻했던 순간이 있었나요? 그 순간을 이야기해주세요",
  },
  {
    tags: ["timecapsule", "echo"],
    text: "1년 뒤 같은 질문을 받는다면 지금과 같은 답을 할 것 같나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["future", "hope"],
    text: "작은 변화 하나가 1년 뒤의 나를 바꿀 수 있다고 믿나요? 그 변화를 이야기해주세요",
  },
  {
    tags: ["echo", "self"],
    text: "올해의 나에게 스스로에게 남기고 싶은 말이 있나요? 그 말을 이야기해주세요",
  },
  {
    tags: ["timecapsule", "emotion"],
    text: "지금 이 질문에 답하며 떠오른 마음, 그대로 이야기해주세요",
  },
  {
    tags: ["echo", "relationship"],
    text: "누군가에게 이 이야기를 공유하고 싶은 순간이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["future", "reflection"],
    text: "당신의 인생에서 꼭 지키고 싶은 일이 있다면 무엇인가요? 그것을 이야기해주세요",
  },
  {
    tags: ["timecapsule", "memory"],
    text: "올해의 마지막 주, 마음에 남기고 싶은 이야기가 있나요? 자유롭게 이야기해주세요",
  },
  {
    tags: ["echo", "gratitude"],
    text: "한 해를 마무리하며 고마운 마음을 전하고 싶은 사람이 있나요? 그 마음을 이야기해주세요",
  },
  {
    tags: ["timecapsule", "future"],
    text: "새해의 나에게 건네고 싶은 말 한마디가 있다면 무엇인가요? 그 말을 이야기해주세요",
  },
];

const REST = [...FEB, ...MAR, ...APR, ...MAY, ...JUN, ...JUL, ...AUG, ...SEP, ...OCT, ...NOV, ...DEC];

const QUESTIONS = [...FIXED_FIRST_38, ...REST];

const TAG_LEGEND = {
  memory: "추억·과거",
  experience: "경험",
  emotion: "감정",
  relationship: "관계",
  goal: "목표·버킷리스트",
  growth: "성장·배움",
  gratitude: "감사",
  daily: "일상·루틴",
  future: "미래",
  self: "자아",
  reflection: "성찰",
  hope: "희망·위로",
  place: "장소 앵커",
  food: "음식 앵커",
  scent: "향기 앵커",
  weather: "날씨·계절 앵커",
  sound: "소리 앵커",
  object: "물건 앵커",
  echo: "연말 Echo·회고",
  timecapsule: "타임캡슐",
};

function validate(questions) {
  const issues = [];
  const texts = new Map();

  if (questions.length !== 365) {
    issues.push({ type: "count", message: `Expected 365 questions, got ${questions.length}` });
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const num = i + 1;

    if (!q.text || q.text.length < 8) {
      issues.push({ type: "length", num, message: `Text too short (${q.text?.length ?? 0} chars)` });
    }

    if (!Array.isArray(q.tags) || q.tags.length < 1 || q.tags.length > 3) {
      issues.push({ type: "tags", num, message: `Invalid tag count: ${q.tags?.length}` });
    } else {
      for (const tag of q.tags) {
        if (!VALID_TAGS.has(tag)) {
          issues.push({ type: "tags", num, message: `Invalid tag: ${tag}` });
        }
      }
    }

    if (texts.has(q.text)) {
      issues.push({ type: "duplicate", num, message: `Duplicate of #${texts.get(q.text)}` });
    } else {
      texts.set(q.text, num);
    }
  }

  const duplicateCount = issues.filter((i) => i.type === "duplicate").length;
  return { issues, duplicateCount, uniqueCount: texts.size };
}

function formatTags(tags) {
  return tags.join(", ");
}

function buildMarkdown(questions) {
  const lines = [
    "# StoryEcho 일일 질문 365",
    "",
    "형식: `번호. [tags] 질문`",
    "날짜: 번호 = 연중 일수 (1=1/1, 365=12/31)",
    "",
  ];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    lines.push(`${i + 1}. [${formatTags(q.tags)}] ${q.text}`);
  }

  lines.push("");
  lines.push("## Tag legend");
  lines.push("");
  for (const [tag, desc] of Object.entries(TAG_LEGEND)) {
    lines.push(`- \`${tag}\` — ${desc}`);
  }
  lines.push("");

  return lines.join("\n");
}

function main() {
  const expectedRest = 365 - FIXED_FIRST_38.length;
  if (REST.length !== expectedRest) {
    console.error(`REST array length mismatch: expected ${expectedRest}, got ${REST.length}`);
    process.exit(1);
  }

  const { issues, duplicateCount, uniqueCount } = validate(QUESTIONS);

  const md = buildMarkdown(QUESTIONS);
  writeFileSync(OUT_PATH, md, "utf8");

  console.log(`Wrote ${OUT_PATH}`);
  console.log(`Total: ${QUESTIONS.length}, unique texts: ${uniqueCount}, duplicate count: ${duplicateCount}`);

  if (issues.length > 0) {
    console.log("\nIssues:");
    for (const issue of issues.slice(0, 20)) {
      console.log(`  [${issue.type}] #${issue.num ?? "?"}: ${issue.message}`);
    }
    if (issues.length > 20) {
      console.log(`  ... and ${issues.length - 20} more`);
    }
  }

  const hasErrors = issues.length > 0;
  if (hasErrors) {
    process.exit(1);
  }
}

main();
