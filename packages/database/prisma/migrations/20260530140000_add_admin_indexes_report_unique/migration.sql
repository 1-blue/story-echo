-- AlterTable
ALTER TABLE "users" ADD COLUMN "is_admin" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "stories_visibility_hidden_from_feed_created_at_idx" ON "stories"("visibility", "hidden_from_feed", "created_at" DESC);

-- CreateIndex
CREATE INDEX "user_question_log_user_id_shown_at_idx" ON "user_question_log"("user_id", "shown_at");

-- CreateIndex
CREATE INDEX "user_question_log_user_id_question_id_idx" ON "user_question_log"("user_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "story_reports_story_id_reporter_user_id_key" ON "story_reports"("story_id", "reporter_user_id");
