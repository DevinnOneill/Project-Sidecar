# UI-UX.md — Interface Standards (Covenant Design System)

> **Version:** 3.0 | **Domain:** Visual Design, Component Behavior, Accessibility, NMCI Rendering
> **Authority:** Tier 1 | **Source:** SIDECAR_DESIGN v2.0 (adapted to light mode)
> **Loaded By:** Every session that modifies HTML or CSS
> **Amended:** 2026-03-27 — Full expansion from SIDECAR_DESIGN v2.0 source document

---

## 1. The Design Rule

**If it reads as SaaS, redesign it.** SideCar is a mission-operations instrument. A dashboard aesthetic borrowed from B2B software products is incompatible with the Covenant direction. The reference points for Covenant are cinematic — institutional gravity, not consumer delight.

## 2. Covenant — Five Principles

1. **Warm Navy / Cinematic restraint:** Warm linen surfaces with deep navy for primary structural elements and brass/khaki gold accents. Pure white (`#FFFFFF`) is explicitly avoided to prevent eye fatigue. The warm surface IS the interface.
2. **Gold as signal:** Brass and khaki gold marks what matters — active navigation states, section dividers, key structural labels. It is an operational indicator. Never use gold for decoration or large surface fills.
3. **Typography carries structure:** Information hierarchy lives in typeface, weight, and scale — not color alone. Any view must be readable in grayscale.
4. **Data is never softened:** Numbers, codes, and identifiers render in monospace at full contrast. No rounded softening of data values. No animated count-ups.
5. **Motion confirms state:** Animation communicates state changes only. If removing an animation has no functional consequence, the animation should not exist.

---

## 3. Color Token System

### Token Authority
The `:root` declaration in `sidecar-app/src/index.css` is the single source of truth for all color values. `Gemini.md` Section 14 is the quick reference. This document is the specification.

**HARD RULE:** If a hex value appears anywhere in component CSS, in a `style` attribute, or in a JavaScript style assignment outside of the `:root` token declaration — it is a constraint violation (C-11). Find the appropriate token or create a new one.

### Background Layer Tokens
Background tokens define the depth hierarchy. These are the light-mode Covenant surfaces:

| Token | Role |
|---|---|
| `--color-bg-void` | Page body background. The absolute floor — warm linen. |
| `--color-bg-base` | Primary application surface. Default background for page content. |
| `--color-bg-surface` | Cards, panels, containers. One level above base. |
| `--color-bg-elevated` | Dropdowns, tooltips, modals, table headers. Floats above surface. |
| `--color-bg-overlay` | Hover states on rows and cards. Focused input backgrounds. |
| `--color-bg-dark` | Deep navy — reserved for topbar and primary structural headers. |

### Gold Accent Tokens

| Token | Use — and What It Must Not Be Used For |
|---|---|
| `--color-gold-primary` | Navigation borders, section dividers, key structural labels. NOT decorative. |
| `--color-gold-bright` | High-emphasis text, active states, heading accents. NOT backgrounds. |
| `--color-gold-dim` | Inactive gold elements, secondary rule lines. NOT primary actions. |
| `--color-gold-glow` | Ambient glow behind gold elements. NOT as fill. |

### Text Tokens

| Token | Role |
|---|---|
| `--color-text-primary` | All primary body copy. Default text on light backgrounds. |
| `--color-text-secondary` | Supporting labels, secondary field values. |
| `--color-text-muted` | Inactive labels, placeholder text, column headers. |
| `--color-text-dim` | Disabled states, very low-emphasis metadata. |

### Border Tokens

| Token | Role |
|---|---|
| `--color-border-subtle` | Internal table rules, low-emphasis separators. |
| `--color-border-default` | Standard card and panel borders, form field outlines. |
| `--color-border-strong` | Focused input states, emphasized panel edges. |
| `--color-border-gold` | Topbar gold rule. The one permanent gold line. Never removed. |

### PRD Status Tokens

**CRITICAL RULE (C-14):** PRD tier color tokens are used ONLY to represent PRD urgency. Repurposing a PRD color for a non-PRD UI element creates semantic ambiguity in a critical operational signal.

| Tier | Background Token | Text Token | Status Dot Token |
|---|---|---|---|
| Gray (STABLE) | `--color-prd-gray` | `--color-prd-gray-text` | `--color-dot-gray` |
| Green (WATCH) | `--color-prd-green` | `--color-prd-green-text` | `--color-dot-green` |
| Yellow (URGENT) | `--color-prd-yellow` | `--color-prd-yellow-text` | `--color-dot-yellow` |
| Red (CRITICAL) | `--color-prd-red` | `--color-prd-red-text` | `--color-dot-red` |
| Escalated (EXPIRED) | `--color-prd-escalated` | `--color-prd-escalated-text` | `--color-dot-escalated` |

---

## 4. Typography System

### Font Roles — Three Fonts, Three Jobs

SideCar uses exactly three fonts. Each has a single defined role. Using the wrong font for a context is a design violation.

| Font | Token | Role | Used For | NEVER Used For |
|---|---|---|---|---|
| Verdana | `--font-brand`, `--font-display`, `--font-body` | Primary UI & Branding | All page titles, headers, narrative copy, UI inputs, sub-text, brand logotypes | Numeric stat lockups |
| DM Mono | `--font-data` | Data / Meta | All table cells, filter inputs, chip labels, nav links, badge text, timestamps | Long-form narrative paragraphs |

### Type Scale Tokens

```css
:root {
  /* ── BRANDING (Verdana) ──────── */
  --type-brand-logotype: 80px;  /* SIDECAR logo */

  /* ── DISPLAY (Verdana) ────────────── */
  --type-display-xl:  48px;   /* Hero stat numbers, page heroes */
  --type-display-lg:  36px;   /* Page section titles */
  --type-display-md:  28px;   /* Card titles, sub-section heads */
  --type-display-sm:  24px;   /* Mixed-case Hero Cards */

  /* ── BODY (Verdana) ───────────────── */
  --type-body-lg:     20px;   /* Lead paragraphs */
  --type-body-md:     18px;   /* Primary inputs, search text, labels */
  --type-body-sm:     16px;   /* Minimum readable body copy */

  /* ── DATA (DM Mono) ─────────────── */
  --type-data-xl:     20px;   /* Large callout values */
  --type-data-md:     18px;   /* Target interactive text size */
  --type-data-sm:     16px;   /* Standard table values */
  --type-data-xs:     16px;   /* ABSOLUTE DATA FLOOR: badges, metadata */

  /* ── LINE HEIGHTS ───────────────── */
  --leading-tight:    1.1;    /* Display only */
  --leading-normal:   1.5;    /* Body copy */
  --leading-data:     1.5;    /* Table rows */

  /* ── LETTER SPACING ─────────────── */
  --tracking-display: 0.04em; /* Display headers */
  --tracking-caps:    0.12em; /* Uppercase data labels */
  --tracking-data:    0.06em; /* DM Mono table cells */
}
```

### Typography Rules

| Rule | Specification |
|---|---|
| Top-level Hero Titles | Verdana at `--type-display-sm` (24px), `font-weight: 600`, mixed-case. No forced caps. |
| Dropdown option text | Verdana at `--type-data-md` (18px). |
| Navigation link labels | DM Mono at `--type-data-xs` (16px), uppercase, `--tracking-caps`. |
| Table column headers | DM Mono at `--type-data-xs` (16px), uppercase, `--tracking-caps`. |
| Table cell values | DM Mono at `--type-data-sm` (16px), `--tracking-data`. |
| Comm log / narrative | Verdana at `--type-body-md` (18px). |
| PRD badge labels | DM Mono at `--type-data-xs` (16px), uppercase. |
| Form placeholder text | Verdana at `--type-body-md` (18px), sans-italic. |
| Data freshness | DM Mono at `--type-data-xs` (16px), color `--color-text-dim`. |

### Font Loading — Three-Layer Fallback Protocol (C-05)

**Layer 1 — Remote Load (Preferred):** Use `<link>` tags in `<head>`. Never `@import` inside CSS — `@import` blocks rendering and fails silently behind NMCI proxies.

**Layer 2 — Local Font Package:** Distribute `.woff2` files in a `/fonts` directory. Define `@font-face` rules in `index.css` before any other usage. Fires automatically if remote load fails.

**Layer 3 — System Font Stack:**
```css
:root {
  --font-brand:   'Verdana', sans-serif;
  --font-display: 'Verdana', sans-serif;
  --font-body:    'Verdana', sans-serif;
  --font-data:    'DM Mono', 'Courier New', monospace;
}

/* Activated by .font-fallback class */
.font-fallback {
  --font-brand:   'Arial', sans-serif;
  --font-display: 'Arial', sans-serif;
  --font-body:    'Arial', sans-serif;
  --font-data:    'Courier New', Courier, monospace;
}
```

### Font Detection Script (NMCI-Hardened)

```javascript
(function () {
  'use strict';
  var TIMEOUT = 2500; // ms — accounts for NMCI proxy latency

  function fallback(reason) {
    document.documentElement.classList.add('font-fallback');
    console.warn('[COVENANT] Font fallback active:', reason);
  }

  if (!document.fonts || typeof document.fonts.check !== 'function') {
    fallback('FontFace API unavailable in this environment');
    return;
  }

  var timeout = new Promise(function (resolve) {
    setTimeout(function () { resolve('timeout'); }, TIMEOUT);
  });

  Promise.race([document.fonts.ready, timeout]).then(function () {
    var ok = document.fonts.check('1em "Verdana"') &&
             document.fonts.check('1em "DM Mono"');
    if (!ok) fallback('One or more primary fonts failed to load');
  });
}());
```

---

## 5. Spacing System & Layout

### 8px Base Grid

```css
:root {
  --space-1:   4px;  /* Micro: icon-to-label, badge internal padding */
  --space-2:   8px;  /* Tight: chip padding, inline element gaps */
  --space-3:  12px;  /* Default internal padding */
  --space-4:  16px;  /* Standard component padding */
  --space-5:  24px;  /* Section internal spacing */
  --space-6:  32px;  /* Between major components */
  --space-7:  48px;  /* Section-to-section rhythm */
  --space-8:  64px;  /* Page-level vertical breathing room */

  --radius-none: 0px;    /* Tables, hard-edged panels */
  --radius-xs:   2px;    /* Status dots, tiny elements */
  --radius-sm:   4px;    /* Input fields, chips, data panels */
  --radius-md:   6px;    /* Cards, panels, dropdowns */
  --radius-lg:   8px;    /* Modals */
  --radius-pill: 100px;  /* Toggle chips, filter pills */
  /* HARD RULE: No component uses border-radius > 10px except landing cards (16px) and Universal Search (32px). */
}
```

### Layout Architecture — Three Structural Zones

Every SideCar page uses the same three-zone architecture. These zones never overlap and never change between pages.

| Zone | Height / Position | Description | CSS Key Properties |
|---|---|---|---|
| **Topbar** | 56px, fixed top | Navigation: wordmark, page links, data freshness indicator, role badge. Never scrolls. | `position:fixed; top:0; height:56px; z-index:1000` |
| **Gold Rule** | 2px, fixed at bottom of topbar | Earth accent border line. The permanent visual anchor. Always visible. | `position:fixed; top:56px; height:2px; background:var(--color-earth-500); z-index:1001` |
| **Content Area** | `calc(100vh - 58px)` from `top:58px` | All page content. Scrollable. Max-width 1440px centered. | `margin-top:58px; overflow-y:auto; max-width:1440px` |

---

## 6. Component Specifications

### 6.1 Topbar

```css
.topbar {
  position: fixed; top: 0; left: 0; right: 0;
  height: 56px;
  background: var(--color-bg-dark);
  display: flex; align-items: center;
  padding: 0 var(--space-6);
  gap: var(--space-5);
  z-index: 1000;
}
```

**Topbar Gold/Earth Rule:**
The accent border at the bottom of the topbar is never removed, hidden, conditionally rendered, or made subject to scroll. It renders on every page, on every load, immediately. It is the one permanent visual anchor of the Covenant interface.

### 6.2 PRD Badges

PRD badges appear in the Sailor Priority Queue and the PRD pipeline strip. The badge CSS class is assigned by the `computePRDTier()` function in `src/services/PrdEngine.ts`. The UI rendering layer never reads a PRD date directly.

```css
.prd-badge {
  display: inline-flex; align-items: center; gap: var(--space-1);
  font-family: var(--font-data);
  font-size: var(--type-data-xs);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: var(--radius-xs);
  border: 1px solid transparent;
  white-space: nowrap;
}
```

Each tier applies its token pair: `background: var(--color-prd-[tier])` and `color: var(--color-prd-[tier]-text)`.

### 6.3 Status Dots

Status dots occupy column 1 of the Sailor Priority Queue. Red and Escalated dots have a CSS pulse animation. This is the only permitted animation on live data content.

```css
.status-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.status-dot--red       { background: var(--color-dot-red);
                         box-shadow: 0 0 6px var(--color-dot-red);
                         animation: dot-pulse-red 2s ease-in-out infinite; }
.status-dot--escalated { background: var(--color-dot-escalated);
                         box-shadow: 0 0 8px rgba(155,48,184,0.5);
                         animation: dot-pulse-esc 1.8s ease-in-out infinite; }

@keyframes dot-pulse-red { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }
@keyframes dot-pulse-esc { 0%,100%{ opacity:1; } 50%{ opacity:0.5; } }
```

### 6.4 Data Tables

**TABLE RULES:** Tables never have outer drop shadows. Tables never have gradient row backgrounds. Row hover must use `var(--color-bg-overlay)`. Escalated rows receive a full-row background treatment. Column headers are DM Mono, uppercase, `--tracking-caps` — never logotype or brand display fonts.

```css
.data-table { width:100%; border-collapse:collapse; font-family:var(--font-data); font-size:var(--type-data-md); }
.data-table th {
  font-size:var(--type-data-xs); letter-spacing:var(--tracking-caps); text-transform:uppercase;
  color:var(--color-text-muted); padding:var(--space-3) var(--space-4);
  text-align:left; white-space:nowrap; cursor:pointer; user-select:none;
}
.data-table td {
  padding:var(--space-3) var(--space-4);
  color:var(--color-text-primary);
  line-height:var(--leading-data);
  border-bottom:1px solid var(--color-border-subtle);
  vertical-align:middle;
}
.data-table tbody tr:hover td { background:var(--color-bg-overlay); cursor:pointer; }
```

### 6.5 Filter Bar

```css
.filter-bar {
  display:flex; gap:var(--space-3); align-items:center; flex-wrap:wrap;
  background:var(--color-bg-surface); border:1px solid var(--color-border-subtle);
  border-radius:var(--radius-md); padding:var(--space-3) var(--space-4);
  margin-bottom:var(--space-4);
}

.filter-input {
  flex:1; min-width:220px; background:transparent;
  border:1px solid var(--color-border-subtle); border-radius:var(--radius-sm);
  padding:10px 12px; color:var(--color-text-primary);
  font-family:var(--font-data); font-size:var(--type-data-md);
  letter-spacing:var(--tracking-data); outline:none;
  transition:border-color 0.15s ease;
}
.filter-input::placeholder { color:var(--color-text-dim); }
.filter-input:focus         { border-color:var(--color-border-strong); }
```

### 6.6 Chips (Filter Toggles)

```css
.chip {
  font-family:var(--font-data); font-size:var(--type-data-xs);
  letter-spacing:var(--tracking-caps); text-transform:uppercase;
  padding:5px 10px; border:1px solid var(--color-border-subtle);
  border-radius:var(--radius-pill); color:var(--color-text-dim);
  background:transparent; cursor:pointer; transition:all 0.15s ease;
}
.chip:hover  { border-color:var(--color-border-default); color:var(--color-text-secondary); }
.chip.active { border-color:var(--color-gold-primary); background:var(--color-gold-glow); color:var(--color-gold-bright); }
```

### 6.7 Mode Toggle (Placement Page)

The mode toggle on the Placement page switches between Coordinator and Evaluator scope.

```css
.mode-toggle {
  display:inline-flex;
  border:1px solid var(--color-border-default);
  border-radius:var(--radius-sm); overflow:hidden;
}
.mode-toggle__btn {
  font-family:var(--font-data); font-size:var(--type-data-xs);
  letter-spacing:var(--tracking-caps); text-transform:uppercase;
  padding:8px 20px; background:transparent; border:none;
  color:var(--color-text-muted); cursor:pointer;
  transition:all 0.15s ease;
}
.mode-toggle__btn:hover  { color:var(--color-text-primary); }
.mode-toggle__btn.active { background:var(--color-gold-glow); color:var(--color-gold-bright); }
```

---

## 7. Motion System

### Timing Tokens

```css
:root {
  --duration-instant:  80ms;   /* Button press, checkbox tap */
  --duration-fast:    150ms;   /* Hover states, chip active */
  --duration-normal:  250ms;   /* Dropdown open, panel reveal */
  --duration-slow:    400ms;   /* Page-load stagger entries */

  --ease-out:   cubic-bezier(0.16, 1, 0.3, 1);    /* Entrances */
  --ease-in:    cubic-bezier(0.4,  0, 1,   1);    /* Exits */
  --ease-inout: cubic-bezier(0.65, 0, 0.35, 1);   /* State transitions */
}
```

### Page Load Reveal — Required on All Pages

On every page load, all primary content regions receive one staggered entrance sequence. The total sequence completes in under 600ms. Elements start invisible and slightly offset downward. The animation fires once and never repeats.

```css
.reveal { opacity:0; transform:translateY(12px); }
.reveal.is-visible {
  animation: reveal-enter var(--duration-slow) var(--ease-out) forwards;
}
@keyframes reveal-enter { to { opacity:1; transform:translateY(0); } }

[data-delay="1"] { animation-delay:0ms;   }
[data-delay="2"] { animation-delay:80ms;  }
[data-delay="3"] { animation-delay:160ms; }
[data-delay="4"] { animation-delay:240ms; }
[data-delay="5"] { animation-delay:320ms; }
```

```javascript
// Double rAF ensures paint before animation
document.addEventListener('DOMContentLoaded', function () {
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('is-visible');
      });
    });
  });
});
```

### Permitted Animations (Complete List)

Only the following animations are permitted. Any animation not on this list requires Tier 1 authorization.

| Animation | Target | Duration | Trigger | Purpose |
|---|---|---|---|---|
| Page load reveal | All `.reveal` elements | 400–600ms staggered | DOMContentLoaded | Communicates page readiness |
| Hover state | Nav links, table rows, cards | 150ms | `:hover` | Confirms interactivity |
| Focus ring | All interactive elements | 80ms | `:focus-visible` | Accessibility — keyboard nav |
| Dropdown open | Filter select elements | 250ms | click / focus | Communicates state change |
| Red dot pulse | `.status-dot--red` | 2s loop | Always-on CSS | Communicates urgency |
| Escalated dot pulse | `.status-dot--escalated` | 1.8s loop | Always-on CSS | Communicates highest urgency |
| Chip active toggle | `.chip.active` | 150ms | JS class toggle | Confirms filter selection |
| Mode toggle switch | `.mode-toggle__btn.active` | 150ms | JS class toggle | Confirms scope change |

### ANIMATED DATA PROHIBITED

Data values must never animate (no count-up on load, no value transitions). Data in SideCar represents real career-affecting Sailor records. Animating values implies real-time updates and erodes trust in the data freshness indicator. This is a hard prohibition.

---

## 8. NMCI Rendering Constraints (Build Output)

These constraints apply to the **Vite production build output**, not the source TypeScript/JSX:

- No CSS nesting in output (`& .child` syntax — Chrome 120+, beyond NMCI baseline)
- No `@container` queries (Chrome 105+, inconsistent on NMCI builds)
- No `@layer` cascade layers
- No `backdrop-filter: blur()` as sole visual indicator (may be disabled)
- No `dvh` / `svh` viewport units (use `vh` with fallback)
- No Tailwind CSS or any runtime CSS framework
- **Vite build target:** ES2020 for Chrome 110+ / Edge 110+ compatibility
- **Test with font fallbacks active** — the interface must be fully functional on Georgia/Arial/Consolas

> **Note:** Source code uses TypeScript `import`/`export` and React JSX — Vite compiles these to Chrome 110-compatible output.

---

## 9. Prohibited Patterns

These prohibitions are constitutional. Any of the following in a delivered artifact is a constraint violation.

### Layout Prohibitions

| Prohibited | Why | Compliant Alternative |
|---|---|---|
| Sidebar navigation | Violates Covenant layout architecture | Topbar-only navigation |
| Hamburger / drawer menu | SaaS / mobile-first pattern | Topbar nav with active state |
| Drop shadows on data tables | Creates false depth on Covenant surfaces | Border + background contrast only |
| Widget drag-and-drop | Consumer product pattern | Fixed institutional layout |

### Color Prohibitions

| Prohibited | Why |
|---|---|
| Any hardcoded hex in component CSS | Breaks token system. Single source of truth is `:root` only. |
| Gradient fills on cards, tables, or panels | Violates flat surface aesthetic. |
| Purple, teal, or blue as general UI accents | Purple is reserved for Escalated PRD tier. Semantic confusion. |
| Pure white (`#FFFFFF`) as page background | Creates eye fatigue. Use warm linen tokens. |
| PRD tier colors for non-PRD UI elements | Destroys the semantic integrity of the urgency signal system. |

### Typography Prohibitions

| Prohibited | Why |
|---|---|
| Fonts below 16px (16px Floor Law) | Presbyopia accessibility violation. Micro-copy is unacceptable for the 50-70yo demographic. |
| Inter / Bebas Neue / Libre Baskerville | Explicitly deprecated in favor of Verdana for improved cross-platform consistency. |
| `font-style: italic` anywhere | Causes massive sub-pixel rendering blur on standard NMCI monitors. |
| `text-transform: uppercase` on card titles | Destroys 'bouma' / word-shape predictability for dyslexic users. |
| Animated or counting-up data values | Implies real-time data. Erodes data freshness trust. |
| Emoji as content or status indicators | Renders inconsistently across NMCI browser configurations. |

### Engineering Prohibitions

| Prohibited | Why |
|---|---|
| External CDN JS without local fallback | Breaks on NMCI. Constraint C-07. |
| Direct `fetch()` calls from React components | All data through SideCarAdapter.ts. Constraint C-02/C-09. |
| PRD tier logic in components or rendering layer | Constraint C-14. Single processing layer in `PrdEngine.ts` only. |
| `@import` for Google Fonts | Blocks rendering, fails silently behind NMCI proxies. |
| `localStorage`/`sessionStorage` for PII | Constraint C-03. No PII on device. |
| `border-radius` above 10px on data elements | Exceeds Covenant radius constraint (exception: landing cards at 16px). |

---

## 10. Accessibility Floor

- **16px Typography Floor**: Legally required minimum limit for all operational strings.
- Color contrast: WCAG AA minimum (4.5:1 for body text, 3:1 for large text)
- All interactive elements keyboard-navigable
- Focus indicators visible (2px solid `--color-gold-primary`)
- No information conveyed by color alone (always pair with text or icon)
- All tables include `<th scope="col">` headers
- All status flag icons include tooltip text (see Quick-Flag semantics in Gemini.md Section 18)

---

## 11. Data Freshness Indicator

Every page must render a data freshness timestamp in the topbar:

```
Data Last Refreshed: 2026-03-27 14:30
```

- **Source:** `SideCarAdapter.getLastUpdated()`
- **Font:** `--font-data` (DM Mono)
- **Size:** `--type-data-xs` (16px)
- **Color:** `--color-text-dim`
- **Position:** Topbar, right-aligned

This is not decorative. The disconnected data architecture means users must always know how stale their view is.

---

*UI-UX.md v3.1 — SideCar Directive Library — Amended 2026-03-31 for React/TypeScript*


