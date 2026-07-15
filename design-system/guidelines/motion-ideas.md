# Casa Kaypa — Motion Graphic Ideas

Movement at Casa Kaypa is **slow, natural and settling** — like light shifting across a
room, a curtain lifting in the breeze, a shadow lengthening at dusk. Nothing snaps, bounces
or races. Every animation should feel like it's *arriving to rest*.

**Principles**
- **Ease-out for entrances** (`--ease-out`) — things settle into place.
- **Gentle ease-in-out for loops** (`--ease-breathe`) — ambient, breathing.
- **Long, calm durations** — `--dur-base` (300ms) for UI; `--dur-slow`/`--dur-slower` for
  hero moments; `--dur-ambient` (6s) for background drift.
- **No bounce, no overshoot, no spring.**
- Always honour `@media (prefers-reduced-motion: reduce)` — show the end state.

---

## Signature moments

### 1. Line-draw logo reveal
The A-frame and the botanical sprig **draw themselves on**, stroke by stroke, as if sketched
by hand — using SVG `stroke-dashoffset` animation — then the wordmark fades up beneath.
Use on first load / splash / intro. Slow (1.2–1.8s), single play. *(Requires an SVG version
of the logo; do not trace the supplied raster — commission a vector.)*

### 2. Soft fade-and-rise (section entrance)
As sections scroll into view, content **fades in and rises ~16px** with `--ease-out` over
`--dur-slow`. Stagger children by ~80ms. The default entrance for headings, cards, images.

### 3. The growing hairline
Dividers and eyebrow rules **draw outward from the left** (`transform: scaleX(0)→1`,
transform-origin left) — a nod to the logo's line language. Pairs beautifully with an
eyebrow fading in above a heading.

### 4. Warm Ken Burns
Full-bleed photography **drifts and scales very slowly** (1.0→1.06 over `--dur-ambient`,
`--ease-breathe`, alternating) — barely perceptible, like heat haze over the valley. Keeps
hero imagery alive without distraction.

### 5. Curtain / reveal wipe
Images and cards reveal behind a soft ivory or cream mask that **slides away** on entrance
(clip-path or a translating overlay), `--ease-out`, `--dur-slow`. Editorial, unhurried.

---

## Micro-interactions

- **Buttons** — fill darkens one step over `--dur-fast`; outline buttons *fill* charcoal
  from transparent. On press, darken a further step; no shrink.
- **Cards (hoverLift)** — rise 4px and deepen shadow (`sm`→`md`) over `--dur-base`,
  `--ease-out`. Image inside may nudge to 1.03 scale.
- **Inputs** — the underline **warms from neutral to sage** and thickens slightly on focus
  (`--transition-color`); the seafoam focus ring fades in.
- **Links** — colour eases terracotta→terracotta-700; underline offset already set.
- **Tags** — subtle background tint deepen on hover if interactive.
- **Nav (future)** — sticky bar background fades from transparent to cream with a hairline
  bottom border as the user scrolls past the hero.

---

## Ambient / decorative

- **Botanical drift** — thin-line sprig accents may sway a few degrees on a 6–8s
  `--ease-breathe` loop, like a plant in a draught. Keep amplitude tiny.
- **Grain shimmer** — an optional very-low-opacity film grain over hero images adds warmth;
  static or a slow 3-frame cycle. Never distracting.

---

## Don'ts
- No spinning loaders with hard easing — use a slow fade or a drawing-line loader instead.
- No parallax that fights scroll direction.
- No bouncy/elastic easing, no confetti, no attention-grabbing pulses.
- No motion that can't degrade gracefully to a clean static end-state.
