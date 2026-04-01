# UX-PATTERNS.md — Interaction Patterns & Feature Specifications

> **Version:** 2.0 (DRY Governance Refactor) | **Domain:** Feature-Level UX Patterns, Interaction Design, Component Behavior
> **Authority:** Tier 1 | **Source:** Covenant Design System

---

## 1. Quick-Flag Grid System

### Purpose
The Quick-Flag grid provides at-a-glance status visibility for each entity. Flags communicate critical states that require immediate user action. The specific flags active for a module (e.g., Medical Holds, Retention Risks, Pvol Targets Met) must be determined by the `docs/` strategic file for that module, but the *rendering pattern* remains universal.

### Sticky Status Column
The Quick-Flag column is typically the **first data column** in any priority queue table. It is `position: sticky` and pinned to the left edge during horizontal scrolling.

### Rendering Rules
- Icons render at 16px, centered in a 24px container
- Multiple flags on one entity render side-by-side, max 3 visible at once
- If > 3 flags, show first 3 + `+N` overflow indicator
- **No flag text** — icons only. Information conveyed via tooltip.
- Each icon must have a tooltip (see Section 5)
- Urgent flags (as defined by the active module's strategy) use `--color-prd-red-text` for emphasis

---

## 2. Information Comparison Modal (Baseball Card)

### Purpose
The Baseball Card modal enables side-by-side comparison of two entities. The specific metrics displayed inside the card MUST be governed by the module's strategy (e.g., `docs/workspace.md`). For example, if the active persona is an AI-Enabled Career Coach tracking Pvol gaps, the comparison modal must display analytical competitiveness metrics rather than just chronological dates.

### Styling Rules
- Modal uses `--color-bg-surface` background
- Backdrop overlay: semi-transparent layer (NOT `backdrop-filter: blur()` — NMCI constraint)
- Modal border-radius: `--radius-lg` (8px)
- All data fields: `--font-data` at `--type-data-md`
- Close button: top-right, `--color-text-muted`, hover to `--color-text-primary`
- Modal max-width: 900px, centered

---

## 3. Settings Hub

### Purpose
The Settings Hub allows each user to configure their local view. It acts as a slide-over configuration interface rather than a full page route.

### Phase 1A Implementation
- Settings stored in `localStorage` under non-PII keys
- Settings panel is a slide-over from the right, NOT a full-page route

### Styling Rules
- Panel background: `--color-bg-surface`
- Border-left: `1px solid var(--color-border-default)`
- Width: 320px, slides from right edge
- Close via ✕ button or clicking outside
- Section headings: `--font-data` at `--type-data-xs`, uppercase, `--tracking-caps`

---

## 4. Shareability Protocol

### Purpose
SideCar operates in environments where users may need to share their current view configuration (e.g., active filters, cohort selection). The Shareability Protocol uses JSON export/import for maximum portability across deployment contexts.

### Export
- System generates a JSON blob containing current active filters, sorts, and UI toggles.
- JSON is copied to clipboard with a toast notification.

### Import
- Paste area accepts JSON blob
- System validates JSON structure, applies local state

### Security Rules
- JSON blob contains NO PII — only filter/sort configuration

---

## 5. Tooltip System

### Behavior Specification
| Property | Value |
|---|---|
| **Trigger** | Mouse hover |
| **Delay before show** | 400ms (prevents flicker) |
| **Delay before hide** | 100ms |
| **Animation** | `opacity 0→1` over `--duration-fast` (150ms). No scale or translate. |

### Styling Rules

```css
.tooltip {
  position: absolute;
  background: var(--color-bg-elevated);
  color: var(--color-text-primary);
  font-family: var(--font-data);
  font-size: var(--type-data-sm);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-soft);
  max-width: 280px;
  white-space: normal;
  z-index: 2000;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--duration-fast) ease;
}
.tooltip.is-visible { opacity: 1; }
```

### Usage Pattern
Use the `data-tooltip` attribute on any element that requires explanatory text.

---

## 6. Analytical Mode Toggles

### Purpose
Component views often require toggling between two analytical lenses (e.g., Structural Capacity vs. Distribution Reality).

### UI Implementation
- Toggle using a `.mode-toggle` component
- Key metrics affected by the toggle render at `--type-display-xl`
- Threshold styling uses standard status colors (green/yellow/red) based on the active metric logic defined by the module strategy.

---

*UX-PATTERNS.md v2.0 — SideCar Directive Library (DRY Refactor)*
