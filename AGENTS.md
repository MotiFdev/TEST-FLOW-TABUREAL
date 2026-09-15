# DESIGN SYSTEM RULES — Tabulation System (Anti-Slop UI)

These rules apply automatically to EVERY interface task in this repo: pages, modals, tables, forms,
sidebars, headers, empty states, new components. They come from the project owner's master UI/UX
instruction ("Anti-Slop System Design"). **Do not re-derive a style from scratch — use this file.**

Goal: professional, intentional, production-quality **product interface** (tabulation/event scoring
system used live during pageants). NOT a landing page, NOT a generic SaaS template.

---

## 1. HARD BANS (never do these)

- Purple/blue gradients, glowing borders, glassmorphism, excessive blur/shadows
- Cards for everything / cards inside cards / equal-card grids ("dashboard = grid of cards" is false)
- Decorative pills, floating icon bubbles, fake "BETA / AI POWERED" badges
- Marketing hero sections inside system pages, oversized dashboard headings
- `transition: all`, animating every interaction, excessive animations
- Pure black text / pure white-on-color extremes; low-contrast gray walls of text
- Inter/Roboto/Arial/Open Sans/Montserrat as the identity font
- Colors used as decoration; status communicated by color alone
- Replacing working functionality/business logic during a "redesign"

## 2. STACK & WHERE STYLE LIVES

- React + Vite + Tailwind CSS **v4** (via `@tailwindcss/vite`). No UI kit.
- All design tokens: `frontend/src/index.css` → `@theme` block (colors, fonts) + `@layer components`
  (reusable classes). **Prefer these classes over inventing new one-off utility soup.**
- Fonts: IBM Plex Sans (UI) + IBM Plex Mono (numeric data), loaded in `frontend/index.html`.

### Reusable class inventory (use these)

| Class | Purpose |
|---|---|
| `page-header` `page-title` `page-desc` | Page top: title → purpose line → right-side context/actions |
| `section-label` | Micro uppercase group heading (sidebar groups, form band labels) |
| `entry-form` | Inline "add record" form band under the page header |
| `field-label` `input` | Form labels + inputs/selects (consistent height, focus ring) |
| `btn` + `btn-primary` / `btn-secondary` / `btn-ghost-danger` | Buttons. One primary action per view max. |
| `data-table` + `num` | Data tables (row hairline dividers, no grid borders); `.num` = tabular figures |
| `badge` + `-success` / `-warning` / `-danger` / `-neutral` / `-primary` | Status indicators (always dot + text label) |
| `status-chip` | Header context chips (active round, hub state) |
| `alert-error` | Error banner (pair with `role="alert"` and an "Error:" prefix) |

Semantic color utilities from `@theme`: `text-ink`, `text-ink-secondary`, `text-ink-muted`,
`bg-canvas`, `bg-primary`, `text-primary`, `bg-success-soft`, `text-success`, `bg-danger-soft`,
`text-danger`, `bg-warning-soft`, `text-warning`, `border-primary` etc.

## 3. LAYOUT RECIPES

- App shell: full-height frame — Sidebar (fixed left) → right column = Header (slim, h-12) +
  scrollable `<main class="p-6">`. No footer in the product layout.
- Header carries: product name, **Active round chip**, **SignalR hub status chip** (truthful state:
  Online / Syncing / Offline).
- **Data-setup pages** (Rounds, Criteria, Contestants, Judges):
  `page-header → alert (if any) → entry-form → data table (in overflow-x-auto)`.
- **Live/operational pages** (LiveLeaderboard, ScoreMonitor):
  `page-header with status chips → main data table → (future: activity/log section)`.
- **Auth pages**: single centered panel (`max-w-sm`, border, white on `bg-canvas`). Focused form only.
- Desktop uses horizontal space; don't shrink desktop into a giant mobile view. Wrap tables in
  `overflow-x-auto`; on small screens forms wrap naturally.

## 4. TABLES

Use tables for structured records — never record-cards. Rules:
- Row dividers only (`border-b`); header separated by a 2px bottom border; **no cell grid borders**.
- `th`: 12px semibold uppercase tracking-wide, `text-ink-secondary`.
- **All numerics (scores, ranks, %, counts, dates, PINs, UUIDs) get `num` class (tabular figures).**
- Row hover: subtle `bg` change only. Active/special rows: soft tinted bg, never saturated.
- Loading / empty states live inside the table as full-width muted cells. Error → `alert-error` above.
- Row actions: small quiet buttons (`btn-secondary`/`btn-ghost-danger`, h-7), destructive in red text.

## 5. FORMS

- Group related fields in one `entry-form` band; labels via `field-label`; never one card per input.
- Logical order, sensible widths, `required` indicators, validation/error text on top of the band.
- Primary submit = the only `btn-primary` on the page.

## 6. STATES (design them, don't improvise later)

Default / Hover / Active / Disabled / Loading / Empty / Error.
This is an **offline-first** system — always consider: Online, Offline, Syncing, Synced,
Pending (IndexedDB), Sync failed, Hub connected/disconnected.
Represent as `badge-*` (dot + text) or `status-chip` in the header. Never color-only.

## 7. COLOR

Semantic tokens only, used to communicate: primary = primary action/selection; success = active/synced;
warning = pending; danger = failed/destructive; neutral = everything else.
Main content sits on white; app canvas `bg-canvas` (#f6f6f4); text `text-ink` (#262624) — softened
ink, not pure black. If an area looks "boring", fix hierarchy — do NOT add color.

## 8. MOTION

150–200ms, `transition-colors` (transform/opacity if needed), no `transition: all`, no animation on
data entry/search/filter. `prefers-reduced-motion` is globally respected in `index.css`.

## 9. REDesign PROTOCOL

Inspect first. Preserve: routes, page names, forms, field names, API calls, roles, buttons with
functional meaning. Separate **functional change** from **visual change**. For redesigns:
PRESERVE what works / IMPROVE hierarchy & spacing & type / REMOVE clutter & generic AI patterns.
Redesign only what's asked.

## 10. PRE-DELIVERY AUDIT (run before finishing any UI task)

Generic AI dashboard look? Too many cards/rounded containers/gradients? Hierarchy obvious?
Primary action findable in <1s? Density appropriate? Tables where tables belong? Motion restrained?
Colors meaningful? Typography carrying the structure? Loading/empty/error/disabled handled?
Responsive? If any answer is bad — fix before delivering.