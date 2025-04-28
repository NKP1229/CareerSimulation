/*
  Warnings:

  - Added the required column `text` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "text" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "rating" INTEGER NOT NULL;
