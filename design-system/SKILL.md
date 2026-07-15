---
name: casa-kaypa-design
description: Use this skill to generate well-branded interfaces and assets for Casa Kaypa (a boutique country retreat in Santa Eulalia, Peru), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and
create static HTML files for the user to view. Link `styles.css` for the full token system,
or copy the token values you need. If working on production code, you can copy assets and
read the rules here to become an expert in designing with this brand.

Key facts:
- **One typeface only: Boska** (high-contrast display serif). Never substitute or pair. It
  loads from the Fontshare CDN via `tokens/fonts.css`; binaries can be self-hosted from
  `assets/fonts/` once provided.
- **Palette:** Warm Ivory canvas, Cream secondary, Charcoal ink, with Sage / Seafoam /
  Terracotta / Dusty Rose accents used sparingly as punctuation.
- **Signature devices:** 1px charcoal hairline rules, uppercase wide-tracked labels, soft
  warm shadows, generous negative space, thin-line/botanical iconography (Lucide).
- **Voice:** warm, unhurried, editorial; Spanish-first with elegant English; sells feeling
  and time, never hype. No emoji.
- **Logo:** in `assets/logo/` — use as-is; never recolor, distort, or redraw.
- **Components:** Button, Tag, Eyebrow, Divider, Input, Card (see `components/core/`).

If the user invokes this skill without any other guidance, ask them what they want to build
or design, ask a few questions, and act as an expert designer who outputs HTML artifacts
_or_ production code, depending on the need.
