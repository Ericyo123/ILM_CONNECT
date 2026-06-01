-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "email_verified_at" DATETIME,
    "two_factor_secret" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" DATETIME
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "preferred_language" TEXT NOT NULL,
    "learning_goals" TEXT NOT NULL,
    "current_tier" TEXT NOT NULL,
    CONSTRAINT "student_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lecturer_profiles" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "full_name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "qualifications" TEXT NOT NULL,
    "specializations" JSONB NOT NULL,
    "languages" JSONB NOT NULL,
    "hourly_availability_json" JSONB NOT NULL,
    "payout_method" TEXT NOT NULL,
    "payout_details" TEXT NOT NULL,
    "rating_avg" REAL NOT NULL DEFAULT 0.0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "lecturer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "stripe_subscription_id" TEXT,
    "current_period_start" DATETIME NOT NULL,
    "current_period_end" DATETIME NOT NULL,
    "lkr_amount" REAL NOT NULL,
    "fx_rate_applied" REAL NOT NULL,
    CONSTRAINT "subscriptions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscription_id" TEXT NOT NULL,
    "amount_lkr" REAL NOT NULL,
    "fx_rate" REAL NOT NULL,
    "gateway" TEXT NOT NULL,
    "gateway_charge_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "processed_at" DATETIME NOT NULL,
    CONSTRAINT "payments_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "availability_slots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lecturer_id" TEXT NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "recurring_rule" TEXT,
    CONSTRAINT "availability_slots_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "lecturer_id" TEXT NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "zoom_meeting_id" TEXT,
    "zoom_join_url" TEXT,
    "zoom_password" TEXT,
    "recording_url" TEXT,
    CONSTRAINT "sessions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sessions_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "session_blocks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "lecturer_id" TEXT NOT NULL,
    "session_1_id" TEXT,
    "session_2_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payout_amount_lkr" REAL NOT NULL DEFAULT 2500.0,
    "completed_at" DATETIME,
    CONSTRAINT "session_blocks_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "session_blocks_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "session_blocks_session_1_id_fkey" FOREIGN KEY ("session_1_id") REFERENCES "sessions" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "session_blocks_session_2_id_fkey" FOREIGN KEY ("session_2_id") REFERENCES "sessions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "session_notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "lecturer_id" TEXT NOT NULL,
    "topics_covered" TEXT NOT NULL,
    "homework" TEXT NOT NULL,
    "student_progress_rating" INTEGER NOT NULL,
    "internal_notes" TEXT NOT NULL,
    "shared_notes" TEXT NOT NULL,
    CONSTRAINT "session_notes_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "session_notes_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "materials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uploader_id" TEXT NOT NULL,
    "session_id" TEXT,
    "title" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "virus_scan_status" TEXT NOT NULL,
    CONSTRAINT "materials_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "materials_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payouts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lecturer_id" TEXT NOT NULL,
    "amount_lkr" REAL NOT NULL,
    "session_blocks_included" JSONB NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "initiated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" DATETIME,
    "failure_reason" TEXT,
    CONSTRAINT "payouts_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "progress_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "lecturer_id" TEXT NOT NULL,
    "period_month" TEXT NOT NULL,
    "content_json" JSONB NOT NULL,
    "generated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" DATETIME,
    CONSTRAINT "progress_reports_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "progress_reports_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "thread_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "read_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "messages_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "lecturer_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ratings_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ratings_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ratings_lecturer_id_fkey" FOREIGN KEY ("lecturer_id") REFERENCES "lecturer_profiles" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actor_id" TEXT,
    "action" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "before_json" JSONB,
    "after_json" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload_json" JSONB NOT NULL,
    "read_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channel" TEXT NOT NULL,
    CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "subscriptions_student_id_idx" ON "subscriptions"("student_id");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "payments_subscription_id_idx" ON "payments"("subscription_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "availability_slots_lecturer_id_idx" ON "availability_slots"("lecturer_id");

-- CreateIndex
CREATE INDEX "availability_slots_starts_at_idx" ON "availability_slots"("starts_at");

-- CreateIndex
CREATE INDEX "availability_slots_status_idx" ON "availability_slots"("status");

-- CreateIndex
CREATE INDEX "sessions_starts_at_idx" ON "sessions"("starts_at");

-- CreateIndex
CREATE INDEX "sessions_status_idx" ON "sessions"("status");

-- CreateIndex
CREATE INDEX "sessions_student_id_idx" ON "sessions"("student_id");

-- CreateIndex
CREATE INDEX "sessions_lecturer_id_idx" ON "sessions"("lecturer_id");

-- CreateIndex
CREATE INDEX "sessions_student_id_starts_at_idx" ON "sessions"("student_id", "starts_at");

-- CreateIndex
CREATE INDEX "sessions_lecturer_id_starts_at_idx" ON "sessions"("lecturer_id", "starts_at");

-- CreateIndex
CREATE INDEX "session_blocks_student_id_idx" ON "session_blocks"("student_id");

-- CreateIndex
CREATE INDEX "session_blocks_lecturer_id_idx" ON "session_blocks"("lecturer_id");

-- CreateIndex
CREATE INDEX "session_blocks_status_idx" ON "session_blocks"("status");

-- CreateIndex
CREATE UNIQUE INDEX "session_notes_session_id_key" ON "session_notes"("session_id");

-- CreateIndex
CREATE INDEX "materials_uploader_id_idx" ON "materials"("uploader_id");

-- CreateIndex
CREATE INDEX "materials_session_id_idx" ON "materials"("session_id");

-- CreateIndex
CREATE INDEX "payouts_lecturer_id_idx" ON "payouts"("lecturer_id");

-- CreateIndex
CREATE INDEX "payouts_status_idx" ON "payouts"("status");

-- CreateIndex
CREATE INDEX "progress_reports_student_id_idx" ON "progress_reports"("student_id");

-- CreateIndex
CREATE INDEX "progress_reports_lecturer_id_idx" ON "progress_reports"("lecturer_id");

-- CreateIndex
CREATE INDEX "messages_thread_id_idx" ON "messages"("thread_id");

-- CreateIndex
CREATE INDEX "messages_sender_id_idx" ON "messages"("sender_id");

-- CreateIndex
CREATE INDEX "messages_recipient_id_idx" ON "messages"("recipient_id");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_session_id_key" ON "ratings"("session_id");

-- CreateIndex
CREATE INDEX "ratings_student_id_idx" ON "ratings"("student_id");

-- CreateIndex
CREATE INDEX "ratings_lecturer_id_idx" ON "ratings"("lecturer_id");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_resource_type_idx" ON "audit_logs"("resource_type");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");
