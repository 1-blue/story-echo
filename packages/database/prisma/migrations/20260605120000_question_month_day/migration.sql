-- Question: annual_key 제거 → month/day (365일 고정). 기존 질문 row는 시드로 재채움.
ALTER TABLE "questions" DROP COLUMN IF EXISTS "annual_key";

ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "month" INTEGER;
ALTER TABLE "questions" ADD COLUMN IF NOT EXISTS "day" INTEGER;

DELETE FROM "user_question_log";
DELETE FROM "questions";

ALTER TABLE "questions" ALTER COLUMN "month" SET NOT NULL;
ALTER TABLE "questions" ALTER COLUMN "day" SET NOT NULL;

CREATE UNIQUE INDEX "questions_month_day_key" ON "questions"("month", "day");
