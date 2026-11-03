UPDATE "subscription_plans" SET "monthly_usd" = CASE WHEN "tier" = 'Fast Track' THEN 69 ELSE 49 END,
  "monthly_lkr" = CASE WHEN "tier" = 'Standard' THEN 5500 ELSE NULL END,
  "updated_at" = CURRENT_TIMESTAMP
WHERE "tier" IN ('Standard', 'Fast Track');

ALTER TABLE "subscriptions" ADD COLUMN "billing_month" TEXT, ADD COLUMN "pricing_snapshot" JSONB;
CREATE UNIQUE INDEX "subscriptions_student_id_billing_month_key" ON "subscriptions"("student_id", "billing_month");
ALTER TABLE "payouts" ADD COLUMN "period_month" TEXT, ADD COLUMN "earnings_snapshot" JSONB;

CREATE TABLE "monthly_lecturer_earnings" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "student_id" TEXT NOT NULL REFERENCES "student_profiles"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "lecturer_id" TEXT NOT NULL REFERENCES "lecturer_profiles"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "subscription_id" TEXT NOT NULL REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "period_month" TEXT NOT NULL CHECK ("period_month" ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  "region" TEXT NOT NULL CHECK ("region" IN ('LK', 'INTERNATIONAL')),
  "amount_lkr" INTEGER NOT NULL CHECK (("region" = 'LK' AND "amount_lkr" = 1500) OR ("region" = 'INTERNATIONAL' AND "amount_lkr" = 3000)),
  "payout_id" TEXT REFERENCES "payouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "monthly_lecturer_earnings_subscription_id_key" ON "monthly_lecturer_earnings"("subscription_id");
CREATE UNIQUE INDEX "monthly_lecturer_earnings_student_id_period_month_key" ON "monthly_lecturer_earnings"("student_id", "period_month");
CREATE INDEX "monthly_lecturer_earnings_lecturer_id_period_month_payout_id_idx" ON "monthly_lecturer_earnings"("lecturer_id", "period_month", "payout_id");
