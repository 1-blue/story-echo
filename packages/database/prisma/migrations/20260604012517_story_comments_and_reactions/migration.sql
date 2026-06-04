-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CommunityReactionTargetType" ADD VALUE 'story';
ALTER TYPE "CommunityReactionTargetType" ADD VALUE 'story_comment';

-- CreateTable
CREATE TABLE "story_comments" (
    "id" UUID NOT NULL,
    "story_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "parent_id" UUID,
    "body_text" TEXT NOT NULL,
    "mentioned_user_ids" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "story_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "story_comments_story_id_created_at_idx" ON "story_comments"("story_id", "created_at");

-- CreateIndex
CREATE INDEX "story_comments_parent_id_idx" ON "story_comments"("parent_id");

-- AddForeignKey
ALTER TABLE "story_comments" ADD CONSTRAINT "story_comments_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_comments" ADD CONSTRAINT "story_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_comments" ADD CONSTRAINT "story_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "story_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
