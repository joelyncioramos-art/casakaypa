# Casa Kaypa — Brand & Design System

> Un refugio de campo boutique a las afueras de Lima. *A boutique country retreat on the edge of Lima.*

Casa Kaypa is a boutique country house in **Santa Eulalia**, built over many years with a
deep love of architecture, nature and design. It offers more than lodging — it offers a
space to **reconnect**: to gather with loved ones, celebrate milestones, explore creative
passions, or simply enjoy the peace of the outdoors. This design system captures the
brand's calm, editorial, hand-touched character so every future asset feels like Casa Kaypa.

This repository **is** the brand guide. It contains the color system, typography rules,
motion language, graphic language, reusable UI components, and the master logo.

---

## Sources provided by the client

- **`uploads/CASA KAYPA LOGO.jpg`** — the master logo (A-frame cabin + botanical line
  illustration + "CASA KAYPA / SANTA EULALIA" wordmark). Preserved and processed into
  transparent PNGs under `assets/logo/`.
- **`uploads/boska.css`** — the client's Boska `@font-face` stylesheet (self-hosting
  version). Preserved verbatim at `assets/fonts/boska.css`.
- **Color roster** — seven named brand colors (see Color System).
- **Company description** — the paragraph above.

> ⚠️ **Font binaries were not included.** `boska.css` points at `../fonts/Boska-*.woff2`
> files that were not part of the upload. Until those are provided, the system loads the
> **real, unmodified Boska** from the official Fontshare CDN
> (`api.fontshare.com`) via `tokens/fonts.css`. No substitute typeface is used. To
> self-host, drop the `.woff2/.woff/.ttf` files into `assets/fonts/` and switch the import
> — see `tokens/fonts.css` for the one-line change.

---

## CONTENT FUNDAMENTALS

**Voice.** Warm, unhurried, quietly poetic. Casa Kaypa speaks like a thoughtful host, not
a marketer. It sells *feeling and time* ("weekends made meaningful", "a space to
reconnect"), never features and discounts.

**Language.** Primarily **Spanish** (the audience is Limeño), with graceful English used
for international guests. Keep both registers elegant; avoid slang. Place names stay in
Spanish: *Santa Eulalia*, *Casa Kaypa*.

**Person.** Address the guest directly and warmly — **"tú"** / **"you"** ("plan your stay",
"wake to birdsong"). The house speaks in a gentle first-person-plural when describing
itself ("we built this over many years").

**Casing.**
- Body & headlines: sentence case, calm and readable.
- Labels, eyebrows, buttons, the wordmark: **UPPERCASE with wide tracking** — this mirrors
  the "CASA KAYPA / SANTA EULALIA" lockup and is the single strongest typographic signal
  of the brand.

**Tone examples (do write like this):**
- "A space to reconnect."
- "Weekends made meaningful, memories made unforgettable."
- "Built over many years, with a deep love of architecture and nature."
- "Gather. Celebrate. Create. Or simply be."

**Avoid:**
- Hype and urgency ("¡Reserva YA!", "oferta limitada", exclamation stacks).
- Corporate filler ("world-class amenities", "state-of-the-art").
- Emoji in brand copy (see Iconography).

---

## VISUAL FOUNDATIONS

**Overall vibe.** Editorial, architectural, botanical. Think a beautifully art-directed
travel magazine spread crossed with an architect's line drawing: lots of ivory space, a
single high-contrast serif, hairline rules, and warm earthy accents used sparingly.

**Color.** Warm and earthy, never saturated or techy. **Warm Ivory** is the default
canvas; **Cream** for secondary wells; **Charcoal** for ink. The four accents (Sage,
Seafoam, Terracotta, Dusty Rose) are used *sparingly* as punctuation — a single terracotta
rule, one sage button — not as flood fills across a page. See "Color Usage & Background
Rules" below.

**Type.** One family only: **Boska**, a high-contrast display serif. Large sizes run
**Light/Extralight** for elegance; body runs **Regular**; **Medium** for emphasis and
labels. Italic is the editorial voice for pull-quotes. Never introduce a second typeface.

**Backgrounds.** Predominantly **flat warm ivory / cream** — no gradients as a rule.
Photography (when present) is full-bleed, warm, natural-light, slightly desaturated — the
tones of adobe, foliage, river stone and evening sun. No stock-photo gloss, no heavy
filters. Decorative graphics are **thin-line / botanical**, echoing the logo — never solid
illustrated blobs.

**Spacing & layout.** Generous and unhurried. Wide margins, tall section rhythm
(`--space-9` = 96px between sections), a readable ~68ch measure for long text. Empty space
is a feature, not waste. Content max width `--content-max` (1152px).

**Borders & lines.** The **1px charcoal hairline** is the brand's signature graphic device
(straight from the logo's line art). Use it for dividers, framing, and outline buttons. A
short **48px terracotta rule** is the go-to decorative accent beneath eyebrows.

**Corner radii.** Soft and organic: `md` (8px) for wells, `lg` (14px) for cards. The full
**pill** radius is reserved for buttons and tags only — never large blocks.

**Shadows / elevation.** Soft, warm, low-contrast — shadows tint **charcoal, not black**,
and stay diffuse (`--shadow-sm` on cards, `--shadow-md` on popovers). Avoid hard, dark,
"app-y" drop shadows.

**Cards.** Three treatments: `raised` (white, hairline border, soft shadow), `outline`
(ivory with a 1px ink frame — the most on-brand), `sunken` (cream well, no shadow). Rounded
`lg`, image headers full-bleed to the card edge.

**Hover states.** Gentle and warm: fills darken one step (sage 500→600), outline buttons
invert to charcoal, cards lift 4px with a slightly deeper shadow. No color *flips* to
unrelated hues.

**Press states.** Fills darken a further step (sage 600→700); optional 1px settle. Avoid
aggressive shrink/bounce.

**Focus.** A soft **seafoam** ring (`--focus-ring`), 3px, offset 2px — visible but calm.

**Transparency & blur.** Used lightly — e.g. ivory text at 60–70% opacity on charcoal
sections, or a subtle scrim over full-bleed imagery to protect text. Avoid heavy glassy
blur panels; they read too "tech".

**Motion.** Slow, natural, settling — see MOTION IDEAS. Ease-out for entrances; nothing
snappy or bouncy. Respect `prefers-reduced-motion`.

**Imagery color vibe.** Warm, sunlit, gently desaturated; adobe, sage-green foliage,
terracotta, river seafoam. Natural grain welcome; cold/blue or heavily-graded looks are
off-brand.

---

## COLOR USAGE & BACKGROUND RULES

**The seven brand colors** (client-approved, never altered):

| Role | Name | Hex | Token |
|---|---|---|---|
| Background | Warm Ivory | `#FBF9F4` | `--ck-warm-ivory` / `--surface-page` |
| Logo base / surface | Cream | `#F4EFE6` | `--ck-cream` / `--surface-sunken` |
| Typography / ink | Charcoal | `#2B2B2B` | `--ck-charcoal` / `--text-primary` |
| Accent 1 | Muted Sage | `#798C74` | `--ck-sage` |
| Accent 2 | Seafoam Wash | `#6CB197` | `--ck-seafoam` |
| Accent 3 | Terracotta | `#B56F61` | `--ck-terracotta` |
| Accent 4 | Dusty Rose | `#E2C3BC` | `--ck-dusty-rose` |

Harmonically derived tints/shades (100–700) exist for each accent plus a neutral ramp —
see `tokens/colors.css` and the "Accent Ramps" card.

**Background rules**
1. **Default canvas is Warm Ivory** (`--surface-page`). Use it for almost every page and
   screen. This is the brand's "paper".
2. **Cream is the secondary surface** (`--surface-sunken`) — for wells, alternating
   sections, sidebars, footers. It's the *only* other light background.
3. **White** (`--surface-raised`) is for cards sitting on ivory/cream — it lifts content
   without introducing a new hue.
4. **Charcoal** (`--surface-inverse`) is for occasional dramatic full-width breaks
   (a quote section, a footer). Use ivory text on it. Use sparingly — it's an accent.
5. **Accents are punctuation, not fields.** Prefer accent *tints* (100/200) for large soft
   background moments (a sage-tinted testimonial block); reserve the full 500 accents for
   small elements (buttons, tags, a short rule). **Never** flood a full page in a saturated
   accent.
6. **No gradients** as backgrounds by default. If a scrim is needed over a photo, use a
   charcoal→transparent protection gradient at low opacity only.
7. **Contrast:** always meet WCAG AA. Approved ink pairings are shown on the "Text on
   Color" card (ivory on charcoal/sage/terracotta; charcoal on ivory/cream; accent-700 on
   its own tint).

---

## TYPOGRAPHY GUIDELINES

**One family: Boska.** Never substitute or pair with another typeface. (Serif system
fonts are listed only as FOUT fallbacks.)

**Where & when:**
- **Hero / display** (`--fs-display-xl` / `-l`, 60–84px): **Light or Extralight**, tight
  tracking (`--ls-tighter`). For the biggest emotional statements only, one per view.
- **Headings** (`h1`–`h3`, 22–36px): **Regular**, `Medium` when a heading must assert
  itself. Sentence case.
- **Body** (`--fs-body`, 17px): **Regular**, line-height `--lh-normal` (1.5), measure
  ~68ch. Use `--lh-relaxed` for long editorial reading.
- **Eyebrows / labels / buttons** (`--fs-overline`, 12–13px): **Medium**, **UPPERCASE**,
  wide tracking (`--ls-wide` to `--ls-wider`). This is the logo's voice — use it to frame
  sections.
- **Locality / ceremonial** (e.g. "SANTA EULALIA"): uppercase, `--ls-widest` (0.32em).
- **Italic** (Boska Italic): pull-quotes, poetic emphasis, a single emphasized word inside
  a headline. Never for long body copy.

Weights ship 200–900; **favour 200/300/400/500**. Reserve 700/900 for rare, deliberate
impact — the brand is quiet.

---

## MOTION IDEAS

Full concepts in **`guidelines/motion-ideas.md`**. In brief: movement is *slow, natural
and settling* — light shifting across a room, a curtain in a breeze. Ease-out entrances,
gentle ambient loops, no bounce. Signature moments include the **line-draw logo reveal**
(the A-frame and botanical stroke themselves on), **soft fade-and-rise** section
entrances, the **growing hairline** divider, **warm image ken-burns**, and gentle button
fills. Tokens live in `tokens/motion.css`. Always honour `prefers-reduced-motion`.

---

## ICONOGRAPHY

Casa Kaypa's visual world is **thin-line / botanical**, matching the logo's hand-drawn
wildflower and single-weight strokes. Guidance:

- **Line style:** thin, single-weight (≈1.5px) **outline** icons — never filled/solid,
  never duotone. This keeps the delicate, editorial feel of the logo.
- **Recommended set (substitution — flag):** no icon set was supplied by the client. Use
  **[Lucide](https://lucide.dev)** (MIT, ~1.5–2px consistent strokes, calm rounded joins)
  as the working icon library, loaded from CDN. It is the closest match to the logo's line
  language. *This is a substitution — if you have a preferred icon set, share it and it
  will replace Lucide.*
- **Botanical accents:** small hand-drawn line sprigs (in the spirit of the logo's
  wildflower) may be used as decorative flourishes. Do **not** redraw or trace the logo's
  own flower — commission/source original botanical line art if needed.
- **Emoji:** **not used** in brand copy or UI. They break the refined, hand-touched tone.
- **Unicode:** simple typographic marks (·, —, ✓, ✕) are acceptable in small UI moments
  (as used on the specimen cards). Prefer real icons for anything meaningful.
- **File formats:** prefer **inline SVG** (crisp, recolorable via `currentColor`). The
  master logo is provided as transparent **PNG** (from the client JPG) in `assets/logo/`.

---

## Components

Reusable React primitives live in `components/core/` (namespace
`window.CasaKaypaDesignSystem_5938b5`). Each has a `.jsx`, a `.d.ts` props contract, a
`.prompt.md` usage note, and appears on a Components card in the Design System tab.

- **Button** — quiet uppercase actions: `primary` (sage), `secondary` (terracotta),
  `outline` (ink hairline), `ghost`, `link`. Sizes `sm/md/lg`.
- **Tag** — small pill label for amenities/seasons: tones `sage / seafoam / terracotta /
  rose / neutral / outline`.
- **Eyebrow** — all-caps wide-tracked section overline with optional leading rule.
- **Divider** — the signature hairline rule: `default` (1px ink), `soft` (neutral),
  `short` (48px terracotta accent).
- **Input** — understated underline field for booking/enquiry forms; line warms to sage on
  focus; supports `label`, `hint`, `error`.
- **Card** — content container for rooms/experiences/stories: `raised / outline / sunken`,
  optional image header, `hoverLift`.

### Components to build later (identified, not yet built)

The current set covers the foundation. As surfaces are designed, these are the natural next
primitives: **Select / Dropdown**, **Checkbox & Radio**, **Textarea**, **Date-range picker**
(central to bookings), **Navigation bar & footer**, **Accordion / FAQ**, **Gallery /
Lightbox**, **Testimonial block**, **Stat / Feature row**, **Booking summary**, **Toast /
Notice**, **Breadcrumb**. Build each in the same line-art, ivory, hairline language.

---

## Index / Manifest

```
styles.css                      ← single entry point (link this); @import manifest only
tokens/
  fonts.css                     ← Boska via Fontshare CDN (self-host note inside)
  colors.css                    ← brand colors, ramps, semantic aliases
  typography.css                ← Boska scale, weights, tracking, roles
  spacing.css                   ← 4px spacing scale + layout tokens
  radii.css                     ← radii, border widths, elevation
  motion.css                    ← durations, easing, transitions
components/core/                ← Button, Tag, Eyebrow, Divider, Input, Card
  <Name>.jsx / .d.ts / .prompt.md + *.card.html showcases
guidelines/
  motion-ideas.md               ← full motion / micro-interaction concepts
  cards/                        ← foundation specimen cards (Design System tab)
assets/
  logo/                         ← casa-kaypa-logo.jpg (master), .png (transparent), -reversed.png
  fonts/boska.css               ← client's self-hosting stylesheet (binaries needed)
readme.md                       ← this brand guide
SKILL.md                        ← Agent Skills manifest
```

Design System tab groups: **Brand**, **Colors**, **Type**, **Spacing**, **Components**.

---

## Open items / asks for the client
- **Boska font binaries** — upload the `.woff2/.woff/.ttf` files to self-host (currently
  served from Fontshare CDN).
- **Icon set** — confirm Lucide, or supply your preferred line-icon library.
- **Photography** — a small library of on-brand images would let us build richer cards and
  UI kits. None was supplied, so cards use color/placeholder media.
- **Website / product surfaces** — per your brief we stopped at the foundation; when ready,
  we'll build UI kits (homepage, rooms, booking) on top of these components.
