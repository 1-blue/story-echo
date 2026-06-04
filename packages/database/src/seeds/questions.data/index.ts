import { assertQuestionSeedsValid, questionIdForMonthDay } from "../../question-calendar";
import type { QuestionSeed } from "../types";
import { MONTH_1_SEEDS } from "./01-january";
import { MONTH_2_SEEDS } from "./02-february";
import { MONTH_3_SEEDS } from "./03-march";
import { MONTH_4_SEEDS } from "./04-april";
import { MONTH_5_SEEDS } from "./05-may";
import { MONTH_6_SEEDS } from "./06-june";
import { MONTH_7_SEEDS } from "./07-july";
import { MONTH_8_SEEDS } from "./08-august";
import { MONTH_9_SEEDS } from "./09-september";
import { MONTH_10_SEEDS } from "./10-october";
import { MONTH_11_SEEDS } from "./11-november";
import { MONTH_12_SEEDS } from "./12-december";

const RAW = [
  ...MONTH_1_SEEDS,
  ...MONTH_2_SEEDS,
  ...MONTH_3_SEEDS,
  ...MONTH_4_SEEDS,
  ...MONTH_5_SEEDS,
  ...MONTH_6_SEEDS,
  ...MONTH_7_SEEDS,
  ...MONTH_8_SEEDS,
  ...MONTH_9_SEEDS,
  ...MONTH_10_SEEDS,
  ...MONTH_11_SEEDS,
  ...MONTH_12_SEEDS,
];

export const QUESTION_SEEDS: QuestionSeed[] = RAW.map((row) => ({
  id: questionIdForMonthDay(row.month, row.day),
  text: row.text,
  month: row.month,
  day: row.day,
}));

assertQuestionSeedsValid(QUESTION_SEEDS);
