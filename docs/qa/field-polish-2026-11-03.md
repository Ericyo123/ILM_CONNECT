# Dropdown and calendar field polish

The screenshot showed dropdown chevrons nearly touching the right border. A shared, scoped control style now gives chevrons a 14px inset and reserves 48px on the trailing side for the icon and separation from text. It applies to monthly pricing/payout sections and the admin dashboard, including session filters and lecturer-assignment fields.

Date and month fields have matching 48px minimum heights, 14px horizontal padding, and an inset native calendar indicator. Select text uses regular weight to distinguish values from field labels. The system pickers remain native for familiar keyboard and touch behavior. Forced-colors mode restores the native select arrow.

Direction remains ILMBIT's existing light appearance, guided by Apple's picker and text-field principles. ENERGY 1 / RHYTHM 1 / MOTION 1. The extra icon spacing prevents a collision with the outline; matching heights align related controls; existing green focus styling identifies the active field. No backend or pricing behavior changed in this follow-up.

## Verification

- Public pricing loaded against the running backend. Switching to Sri Lanka/Duo still calculated LKR 9,900.
- Computed dropdown styles confirmed 48px height, 48px trailing padding and a 14px chevron inset.
- Admin Finance was checked with clearly labeled QA preview data and read-only intercepted requests. The billing month accepted October 2026, the native month picker opened and dismissed, and Trio expanded the form to three student selectors.
- Admin Finance had no horizontal overflow at 320, 390, 768 and 1440px. Public pricing also fit desktop and 390px mobile widths.
- The admin Sessions filter received the same styling and remained keyboard operable.
- Scoped axe checking of the tuition form found no WCAG A/AA violations. Browser checks had no page errors.
- ESLint passed for the changed admin layout; `git diff --check` passed.
- Screenshots and computed-style evidence are saved under `output/monthly-pricing/field-polish/`.

## Antislop Delivery Gate, this follow-up

- Hard Gate PASS: no new product copy, claims, personal assets, navigation, FAQ, data flows, or themes; responsive layouts and existing native behaviors were verified above (R-02/03/17/18/23/24/26/27/28/33/34/35/36/37/38).
- Contrast PASS: existing text colors are retained; the `#728078` field border has 4.14:1 contrast against white, and the chevron `#56635c` has 6.30:1 (R-25).
- Keyboard PASS: native selection, month editing, picker dismissal, visible focus and session filtering work (R-32).
- Purpose Gate PASS: the only added glyph replaces the dropdown affordance, with spacing justified above; no decoration, new animation, imagery, shadows, badges or gradients (R-01/04/06/07/08/09/10/12/13/14/19/22).
- Liveliness PASS: existing identity and calm dials remain; values and calculations retain the screen's focal hierarchy.
- Craft and consistency PASS: one reusable control style covers the requested surfaces, native semantics remain, and browser/contrast evidence supports the result (C-1 through C-5; R-05/11/15/16/20/21/29/30/31).

The previously documented unrelated home/About build errors remain outside this follow-up.
