# Tuition dropdown redesign

The three calculator fields now use styled, accessible selection menus with supporting descriptions, selected-item checkmarks, and collision-aware positioning. Their rounded containers use the site's `--radius-control`, Helvetica body text, ILMBIT green, and existing light surfaces. The course field spans the form width so course names can wrap without competing with a second field. The calculator heading uses the site's Bricolage heading family, and a quiet inset section groups the monthly calculation.

Design Markdown reviewed: `frontend/CLAUDE.md`, `frontend/AGENTS.md`, `docs/qa/about-ui-continuity-2026-10-12.md`, and visual guidance in `antigravity_prompt.md`. Current CSS tokens and existing pricing cards supplied the actual colors, typefaces and radii. The historical prompt was read for visual context only. The current pricing rules remain unchanged.

Apple references: pop-up buttons and menus support labeled, mutually exclusive choices, predictable defaults, selected-item indicators and grouped information. Antislop remains in during mode. Dials: ENERGY 1 / RHYTHM 2 / MOTION 1.

## Decisions

- Softer 14px control corners reuse the site's existing radius token and distinguish the fields from the outer 24px calculator section.
- Two-line values explain currency, student count/discount and course pace directly within the relevant choice.
- Green checkmarks and accessible selected states show the chosen option; text remains readable without depending on color alone.
- Popup shadows indicate the floating menu layer. The surrounding containers remain flat.
- The course field spans the row to accommodate the actual course titles. Narrow layouts stack all three fields.
- Only chevron rotation and brief hover feedback are added; reduced-motion preferences remove transitions.
- Radix Select provides keyboard navigation, typeahead, focus return, outside dismissal and viewport collision handling. No custom focus-management implementation was added.

## Verification

Browser checks passed at 320, 390, 768, 1100 and 1440px:

- Each of the three menus opens and chooses an option.
- Local Trio totals LKR 14,025; local Duo totals LKR 9,900; international Fast Track Duo totals USD 124.20 and Trio totals USD 175.95; Solo returns to USD 69.
- Home/Enter selects the first package; typing “t” in the course menu focuses Tajweed and Enter selects it.
- Escape closes the menu and returns focus to its trigger. Tab moves to the next field. Clicking outside dismisses the menu.
- Popup bounds stay within the viewport. All three targets exceed 44px and long course names wrap.
- The page has no horizontal overflow at the tested widths, including 390px with 200% root text size.
- Scoped axe checks found no WCAG A/AA violations in the calculator or open menus at any tested width. Browser checks reported no page errors.
- Touch-emulated selection correctly calculated the local Duo total. Forced-colors mode still opened and dismissed the menu.
- Updated the existing browser QA harness to use the custom menu interactions.
- ESLint and whitespace checks pass. TypeScript reports only the already documented home/About errors; changed files have no errors.

Screenshots and measurements are saved in `output/monthly-pricing/dropdown-redesign/`.

## Antislop Delivery Gate, this change

- Hard Gate PASS: actual policy/quote data supplies all amounts, no new promotional claims or personal assets were added, menus and error/loading states work, popup bounds and text scaling were checked, and no unrelated navigation or themes were changed (R-02/03/17/18/23/24/26/27/28/33/34/35/36/37/38).
- Contrast PASS: the control border `#7d8e83` has 3.30:1 non-text contrast against `#f8faf8`; supporting text `#56635c` has 5.67:1 contrast on highlighted options `#edf5f0`. Existing dark text and green retain their verified contrast (R-25).
- Keyboard PASS: Arrow keys, Home, Enter, typeahead, Escape, Tab and focus restoration were exercised (R-32).
- Purpose Gate PASS: the chevron opens choices; the checkmark indicates selection; popup elevation separates layers; existing fonts and brand colors retain identity. No imagery, gradients, glow or decorative badges were introduced (R-01/04/06/07/08/09/10/12/13/14/19/22).
- Liveliness PASS: declared dials match the restrained utility; the form/result composition and ILMBIT typography distinguish the calculator without competing with the pricing content.
- Craft and consistency PASS: shared field/menu components, documented type/spacing/radius choices, real quote checks, responsive screenshots and accessibility results support the result (C-1 through C-5; R-05/11/15/16/20/21/29/30/31).

The previously documented unrelated home/About build errors remain outside this change.
