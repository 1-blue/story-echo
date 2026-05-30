-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('guest', 'member');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('private', 'community');

-- CreateEnum
CREATE TYPE "FontSize" AS ENUM ('sm', 'md', 'lg');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "device_id" TEXT,
    "email" TEXT,
    "account_type" "AccountType" NOT NULL DEFAULT 'guest',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "nickname" TEXT,
    "ad_free" BOOLEAN NOT NULL DEFAULT false,
    "font_size" "FontSize" NOT NULL DEFAULT 'md',
    "skip_repeat_questions" BOOLEAN NOT NULL DEFAULT false,
    "notifications_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upgraded_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "annual_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stories" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "question_id" UUID,
    "body_text" TEXT NOT NULL,
    "photo_urls" JSONB NOT NULL DEFAULT '[]',
    "visibility" "Visibility" NOT NULL DEFAULT 'private',
    "is_capsule" BOOLEAN NOT NULL DEFAULT false,
    "unlock_at" TIMESTAMP(3),
    "is_capsule_active" BOOLEAN NOT NULL DEFAULT false,
    "hidden_from_feed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_question_log" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "question_id" UUID NOT NULL,
    "shown_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_question_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_reports" (
    "id" UUID NOT NULL,
    "story_id" UUID NOT NULL,
    "reporter_user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "story_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_device_id_key" ON "users"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "stories_user_id_created_at_idx" ON "stories"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_question_log_user_id_question_id_shown_at_key" ON "user_question_log"("user_id", "question_id", "shown_at");

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_question_log" ADD CONSTRAINT "user_question_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_question_log" ADD CONSTRAINT "user_question_log_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_reports" ADD CONSTRAINT "story_reports_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_reports" ADD CONSTRAINT "story_reports_reporter_user_id_fkey" FOREIGN KEY ("reporter_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
