# Three pillars design verification

Scope: the Three Sacred Pillars of Every Lesson section on `/about`. Existing page controls and unrelated working-tree changes are outside this change.

Direction: the user's latest reference supplies a heading and introduction on the left, three tall photo pillars on the right, and rounded tops with square bottoms as explicitly requested. Single-line titles remain over the images, with Arabic and descriptions beneath. ENERGY 2 / RHYTHM 2 / MOTION 1.

## Decisions

- Color: the existing off-white #fbfbf9 and brand green connect the section to its neighbouring About sections.
- Layout: a left introduction balances three narrow 184px photo pillars on the right, retaining the shorter middle pillar.
- Typography: Bricolage headings and the existing body font match the site; Amiri remains reserved for Arabic.
- Spacing: compact vertical padding keeps the entire section beneath the fixed header on a 1366 × 768 desktop viewport.
- Panels: rounded tops echo an Islamic arch silhouette; square bottoms keep a firm baseline as explicitly requested. Clipping applies only to photo crops.
- Images: a Quran held for recitation, quiet prayer as a symbol of humility, and careful Quran study relate respectively to Talaqqi, Adab, and Amanah. Dark backgrounds unify their aesthetic; these are illustrative stock photos, not Ilmbit staff.
- Scrim: a dark gradient provides constant 85% dark backing behind each single-line title, fading above it to preserve the photographs.
- Responsiveness: tablets retain three narrow pillars; phones stack the same tall silhouette without widening photos into boxes.
- Copy: concise descriptions retain the existing teaching principles; redundant English subtitles removed, and Arabic appears directly under every photo.
- Motion: this section renders directly without a reveal animation so the three principles remain visible together.

## Evidence

- ESLint: `npx eslint src/app/about/page.tsx` passes.
- Latest browser checks: 1440 × 900 and 1366 × 768 desktop, 640 × 900 tablet, and 320 × 740 phone. No horizontal overflow or title overflow.
- Latest layout: at 1366 × 768 the section is 650.75px high and ends at 750.44px, fully visible below the fixed header. Outer photos are 184 × 361px, middle photo 184 × 313px. The screenshot was visually reviewed. Additional checks at 900 × 900, 640 × 900, and 320 × 740 show no overflow; titles remain single-line and all images load.
- All three images load successfully, with descriptive alternatives.
- Contrast: body text 7.15:1; Arabic green tested against #fbfbf9; white titles against the brightest possible composited scrim background 11.65:1.
- Every English title is one line (21px tall) without horizontal overflow, fitting within the constant-opacity 56px scrim area. Arabic labels also stay on one line without overflow.
- Interaction inventory: the changed section contains zero links, buttons, inputs, or selects; no click-through actions added.
- Existing browser console limitation: `/api/v1/auth/me` on port 3002 returns 401 for the unauthenticated preview. No section-specific runtime errors observed.
- Visual review: desktop and mobile screenshots inspected; heading remains visible below the floating header after scrolling settles.

## Antislop delivery gate

Each PASS below applies to the changed section.

### Hard gate

- R-02 PASS: no new em dashes in rendered text.
- R-03 PASS: revised layout tested at desktop, tablet, and phone widths without horizontal overflow or clipped titles.
- R-17 PASS: no statistical claims added.
- R-18 PASS: no testimonials or identities added.
- R-23 PASS: user explicitly requested Islamic photos and supplied the layout reference.
- R-24 PASS: no navigation items added.
- R-25 PASS: computed contrast ratios exceed AA; title area lies entirely within the constant dark scrim.
- R-26 PASS: static section with no controls or dead actions.
- R-27 PASS: fixed authored content requires no fetched-data states; title and text remain available if decorative photography cannot load.
- R-28 PASS: no FAQ added.
- R-32 PASS: semantic section and headings; no new keyboard interactions.
- R-33 PASS: source edited directly using apply_patch; no rewriting scripts.
- R-34 PASS: no theme control or theme behavior changed; section uses its existing fixed light treatment.
- R-35 PASS: app run in browser, screenshots inspected, ESLint passed; section interaction inventory is empty.
- R-36 PASS: no new performance, security, or customer claims.
- R-37 PASS: user-supplied reference determines the design.
- R-38 PASS: pillar descriptions condensed from existing content; real Pexels photos have source records.

### Purpose gate

- R-01 PASS: gradient exists only to make photo titles readable; reason recorded above.
- R-04 PASS: no decorative icons added.
- R-06 PASS: site heading and body fonts unify the section with adjacent content; Arabic retains its existing serif.
- R-07 PASS: no decorative grid or background pattern added.
- R-08 PASS: no button arrows added.
- R-09 PASS: no badges added.
- R-10 PASS: no glass effects added.
- R-12 PASS: no shadows added to pillars.
- R-13 PASS: no glows added.
- R-14 PASS: open editorial columns and a shorter middle panel follow the actual three-pillar content and reference.
- R-19 PASS: no section animation added; static composition matches MOTION 1.
- R-22 PASS: real photographs connect directly to Islamic learning; no generic illustrations.

### Liveliness

- Dials PASS: ENERGY 2 / RHYTHM 2 / MOTION 1 declared before implementation.
- Consistency PASS: photo-led composition, shorter centre panel, no decorative motion.
- Focal point PASS: section heading identifies the subject in a distinct left column beside the photo sequence.
- Whitespace PASS: column gutters separate principles; compact outer spacing keeps the section together.
- Accent PASS: brand green reserved for Arabic labels within the section.
- Identity PASS: recitation, humility in prayer, careful study, and bilingual typography connect it to Islamic learning.
- Design Read PASS: declared before generation in the conversation and recorded above.

### Craftsmanship and quality locks

- C-1 PASS: major design choices have written reasons.
- C-2 PASS: no inert interactive elements in the section.
- C-3 PASS: exactly the three existing principles requested by the user.
- C-4 PASS: mobile, tablet, and desktop reflow inspected; static content is not dependent on hover or motion.
- C-5 PASS: no claims or testimonials invented.
- R-05 PASS: composition follows the supplied reference and existing content.
- R-11 PASS: computed photo radius is 999px 999px 0px 0px, giving rounded tops and square bottoms as requested.
- R-15 PASS: no CTA added.
- R-16 PASS: no marketing buzzwords added.
- R-20 PASS: Quran learning photographs and Arabic labels establish the section's subject.
- R-21 PASS: existing light treatment retained.
- R-29 PASS: the surrounding site's off-white, dark green, muted body text, and green accent define the UI palette.
- R-30 PASS: user's reference guides the composition, not a software product template.
- R-31 PASS: reasons for color, layout, typography, spacing, panels, and imagery recorded above.

Photography credits: [SOURCES.md](../../frontend/public/images/about/SOURCES.md).

## Focused QA session

Padding refinement: PASS. Container now matches the About page's 1280px maximum width and 16/24/32px responsive side gutters. Equal vertical padding scales between 32 and 48px. At 1366 × 768 measured top and bottom padding are both 38.4px, section ends at 731.22px, heading remains two lines and introduction three lines. Desktop and 320px phone show no overflow; screenshot inspected. Existing delivery gate remains satisfied.

Paragraph refinement: PASS. Desktop introduction uses a 42ch measure to sit beneath the two-line heading in three lines. Browser verification at 1366 × 768 measured 82px height / 27.2px line height, three lines with no overflow; 1440 × 900 also renders three lines. Smaller layouts retain their existing natural wrapping. Existing delivery gate remains satisfied.

Latest heading refinement: PASS. At 1366 × 768, the heading renders in two lines: "Three Sacred Pillars" / "of Every Lesson". Measured height 94px with a 47.127px line height; no heading or page overflow. Explicit line breaks apply from 1200px; smaller layouts retain natural wrapping. Screenshot inspected. The existing delivery gate remains satisfied; only heading wrapping changed.

Charter: explore the revised pillars with desktop, tablet, and phone widths to check visual consistency with the About page, image loading, single-line labels, and the one-screen desktop requirement.

- Image oracle: replaced the classroom and home photos with subdued photographic subjects; the third photo remains unchanged.
- Product oracle: heading font, description font, background, and green Arabic labels now use established site styles.
- Boundary check: 320px phone and 640px tablet show no page overflow or English/Arabic label overflow.
- Claims check: 1366 × 768 contains the full section below the header; all three photos load.
- Debrief: no unresolved defects found within the changed section. Existing unauthenticated auth endpoint returns 401, unrelated to the section. No new interactive controls were added.
