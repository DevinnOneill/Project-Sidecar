# UX-PATTERNS.md — Interaction Patterns & Feature Specifications

> **Version:** 1.0 | **Domain:** Feature-Level UX Patterns, Interaction Design, Component Behavior
> **Authority:** Tier 1 | **Source:** UX Guidelines and Prompts, PERS-4 Requirements
> **Loaded By:** Sessions involving dashboard or feature module development

---

## 1. Quick-Flag Grid System

### Purpose
The Quick-Flag grid provides at-a-glance status visibility for each Sailor in the Detailer View. Flags communicate administrative or legal status that affects assignability. A Detailer must know immediately — before clicking into a record — whether a Sailor has a hold, a medical condition, or a dependency that constrains their next assignment.

### Sticky Status Column
The Quick-Flag column is the **first data column** in the Sailor Priority Queue table (immediately after the Status Dot column). It is `position: sticky` and pinned to the left edge during horizontal scrolling.

### Icon Semantics

| Flag Code | Icon | CSS Class | Meaning | Assignment Impact |
|---|:---:|---|---|---|
| **8 Flag** | ⚑ | `.flag-promo-hold` | Promotion Hold | Cannot be slated for rank-dependent billets |
| **8,8 Flag** | ⚖ | `.flag-legal` | Active Legal Investigation | Assignment restricted pending resolution |
| **4 Flag** | 💐 | `.flag-colo` | Colocation Request | Spouse also in service — geographic constraint on assignment |
| **6 Flag** | 🏥 | `.flag-efmp` | Exceptional Family Member Program | Requires EFMP-compatible duty station |
| **LIMDU** | ✚ | `.flag-limdu` | Limited Duty (Medical Hold) | Non-deployable. Cannot PCS until cleared. |
| **OPSDEF** | 👶 | `.flag-opsdef` | Operational Deferment | Temporary non-availability (e.g., pregnancy) |

### Rendering Rules
- Icons render at 14px, centered in a 24px container
- Multiple flags on one Sailor render side-by-side, max 3 visible at once
- If > 3 flags, show first 3 + `+N` overflow indicator
- **No flag text** — icons only. Information conveyed via tooltip.
- Each icon must have a tooltip (see Section 5)
- Flag icons use `--color-text-secondary` as default color
- Active/urgent flags (LIMDU, Legal) use `--color-prd-red-text` for emphasis
- Flag absence means no flag (no "unflagged" indicator needed)

### Data Source
Flags are boolean fields on the Sailor object returned by `SideCarAdapter.getSailor()`:

```javascript
{
  flags: {
    promoHold:  false,  // 8 Flag
    legalHold:  false,  // 8,8 Flag
    colo:       true,   // 4 Flag — includes spouse SSN ref
    efmp:       true,   // 6 Flag
    limdu:      false,  // LIMDU
    opsdef:     false   // OPSDEF
  }
}
```

**Security Rule (SECURITY.md §11):** Flag fields are boolean only. The adapter never returns diagnostic details, medical narratives, or investigation specifics — even in synthetic data.

---

## 2. Baseball Card Comparison Modal

### Purpose
The Baseball Card modal enables side-by-side comparison of two Sailors — a critical workflow when a Detailer is choosing between candidates for a billet. The metaphor is a baseball trading card: compact, scannable, with all key stats visible at once.

### Trigger
- User selects a Sailor in the Priority Queue → card 1 populates
- User holds `Shift` and selects a second Sailor → card 2 populates and the comparison modal opens
- Alternative: "Compare" button in the Personnel View header, with a second Sailor search

### Modal Layout

```
┌──────────────────────────────────────────────────────────────┐
│  COMPARE SAILORS                                    [✕ Close]│
├─────────────────────────┬────────────────────────────────────┤
│  [Sailor A Card]        │  [Sailor B Card]                   │
│                         │                                    │
│  Name: ALPHA, SAILOR B  │  Name: BRAVO, SAILOR C             │
│  Rate/Rank: IT1 (E-6)   │  Rate/Rank: IT1 (E-6)              │
│  DODID: 9999000001       │  DODID: 9999000002                 │
│  PRD: [■ URGENT] 202607 │  PRD: [■ WATCH] 202610             │
│  EAOS: 202812           │  EAOS: 202903                      │
│  Command: USS EXAMPLE    │  Command: USS SAMPLE               │
│  BSC: 12345              │  BSC: 67890                        │
│  AQDs: 2K7, 4E1          │  AQDs: 2K7                         │
│  Flags: ⚑ 💐             │  Flags: ✚                          │
│  FITREP Avg: 3.82        │  FITREP Avg: 3.91                  │
│                         │                                    │
│  [View Full Profile]     │  [View Full Profile]               │
├─────────────────────────┴────────────────────────────────────┤
│  FIELD COMPARISON                                             │
│  ┌──────────┬──────────┬──────────┬────────────────────┐     │
│  │ Field    │ Sailor A │ Sailor B │ Advantage          │     │
│  ├──────────┼──────────┼──────────┼────────────────────┤     │
│  │ PRD      │ 202607   │ 202610   │ A rotates sooner   │     │
│  │ EAOS     │ 202812   │ 202903   │ B has more service │     │
│  │ AQDs     │ 2        │ 1        │ A more qualified   │     │
│  │ FITREP   │ 3.82     │ 3.91     │ B higher avg       │     │
│  └──────────┴──────────┴──────────┴────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
```

### Styling Rules
- Modal uses `--color-bg-surface` background
- Backdrop overlay: semi-transparent dark layer (NOT `backdrop-filter: blur()` — NMCI constraint)
- Modal border-radius: `--radius-lg` (8px)
- All data fields: `--font-data` at `--type-data-md`
- PRD badges use standard `.prd-badge` component
- Close button: top-right, `--color-text-muted`, hover to `--color-text-primary`
- Modal max-width: 900px, centered

### Data Source
Both cards are populated from `SideCarAdapter.getSailor(sailorId)`. No additional data fetching.

---

## 3. Settings Hub

### Purpose
The Settings Hub allows each user to configure their SideCar experience based on their operational role. It is not an "admin panel" — it is a personal workspace configuration interface.

### Access
Located in the topbar as a gear icon (⚙), right-aligned before the data freshness timestamp.

### Configuration Options

| Setting | Default | Options | Persisted? |
|---|---|---|---|
| **Role Mode** | Detailer | Detailer / Placement / Evaluator / TYCOM | `localStorage` (non-PII) |
| **Default PRD Filter** | All Tiers | Checkboxes for each of 5 tiers | `localStorage` |
| **Table Density** | Standard | Compact / Standard / Expanded | `localStorage` |
| **Rows Per Page** | 25 | 10 / 25 / 50 / 100 | `localStorage` |
| **Highlight Escalated** | On | Toggle | `localStorage` |
| **Community Filter** | None | Text input for designator/rate filter | `localStorage` |

### Phase 1A Implementation
- Settings stored in `localStorage` under non-PII keys (e.g., `sidecar_role`, `sidecar_density`)
- No server-side persistence in Phase 1A
- Settings reset on `localStorage` clear — this is acceptable
- Settings panel is a slide-over from the right, NOT a full-page route

### Styling Rules
- Panel background: `--color-bg-surface`
- Border-left: `1px solid var(--color-border-default)`
- Width: 320px, slides from right edge
- Close via ✕ button or clicking outside
- All form elements: `--font-data` at `--type-data-md`
- Section headings: `--font-data` at `--type-data-xs`, uppercase, `--tracking-caps`

---

## 4. Shareability Protocol

### Purpose
SideCar operates in environments where Detailers may need to share their current view configuration with a colleague — a filtered roster, a specific command view, or a comparison setup. Because SideCar runs from `file://` in Phase 1A, URL-based sharing (query strings) is unreliable. The Shareability Protocol uses JSON export/import instead.

### Export
- User clicks "Share View" button (📤 icon in filter bar)
- System generates a JSON blob containing:
  - Current active filters
  - Sort column and direction
  - PRD tier filter selections
  - Role mode setting
  - Any active community filter
- JSON is copied to clipboard with a toast notification: "View configuration copied"

### Import
- User clicks "Load View" button (📥 icon in filter bar)
- Paste area accepts JSON blob
- System validates JSON structure, applies filters
- Invalid JSON shows inline error: "Invalid configuration format"

### JSON Schema

```javascript
{
  "version": "1.0",
  "exported": "2026-03-27T14:30:00Z",
  "filters": {
    "search": "IT1",
    "prdTiers": ["CRITICAL", "URGENT"],
    "rate": "IT",
    "payGrade": "E-6"
  },
  "sort": {
    "column": "prd",
    "direction": "asc"
  },
  "role": "detailer",
  "community": "1110"
}
```

### Security Rules
- JSON blob contains NO PII — only filter/sort configuration
- Exported JSON is never persisted to disk automatically
- Clipboard write uses `navigator.clipboard.writeText()` with fallback to textarea selection

---

## 5. Tooltip System

### Purpose
Tooltips provide contextual information on hover without cluttering the interface. They are essential for Quick-Flag icons, column headers, and abbreviated data values.

### Behavior Specification

| Property | Value |
|---|---|
| **Trigger** | Mouse hover |
| **Delay before show** | 400ms (prevents flicker during mouse traversal) |
| **Delay before hide** | 100ms (allows mouse to move to tooltip for long text) |
| **Max width** | 280px |
| **Position** | Above the trigger element, centered. Falls below if above would clip viewport. |
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

### Implementation (Vanilla JS — No Libraries)

```javascript
// Tooltip controller — attach to any element with data-tooltip attribute
(function () {
  'use strict';
  var tip = null;
  var showTimer = null;
  var hideTimer = null;

  function show(el) {
    clearTimeout(hideTimer);
    showTimer = setTimeout(function () {
      if (!tip) {
        tip = document.createElement('div');
        tip.className = 'tooltip';
        document.body.appendChild(tip);
      }
      tip.textContent = el.getAttribute('data-tooltip');
      var rect = el.getBoundingClientRect();
      tip.style.left = rect.left + (rect.width / 2) - (tip.offsetWidth / 2) + 'px';
      tip.style.top  = rect.top - tip.offsetHeight - 6 + window.scrollY + 'px';
      tip.classList.add('is-visible');
    }, 400);
  }

  function hide() {
    clearTimeout(showTimer);
    hideTimer = setTimeout(function () {
      if (tip) tip.classList.remove('is-visible');
    }, 100);
  }

  document.addEventListener('mouseover', function (e) {
    var target = e.target.closest('[data-tooltip]');
    if (target) show(target);
  });
  document.addEventListener('mouseout', function (e) {
    var target = e.target.closest('[data-tooltip]');
    if (target) hide();
  });
}());
```

### Usage — HTML Attribute Pattern

```html
<!-- Quick-Flag icon with tooltip -->
<span class="flag-limdu" data-tooltip="LIMDU: Limited Duty (Medical Hold)">✚</span>

<!-- Column header with tooltip -->
<th data-tooltip="Projected Rotation Date — months until next assignment">PRD</th>

<!-- Abbreviated data with tooltip -->
<td data-tooltip="Surface Warfare Officer">SWO</td>
```

---

## 6. Manning Percentage Toggle

### Purpose
The Command View must display manning percentage that toggles between two analytical lenses:

| Lens | Denominator | Use Case |
|---|---|---|
| **Billet-Based** | Total Billets Authorized (`O.BA` + `E.BA`) | True structural capacity of the command |
| **DMP-Limited** | Billets allowed by NMP/DMP distribution plan | Realistic manning target given Navy-wide inventory |

### UI Implementation
- Toggle between the two lenses using a `.mode-toggle` component (see UI-UX.md §6.7)
- Label: "BILLET BASED" / "DMP LIMITED"
- Manning % renders in Bebas Neue at `--type-display-xl` (48px)
- Below 80%: text in `--color-prd-red-text`
- 80–95%: text in `--color-prd-yellow-text`
- 95–105%: text in `--color-prd-green-text`
- Above 105% (overmanned): text in `--color-prd-yellow-text` with "▲" indicator

### Calculation (app.js — computeManning)

```javascript
function computeManning(command, mode) {
  var filled = command.personnelAssigned;
  var authorized;
  if (mode === 'billet') {
    authorized = command.billetsAuthorized; // O.BA + E.BA
  } else {
    authorized = command.dmpLimited; // DMP/NMP cap
  }
  if (!authorized || authorized === 0) return { pct: null, label: 'N/A' };
  var pct = Math.round((filled / authorized) * 100);
  return { pct: pct, label: pct + '%' };
}
```

---

*UX-PATTERNS.md v1.0 — SideCar Directive Library*
