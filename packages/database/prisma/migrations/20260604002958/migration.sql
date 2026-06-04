-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('guest', 'member', 'admin');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('private', 'community');

-- CreateEnum
CREATE TYPE "FontSize" AS ENUM ('sm', 'md', 'lg');

-- CreateEnum
CREATE TYPE "CommunityReactionTargetType" AS ENUM ('post', 'comment');

-- CreateEnum
CREATE TYPE "CommunityReactionEmoji" AS ENUM ('heart', 'sad', 'angry', 'fire', 'clap');

-- CreateEnum
CREATE TYPE "CommunityNotificationType" AS ENUM ('comment_on_post', 'reply_to_comment', 'mention');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "device_id" TEXT,
    "email" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'guest',
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
    "is_bookmarked" BOOLEAN NOT NULL DEFAULT false,
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

-- CreateTable
CREATE TABLE "community_posts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "question_id" UUID,
    "body_text" TEXT NOT NULL,
    "photo_urls" JSONB NOT NULL DEFAULT '[]',
    "hidden_from_feed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_comments" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "parent_id" UUID,
    "body_text" TEXT NOT NULL,
    "mentioned_user_ids" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_reactions" (
    "id" UUID NOT NULL,
    "target_type" "CommunityReactionTargetType" NOT NULL,
    "target_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "emoji" "CommunityReactionEmoji" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_notifications" (
    "id" UUID NOT NULL,
    "recipient_user_id" UUID NOT NULL,
    "actor_user_id" UUID NOT NULL,
    "type" "CommunityNotificationType" NOT NULL,
    "post_id" UUID NOT NULL,
    "comment_id" UUID,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_post_reports" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "reporter_user_id" UUID NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_post_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_device_id_key" ON "users"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_nickname_key" ON "users"("nickname");

-- CreateIndex
CREATE INDEX "stories_user_id_created_at_idx" ON "stories"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "stories_visibility_hidden_from_feed_created_at_idx" ON "stories"("visibility", "hidden_from_feed", "created_at" DESC);

-- CreateIndex
CREATE INDEX "user_question_log_user_id_shown_at_idx" ON "user_question_log"("user_id", "shown_at");

-- CreateIndex
CREATE INDEX "user_question_log_user_id_question_id_idx" ON "user_question_log"("user_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_question_log_user_id_question_id_shown_at_key" ON "user_question_log"("user_id", "question_id", "shown_at");

-- CreateIndex
CREATE UNIQUE INDEX "story_reports_story_id_reporter_user_id_key" ON "story_reports"("story_id", "reporter_user_id");

-- CreateIndex
CREATE INDEX "community_posts_hidden_from_feed_created_at_idx" ON "community_posts"("hidden_from_feed", "created_at" DESC);

-- CreateIndex
CREATE INDEX "community_posts_user_id_created_at_idx" ON "community_posts"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "community_comments_post_id_created_at_idx" ON "community_comments"("post_id", "created_at");

-- CreateIndex
CREATE INDEX "community_comments_parent_id_idx" ON "community_comments"("parent_id");

-- CreateIndex
CREATE INDEX "community_reactions_target_type_target_id_idx" ON "community_reactions"("target_type", "target_id");

-- CreateIndex
CREATE UNIQUE INDEX "community_reactions_target_type_target_id_user_id_key" ON "community_reactions"("target_type", "target_id", "user_id");

-- CreateIndex
CREATE INDEX "community_notifications_recipient_user_id_read_at_created_a_idx" ON "community_notifications"("recipient_user_id", "read_at", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "community_post_reports_post_id_reporter_user_id_key" ON "community_post_reports"("post_id", "reporter_user_id");

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

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "community_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_reactions" ADD CONSTRAINT "community_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_notifications" ADD CONSTRAINT "community_notifications_recipient_user_id_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_notifications" ADD CONSTRAINT "community_notifications_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_post_reports" ADD CONSTRAINT "community_post_reports_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_post_reports" ADD CONSTRAINT "community_post_reports_reporter_user_id_fkey" FOREIGN KEY ("reporter_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
