/*
  Warnings:

  - You are about to drop the column `lastAccessed` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the `Completion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `completions` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `completions` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Completion" DROP CONSTRAINT "Completion_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Completion" DROP CONSTRAINT "Completion_userId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "completions" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "lastAccessed",
DROP COLUMN "status",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "completions" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Completion";
