/*
  Warnings:

  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Post` table. All the data in the column will be lost.
  - Added the required column `Title` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Post_name_idx";

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
DROP COLUMN "name",
ADD COLUMN     "Title" TEXT NOT NULL,
ADD COLUMN     "content" TEXT,
ADD COLUMN     "coverPictureURL" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Post_id_seq";

-- CreateIndex
CREATE INDEX "Post_createdById_idx" ON "Post"("createdById");
