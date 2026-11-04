# Mobile pricing selector and form email verification

2 November 2026. Continued on the existing `main` checkout. Existing country-pricing work from the earlier request was retained.

Outside forms, the pricing selector now uses a bottom sheet below 640px: full-width trigger, separate region and currency labels, selected-state indication, 44px or larger touch targets, Escape/close handling, focus containment and restoration, and background scroll locking. Desktop retains the existing select. The presentation is enabled on Home, Pricing, selected-plan Billing, and the subscription gate.

The About waitlist, waitlist modal, and country phone input were not edited in this follow-up. SHA-256 values before and after match:

| File | SHA-256 |
| --- | --- |
| `frontend/src/app/about/page.tsx` | `451c6a17d84531c565b5f7a26346e6265ca237dbd5c98456a15ecc6326968443` |
| `frontend/src/components/waitlist-modal.tsx` | `e22f04196f508e41eafc121751af6da5e248d26849850c6cc105fa9e0607935e` |
| `frontend/src/components/country-phone-input.tsx` | `06123cacb72d9619cf85862c5dd205157f9f9d045b1e78641a84abc17385aa27` |

The shared selector defaults to its original native form presentation. Browser checks confirmed that the About form still exposes its native currency and phone-country selects on mobile and has no new currency-sheet trigger.

Both public forms already use the same waitlist endpoint. That endpoint now sends saved enquiry details to `contact@bitmosolutions.com` through the existing Resend key and sender configuration. The address was found in the user's company project sources. The backend local recipient variable and example configuration were updated. The visitor's address is Reply-To. Failures return a retryable message while retaining the enquiry; retries use the saved entry's provider idempotency key.

## Verification

| Check | Result |
| --- | --- |
| Frontend production build | PASS: 39 static pages generated |
| Backend production build | PASS: Prisma client generation and TypeScript compilation |
| Frontend standalone type check | PASS |
| Targeted frontend ESLint | PASS |
| Auth and existing email service unit tests | PASS: 34 tests |
| Real Nest HTTP route tests with mocked DB and Resend | PASS: 4 tests |
| Mobile browser checks using deterministic API fixtures | PASS: 35 checks |
| Form-file hashes | PASS: all three unchanged |
| `git diff --check` | PASS |

Browser checks covered 320px, 375px, 430px, and desktop, all five currencies, price updates, saved choice, focus trapping/restoration, Escape/close controls, scroll lock, native form selectors, and Home/Pricing consistency. No JavaScript page errors were recorded. The sheet screenshot is `output/playwright/mobile-currency-sheet.png`; the browser check script is retained in the same output directory.

HTTP checks exercised the actual public endpoint and DTO validation: accepted form payload to the configured recipient, invalid-email rejection, saved-request retry after provider failure, and rejection of visitor-supplied recipient fields. No production database or mailbox was mutated by these tests.

## Antislop delivery gate

- Hard Gate PASS: all sheet controls were exercised and measured at least 44px tall; no horizontal sheet overflow at tested phone widths; keyboard focus remains in the dialog and returns on dismissal. Selected green text against pale green measured 6.93:1, secondary text 5.68:1, and trigger-border contrast against white 3.85:1, exceeding the 3:1 non-text requirement.
- Purpose Gate PASS: the existing green and white palette identifies the selected region; separate currency codes make options easier to scan; bottom placement keeps choices reachable on phones. Check, chevron, and close icons communicate selection, disclosure, and dismissal. No decorative motion or assets were added.
- Liveliness PASS: the existing ENERGY 2 / RHYTHM 2 / MOTION 2 direction remains. The new sheet uses a clear heading and selection hierarchy with the existing typography and green accent.
- Craftsmanship PASS: both builds, type check, targeted lint, 38 backend tests, 35 browser checks, and unchanged form hashes passed. Error handling retains saved requests and never reports simulated email delivery as success.

## Limits

No real email was sent during verification. The existing key allows sending but cannot list sender domains, so live delivery and the sender's production verification status remain unverified. Changes are local and have not been pushed or deployed. The recipient has a code default; production still requires the existing Resend key and a verified sender.
