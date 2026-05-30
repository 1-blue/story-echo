-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('guest', 'member', 'admin');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'guest';

-- MigrateData
UPDATE "users" SET "role" = 'admin' WHERE "is_admin" = true;
UPDATE "users" SET "role" = 'member' WHERE "account_type" = 'member' AND "is_admin" = false;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_admin",
DROP COLUMN "account_type";

-- DropEnum
DROP TYPE "AccountType";
