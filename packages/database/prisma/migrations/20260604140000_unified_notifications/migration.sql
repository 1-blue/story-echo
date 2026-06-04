-- Rename enum and extend notification types
ALTER TYPE "CommunityNotificationType" RENAME TO "NotificationType";
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'comment_on_public_story';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'reply_to_story_comment';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'daily_question_reminder';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'capsule_unlocked';

-- Rename table
ALTER TABLE "community_notifications" RENAME TO "notifications";

-- Nullable actor and post; add story
ALTER TABLE "notifications" ALTER COLUMN "actor_user_id" DROP NOT NULL;
ALTER TABLE "notifications" ALTER COLUMN "post_id" DROP NOT NULL;
ALTER TABLE "notifications" ADD COLUMN "story_id" UUID;

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_story_id_fkey"
  FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notifications" DROP CONSTRAINT IF EXISTS "community_notifications_actor_user_id_fkey";
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_user_id_fkey"
  FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "notifications_capsule_once"
  ON "notifications"("recipient_user_id", "type", "story_id");

CREATE INDEX "notifications_recipient_user_id_type_created_at_idx"
  ON "notifications"("recipient_user_id", "type", "created_at" DESC);
