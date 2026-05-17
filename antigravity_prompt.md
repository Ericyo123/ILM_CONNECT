# ANTIGRAVITY BUILD PROMPT — ISLAMIC EDUCATION PLATFORM (END-TO-END)

## CONTEXT & MISSION

Build a production-grade web application that connects qualified Sri Lankan Islamic scholars (Maulavis) with Muslim students living in the diaspora (UK, Europe, Australia, Middle East, North America). The platform facilitates structured 1:1 online Islamic education through scheduled 45-minute sessions, twice per week, covering Quran recitation, Quran memorization (Hifz), Hadith, Fiqh (Islamic jurisprudence), Aqeedah, and Arabic language.

This is a real revenue-generating SaaS marketplace. The build must be production-ready, secure, scalable from 5 to 1000+ concurrent users, and shippable in approximately 12 weeks. Every architectural decision must prioritize **trust, security, reliability, and a frictionless user experience** — students are paying real money monthly, lecturers depend on the platform for income, and the subject matter (religious education) demands a respectful, professional product.

---

## 1. BUSINESS MODEL & DOMAIN RULES (ENCODE THESE EXACTLY)

### Pricing (configurable in admin panel — do not hardcode)
- **Tier 1 — Quran Basic**: 15,000 LKR / month (~$50 USD)
- **Tier 2 — Quran Premium**: 18,000 LKR / month (~$60 USD) — includes recordings + monthly progress reports
- **Tier 3 — Hadith / Fiqh / Islamic Law**: 20,000 LKR / month (~$67 USD) — advanced 1:1 only

### Session Structure
- Each session is **45 minutes**
- Students receive **8 sessions per month** (2 per week)
- Sessions are **1:1 by default**; group sessions (max 4 students) are an admin-toggled option
- **Mandatory 3-day gap** between a student's two weekly sessions (Mon+Thu, Tue+Fri, Wed+Sat patterns enforced at booking time)
- Sessions cannot be booked less than 12 hours in advance
- Sessions can be rescheduled up to 24 hours before start time (no penalty); within 24h = counts as used

### Lecturer Compensation
- **1,250 LKR per 45-minute session**
- Paid in **2-session blocks of 2,500 LKR** — payout is triggered automatically when a 2-session block for a given student is completed
- Monthly payout cycle: lecturers paid by the 5th of the following month via configured method (bank transfer / Wise / local LKR transfer)
- Lecturer dashboard must show: pending earnings, paid earnings, sessions taught, sessions upcoming, no-show count

### Cost Model (for admin financial dashboard)
- Payment processing: 3% of revenue
- Operational overhead: configurable (default 5,000 LKR/month for self-managed phase, 55,000 LKR when support staff is hired)
- Break-even threshold: 12 paying students (display this live on admin dashboard)

### Multi-currency
- Display prices in user's local currency (GBP, EUR, AUD, USD, SAR, AED) using live FX rates, but **charge in LKR** with FX conversion noted on invoice
- Exchange rates fetched daily and cached; admin can override

---

## 2. USER ROLES & PERMISSIONS (RBAC)

Implement four distinct roles with strict authorization checks on **every** API endpoint:

1. **Student** — books sessions, pays subscription, accesses materials, views own progress
2. **Lecturer (Maulavi)** — sets availability, conducts sessions, uploads materials, submits session notes, views earnings
3. **Admin** — full platform control: user management, financial reports, dispute resolution, content moderation, configuration
4. **Super Admin** — admin permissions + role management + system configuration + audit log access

**Authorization rules:**
- A student can only read/write their own data
- A lecturer can only see students assigned to them and their own data
- All cross-role data access must pass through explicit policy checks (use a centralized policy/guard layer — do NOT rely on frontend hiding)
- Every privileged action writes to an immutable audit log

---

## 3. TECH STACK (PRODUCTION-GRADE)

### Frontend
- **Next.js 14+ (App Router)** with React 18, TypeScript strict mode
- **Tailwind CSS** + **shadcn/ui** component library
- **TanStack Query** for server state, **Zustand** for client state
- **React Hook Form** + **Zod** for all forms and validation
- **next-intl** for i18n (English, Arabic with RTL support, Tamil, Sinhala)
- **Framer Motion** for tasteful micro-interactions (do not over-animate)
- **Lucide React** for icons; no emoji as UI icons

### Backend
- **NestJS** (TypeScript) — modular, opinionated, excellent for RBAC/guards/interceptors
- **PostgreSQL 15+** as primary datastore
- **Prisma** ORM with strict schema migrations
- **Redis** for sessions, rate limiting, queue backing, caching
- **BullMQ** for background jobs (emails, payouts, reminders, recordings processing)
- **Socket.IO** for real-time notifications (booking confirmations, session-starting alerts)

### Infrastructure & Integrations
- **Stripe** for international card payments + **PayHere** (Sri Lankan gateway) for local LKR payments
- **Zoom Meeting SDK** (server-to-server OAuth app) — auto-generate unique meeting per session, store recordings to S3
- **AWS S3** for materials storage and session recordings (encrypted at rest, signed URLs only)
- **AWS SES** or **Resend** for transactional email
- **Twilio** for SMS reminders (optional, configurable per user)
- **Sentry** for error tracking, **PostHog** for product analytics, **CloudWatch** for infra logs
- **Cloudflare** in front of everything (DDoS, WAF, CDN)

### DevOps
- **Docker** + **docker-compose** for local dev
- **AWS ECS Fargate** or **Railway/Render** for production hosting
- **GitHub Actions** for CI/CD with mandatory: typecheck → lint → test → build → deploy
- **Terraform** or **Pulumi** for infrastructure-as-code
- Separate environments: `local`, `staging`, `production` — never share secrets or DBs

---

## 4. SECURITY REQUIREMENTS (NON-NEGOTIABLE)

### Authentication
- **Email + password** with bcrypt (cost factor 12+) or **argon2id** (preferred)
- **Mandatory email verification** before first session booking
- **2FA via TOTP** (Google Authenticator compatible) — required for admin/super admin, optional for students/lecturers
- **OAuth/SSO** for Google sign-in (students) — never auto-create accounts without explicit user action
- **Session management** via httpOnly, Secure, SameSite=Strict cookies — NOT localStorage for tokens
- **Refresh token rotation** with reuse detection (revoke entire family on reuse)
- **Account lockout**: 5 failed attempts → 15-minute lockout, exponential backoff
- **Password reset** via signed, single-use, 30-minute-expiry tokens

### Authorization
- Centralized policy layer (NestJS Guards + custom `@Policy()` decorator)
- Every database query scoped by `userId` / `tenantId` at the ORM layer — defense in depth
- No direct object reference (IDOR) vulnerabilities — verify ownership on every fetch

### Data Protection
- **TLS 1.3** everywhere; HSTS with preload
- **At-rest encryption**: AES-256 for PII fields (full name, phone, address) in DB
- **PCI-DSS compliance**: card data NEVER touches your servers — Stripe Elements / PayHere hosted fields only
- **PII minimization**: only collect what's required; document every field's purpose
- **GDPR-ready**: data export endpoint, right-to-erasure flow (anonymize, don't hard-delete sessions for accounting)

### Application Security (OWASP Top 10 mitigations — implement all)
- **Input validation**: Zod schemas on every API boundary, reject unknown fields
- **SQL injection**: Prisma parameterized queries only; no raw SQL with interpolation
- **XSS**: React auto-escapes, but also set strict CSP header; sanitize all user-generated HTML (e.g., session notes) with DOMPurify
- **CSRF**: double-submit cookie pattern + SameSite=Strict
- **Rate limiting**: per-IP and per-user, tiered (auth endpoints: 5/min, general: 100/min, public: 20/min)
- **CORS**: strict allowlist of frontend origins only
- **Security headers**: CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy
- **Dependency scanning**: Snyk or Dependabot in CI, fail builds on high CVEs
- **Secrets management**: AWS Secrets Manager or Doppler; NEVER commit `.env` files
- **File uploads**: validate MIME type AND magic bytes, max size limits, virus scan (ClamAV) on lecturer-uploaded materials, store outside webroot, serve via signed URLs

### Audit & Monitoring
- **Audit log table** — append-only, records: who, what, when, IP, user-agent, before/after state for every privileged action (payment, role change, account deletion, content edit)
- **Real-time alerts** to admin Slack/email on: failed login spikes, payment failures, 5xx error rate >1%, suspicious geographic logins
- **Health checks**: `/health`, `/ready`, `/metrics` (Prometheus format)

---

## 5. DATABASE SCHEMA (CORE TABLES)

Generate full Prisma schema. Critical tables (with key fields and indexes):

- `users` — id, email (unique, indexed), password_hash, role, status, email_verified_at, two_factor_secret, created_at, deleted_at
- `student_profiles` — user_id (FK), full_name (encrypted), phone (encrypted), country, timezone, preferred_language, learning_goals, current_tier
- `lecturer_profiles` — user_id (FK), full_name (encrypted), bio, qualifications, specializations[], languages[], hourly_availability_json, payout_method, payout_details (encrypted), rating_avg, rating_count, status (pending/active/suspended)
- `subscriptions` — id, student_id (FK), tier, status (active/canceled/past_due), stripe_subscription_id, current_period_start, current_period_end, lkr_amount, fx_rate_applied
- `availability_slots` — id, lecturer_id (FK), starts_at, ends_at, status (open/booked/blocked), recurring_rule (RRULE iCal format)
- `sessions` — id, student_id (FK), lecturer_id (FK), starts_at (indexed), ends_at, status (scheduled/in_progress/completed/no_show_student/no_show_lecturer/canceled), zoom_meeting_id, zoom_join_url (encrypted), zoom_password (encrypted), recording_url (signed S3, encrypted), session_notes_id (FK)
- `session_blocks` — id, student_id, lecturer_id, session_1_id, session_2_id, status (pending/completed/paid_out), payout_amount_lkr (2500), completed_at
- `session_notes` — id, session_id, lecturer_id, topics_covered, homework, student_progress_rating, internal_notes (lecturer-only), shared_notes (visible to student)
- `materials` — id, uploader_id, session_id (nullable), title, file_url (S3 key), file_type, file_size, virus_scan_status
- `payments` — id, subscription_id, amount_lkr, fx_rate, gateway (stripe/payhere), gateway_charge_id, status, processed_at
- `payouts` — id, lecturer_id, amount_lkr, session_blocks_included[], method, status, initiated_at, completed_at, failure_reason
- `progress_reports` — id, student_id, lecturer_id, period_month, content_json, generated_at, sent_at
- `messages` — id, thread_id, sender_id, recipient_id, content (encrypted), read_at — basic in-app messaging only
- `ratings` — id, session_id, student_id, lecturer_id, score (1–5), comment, created_at
- `audit_logs` — id, actor_id, action, resource_type, resource_id, ip, user_agent, before_json, after_json, created_at (immutable, append-only, never deleted)
- `notifications` — id, user_id, type, payload_json, read_at, channel (in_app/email/sms)

**Indexes**: every FK, every `status` column, `sessions.starts_at`, `users.email`, composite `(student_id, starts_at)` and `(lecturer_id, starts_at)` for session queries.

**Soft deletes** on user-facing entities (`deleted_at`); hard purge job after legal retention period.

---

## 6. CORE FEATURES & USER FLOWS

### A. Student Journey
1. **Landing page** — clear value prop, pricing tiers, social proof, sample lecturer profiles, FAQ, "Book Free Trial Session" CTA
2. **Sign up** → email verify → onboarding wizard (timezone, learning goals, preferred language, tier selection)
3. **Free 30-minute trial session** with auto-assigned lecturer (one per account, tracked)
4. **Subscribe** via Stripe/PayHere checkout
5. **Booking flow**:
   - Browse lecturer profiles (filter by specialization, language, rating, availability)
   - Pick a lecturer OR let system auto-match
   - View lecturer's calendar in student's timezone
   - Select 2 weekly slots respecting 3-day-gap rule (system blocks invalid combinations)
   - Confirm booking → Zoom link generated → calendar invite sent (Google/Apple/Outlook ICS)
6. **Dashboard** — upcoming sessions, recent recordings, materials, progress chart, payment status, "Join Session" button (active 10 min before start)
7. **Session join** — one-click Zoom launch with pre-generated unique meeting
8. **Post-session** — rate lecturer, view notes, download materials
9. **Monthly progress report** auto-generated, emailed PDF

### B. Lecturer Journey
1. **Application form** — qualifications, sample teaching video upload, references, ID verification
2. **Admin approval** with interview workflow (admin can mark as `pending_review` → `interview_scheduled` → `approved` / `rejected`)
3. **Onboarding** — set bio, profile photo, specializations, languages, weekly recurring availability
4. **Dashboard** — today's sessions, this week's schedule, students assigned, pending earnings, completed payouts, materials uploaded
5. **Pre-session**: prep notes, review student profile, see previous session notes
6. **Conduct session** via Zoom (auto-recorded if student is on Premium/Tier 2+)
7. **Post-session**: submit notes (internal + shared), mark attendance, optionally upload follow-up materials
8. **Payouts**: see earnings breakdown by student, by month, payout history with status

### C. Admin Journey
1. **Dashboard** — live KPIs: total students, MRR (LKR + USD), active lecturers, sessions today/this week, churn rate, break-even status, pending lecturer applications
2. **User management** — search, filter, suspend, reset password, impersonate (with audit trail) for support
3. **Financial reports** — revenue, costs, profit, margin, lecturer payouts, payment failures, FX impact — exportable to CSV/Excel
4. **Lecturer management** — approve/reject, performance metrics (avg rating, no-show rate, retention impact), payout management
5. **Session management** — view all sessions, intervene in disputes, refund/credit
6. **Configuration panel** — pricing tiers, session duration, cancellation policy, gap rule, operational cost, FX overrides, email templates
7. **Content moderation** — review reported messages, materials, session notes
8. **Audit log viewer** — filterable, exportable

### D. Critical Booking Rules (encode in domain layer, not just UI)
- 3-day gap between weekly sessions enforced server-side
- A lecturer cannot have overlapping sessions
- A student cannot book during the same lecturer's blocked slots
- A student on Tier 1 cannot book Tier 3 (Hadith) sessions
- Cancellation within 24h marks session as used
- No-show: lecturer marks via dashboard within 1 hour of session end; student gets disputed → admin reviews

---

## 7. UI / UX REQUIREMENTS

### Design Philosophy
- **Calm, trustworthy, scholarly** — this is religious education, not a flashy edtech app
- **Respectful of Islamic aesthetics** — geometric patterns subtle, never figurative imagery of people in religious contexts, no music/audio auto-play
- **Accessibility-first** — WCAG 2.1 AA minimum (contrast 4.5:1 body, 3:1 large text, full keyboard nav, ARIA labels, focus-visible states, prefers-reduced-motion respected)
- **Mobile-first** — 60%+ of diaspora users will be on phones; every flow must work on a 375px viewport
- **RTL support** — full mirroring for Arabic locale

### Design System
- **Color palette** — primary deep teal/emerald (`#0F766E`), neutral warm grays, accent gold (`#CA8A04`) used sparingly, semantic red/green/amber for status. Provide light AND dark mode.
- **Typography** — `Inter` for English/Latin scripts, `Noto Naskh Arabic` for Arabic, `Noto Sans Sinhala/Tamil` for SL languages. Type scale: 12/14/16/18/20/24/30/36/48 px.
- **Spacing** — 4px base unit, consistent 4/8/12/16/24/32/48/64 scale
- **Components** — all from shadcn/ui, customized to brand. Build a Storybook showcasing every component state.
- **Icons** — Lucide only, 20px or 24px, never mix icon styles

### Page-Level UX
- **Loading states** — skeleton screens, never spinners alone for >300ms loads
- **Empty states** — illustrated, with clear CTA
- **Error states** — actionable, friendly, never expose stack traces
- **Optimistic updates** for non-critical writes (ratings, notes); rollback on failure
- **Offline-aware** — show banner, queue non-critical actions
- **Toast notifications** — bottom-right, auto-dismiss success (4s), persistent errors with dismiss action

### Key Pages (build all)
1. Marketing landing page (public)
2. Pricing page
3. About / How it works
4. Lecturer profiles directory (public, SEO-optimized)
5. Individual lecturer profile (public)
6. Sign up / Sign in / Forgot password / Reset password / 2FA setup / 2FA verify
7. Student onboarding wizard (4 steps)
8. Student dashboard
9. Booking flow (lecturer search → calendar → confirm)
10. Session detail page (with join button)
11. Materials library
12. Payment & subscription management
13. Profile & settings
14. Lecturer application form
15. Lecturer dashboard
16. Lecturer availability editor (calendar UI)
17. Lecturer earnings page
18. Admin dashboard
19. Admin user management
20. Admin financial reports
21. Admin configuration
22. 404, 500, maintenance pages

---

## 8. API DESIGN

- **RESTful**, versioned at `/api/v1/`
- **OpenAPI 3.0 spec** auto-generated from NestJS decorators, hosted at `/api/docs` (admin-only in prod)
- **Consistent response envelope**: `{ data, meta, error }` — never mix shapes
- **Error codes**: domain-specific codes (e.g., `BOOKING_GAP_VIOLATION`, `PAYMENT_DECLINED`) alongside HTTP status
- **Pagination**: cursor-based for lists >100 items, `?limit=&cursor=`
- **Idempotency keys** required on all mutating endpoints (especially payments and bookings)
- **Webhooks** for Stripe, PayHere, Zoom — signature verified, replay-protected

---

## 9. INTEGRATIONS — DETAILED

### Stripe
- Subscription model with three Price IDs (one per tier)
- Webhook handlers for: `customer.subscription.created/updated/deleted`, `invoice.payment_succeeded/failed`, `charge.dispute.created`
- Customer portal enabled for self-service subscription management
- 3D Secure / SCA compliant for European cards

### PayHere (Sri Lankan gateway)
- For lecturers receiving payouts in LKR
- For Sri Lankan students paying in LKR directly
- Recurring tokenization for subscriptions

### Zoom
- Server-to-server OAuth app (NOT JWT, deprecated)
- Auto-create meeting 1 hour before scheduled session
- Unique meeting ID + password per session
- Cloud recording auto-enabled for Tier 2+
- Webhook for `meeting.ended`, `recording.completed` → update session status, store recording URL
- Waiting room enabled, only authenticated participants

### Email (transactional)
- Welcome, email verification, password reset, booking confirmation, session reminder (24h + 1h before), session cancellation, payment receipt, payment failure, monthly progress report, lecturer payout confirmation
- All emails: branded HTML + plain-text fallback, unsubscribe link where applicable, DKIM/SPF/DMARC configured

---

## 10. TESTING STRATEGY

- **Unit tests** (Jest): 70%+ coverage on services, domain logic, validation. Booking gap rule must have exhaustive test cases.
- **Integration tests**: API endpoints with test DB, every auth/authz path tested
- **E2E tests** (Playwright): critical flows — sign up, book session, complete payment, lecturer accepts booking, admin suspends user
- **Load tests** (k6 or Artillery): simulate 500 concurrent users, 10k sessions/month
- **Security tests**: OWASP ZAP scan in CI, manual pen test before launch
- **Accessibility tests**: axe-core in CI, manual screen reader pass

---

## 11. DEPLOYMENT & OPERATIONS

- **CI/CD pipeline**: PR → typecheck + lint + test + build → preview deploy → manual approve → production
- **Zero-downtime deploys** via blue/green or rolling
- **Database migrations**: Prisma migrate, never destructive without explicit flag, always reversible
- **Backups**: hourly snapshots, daily full backup, 30-day retention, quarterly restore drill
- **Monitoring dashboards**: API latency p50/p95/p99, error rate, queue depth, DB connection pool, Redis hit rate, payment success rate, session completion rate
- **Alerting**: PagerDuty or Opsgenie integration for critical alerts only (no alert fatigue)
- **Disaster recovery plan**: documented RTO 4h, RPO 1h
- **Status page**: public statuspage.io or self-hosted

---

## 12. BUILD PHASES (12-WEEK PLAN)

### Weeks 1–2: Foundation
- Repo setup, monorepo or split repos, Docker, CI/CD skeleton
- Auth system end-to-end (sign up, sign in, 2FA, password reset)
- Database schema + Prisma migrations
- Design system + Storybook

### Weeks 3–4: Core Domain
- User profiles (student + lecturer)
- Availability management
- Booking engine with gap-rule enforcement
- Zoom integration

### Weeks 5–6: Payments & Subscriptions
- Stripe integration (subscriptions, webhooks)
- PayHere integration
- Invoice generation
- Lecturer payout calculation engine

### Weeks 7–8: Dashboards & UX Polish
- Student dashboard
- Lecturer dashboard
- Admin dashboard
- Notifications (email + in-app)
- Materials upload + virus scan

### Weeks 9–10: Hardening
- Security audit (internal + automated tools)
- Load testing + performance optimization
- Accessibility audit
- E2E test coverage
- Bug bash

### Week 11: UAT & Soft Launch
- Closed beta with 5 lecturers + 10 students
- Collect feedback, fix critical bugs
- Final security pen test

### Week 12: Production Launch
- Marketing site live
- Public registration enabled
- Monitoring + on-call rotation active
- Post-launch support sprint planned

---

## 13. ACCEPTANCE CRITERIA

The build is considered done when:

- ✅ All four user roles can complete their full journey end-to-end without engineering intervention
- ✅ A student can sign up, pay, book 8 sessions in a month respecting the 3-day-gap rule, attend via Zoom, and receive a recording (Tier 2+)
- ✅ A lecturer can apply, get approved, set availability, conduct sessions, and receive a correctly calculated monthly payout
- ✅ An admin can view real-time MRR, profit, break-even status, and resolve any user dispute
- ✅ All OWASP Top 10 mitigations are verified by automated scan + manual review
- ✅ Lighthouse scores: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 on key public pages
- ✅ p95 API latency < 300ms under 100 concurrent users
- ✅ Test coverage ≥ 70% backend, ≥ 60% frontend critical paths
- ✅ Zero high/critical CVEs in dependencies
- ✅ Full OpenAPI documentation generated
- ✅ Runbook documented for: incident response, payout reconciliation, lecturer onboarding, refund processing

---

## 14. WHAT NOT TO DO

- ❌ Do not use localStorage or sessionStorage for auth tokens
- ❌ Do not store any card data; tokenize via Stripe/PayHere only
- ❌ Do not auto-send messages or auto-take actions on behalf of users without explicit consent
- ❌ Do not over-engineer — no microservices, no Kubernetes for v1; modular monolith is the right call
- ❌ Do not skip the audit log — it is non-optional
- ❌ Do not build mobile apps in v1 — PWA-quality responsive web only
- ❌ Do not allow lecturers to message students outside the platform messaging system (compliance + safeguarding)
- ❌ Do not display lecturer earnings to students or vice versa
- ❌ Do not auto-renew subscriptions silently; always send 3-day-prior reminder

---

## 15. DELIVERABLES

1. Two repositories (or monorepo): `frontend/` and `backend/`
2. Complete Prisma schema + migrations
3. OpenAPI specification
4. Storybook for the design system
5. Seed scripts: 5 demo lecturers, 10 demo students, 50 sample sessions
6. README with local setup, env var documentation, architecture diagrams
7. Runbooks for operations
8. Threat model document
9. Postman/Insomnia collection for API testing
10. Demo video walkthrough of all four user roles

---

**Ship it production-ready, secure, fast, and beautiful. Build like the lecturers' livelihoods and students' education depend on it — because they do.**
