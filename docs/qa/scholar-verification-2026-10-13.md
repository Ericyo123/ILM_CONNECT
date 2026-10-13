# Scholar verification reference layout

Scope: four review points in the About page's scholar-verification section.

Design Read: an editorial process diagram for families, following the user's curved-path reference. ENERGY 2 / RHYTHM 2 / MOTION 1.

Latest number refinement: PASS. Large faded numbers occupy a dedicated side column, with a measured 12px gap from headings and descriptions on desktop. Numbers are 72px high on desktop and 56px on smaller screens. On phones the description spans both columns below the number and heading, retaining a readable text measure. Color #c7d2c9 retains the requested pale treatment. Numbers remain redundant decoration hidden from assistive technology.

The desktop path is restored to 400px tall and intro gap to 48px, reducing diagram space by 148px compared with the previous version. Screenshot inspections at desktop and phone sizes passed. Browser checks at 1440px, 1200px, 768px, and 320px show no horizontal overflow or number/text overlap. ESLint and diff whitespace checks pass.

Focused QA found the curve touching "Europe," in the third description after the side-column change. Moving the upper text blocks 24px upward corrected it. Sampling the SVG path every two units against every rendered word rectangle, with a 2px clearance buffer, now detects zero text intersections at both 1440px and 1200px. Existing delivery gate remains satisfied.

## Decisions and verification

- Layout: alternating text above and below the horizontal curve matches the supplied reference and preserves all four real review steps.
- Color: brand green #095f46, the existing pale green background #f3f5f0, dark headings, and muted descriptions keep the diagram consistent with the site.
- Typography: existing heading and body fonts preserve the site's voice; large faded step numbers occupy a separate side column, without carrying information alone.
- Markers: white hexagons reproduce the reference's anchors. Graduation cap, audio lines, conversation, and shield represent qualifications, oral assessment, communication, and safeguarding respectively.
- Shadow: a subtle path offset separates the curve from the background; restrained marker shadows lift only the anchors.
- Spacing: fixed wide-screen wave coordinates align marker centres with peaks and troughs; text remains separate from the curve.
- Responsive behavior: below 1200px a vertical curve follows the steps in reading order. Each item owns its curve segment so taller descriptions cannot shift markers off the path.
- Motion: the process diagram renders immediately, without reveal effects or animated curves.

QA charter: inspect the reference composition, text-to-path separation, content preservation, responsive reflow, semantics, and runtime behavior.

- Inspected desktop screenshots at 1440px and 1200px; all four text blocks and markers align with the wave.
- At 1024px the layout switches to a vertical path, avoiding the narrow horizontal composition's text collisions.
- At 768px and 320px there is no page overflow. The longest phone item grows to 263px and its marker remains centred on its individual curve segment.
- Browser snapshot contains all four semantic articles. The family-teaching description is condensed while retaining its English communication, teaching, and country context. Curves, icons, and repeated large numbers are hidden from assistive technology.
- Changed section has zero interactive controls; no click-through actions are required.
- Body contrast: 6.75:1 against #f3f5f0. Green markers: 7.67:1 against white. Pale numerals are redundant decoration, not the sole labels for any step.
- ESLint for the About page and `git diff --check` pass.
- No section-specific console errors. Existing unauthenticated `/api/v1/auth/me` request returns 401.

## Antislop delivery gate

### Hard gate

- R-02 PASS: no new em dashes in rendered text.
- R-03 PASS: desktop, tablet, and 320px phone checked without overflow; vertical segments grow with text.
- R-17 PASS: four numbered steps represent existing content, not invented statistics.
- R-18 PASS: no testimonials or identities added.
- R-23 PASS: user explicitly requested the supplied diagram composition.
- R-24 PASS: no navigation added.
- R-25 PASS: computed content text and icon contrast exceeds AA. Faded numbers are redundant decorative elements.
- R-26 PASS: no interactive elements in the changed section.
- R-27 PASS: authored static process content has no fetching dependency.
- R-28 PASS: no FAQ added.
- R-32 PASS: semantic headings and articles retain reading order; decoration is hidden from assistive technology.
- R-33 PASS: JSX and CSS edited directly with apply_patch.
- R-34 PASS: existing fixed light section treatment retained; no theme control added.
- R-35 PASS: app run, screenshots inspected, viewport checks and lint passed; control inventory is empty.
- R-36 PASS: no new claims added.
- R-37 PASS: user reference supplies direction.
- R-38 PASS: review content retained, with the family-teaching description condensed for the narrow column.

### Purpose gate

- R-01 PASS: established green palette; no decorative gradient added.
- R-04 PASS: each icon represents its specific review activity; reasons recorded above.
- R-06 PASS: existing site fonts retained.
- R-07 PASS: wave communicates process sequence, not a decorative background grid.
- R-08 PASS: no arrows added to buttons.
- R-09 PASS: hexagons identify real review stages; no promotional badges.
- R-10 PASS: no glass effects added.
- R-12 PASS: restrained shadows lift the path anchors; purpose recorded above.
- R-13 PASS: no glow effects.
- R-14 PASS: open alternating composition follows the reference, without repeated cards.
- R-19 PASS: static process layout matches MOTION 1.
- R-22 PASS: diagram directly represents the review process; no generic illustrations.

### Liveliness

- Dials PASS: ENERGY 2 / RHYTHM 2 / MOTION 1 recorded.
- Consistency PASS: alternating curve and static rendering reflect those dials.
- Focal point PASS: heading identifies the process above the sequence.
- Whitespace PASS: text sits between curve anchors without crossing the path.
- Accent PASS: brand green directs attention along the process.
- Identity PASS: qualifications, recitation, family communication, and safeguarding are specific to the platform.
- Design Read PASS: direction follows the user reference and is recorded above.

### Craftsmanship and quality locks

- C-1 PASS: layout, palette, type, markers, shadows, spacing, and motion have written purposes.
- C-2 PASS: no inert controls added.
- C-3 PASS: exactly the four real review points requested.
- C-4 PASS: narrow layouts use per-item vertical segments; content height remains flexible.
- C-5 PASS: no fabricated claims or identities.
- R-05 PASS: supplied process composition determines the structure.
- R-11 PASS: hexagonal anchors follow the reference; other elements retain existing geometry.
- R-15 PASS: no CTA added.
- R-16 PASS: no marketing buzzwords added.
- R-20 PASS: existing Islamic education review content establishes identity.
- R-21 PASS: existing light section retained.
- R-29 PASS: established green and neutral palette only.
- R-30 PASS: composition follows the user's reference, not a software product template.
- R-31 PASS: all major decisions have reasons recorded above.
