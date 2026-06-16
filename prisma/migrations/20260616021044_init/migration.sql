-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "organization" TEXT NOT NULL DEFAULT '',
    "community" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT,
    "avatar_color" TEXT,
    "avatar_emoji" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "last_login" DATETIME
);

-- CreateTable
CREATE TABLE "elder_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "living_status" TEXT NOT NULL,
    "community" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL DEFAULT '',
    "medical_history" TEXT NOT NULL DEFAULT '',
    "emergency_notes" TEXT NOT NULL DEFAULT '',
    "communication_pref" TEXT NOT NULL DEFAULT '',
    "care_pref" TEXT NOT NULL DEFAULT '',
    "aid_needs" TEXT NOT NULL DEFAULT '',
    "risk_level" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_by_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "elder_profiles_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "trusted_contacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "elder_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "verified_status" TEXT NOT NULL DEFAULT 'pending',
    "can_make_decision" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "trusted_contacts_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "emergency_cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "elder_id" TEXT NOT NULL,
    "card_no" TEXT NOT NULL,
    "qr_token" TEXT NOT NULL,
    "visibility_level" TEXT NOT NULL DEFAULT 'contact',
    "emergency_note" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "printed_at" DATETIME,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "emergency_cards_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "qr_codes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "card_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "scan_count" INTEGER NOT NULL DEFAULT 0,
    "last_scanned_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "qr_codes_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "emergency_cards" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "elder_id" TEXT NOT NULL,
    "task_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'todo',
    "priority" INTEGER NOT NULL DEFAULT 2,
    "assignee_id" TEXT NOT NULL,
    "due_date" DATETIME NOT NULL,
    "completed_at" DATETIME,
    "completion_note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "tasks_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tasks_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "case_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "elder_id" TEXT NOT NULL,
    "trigger_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "severity" INTEGER NOT NULL DEFAULT 2,
    "assignee_id" TEXT NOT NULL,
    "resolved_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "case_events_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "case_events_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "discharge_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "elder_id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "hospital_name" TEXT NOT NULL,
    "discharge_date" DATETIME NOT NULL,
    "pickup_status" TEXT NOT NULL DEFAULT 'pending',
    "medication_reminder_status" TEXT NOT NULL DEFAULT 'pending',
    "revisit_status" TEXT NOT NULL DEFAULT 'pending',
    "visit_status" TEXT NOT NULL DEFAULT 'pending',
    "assignee_id" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "discharge_plans_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "discharge_plans_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "followup_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "elder_id" TEXT NOT NULL,
    "case_id" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "scheduled_date" DATETIME NOT NULL,
    "completed_at" DATETIME,
    "result" TEXT NOT NULL DEFAULT '',
    "satisfaction" INTEGER,
    "next_action" TEXT NOT NULL DEFAULT '',
    "assignee_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "followup_records_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "followup_records_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "voice_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "elder_id" TEXT NOT NULL,
    "field_name" TEXT NOT NULL,
    "audio_url" TEXT,
    "transcript" TEXT NOT NULL,
    "confidence" REAL,
    "duration_ms" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "voice_records_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "summaries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "elder_id" TEXT NOT NULL,
    "version_no" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "generated_by" TEXT NOT NULL DEFAULT 'rule_engine',
    "review_status" TEXT NOT NULL DEFAULT 'pending',
    "reviewed_by" TEXT,
    "reviewed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "summaries_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "consents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "elder_id" TEXT NOT NULL,
    "version_no" TEXT NOT NULL,
    "agreed_by" TEXT NOT NULL,
    "relation" TEXT NOT NULL DEFAULT '本人',
    "agreed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "consents_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "medical_records" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "elder_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT,
    "ocr_text" TEXT,
    "structured_data" TEXT,
    "confidence_score" REAL,
    "reviewed_by" TEXT,
    "review_status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "medical_records_elder_id_fkey" FOREIGN KEY ("elder_id") REFERENCES "elder_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actor_id" TEXT NOT NULL,
    "actor_name" TEXT NOT NULL,
    "actor_role" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "ip" TEXT NOT NULL DEFAULT '',
    "is_abnormal" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_cards_card_no_key" ON "emergency_cards"("card_no");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_cards_qr_token_key" ON "emergency_cards"("qr_token");

-- CreateIndex
CREATE UNIQUE INDEX "qr_codes_card_id_key" ON "qr_codes"("card_id");

-- CreateIndex
CREATE UNIQUE INDEX "qr_codes_token_key" ON "qr_codes"("token");
