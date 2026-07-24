/*
  Warnings:

  - You are about to drop the column `after_json` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `before_json` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `resource_id` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `resource_type` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `zoom_join_url` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `zoom_meeting_id` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `zoom_password` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `details` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_id` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Made the column `actor_id` on table `audit_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_actor_id_fkey";

-- DropIndex
DROP INDEX "audit_logs_created_at_idx";

-- DropIndex
DROP INDEX "audit_logs_resource_type_idx";

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "after_json",
DROP COLUMN "before_json",
DROP COLUMN "ip",
DROP COLUMN "resource_id",
DROP COLUMN "resource_type",
DROP COLUMN "user_agent",
ADD COLUMN     "details" JSONB NOT NULL,
ADD COLUMN     "entity" TEXT NOT NULL,
ADD COLUMN     "entity_id" TEXT NOT NULL,
ALTER COLUMN "actor_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "zoom_join_url",
DROP COLUMN "zoom_meeting_id",
DROP COLUMN "zoom_password",
ADD COLUMN     "lesson_id" TEXT,
ADD COLUMN     "livekit_room_name" TEXT;

-- AlterTable
ALTER TABLE "student_profiles" ADD COLUMN     "assigned_lecturer_id" TEXT,
ALTER COLUMN "current_tier" SET DEFAULT 'FREE';

-- CreateTable
CREATE TABLE "learning_paths" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "target_audience" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "learning_path_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "objectives" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 45,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_progress" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "current_learning_path_id" TEXT NOT NULL,
    "current_module_id" TEXT,
    "current_lesson_id" TEXT,
    "progress_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "learning_path_id" TEXT NOT NULL,
    "scholar_id" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "performance_summary" TEXT NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "modules_learning_path_id_idx" ON "modules"("learning_path_id");

-- CreateIndex
CREATE INDEX "lessons_module_id_idx" ON "lessons"("module_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_progress_student_id_key" ON "student_progress"("student_id");

-- CreateIndex
CREATE INDEX "student_progress_current_learning_path_id_idx" ON "student_progress"("current_learning_path_id");

-- CreateIndex
CREATE INDEX "certificates_student_id_idx" ON "certificates"("student_id");

-- CreateIndex
CREATE INDEX "certificates_learning_path_id_idx" ON "certificates"("learning_path_id");

-- CreateIndex
CREATE INDEX "support_tickets_user_id_idx" ON "support_tickets"("user_id");

-- CreateIndex
CREATE INDEX "support_tickets_status_idx" ON "support_tickets"("status");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_assigned_lecturer_id_fkey" FOREIGN KEY ("assigned_lecturer_id") REFERENCES "lecturer_profiles"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_progress" ADD CONSTRAINT "student_progress_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_progress" ADD CONSTRAINT "student_progress_current_learning_path_id_fkey" FOREIGN KEY ("current_learning_path_id") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_progress" ADD CONSTRAINT "student_progress_current_module_id_fkey" FOREIGN KEY ("current_module_id") REFERENCES "modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_progress" ADD CONSTRAINT "student_progress_current_lesson_id_fkey" FOREIGN KEY ("current_lesson_id") REFERENCES "lessons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_learning_path_id_fkey" FOREIGN KEY ("learning_path_id") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
