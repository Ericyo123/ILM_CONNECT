# Shared dropdown controls

3 November 2026. The app remains running at http://localhost:3001 with the local backend at port 3002. No deployment or backend write was performed.

Replaced 26 visible native select fields across 19 files with `FormSelect`, which reuses the pricing calculator's Radix menu and CSS. This covers public forms, country and currency pickers, signup, tutor qualification, dashboard filters, support, lesson access, assessments, materials, and billing controls. The pricing calculator keeps its existing larger controls with descriptions.

Each compact trigger has one 20px arrow, 18px inline padding, a 48px minimum height, the existing green selection indicator, and a menu constrained to the viewport. The native select is retained invisibly for existing change handlers, required-field validation, FormData, and reset behavior. Menus opened inside native dialogs use that dialog as their portal container.

## Verification

- Production build and standalone TypeScript check passed.
- New component and clean migrated files passed targeted ESLint. Broader lint finds 37 existing errors in four dashboard pages. Running the same checks on their HEAD versions produced the same 37 errors; these are unrelated unused symbols and `any` types.
- 59 browser assertions passed across the waitlist, tutor form, and signup at 320, 390, 768, and 1440px. Checks covered trigger and menu fit, target height, one arrow with at least 14px clearance, Escape and focus restoration, selection state, required-field validation, and keyboard navigation.
- Two additional checks passed using the real shared-materials form with intercepted backend responses: selected session ID is preserved in FormData, and reset restores the placeholder. No upload or backend mutation was sent.
- Inspected an open desktop menu in `output/playwright/dropdown-menu-desktop.png`.

Browser scripts are `output/playwright/dropdown-review.js` and `output/playwright/dropdown-formdata-review.js`.

## Antislop delivery gate

- Hard Gate PASS for this change: all visible select call sites use the shared component; the browser checks verified keyboard controls, validation, form data, and mobile fit. No claims or visual assets were added.
- Purpose Gate PASS: reuse the user's pricing menu for consistency; reserve space for the arrow so it cannot touch the border; use compact triggers where the form does not need a description.
- Liveliness PASS: retain the existing Ilmbit identity and ENERGY 2 / RHYTHM 2 / MOTION 1 direction, with green selection and focus states and motion limited to the disclosure arrow.
- Craftsmanship PASS for this change: build, standalone types, targeted lint, 61 browser assertions, source inventory, and visual inspection completed. The four pages' pre-existing lint errors are recorded above.
