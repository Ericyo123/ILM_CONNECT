# Form borders and public page headers

3 November 2026. Changes are local, with screenshots captured from a production build for group review. Nothing was pushed or deployed.

The About waitlist, waitlist modal, and tutor application use the shared `#84958c` control border. The phone picker has a complete outer boundary. Unselected pace and tutor choices have matching outlines, and the forms have explicit keyboard focus outlines. The waitlist grid now shrinks properly at 320px instead of clipping its fields.

Pricing and tutor pages have a light navigation surface at the top. Their hero photographs use one lighter overlay. The tutor hero previously stacked three overlays in addition to reducing image opacity.

This checkout did not contain `/teach`. The existing page and four supporting photographs were restored from `upstream/frontend`; the current shared hero now accepts its application link. The restored form uses the existing lecturer registration endpoint. Its network-error path now retains the form and displays an error instead of falsely reporting success. Country of residence and city are retained in the request. Tutor links were restored in desktop and mobile navigation.

## Verification

| Check | Result |
| --- | --- |
| Production build | PASS, including `/teach` |
| TypeScript | PASS, standalone `tsc --noEmit` |
| ESLint | PASS on changed TSX files |
| Browser checks | PASS, 45 assertions on the local production build |
| Control border contrast against white | PASS, 3.15:1, above the 3:1 non-text requirement |
| Placeholder contrast against white | PASS, 6.30:1 |

Browser checks covered 320, 390, 768, 1280, and 1600px widths, form-field fit and height, phone boundaries, focus outlines, native validation, pace selection, tutor password reveal, experience, subjects, availability, failed submission, mocked success, and mobile navigation. No JavaScript page errors were recorded. Registration responses were intercepted; no real registration was submitted.

Screenshot pricing comes from the running local backend. The capture script proxies those requests through Playwright because the temporary production-preview port is outside the backend's configured CORS origins. Prices were not fabricated or inserted into the page.

## Design decisions and antislop delivery gate

Direction: retain Ilmbit's existing green, cream, and photographic language. ENERGY 2 / RHYTHM 2 / MOTION 1 for these changes.

- Hard Gate PASS for the requested changes: fields fit all five tested widths, focus is visible, controls and form states were exercised, existing photographs were reused, and the app was built and run.
- Purpose Gate PASS: darker borders identify editable fields; a light navigation surface keeps links readable independently of the photograph; a single overlay preserves image detail and heading hierarchy. Existing typography, spacing, and brand colors provide continuity.
- Liveliness PASS: existing photographic focal points, green actions, and varied page sections preserve the declared direction. No decorative motion or new imagery was introduced.
- Craftsmanship PASS: build, standalone type check, targeted lint, 45 browser checks, and visual inspection of desktop and mobile captures passed. A failed tutor request cannot display the success state.

This is verification of the requested UI changes, not a full audit of unrelated existing content or backend registration delivery.

## Screenshots

Desktop captures use 1600 × 1000.

- [Pricing header](../../output/playwright/pricing-header-updated.png)
- [Tutor header](../../output/playwright/tutor-header-updated.png)
- [Waitlist form](../../output/playwright/waitlist-form-updated.png)
- [Tutor form](../../output/playwright/tutor-form-updated.png)
- [Pricing on mobile](../../output/playwright/pricing-header-mobile.png)
- [Tutor on mobile](../../output/playwright/tutor-header-mobile.png)

Browser check and capture scripts are retained in `output/playwright/ui-review-checks.js` and `output/playwright/capture-ui-review.js`.
