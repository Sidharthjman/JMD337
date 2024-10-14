/*
  Warnings:

  - Made the column `userid` on table `enrollments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `courseid` on table `enrollments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `completed` on table `enrollments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "startDate" TIMESTAMP(3),
ALTER COLUMN "userid" SET NOT NULL,
ALTER COLUMN "courseid" SET NOT NULL,
ALTER COLUMN "completed" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "enrollments" SET DEFAULT 0,
ALTER COLUMN "completions" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "courses"("courseid") ON DELETE RESTRICT ON UPDATE CASCADE;
