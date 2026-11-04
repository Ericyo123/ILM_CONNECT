---
name: ui-ux-pro-max
description: >-
  Establishes professional design systems, typography, color palettes, spacing scales,
  component styling, and UI/UX patterns. Use when designing, creating, or refining
  interfaces, pages, dashboards, landing pages, or components. Enforces strict visual
  hierarchy, precise alignment, responsive layouts, and eliminates generic AI-looking
  layouts, awkward line spacing, and unnecessary decorative clutter.
metadata:
  source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
---

# UI/UX Pro Max Skill

A professional design intelligence skill and system guide for building production-ready, human-grade user interfaces with cohesive aesthetics, intentional typography, and precise spatial discipline.

---

## 1. Core Principles

1. **Design System First**:
   - Before implementing any UI, determine the visual direction, typography hierarchy, spacing scale, and color system.
   - Never write arbitrary, uncalibrated utility classes (e.g. random margins, arbitrary font sizes) that break rhythm.

2. **Typography Discipline**:
   - **Heading Line Heights**: Headings must use tight, calibrated line-heights (`leading-[1.12]` to `leading-[1.2]`). Never add artificial vertical margins (`mt-2`, `mt-4`) between individual lines of a heading; use natural line breaks (`<br />`) with an exact `line-height` so text breathes naturally without looking cramped or bloated.
   - **Body Line Heights**: Body and descriptive text must use comfortable reading line-height (`leading-relaxed` or `1.6`–`1.75`).
   - **Font Hierarchy**: Maximum 2 primary font families per product (e.g. Display font for titles, clean Sans for UI and body text, with an optional accent Serif for authentic or editorial moments).

3. **Spatial Discipline & Alignment**:
   - Stick to an 8pt / 4pt spatial grid (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px).
   - Ensure horizontal and vertical alignment across multi-column grids.
   - Ensure equal card heights (`h-full flex flex-col justify-between`) when displaying side-by-side cards.

4. **Intentional Color Systems**:
   - **Primary Palette**: Strong brand identity color (e.g. deep emerald green `#095F46`, `#063529`).
   - **Accent Palette**: Purposeful accents (e.g. warm gold `#EAD08A` for badges, borders, or highlights).
   - **Surface & Backgrounds**: Clear cadence between alternating sections (e.g. Image Hero -> Pure White Surface -> Deep Gradient Theme -> Pure White Surface -> Luxury Framed Card).
   - Avoid generic harsh colors, jarring saturated gradients, or unmotivated shadows.

5. **Clutter Elimination (Anti-Patterns)**:
   - Avoid excessive nested rounded cards inside cards.
   - Avoid redundant promotional tags or marketing fluff when simple, honest clarity is stronger.
   - Avoid conflicting media query hacks that break headings unpredictably across screen sizes.

---

## 2. Autonomous UI/UX Review Checklist

When implementing or reviewing any UI feature, evaluate these 7 criteria:

1. **Typography & Line Spacing**:
   - Are heading lines naturally spaced? Neither overlapping nor spaced apart with giant gaps?
   - Is font sizing proportional across mobile (`text-3xl`), tablet (`text-4xl`), and desktop (`text-5xl+`)?
2. **Alignment & Grid Rhythm**:
   - Do multi-column items align cleanly at the top and bottom?
   - Are timeline nodes, icons, and text labels vertically centered or baseline-aligned?
3. **Contrast & Readability**:
   - Does text meet WCAG AA standards (4.5:1 for body, 3:1 for large headings)?
   - Are dark text on light backgrounds and light text on dark gradients crisp and legible?
4. **Responsiveness**:
   - Does the layout gracefully shift from stacked mobile (`flex-col`, `grid-cols-1`) to multi-column desktop (`lg:grid-cols-2`, `lg:grid-cols-12`)?
5. **Component Balance**:
   - Are buttons consistent in padding, font weight, border-radius, and hover states?
   - Are forms, inputs, and touch targets at least 44px on mobile?
6. **Imagery & Media**:
   - Are all images properly contained, sized, and rendered without distortion or breaking aspect ratios?
7. **Copy Screening & Editorial Polish**:
   - Is text concise, dignified, and free from typos, grammar errors, or awkward repetition?

---

## 3. How to Invoke

- Mention `UI/UX Pro Max` or `/ui-ux-pro-max` in your instructions.
- Example: *"Using UI/UX Pro Max, review and polish the courses grid layout and typography."*
