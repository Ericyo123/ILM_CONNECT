# Monthly pricing and lecturer payouts

Work is on `main`, based on owner remote `upstream/main` at `571c565`. Both remotes were fetched before editing. Local main already matched the owner's main. The recent feature-branch pricing/waitlist commits were not merged into it.

## Implemented policy

| Student pricing | Solo, each | Duo, each | Duo total | Trio, each | Trio total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Sri Lanka | LKR 5,500 | LKR 4,950 | LKR 9,900 | LKR 4,675 | LKR 14,025 |
| International Standard, any of the three courses | USD 49 | USD 44.10 | USD 88.20 | USD 41.65 | USD 124.95 |
| International Fast Track, 3 sessions/week | USD 69 | USD 62.10 | USD 124.20 | USD 58.65 | USD 175.95 |

- Every student has private lessons. Packages contain two or three distinct students on the same course, pace and pricing region.
- Discounts apply to tuition, including Fast Track. They do not reduce lecturer earnings.
- Each paid student earns one lecturer LKR 1,500/month for Sri Lanka or LKR 3,000/month internationally, including Fast Track. Trials and session counts do not accrue monthly earnings.
- Billing uses calendar months in Sri Lanka time. A completed month is payable; the current month is shown as accruing. There is no partial-month proration.
- Local Fast Track is unavailable because the supplied policy specifies Fast Track internationally only.
- International fees are in USD. LKR bookkeeping uses a verified exchange-rate snapshot, rounds each student's converted fee to cents, then sums the students. Bank proceeds and operating expenses may differ from the reference conversion.
- The monthly remainder subtracts accrued lecturer earnings from that month's recorded tuition. The separate cash summary subtracts payouts actually completed from payments actually received.
- Historical subscriptions and session payouts remain in history. They are not automatically repriced or backfilled into the monthly ledger. Backdated records do not overwrite a student's current plan label.

## Recording and payout flow

The existing online gateway is not connected. An administrator records tuition already received externally in Finance, with a receipt/reference and a server-calculated amount. The app records the successful external payment, activates access for the selected calendar month, snapshots pricing and lecturer assignment, and creates the monthly earning in one transaction. No charge or bank transfer is initiated.

Student/month uniqueness and sorted transaction locks prevent repeated or overlapping package submissions from duplicating tuition. Currency conversion finishes before student locks are held; the confirmed rate snapshot is reused during recording. The server rejects a changed displayed amount.

An administrator can prepare outstanding monthly payouts, or a lecturer can request the full unpaid balance for one completed month. Lecturer locks and conditional reservations prevent duplicate payouts. Successful external payouts retain their reservations. Failed payouts release the earnings for retry while retaining an itemized historical snapshot. A settled payout cannot be processed again.

The additive migration `20261103120000_monthly_pricing_payouts` was tested on a fresh local PostgreSQL database and applied to the configured development database. It updates the six catalog prices, adds subscription pricing snapshots and month uniqueness, and creates a monthly earnings ledger with constraints for the fixed payout amounts.

## Verification

- Backend build passed, including Prisma generation.
- Full backend suite passed: 26 suites, 247 tests. The affected pricing, subscription, finance and payout suites were also run after the final changes.
- The real PostgreSQL API harness passed 56 checks. It covers all nine fee/package combinations, role restrictions, trial exclusion, changed quotes, stale exchange rates, fixed payouts with discounts, assignment changes, duplicate submissions, month closing, reservations, failure/retry, settlement, and revenue totals.
- Concurrent tuition submissions returned one success and one conflict. Concurrent lecturer requests returned one success and one rejection. No duplicate money records were created.
- Browser harness passed 18 workflows/reflow checks. Pricing was checked at 320, 390, 768, 1100 and 1440 pixels; finance and lecturer earnings at 320, 768 and 1440 pixels.
- Scoped axe checks found no WCAG A/AA violations in the new pricing calculator and tuition-recording form. Both pages had no horizontal overflow at 390px with the root text size doubled.
- Changed frontend files passed ESLint. TypeScript reported no errors in changed files.
- Live USD and other currency snapshots refreshed successfully after increasing the exchange transaction timeout from five to thirty seconds.

Browser actions recorded:

| Control | Observed behavior |
| --- | --- |
| Student location | Changes calculator currency and course-card fees together |
| Tuition package | Recalculates Solo, Duo and Trio totals with the correct discounts |
| Course and pace | Recalculates Standard/Fast Track; excludes local Fast Track |
| Fast Track disclosure | Opens and closes with correct expanded state |
| Billing month, package and student selectors | Accept valid selections; package expands to the required number of students |
| Receipt field and record button | Record received tuition; duplicate student/month produces an inline error |
| Prepare monthly payouts | Creates pending requests for unpaid students in a completed month |
| Mark failed | Releases the monthly earnings for retry |
| Mark paid externally | Settles a pending request without initiating a transfer |
| Included students | Pointer and keyboard open/close the itemized payout disclosure |
| Finance, rates and earnings exports | Download CSV files with the expected filenames |
| Lecturer dashboard monthly-payout link | Opens the monthly request section |
| Lecturer month/method selectors and request button | Reserve the chosen month's full balance and show success |
| Student Billing | Displays the stored month, package, discount and original-currency tuition |
| Retry calculation / Retry earnings | Recover after simulated API failures |
| Empty plans / Empty earnings | Explain the missing data without invented records |
| Loading earnings | Shows a perceivable loading message before the response arrives |
| Keyboard navigation | Reaches native selectors and controls with visible focus |

## Design decisions

Reading: monthly tuition and payout tools for ILMBIT administrators, lecturers and students, using Apple's hierarchy, grouping, data-entry and feedback principles. ENERGY 1 / RHYTHM 1 / MOTION 1.

- Keep ILMBIT green `#095f46` for primary actions and the final tuition/remainder amount because these are the decisions people need to find.
- Use white sections, ink `#202823`, secondary text `#56635c`, and quiet `#f1f5f3` notices to fit the existing light application. Text contrast is 7.67:1 for green on white, 6.30:1 for secondary text on white and 5.73:1 for secondary text on notices. Input borders `#728078` have 4.14:1 non-text contrast against white; error text `#9b2727` has 7.74:1.
- Retain the application's typography for continuity; use a 20px section title, 14px supporting copy, 16px controls and tabular numeric amounts for scanning.
- Put selections next to an itemized tuition/discount/earnings calculation on wide screens and stack them in reading order on narrow screens. The calculation belongs to the tuition workflow rather than a generic dashboard template.
- Use 20px section padding on compact screens, 28px on wider screens, and larger gaps between form and calculation to distinguish tasks from the result.
- Contain each transaction in one section. Use rows and native disclosures for details instead of separate decorative cards or icons for every value.
- Add no illustrations, logos, photos, navigation items, display fonts, glows, gradients or new motion. Existing public-page artwork and unrelated layout remain outside the change.

Apple references read: accessibility, layout, typography, color, designing for macOS, cross-platform translation, entering data, lists and tables, feedback, and buttons. Their principles are applied to a web app, not as native macOS navigation conventions.

## Antislop Delivery Gate, changed functionality

Scope is the added/changed monthly pricing, billing and payout controls, not the existing site navigation or unrelated pages.

- R-02 PASS: authored product copy uses no em dashes; existing unrelated copy was retained.
- R-03 PASS: tested widths 320 through 1440px have no page overflow; new controls measure at least 44px high.
- R-17 PASS: fees and payout rates come from the supplied policy; totals come from API records or explicitly labeled calculations.
- R-18 PASS: no testimonials or personal endorsements were created.
- R-23 PASS: no visual assets or navigation structure were added; existing identity was retained.
- R-24 PASS: the added dashboard link points to the existing earnings route and an existing request-section ID.
- R-25 PASS: measured text contrast exceeds 4.5:1; scoped axe checks have no violations.
- R-26 PASS: selectors, submits, payout actions, disclosures and CSV buttons were exercised as recorded above.
- R-27 PASS: loading, empty and error/retry states were exercised in the browser.
- R-28 PASS: no FAQ was added or rewritten.
- R-32 PASS: native controls, visible focus, Tab navigation and keyboard disclosure activation were verified.
- R-33 PASS: UI changes are written directly in React/CSS source using patches; no rewriting script implements the feature.
- R-34 PASS: the existing application ships a light theme; the new sections retain its appearance and add no theme switch.
- R-35 PASS: backend build, real database API checks and browser click-through passed for the scoped functionality; full-site build limitation is recorded below.
- R-36 PASS: no performance, compliance or security claims, testimonials or invented production statistics were added.
- R-37 PASS: the requested Apple design direction and existing ILMBIT identity guided the decisions above.
- R-38 PASS: production amounts come from real API data; test screenshots use explicitly named QA accounts on disposable PostgreSQL.
- R-01 PASS: the existing green marks actionable controls and final calculation totals; no new gradients.
- R-04 PASS: retained download/check/wallet icons describe their actions; no decorative feature icons.
- R-06 PASS: existing typography is retained; numeric alignment aids comparison.
- R-07 PASS: no new background texture or pattern.
- R-08 PASS: no button arrows were added.
- R-09 PASS: payout status labels indicate recorded states; no decorative badges.
- R-10 PASS: no glass treatment added.
- R-12 PASS: new calculation sections sit flat without decorative elevation.
- R-13 PASS: no glow added.
- R-14 PASS: itemized rows and grouped forms reflect the actual billing content, without feature-card repetition.
- R-19 PASS: no new animation; native control feedback is the only added motion.
- R-22 PASS: no illustration added.
- Liveliness PASS: declared calm dials match the screens; ILMBIT color and student-specific tuition/lecturer breakdown supply identity and one calculation focal point.
- C-1 PASS: color, layout, type, spacing and grouping have written reasons above.
- C-2 PASS: each added action has a tested API operation, navigation target, native disclosure behavior or download.
- C-3 PASS: sections follow monthly tuition, calculation, earnings and payout tasks; no promotional filler.
- C-4 PASS: compact/intermediate/wide layouts, 200% text size, keyboard operation and failure recovery were checked.
- C-5 PASS: server records and supplied prices are the source of displayed amounts.
- R-05/R-11 PASS: form/result layout reflows deliberately; shared 16px section and 8px control radii are consistent.
- R-15/R-16 PASS: actions say “Record received payment”, “Prepare monthly payouts” and “Request monthly payout”; copy explains actual behavior without buzzwords.
- R-20/R-21 PASS: controls and content remain distinct in the existing light theme; no ornamental visual system was introduced.
- R-29/R-30/R-31 PASS: existing brand colors and typography are retained, no product is visually cloned, and major decisions have written reasons.

## Base-branch issue resolved during PR integration

The initial owner-main checkout failed while prerendering `/` because `useInView` was undefined. TypeScript also reported existing undefined references on the home and About pages. The open PR already contained the fixes for these public pages. Before publication, its changes were integrated with the monthly pricing implementation, preserving the latest tuition calculator and dropdowns.

The final integrated frontend production build and standalone TypeScript check pass. The combined backend suite passes 263 tests across 27 suites, the country-mapping tests pass, and the five-width dropdown/accessibility checks pass. No merge-conflict markers or whitespace errors remain.

The scoped routes run directly in the development server: `/pricing`, `/admin/finance`, `/admin/config`, `/lecturer/earnings`, and `/student/billing`. The normal review server uses port 3001 and the configured backend on port 3002.
