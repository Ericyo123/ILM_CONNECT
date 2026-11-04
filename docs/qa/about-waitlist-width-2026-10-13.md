# About waitlist width correction

The waitlist card had an additional `max-w-6xl` cap inside the About page's `max-w-7xl` container. Removing that cap makes its visible edges align with the other sections. Mobile side padding now uses the same 16px gutter as the other About sections.

Verification:

- Desktop 1440 × 900: form edges are x=112 and x=1328, width 1216px; these exactly match the pillars section's content edges.
- Phone 390 × 844: form edges are x=16 and x=374, width 358px, with equal 16px side gutters.
- Both checked sizes have no horizontal page overflow.
- Desktop screenshot inspected; columns, inputs, and submission button remain contained.
- ESLint for the About page and `git diff --check` pass.

Antislop gate, scoped to this width and gutter correction:

- Hard gate PASS: no copy, assets, claims, navigation, or controls added; responsive widths verified without overflow. Existing form behavior is unchanged.
- Purpose gate PASS: removing a redundant width cap aligns this card with established page geometry; no effects or decorative techniques added.
- Liveliness PASS: existing composition and ENERGY 2 / RHYTHM 2 / MOTION 1 retained; content remains the focal point.
- Craftsmanship PASS: measured form edges match surrounding content; equal mobile gutters and desktop screenshot verified; no unrelated form styling or functionality changed.
