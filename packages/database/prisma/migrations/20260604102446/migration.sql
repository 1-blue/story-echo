-- AlterTable
ALTER TABLE "notifications" RENAME CONSTRAINT "community_notifications_pkey" TO "notifications_pkey";

-- RenameForeignKey
ALTER TABLE "notifications" RENAME CONSTRAINT "community_notifications_recipient_user_id_fkey" TO "notifications_recipient_user_id_fkey";

-- RenameIndex
ALTER INDEX "community_notifications_recipient_user_id_read_at_created_a_idx" RENAME TO "notifications_recipient_user_id_read_at_created_at_idx";
