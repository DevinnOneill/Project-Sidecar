# UI-UX.md — Interface Standards (Covenant Design System)

> **Version:** 2.0 | **Domain:** Visual Design, Component Behavior, Accessibility, NMCI Rendering
> **Authority:** Tier 1 | **Full Specification:** SIDECAR_DESIGN v2.0
> **Loaded By:** Every session that modifies HTML or CSS
> **Amended:** 2026-03-25 — Tier 1 authorized transition from dark/void to light/white+gold

---

## 1. The Design Rule

**If it reads as SaaS, redesign it.** SideCar is a mission-operations instrument. A dashboard aesthetic borrowed from B2B software products is incompatible with the Covenant direction.

## 2. Covenant — Five Principles

1. **Light-first:** Clean white surfaces with purposeful gold accents. The white surface IS the interface. There is no dark mode.
2. **Gold as signal:** Warm brass gold (#B39F75) marks what matters — borders, icons, active states. Never decorative fill on large surfaces.
3. **Typography carries structure:** Hierarchy lives in typeface, weight, and scale — not color alone. Any view must be readable in grayscale.
4. **Data is never softened:** Numbers, codes, and identifiers render in monospace at full contrast.
5. **Motion confirms state:** Animation communicates state changes only. If removing an animation has no functional consequence, the animation should not exist.

## 3. Token Authority

The full `:root` token declaration in `Gemini.md` Section 14 is the quick reference. SIDECAR_DESIGN v2.0 is the authoritative source.

**Hard rules:**
- No hex values outside `:root` (Constraint C-11)
- All numerical data uses `--font-data` (Constraint C-12)
- PRD colors are semantic-only (Constraint C-14)
- Background layers: lighter = deeper / more elevated (white base, off-white elevated)
- Gold is never used as background fill on large surfaces

## 4. Typography Roles

| Role | Font | Token | Usage |
|---|---|---|---|
| Display | Bebas Neue | `--font-display` | Page titles, section headers, navigation labels |
| Body | Libre Baskerville | `--font-body` | Narrative text, descriptions, instructions |
| Data | DM Mono | `--font-data` | All numbers, dates, codes, identifiers, PRD values |

**Font loading:** Three-layer fallback (Constraint C-05):
```css
@font-face {
  font-family: 'Bebas Neue';
  src: url('https://fonts.gstatic.com/...') format('woff2'),  /* CDN — may be blocked */
       url('fonts/BebasNeue.woff2') format('woff2');           /* Local fallback */
  font-display: swap;
}
/* System fallback in token: 'Bebas Neue', Impact, sans-serif */
```

## 5. Component Specifications (Summary)

### Topbar
- Gold rule border: 2px solid `--color-border-gold` at bottom
- This line is the one permanent anchor of the interface. It is never removed.
- Background: `--color-bg-surface` (white)
- Height: 56px

### Cards / Panels
- Background: `--color-bg-surface` (white)
- Border: 1px solid `--color-border-subtle`
- Border-radius: 4px for data panels, 16px for landing cards
- Padding: 16px 20px
- Shadow: `--shadow-soft` or `--shadow-card` for elevation

### Tables
- Header row: `--color-bg-elevated`, text in `--font-data` uppercase
- Row hover: `--color-bg-overlay`
- Row borders: `--color-border-subtle`
- All data cells: `--font-data`
- PRD column: colored dot + tier label using semantic PRD tokens

### PRD Badges
- Background: PRD tier background token (light-tinted per tier)
- Text: PRD tier text token
- Font: `--font-data`, uppercase, letter-spacing 0.05em
- Border-radius: 2px
- Padding: 2px 8px

### Navigation
- Active state: `--color-gold-primary` text + `--color-border-gold` bottom border
- Inactive: `--color-text-muted`
- Font: `--font-display`

## 6. NMCI Rendering Constraints

- No CSS nesting (`& .child` syntax — Chrome 120+, beyond baseline)
- No `@container` queries (Chrome 105+, but inconsistent on NMCI builds)
- No `@layer` cascade layers
- No `backdrop-filter: blur()` as sole visual indicator (may be disabled)
- No `dvh` / `svh` viewport units (use `vh` with fallback)
- No Tailwind CSS CDN or any runtime CSS framework (blocked on NMCI, no network at file://)
- Test with font fallbacks active — the interface must be fully functional on Georgia/Arial/Consolas

## 7. Accessibility Floor

- Color contrast: WCAG AA minimum (4.5:1 for body text, 3:1 for large text)
- All interactive elements keyboard-navigable
- Focus indicators visible (2px solid `--color-gold-primary`)
- No information conveyed by color alone (always pair with text or icon)
- All tables include `<th scope="col">` headers

---

*UI-UX.md v2.0 — SideCar Directive Library — Amended 2026-03-25 (dark→light)*
