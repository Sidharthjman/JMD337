/*
  Warnings:

  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "courses" (
    "courseid" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "short_intro" TEXT,
    "category" VARCHAR(100),
    "total_enrollments" INTEGER DEFAULT 0,
    "completion_rate" DOUBLE PRECISION DEFAULT 0,
    "total_completions" INTEGER DEFAULT 0,
    "skills" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("courseid")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "enrollmentid" SERIAL NOT NULL,
    "userid" TEXT,
    "courseid" TEXT,
    "grade" INTEGER,
    "completed" BOOLEAN DEFAULT false,
    "progress" INTEGER DEFAULT 0,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("enrollmentid")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT,
    "enrollments" INTEGER NOT NULL,
    "completions" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
