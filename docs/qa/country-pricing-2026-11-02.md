# Country pricing verification

2 November 2026. Implemented in the existing `main` checkout at `571c565`, matching fetched `upstream/main`. Browser verification used the local frontend on port 3100 with deterministic API fixtures; it did not change production prices, accounts, payments, or exchange rates.

The pricing page and About waitlist now use the subscription catalog for every course and tier. Home, pricing, waitlist, subscription selection, and selected-plan billing share the currency hook. Selection precedence is explicit account preference, profile country, guest preference, detected country, then USD. Sri Lanka uses its independently configured LKR amount; GBP, EUR and AUD retain the backend's international conversion policy. No local prices were invented.

The build also required fixing merge leftovers: the pricing selector was not imported, About referenced missing pricing/API declarations, and Home referenced removed testimonial data and an unimported icon. Unused testimonial logic was removed; no testimonial content was added.

## Checks

| Verification | Result |
| --- | --- |
| Frontend production build | PASS: all 39 static pages generated |
| Standalone `npx tsc --noEmit` | PASS; run separately because the repository build skips type validation |
| ESLint on all five changed frontend source files | PASS |
| `node --test test/pricing-regions.test.mjs` | PASS: 2 tests, including country aliases, unsupported countries, and corrupted preferences |
| Backend exchange-rate and subscription service suites | PASS: 42 tests |
| Browser pricing and navigation checks | PASS: 30 checks |
| Browser country, account, storage, and outage checks | PASS: 25 checks |
| Browser final interaction and maximum-price checks | PASS: 14 checks |
| `git diff --check` | PASS |

Browser coverage: every Standard and Fast Track course in all five currencies; per-course prices and collapsed summary; persistence across reload and public pages; country detection and unknown-country fallback; profile precedence and separate accounts; selected-plan billing; blocked storage; failed detection, failed rates, stale rates, failed catalog, empty catalog, and retry recovery. Keyboard checks exercised Fast Track and all seven FAQs. Both pricing calls to action reached `/about#waitlist`.

Layouts were checked at 320, 375, 768, and 1280 pixels. Normal-price checks found no horizontal page overflow; maximum-price checks found no clipped price rows in any of the six course cards. Final interaction checks recorded no JavaScript page errors. Expected HTTP failures in outage fixtures and a missing-subscription fixture are not application exceptions.

Screenshots with fixture prices: `output/playwright/country-pricing-desktop.png` and `output/playwright/country-pricing-mobile.png`. Browser verification scripts were retained in the same output directory.

## Antislop delivery gate for the changed pricing flow

- Hard Gate PASS: native labelled selector remains enabled during outages; rates and catalog expose loading/unavailable/retry states; keyboard controls and destination links were exercised. New selector text colors against white measured 7.67:1, 15.12:1, and 6.30:1. No invented prices, assets, claims, or decorative copy were introduced.
- Purpose Gate PASS: the selector uses existing green, white, typography, and borders to match the course forms. Price rows wrap to accommodate longer currency amounts. The Fast Track summary comes from actual plan values. No new decoration or animation was added.
- Liveliness PASS: ENERGY 2 / RHYTHM 2 / MOTION 2 follows the existing course design. Course titles and prices retain the focal hierarchy; the existing imagery, cream surface, green accent, spacing, and section structure remain the design direction.
- Craftsmanship PASS: all six plan values use backend data; supported currencies, profile and account precedence, errors, recovery, keyboard use, and four viewport sizes passed the checks above. New copy describes the available action without unsupported claims.

## Limits

Browser API responses were controlled fixtures, not an end-to-end check against production data or the live exchange provider. Country detection depends on deployment-provided country headers and falls back to USD when absent. The existing administrator configuration remains responsible for setting local LKR prices. The payment gateway is still unconnected; this work completes regional price presentation, not charging or settlement. Existing recorded payments remain in their recorded LKR amounts.
