# Cowboy Tools Jobs — design system

A job board and directory for the skilled trades. The UI is industrial and utility-forward: black and white, 1px rules, Geist + Geist Mono, uppercase tracked labels. Structure comes from borders, never shadows.

**Built for the actual user:** a tradesperson on a phone, on a job site, often in sunlight and sometimes in gloves. Every rule below is constrained by that. Density and legibility beat elegance where they conflict.

**Code is the source of truth.** If a value here disagrees with a canonical file, update this doc in the same change.

> **Status.** Every component specified below is built: the token foundation, the browse slice (search, faceted results, pagination, empty states, job detail), both form flows (post a job, apply), and the employer directory. The doc and the code now describe the same system — keep them that way by re-measuring here whenever a value changes.

---

## Non-negotiables

1. **No box-shadow.** Depth comes from `1px solid` borders.
2. **Corners ≤ 4px.** Prefer `0`. Never `rounded-lg` / `rounded-xl`.
3. **Geist only.** Sans for body and display; Mono for UI, metadata, and numerics. Do not add a third family.
4. **Mono for all metadata** — pay, location, trade, employment type, dates, counts, IDs. Mono makes columns align down a listing page; that alignment *is* the scanning affordance.
5. **Uppercase + tracking** on labels, badges, and buttons (`0.14em`–`0.18em`).
6. **Borders as structure** — `1px solid #000` on light, `1px solid #fff` / `rgba(255,255,255,0.25)` on ink.
7. **Rows touch.** Listing grids use `0px` gap so adjacent borders collapse into a single shared rule.
8. **Hover is opacity or transform**, 120–200ms. Named exception: primary CTA inverts fill/text.
9. **Nothing readable below 4.5:1.** See [Accessibility floor](#accessibility-floor). This overrides any aesthetic preference in this document.
10. **Search is the hero.** The landing surface's focal element is the search field, not photography. Listings must be reachable without scrolling on a 667px-tall viewport.

---

## Accessibility floor

Non-negotiable #9, stated precisely. These are computed contrast ratios against `#fff`, not estimates.

| Value | Renders as | Contrast | Verdict |
|-------|-----------|----------|---------|
| `opacity: 0.35` | `#A6A6A6` | 2.4:1 | ❌ Never use for text |
| `opacity: 0.45` | `#8C8C8C` | 3.4:1 | ❌ Fails AA normal text |
| `opacity: 0.50` | `#808080` | 4.0:1 | ❌ Fails AA normal text |
| **`opacity: 0.55`** | `#737373` | **4.7:1** | ✅ Absolute minimum |
| **`opacity: 0.60`** | `#666666` | **5.7:1** | ✅ **Default muted value** |

**Use `0.6` for muted text.** Drop to `0.55` only under design pressure; never below.

**Size floors.** Mono `12px` minimum for anything the user must read. `11px` is permitted *only* for badges and eyebrows — short, uppercase, one or two words, and rendered at full ink (never muted). Body copy never goes below `14px`.

Tap targets are `44×44` minimum, including the checkbox rows in the filter rail.

---

## Type

Load `Geist` → `--font-geist-sans` and `Geist_Mono` → `--font-geist-mono` once at the layout root. Body uses `font-sans`.

Put the mono helpers (`mono`, `monoUi`) in one shared module — `lib/brand-type.ts`. Do not paste a new `const mono` into each file.

| Role | Family | Size | Weight | Tracking | Transform |
|------|--------|------|--------|----------|-----------|
| Display — search hero | Geist | `clamp(32px, 4.5vw, 56px)` | 600 | `-0.03em` | uppercase |
| Page title | Geist | `clamp(28px, 4vw, 44px)` | 600 | `-0.02em` | uppercase |
| Section heading | Geist | 28px | 600 | `-0.02em` | uppercase |
| Job title — detail | Geist | 32px | 600 | `-0.02em` | none |
| Job title — listing row | Geist | 17px | 500 | `-0.005em` | none |
| Body | Geist | 15–16px | 400 | `0` | none |
| Body small | Geist | 14px | 400 | `0` | none |
| Employer name | Geist Mono | 13px | 400 | `0.14em` | uppercase |
| Pay / numeric | Geist Mono | 14px | 500 | `0.02em` | none |
| Metadata | Geist Mono | 12px | 400 | `0.08em` | uppercase |
| Field label | Geist Mono | 11px | 500 | `0.18em` | uppercase |
| Badge | Geist Mono | 11px | 500 | `0.14em` | uppercase |
| Button default | Geist Mono | 12px | 500 | `0.16em` | uppercase |
| Button large | Geist Mono | 13px | 500 | `0.16em` | uppercase |
| Stat number | Geist | 40px | 600 | `-0.02em` | none |

Pay figures carry weight `500` — they are the single most-scanned value on the page and earn the emphasis.

---

## Color

Base is two values and a muted scale. Semantic color exists only where black-and-white genuinely cannot carry meaning.

### Base

| Token | Value | Use |
|-------|--------|-----|
| Ink | `#000` | text, borders, filled buttons, active states, footer |
| Surface | `#fff` | page, cards, rows, outlined buttons |
| Muted | `rgba(0,0,0,0.6)` | secondary text, help text, counts |
| Hairline on ink | `rgba(255,255,255,0.25)` | dividers on black surfaces |

### Semantic

Used for **state only** — never as decoration, never as a brand fill. All four pass AA on `#fff`.

| Token | Value | Contrast | Use |
|-------|--------|----------|-----|
| Urgent | `#B42318` | 6.6:1 | closing soon, expired, form errors |
| Caution | `#B54708` | 5.4:1 | incomplete profile, unverified employer |
| Success | `#067647` | 5.7:1 | offer received, verified employer, copy confirmation |
| Neutral | `#000` | 21:1 | new, active, applied — the default |

### Category badges

Employment type, union, and verified badges are **filled**: tinted background, matching text, matching border. Trade badges stay outlined ink. Each pair below is ≥ 4.5:1 (11px mono on its fill).

| Badge | Text / border | Fill |
|-------|----------------|------|
| Full-time | `#163A5F` | `#D5E6F5` |
| Part-time | `#6B2D5B` | `#F3D9EC` |
| Contract | `#8C3A16` | `#F6DCCE` |
| Apprenticeship | `#7A4A00` | `#F3E0B5` |
| Union | `#1B4F72` | `#D0E6F5` |
| Verified employer | `#fff` | `#067647` (Success) — solid green fill |
| Closing soon | Urgent | `#F8DDD9` |

---

## Layout

| Element | Value |
|---------|--------|
| Content max-width | `1280px` |
| Page gutters | `16px` mobile / `32px` desktop (`px-4` / `md:px-8`) |
| Header | height `64px`, sticky, `border-bottom: 1px solid #000`, white |
| Search hero | max-height `320px` — **not** a viewport-height hero |
| Search results shell | `grid: 264px 1fr`, gap `32px`; rail collapses to a drawer below `1024px` |
| Filter rail | `264px` fixed, sticky at `top: 88px` |
| Listing row | min-height `96px`, full width, `1px solid #000`, `0px` grid gap |
| Job detail shell | `grid: 1fr 320px`, gap `40px`; apply card sticky at `top: 88px` |
| Section padding | `32–48px` vertical |
| Footer | black, `grid 2fr 1fr 1fr 1fr`, gap `40px` |

Below `1024px` everything is single-column and the filter rail becomes a full-screen drawer with a sticky apply/clear bar.

---

## Motion

- Default hover: `opacity` 0.7 or `translate` / `scale`. Duration **120–200ms**.
- Standard easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Primary CTA: **exception** — `transition-colors duration-150`, `hover:bg-black hover:text-white`.
- Filter drawer: `220ms` slide.
- Share copy: `140ms` invert plus a 2s “link copied” tooltip — confirmation, not a toggle.
- Respect `prefers-reduced-motion` globally in `globals.css`.
- Define once in `globals.css`, never redefine locally: `animate-skeleton` (1.4s, listing-row loading state).

This is a utility product. Motion confirms actions; it does not entertain.

---

## Buttons

| Size | Height | Font | Tracking | Padding |
|------|--------|------|----------|---------|
| Default | 40px | Mono 12px | 0.16em | 18px horizontal |
| Large | 52px | Mono 13px | 0.16em | 24px horizontal |
| Compact | 32px | Mono 11px | 0.14em | 12px horizontal |

- Radius `0`. Uppercase.
- Variants: black fill + white text; white fill + `1px solid #000` + black text; bare text + underline on hover.
- Default hover: opacity `0.7`. Large primary CTA: invert (named exception).
- Compact is for in-row actions only (`SHARE`) and must still occupy a `44px` tap target via padding.

---

## Forms

Half this product is forms — post-a-job, apply, employer onboarding, profile. Treat this section as load-bearing.

| Element | Spec |
|---------|------|
| Field height | `48px` (textarea min `120px`) |
| Field border | `1px solid #000`, radius `0` |
| Field focus | `2px solid #000` inset — no glow, no color shift |
| Field text | Geist 15px |
| Placeholder | Geist 15px, `rgba(0,0,0,0.6)`, sentence case — never uppercase |
| Label | Mono 11px `0.18em` uppercase, full ink, `8px` above field |
| Required marker | Mono `*` in Urgent, immediately after label text |
| Help text | Geist 13px, `rgba(0,0,0,0.6)`, `6px` below field |
| Error text | Geist 13px in Urgent, `6px` below field |
| Error field | Border becomes `1px solid` Urgent |
| Field group gap | `24px` |
| Checkbox / radio | `20×20`, `1px solid #000`, radius `0`; checked = ink fill, white mark |
| Select | Same as field; chevron 1.4px stroke, no fill |

Errors appear on blur, not on keystroke, then clear live as the user corrects them. Never rely on border color alone to signal an error — always pair it with error text.

Field text and help text compile to their own tokens — `text-field` (15px) and `text-help` (13px) — so a control never reaches for a body size that is close but wrong.

---

## Component recipes

### Search field — the most important component in the product

```
┌────────────────────┬──────────────────┬──────────────┐
│ Trade or keyword   │ City or postal   │   SEARCH     │
└────────────────────┴──────────────────┴──────────────┘
   1fr                  1fr                160px
```

- Height `56px`. Outer `1px solid #000`, radius `0`.
- Segments divided by `1px solid #000`. No gaps, no nesting.
- Placeholder Geist 15px at `0.6` — sentence case, because it is read, not scanned.
- Button segment: ink fill, white mono 13px `0.16em`.
- Below `768px`: stacks to three full-width rows, borders collapsing.

### Listing row — the core unit

```
┌──────────────────────────────────────────────────────────────┐
│ [logo 48]  Journeyman Electrician                [ SHARE ]   │
│            ACME ELECTRIC · CALGARY, AB                       │
│            $38–46/HR    FULL-TIME  UNION        2 DAYS AGO   │
└──────────────────────────────────────────────────────────────┘
```

- Padding `20px 24px`. Min-height `96px`. Logo `48×48`, `1px solid #000`. When no logo is on file, render two-letter initials in the same box.
- Title Geist 17px/500. Employer mono 13px `0.14em` uppercase. Separator ` · `.
- Pay mono 14px/500 — always leftmost in the metadata row, always present. If an employer omits pay, render `PAY NOT LISTED` at `0.6` rather than hiding the slot; the column must stay aligned.
- Badges `11px` mono, `4px 8px` padding. Employment type, union, and verified use filled category colors (see [Category badges](#category-badges)); trade and source stay outlined ink.
- Posted date right-aligned, mono 12px at `0.6`.
- Hover: background `rgba(0,0,0,0.03)`. Share: outlined → ink fill while confirming.
- Rows sit at `0px` gap so borders collapse to shared 1px rules.

### Filter rail

- Group label: mono 11px `0.18em` uppercase, full ink, `1px solid #000` bottom rule, `12px` padding below.
- Option row: `44px` tall, checkbox `20×20`, label Geist 14px, count mono 12px at `0.6` right-aligned.
- Group gap `28px`.
- Active filters render as chips above results: employment-type and union chips use the same filled category colors as listing badges; search, location, and trade stay ink fill, white mono 11px, `×` at 1.4px stroke.
- `CLEAR ALL` as a bare text button, mono 11px, right-aligned in the chip row.

### Job detail

- Title Geist 32px/600. Employer mono 13px `0.14em` below.
- Spec table: `grid 180px 1fr`, row padding `16px 0`, `1px solid rgba(0,0,0,0.12)` between rows. Labels mono 11px `0.18em`; values Geist 15px. Rows: Pay · Type · Trade · Experience · Location · Posted · Closes.
- Body copy Geist 16px, line-height `1.6`, max-width `68ch`.
- Apply card: sticky, `1px solid #000`, padding `24px`, large CTA full-width, compact Share beneath (copies the job URL).

### Company card — directory surface

- `1px solid #000`, padding `24px`, `0px` grid gap so cards share borders.
- Logo `56×56`. Missing logos use two-letter initials. Name Geist 17px/500. Trade categories as outlined badges.
- Footer strip: mono 12px at `0.6` — `12 OPEN ROLES · CALGARY, AB`.
- Verified employers carry a Success badge (solid green fill, white text); unverified carry nothing (never a Caution badge — absence is not a warning). `verified` is a property of the employer record, never copied onto a listing, so the two can never disagree.

### Empty states

Every search-driven surface needs one. Structure is identical across all three:

- `1px solid #000` box, padding `48px 32px`, centered, max-width `480px`.
- Mono 11px `0.18em` uppercase label → Geist 15px explanation at `0.6` → one default button.

| Surface | Label | Action |
|---------|-------|--------|
| Zero results | `NO MATCHES` | `CLEAR FILTERS` |
| No applications | `NO APPLICATIONS` | `BROWSE JOBS` |
| Employer, no posts | `NO ACTIVE POSTINGS` | `POST A JOB` |

Zero-results must also surface the nearest broader query — drop the narrowest active filter and show that count as a secondary bare-text action.

### Pagination

- Cells `40×40`, `1px solid #000`, `0px` gap so borders collapse. Wrap rather than overflow.
- Mono 12px `0.14em`. Current page: ink fill, white text.
- Prev/next chevrons 1.4px stroke. Disabled state: `opacity: 0.35` — permitted here because chevrons are not text.
- Never list every page. Show first, last, the current page ±1, and ellipsis for skipped ranges. Ellipsis is a non-interactive cell (muted, not a link). Cap at 7 numbered buttons.

### Open Graph card — 1200×630

Shared when a URL is posted. Same system as the product: white field, 40px inset, 1px ink frame. No shadow, no radius, no photography.

- Header: `COWBOY TOOLS JOBS` mono tracked; `CANADA` on the right of the site card.
- Site headline is the homepage display line (`WORK IN THE TRADES`). Job titles stay mixed case; employer names are mono uppercase.
- Pay is always present on job cards (including `PAY NOT LISTED`). Employment-type and union badges use category fills; trade stays outlined ink.
- Generated by `app/opengraph-image.tsx` / `app/jobs/[id]/opengraph-image.tsx` / `app/employers/[slug]/opengraph-image.tsx`. Set `NEXT_PUBLIC_SITE_URL` in production so `og:image` is absolute.

### Footer

Black. Four columns: brand + locality, For Tradespeople, For Employers, Company. Labels mono 11px `0.18em` at `0.6`. Links Geist 14px, hover opacity `0.7`. Job-alert signup: `1px solid #fff` field, white **SUBSCRIBE** button.

---

## Named exceptions

These break a rule above **on purpose**. Do not "fix" them, and do not extend them to new cases.

| Exception | Why it stays |
|-----------|----------------|
| Primary CTA inverts on hover | It is the single most important action on the page |
| Pagination chevrons at `opacity: 0.35` | Icons, not text — the 4.5:1 floor governs text |
| Row hover at `rgba(0,0,0,0.03)` | Needed for row targeting; not a decorative fill |
| Category badge fills | Employment type, union, and verified must be scannable at a glance |
| Spec-table rules at `rgba(0,0,0,0.12)` | Full-ink 1px rules are too heavy inside a dense table |
| `PAY NOT LISTED` placeholder | Column alignment outranks hiding an empty value |

---

## What not to build

- Shadowed or rounded cards. If it needs separation, it needs a border.
- A dark theme. Branded surfaces hardcode `#000` / `#fff`.
- A third font family, or any display face beyond Geist.
- A viewport-height photo hero.
- Carousels. This is a search product; results are ranked lists.

---

## Canonical source files

Measure from these before inventing. **None exist yet** — check each off as it lands, and treat this list as the real source of truth once populated.

- [x] `app/layout.tsx` — Geist + Geist Mono wired to `--font-geist-sans` / `--font-geist-mono`
- [x] `app/globals.css` — full token layer; color, radius and shadow namespaces reset
- [x] `lib/brand-type.ts` — `mono` role map, `monoUi`, `muted`
- [x] `components/header.tsx`
- [x] `components/search-field.tsx` — GET form; a search is a shareable URL
- [x] `components/listing-row.tsx` — stretched link + separate share button
- [x] `components/filter-rail.tsx` — URL-driven facets, counts exclude own dimension
- [x] `components/badge.tsx`
- [x] `components/company-card.tsx`
- [x] `lib/employers.ts` — employer records; `verified` lives here, not on Job
- [x] `components/empty-state.tsx` — includes nearest-broader-query recovery
- [x] `components/pagination.tsx`
- [x] `components/form/fields.tsx` — text, textarea, select, checkbox, fieldset, error summary
- [x] `components/post-job-form.tsx` / `components/apply-form.tsx`
- [x] `lib/validate.ts` + `lib/schemas.ts` — one rule set shared by client blur and server action
- [x] `components/footer.tsx`
- [x] `components/button.tsx` — `fill` / `outline` / `bare`, three sizes
- [x] `components/icons.tsx` — 1.4px stroke, no fill
- [x] `components/share-button.tsx` — copies the job URL; “link copied” tooltip
- [x] `app/opengraph-image.tsx` — 1200×630 site card; job/employer variants in their route folders
- [x] `lib/og/` — ImageResponse frame, copy, vendored Geist latin (WOFF)

---

## Playground

Stand up an experimental route at `/dev/brand` — unattached (no nav, no sitemap), local and preview only, 404 in production. Render every component above at both `375px` and `1440px`, and include a contrast audit strip so the [accessibility floor](#accessibility-floor) is visible rather than assumed.
