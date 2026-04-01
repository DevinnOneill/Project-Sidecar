# BACKLOG.md — SideCar Feature Backlog

> **Version:** 1.0 | **Created:** 2026-03-28  
> **Authority:** Product Planning (Non-Governance — Does Not Override Directives)  
> **Scope:** Frontend implementation only. All items use `SideCarAdapter` with synthetic data stubs until Phase 1B Graph API integration.

---

## How to Read This Backlog

Each item follows this format:

```
### [ID] Title
- **Module:** Which MOD-* module this touches
- **Page(s):** Which React component(s) are modified or created
- **Adapter:** New SideCarAdapter methods required (synth stub first)
- **Priority:** 🔴 Critical | 🟡 High | 🟢 Medium | ⚪ Low
- **MS365 Target:** Which MS365 service this maps to in Phase 1B
- **Status:** ⬜ Backlog | 🔲 Ready | 🔳 In Progress | ✅ Done
- **Description:** What the frontend does
```

**Rules:**
1. Every new adapter method starts as `Promise.resolve(SYNTHETIC_DATA)` — no `fetch()` until Phase 1B.
2. Every new component follows the module boundary rules in `MODULE-MAP.md`.
3. Every new component uses the Covenant Design System tokens in `sidecar-app/src/index.css`.
4. No item ships without passing the quality gate in `TESTING.md`.

---

## Epic 1: Communication Management (Outlook Integration Surface)

> Detailers make 20-40 contacts/day across phone, email, and Teams. Every contact must be logged. Today this is manual. These items build the frontend for automated comm tracking and outbound templates.

### COM-001 — Comm Log Timeline View
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx`, `Personnel/Personnel.tsx`
- **Adapter:** `getCommLog(sailorId)` (exists)
- **Priority:** 🔴 Critical
- **MS365 Target:** Outlook Mail / Graph API
- **Status:** ✅ Done (Sprint 1)
- **Description:** Replace the flat comm log list with a vertical timeline component. Each entry shows: date, type icon (📧 email / 📞 phone / 💬 teams / 📋 note), summary, and staleness indicator. The timeline renders inside the Sailor detail panel on `Personnel/Personnel.tsx` and as a slide-out on `Workspace/Workspace.tsx` row click. Design must handle 50+ entries with virtual scrolling.

### COM-002 — Quick Contact Buttons
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx`, `Personnel/Personnel.tsx`
- **Adapter:** `addCommEntry(sailorId, entry)` (exists)
- **Priority:** 🔴 Critical
- **MS365 Target:** Outlook / Teams Deep Links
- **Status:** ✅ Done (Sprint 1)
- **Description:** Add a row-level action bar to the workspace roster: [📧 Email] [📞 Call] [💬 Teams] [📋 Note]. Clicking "Email" opens a pre-filled `mailto:` link with the Sailor's name and a template subject line ("RE: Assignment Coordination — [LastName], [FirstName] [Rate] [PayGrade]"). Clicking "Note" opens an inline form that calls `addCommEntry`. In Phase 1B, "Email" and "Teams" will trigger Graph API calls; for now they use deep links.

### COM-003 — Email Template Library
- **Module:** MOD-DET
- **Page(s):** New: `Workspace/Templates.tsx` or modal in `Workspace/Workspace.tsx`
- **Adapter:** New: `getTemplates()` → synth stub
- **Priority:** 🟡 High
- **MS365 Target:** Outlook Templates / Graph API draft creation
- **Status:** ✅ Done (Sprint 4)
- **Description:** Build a template picker modal with 5 standard detailer email templates:
  1. "PRD Window Opening" (90-day notice)
  2. "PRD Approaching — Action Required" (30-day notice)
  3. "Billet Options Available" (with placeholder billet list)
  4. "COLO/EFMP Request Acknowledgment"
  5. "Order Modification Status Update"
  
  Each template has merge fields: `{{sailorName}}`, `{{prd}}`, `{{command}}`, `{{rate}}`, `{{payGrade}}`. Template selection opens a preview with merged data from the Sailor record, then launches `mailto:` or (Phase 1B) creates a Graph API draft.

### COM-004 — Contact Staleness Heatmap
- **Module:** MOD-DET, MOD-ANLYT
- **Page(s):** `Workspace/Workspace.tsx`, `Analytics/Analytics.tsx`
- **Adapter:** `getSailors()` (exists — uses `lastContact` field)
- **Priority:** 🟡 High
- **MS365 Target:** Power BI (Phase 1B visualization)
- **Status:** ✅ Done (Sprint 5)
- **Description:** Add a heatmap row to the workspace dashboard showing contact staleness distribution: 0-7d (green), 8-14d (light green), 15-30d (yellow), 31-60d (orange), 60d+ (red). Each cell is clickable and filters the roster to that staleness band. Also render a summary version on `Analytics/Analytics.tsx` as a community-wide contact health metric.

### COM-005 — Auto-Log Indicator (Phase 1B Prep)
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx`, `Personnel/Personnel.tsx`
- **Adapter:** New: `getAutoLogStatus()` → synth stub (returns `{ enabled: false, pendingSyncs: 0 }`)
- **Priority:** 🟢 Medium
- **MS365 Target:** Graph Mail search → auto-populate comm log
- **Status:** ⬜ Backlog
- **Description:** Add a small status badge to the comm log panel: "Auto-Log: OFF" (Phase 1A) or "Auto-Log: ON — 3 pending syncs" (Phase 1B). This is a frontend-only indicator — no actual syncing occurs in Phase 1A. The badge teaches users the feature exists and builds expectation for Graph integration.

---

## Epic 2: Scheduling & Appointments (Bookings Integration Surface)

> A detailer with 2,000 Sailors cannot play phone tag. Self-service scheduling is the single highest-impact CRM function. These items build the scheduling frontend.

### SCH-001 — Appointment Calendar Widget
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx` (sidebar or drawer)
- **Adapter:** New: `getAppointments(detailerId, dateRange)` → synth stub
- **Priority:** 🔴 Critical
- **MS365 Target:** Microsoft Bookings API / Graph Calendar
- **Status:** ✅ Done (Sprint 3)
- **Description:** Add a collapsible calendar sidebar to the workspace showing today's and this week's appointments. Each appointment card shows: Sailor name, rate/grade, time, type (phone/video/in-person), and a one-line reason. Include a "No appointments today" empty state. Clicking an appointment opens the Sailor's `Personnel/Personnel.tsx` record. Synthetic data: 3-5 fake appointments per day for the current week.

### SCH-002 — Booking Link Generator
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx`, `Personnel/Personnel.tsx`
- **Adapter:** New: `getBookingLink(detailerId)` → synth stub (returns a placeholder URL)
- **Priority:** 🟡 High
- **MS365 Target:** Microsoft Bookings public page
- **Status:** ✅ Done (Sprint 3)
- **Description:** Add a "Send Booking Link" action to the Quick Contact bar (COM-002). Clicking it copies a booking URL to clipboard with a toast notification: "Booking link copied — paste into email." In Phase 1B, this URL is the actual Bookings public page. In Phase 1A, it returns a placeholder `https://outlook.office365.com/bes2/bookings/...` URL.

### SCH-003 — Appointment Preparation Card
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx` (calendar sidebar)
- **Adapter:** `getSailor(sailorId)` (exists), `getCommLog(sailorId)` (exists)
- **Priority:** 🟡 High
- **MS365 Target:** Bookings → Forms pre-appointment
- **Status:** ✅ Done (Sprint 3)
- **Description:** When a detailer clicks on an upcoming appointment in the calendar widget, show a "Prep Card" with: Sailor's PRD tier badge, current command, EAOS, last 3 comm log entries, and any active flags (LIMDU/ORDMOD/COLO). This gives the detailer a 10-second brief before the call. No new adapter methods — composites existing data.

### SCH-004 — No-Show Tracker
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx` (calendar sidebar)
- **Adapter:** New: `getNoShows(detailerId, dateRange)` → synth stub
- **Priority:** 🟢 Medium
- **MS365 Target:** Bookings webhook / Graph Calendar
- **Status:** ⬜ Backlog
- **Description:** Add a "Missed" tab to the calendar sidebar showing Sailors who did not attend their scheduled appointment. Each no-show card shows: Sailor name, missed date, and a "Reschedule" button (which triggers the booking link flow from SCH-002). Synthetic data: 1-2 no-shows per week.

---

## Epic 3: Preference & Intake Collection (Forms Integration Surface)

> Every PRD cycle requires collecting Sailor billet preferences, COLO requests, EFMP data, and special circumstances. Today this happens via unstructured email. These items formalize the intake process.

### FRM-001 — Preference Intake Status Column
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx`
- **Adapter:** New: `getFormStatus(sailorId)` → synth stub
- **Priority:** 🔴 Critical
- **MS365 Target:** Microsoft Forms / Power Automate
- **Status:** ✅ Done (Sprint 2)
- **Description:** Add a column to the workspace roster: "PREFS" — showing intake status per Sailor. States: ⬜ Not Sent | 📤 Sent | ✅ Received | ⚠️ Overdue (>14 days since sent, no response). The column is sortable and filterable. Clicking the cell opens a detail popover showing: form sent date, response date (if received), and top 3 billet preferences (if received). Synthetic data: randomized states across the roster.

### FRM-002 — Send Preference Form Action
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx`, `Personnel/Personnel.tsx`
- **Adapter:** New: `sendFormLink(sailorId, formType)` → synth stub (returns `{ sent: true, formUrl: '...' }`)
- **Priority:** 🟡 High
- **MS365 Target:** Microsoft Forms + Power Automate notification
- **Status:** ✅ Done (Sprint 4)
- **Description:** Add a "📋 Send Form" button to the roster action bar. Clicking opens a dropdown with form types: "PRD Preferences", "COLO Request", "EFMP Intake", "Special Circumstances". Selecting one triggers a toast: "Preference form sent to [Sailor]." In Phase 1B, this triggers a Power Automate flow that sends the Forms link via Outlook. In Phase 1A, it updates the synthetic form status to "Sent."

### FRM-003 — Preference Summary Panel
- **Module:** MOD-DET
- **Page(s):** `Personnel/Personnel.tsx`
- **Adapter:** New: `getFormResponses(sailorId)` → synth stub
- **Priority:** 🟡 High
- **MS365 Target:** Microsoft Forms responses API
- **Status:** ✅ Done (Sprint 4)
- **Description:** On the Sailor detail page (`Personnel/Personnel.tsx`), add a "Preferences" tab showing structured intake data: Top 3 billet choices (ranked), geographic preferences, sea/shore preference, COLO status (yes/no + spouse info), EFMP status (yes/no + category), and free-text special circumstances. Synthetic data: randomized but realistic preference sets.

### FRM-004 — Bulk Form Send
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx`
- **Adapter:** `sendFormLink` (from FRM-002, called in loop)
- **Priority:** 🟢 Medium
- **MS365 Target:** Power Automate batch processing
- **Status:** ⬜ Backlog
- **Description:** Add a bulk action to the workspace: select multiple Sailors via checkbox → "Send Form to Selected." Confirmation modal shows: "[X] Sailors selected. Send PRD Preference Form?" Progress bar shows send progress. Toast on completion: "Forms sent to [X] Sailors." This is a daily-use feature for detailers entering a new PRD cycle window.

---

## Epic 4: Alerts & Notifications (Teams / Power Automate Surface)

> A detailer needs proactive alerts, not just a dashboard to check. These items build the notification surfaces that will connect to Teams and Power Automate in Phase 1B.

### ALT-001 — Action Center Panel
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx` (drawer or sidebar)
- **Adapter:** New: `getNotifications(detailerId)` → synth stub
- **Priority:** 🔴 Critical
- **MS365 Target:** Teams Adaptive Cards / Power Automate
- **Status:** ✅ Done (Sprint 2)
- **Description:** Add an Action Center panel (bell icon in topbar, badge count) that lists prioritized notifications:
  - 🔴 "Alpha, Aaron PRD EXPIRED — 77 days no contact"
  - 🟡 "3 Sailors entering PRD window next month"
  - 🟢 "Foxtrot, Faye preference form received"
  - 📅 "2 appointments today at 0900 and 1400"
  
  Each notification has a type icon, timestamp, and a primary action button ("Open Record", "Send Email", "View Form"). Notifications are dismissible. Synthetic data: 8-12 notifications per session.

### ALT-002 — PRD Countdown Banners
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx`, `Personnel/Personnel.tsx`
- **Adapter:** `getSailors()` (exists — computed from PRD dates)
- **Priority:** 🟡 High
- **MS365 Target:** Power Automate scheduled flows
- **Status:** ✅ Done (Sprint 2)
- **Description:** Add milestone banners triggered at PRD threshold crossings: 9 months ("Window Opening"), 6 months ("Active Negotiation"), 3 months ("Orders Required"), 0 months ("EXPIRED — Escalation"). On `Personnel/Personnel.tsx`, the banner renders prominently at the top of the Sailor record. On `Workspace/Workspace.tsx`, the PRD badge already exists but add a tooltip showing "Crosses to CRITICAL in 12 days." Pure frontend computation — no new adapter calls.

### ALT-003 — Escalation Flag System
- **Module:** MOD-DET, MOD-PLAC
- **Page(s):** `Workspace/Workspace.tsx`, `Placement/Command.tsx`
- **Adapter:** New: `getEscalations(detailerId)` → synth stub
- **Priority:** 🟡 High
- **MS365 Target:** Power Automate → Teams channel post
- **Status:** ✅ Done (Sprint 5)
- **Description:** Build a compound escalation scoring system. A Sailor triggers escalation when: PRD EXPIRED + no contact >30d, OR PRD CRITICAL + LIMDU + no orders, OR any flag combination exceeding a risk threshold. Escalated Sailors render with a pulsing red border in the roster and appear in a dedicated "ESCALATION" section at the top of the workspace. On `Placement/Command.tsx`, escalated Sailors surface in the "Immediate Action" list with a [⚡ ESCALATED] badge.

### ALT-004 — Daily Digest Summary
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx` (modal on first load)
- **Adapter:** Computed from existing adapter methods
- **Priority:** 🟢 Medium
- **MS365 Target:** Power Automate → Outlook daily email
- **Status:** ⬜ Backlog
- **Description:** On workspace load, show a "Daily Brief" modal summarizing: total portfolio count, PRD tier breakdown changes since last session, new escalations, appointments today, pending form responses, and "Sailors you haven't contacted in 30+ days." Dismissible and re-accessible via a topbar button. This is the frontend preview of what the Power Automate daily digest email will contain in Phase 1B.

---

## Epic 5: Analytics & Reporting (Power BI Integration Surface)

> Branch Heads and Directors need trend data, not just point-in-time snapshots. These items build the reporting surfaces that Power BI will eventually power.

### RPT-001 — PRD Trend Chart
- **Module:** MOD-ANLYT
- **Page(s):** `Analytics/Analytics.tsx`
- **Adapter:** `getSailors()` (exists — computed projection)
- **Priority:** 🟡 High
- **MS365 Target:** Power BI Embedded
- **Status:** ⬜ Backlog
- **Description:** Add a 12-month PRD projection chart showing how the tier distribution will shift over time. X-axis: months (current → +12). Y-axis: count per tier. This is a stacked area chart rendered in pure CSS/SVG or lightweight React components (no heavy charting library — NMCI constraint). The chart projects current Sailors forward assuming no orders are written, showing the "wave" of PRDs approaching. Critical for resource planning.

### RPT-002 — Detailer Activity Metrics
- **Module:** MOD-ANLYT
- **Page(s):** `Analytics/Analytics.tsx`
- **Adapter:** New: `getActivityMetrics(detailerId, dateRange)` → synth stub
- **Priority:** 🟢 Medium
- **MS365 Target:** Power BI → Graph API activity data
- **Status:** ⬜ Backlog
- **Description:** Add a "My Activity" card to analytics showing: contacts made this week, forms sent, appointments completed, orders drafted, and average response time. Compare against portfolio size to show coverage percentage. Bar chart showing daily contact volume over the last 30 days. Synthetic data: randomized daily counts.

### RPT-003 — Manning Trend Line
- **Module:** MOD-ANLYT
- **Page(s):** `Analytics/Analytics.tsx`
- **Adapter:** `getCommands()`, `getBillets()` (exist — computed projection)
- **Priority:** 🟡 High
- **MS365 Target:** Power BI Embedded
- **Status:** ⬜ Backlog
- **Description:** Add a per-command manning trend line showing projected manning percentage over the next 12 months, accounting for known PRDs (Sailors leaving) and vacancy fills. Renders as a multi-line SVG chart — one line per command, color-coded. Commands projected to drop below 80% render with a warning indicator.

### RPT-004 — Power BI Embed Container
- **Module:** MOD-ANLYT
- **Page(s):** `Analytics/Analytics.tsx`
- **Adapter:** New: `getPowerBIEmbed(reportId)` → synth stub (returns placeholder config)
- **Priority:** 🟢 Medium
- **MS365 Target:** Power BI JavaScript SDK
- **Status:** ⬜ Backlog
- **Description:** Add a tabbed section to `Analytics/Analytics.tsx` with an embedded Power BI report container. In Phase 1A, the embed container shows a styled placeholder: "Power BI Report — Available when connected to GCC High environment" with a mock report thumbnail. In Phase 1B, the container uses the Power BI JS SDK to render live embedded reports. The adapter provides the embed token and report configuration.

### RPT-005 — Export to PowerPoint / PDF
- **Module:** MOD-ANLYT
- **Page(s):** `Analytics/Analytics.tsx`
- **Adapter:** Computed from existing data
- **Priority:** ⚪ Low
- **MS365 Target:** Power BI export API
- **Status:** ⬜ Backlog
- **Description:** Add an "Export" button to each analytics card that generates a printable/exportable view. In Phase 1A, this opens a `print`-optimized CSS view. In Phase 1B, this triggers the Power BI export API to generate PDF/PowerPoint. The print CSS must handle the data density of the analytics views without truncation.

---

## Epic 6: Workflow Automation (Power Automate Frontend Triggers)

> These items are frontend buttons and status indicators that will trigger Power Automate flows in Phase 1B. In Phase 1A, they update synthetic state to demonstrate the UX.

### WFL-001 — Order Drafting Wizard
- **Module:** MOD-DET
- **Page(s):** `Personnel/Personnel.tsx` or new `Workspace/Orders.tsx`
- **Adapter:** New: `draftOrder(sailorId, billetId)` → synth stub
- **Priority:** 🟡 High
- **MS365 Target:** Power Automate → SharePoint document generation
- **Status:** ⬜ Backlog
- **Description:** Build a multi-step "Tactical Wizard" (per UX-PATTERNS.md) for order creation: Step 1 — Select Sailor (pre-filled if launched from roster). Step 2 — Select Billet (filtered by rate/grade match). Step 3 — Review match quality (rate match, grade match, AQD match, geographic preference alignment). Step 4 — Generate draft order (creates a document stub). In Phase 1B, Step 4 triggers a Power Automate flow that generates a real order document in SharePoint.

### WFL-002 — Slate Builder
- **Module:** MOD-PLAC
- **Page(s):** New: `Placement/Slate.tsx` or panel in `Placement/Command.tsx`
- **Adapter:** New: `getSlate(billetId)` → synth stub, `addToSlate(billetId, sailorId)` → synth stub
- **Priority:** 🟡 High
- **MS365 Target:** Power Automate → SharePoint list, Outlook notification
- **Status:** ⬜ Backlog
- **Description:** Build a slate management interface for Placement Coordinators. For each open billet, show a "Candidates" list of eligible Sailors (rate/grade match from adapter). Drag-and-drop or button-add Sailors to the slate. Show match quality scoring per candidate. When the slate is "submitted," Phase 1B triggers a Power Automate flow that notifies the relevant detailer(s) via Outlook/Teams. Phase 1A updates synthetic state.

### WFL-003 — Workflow Status Pipeline
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx`, `Personnel/Personnel.tsx`
- **Adapter:** New: `getOrderStatus(sailorId)` → synth stub
- **Priority:** 🟢 Medium
- **MS365 Target:** Power Automate → status tracking
- **Status:** ✅ Done (Sprint 5)
- **Description:** Add a horizontal pipeline indicator to each Sailor record showing where they are in the assignment process: [Preference Collection] → [Billet Matching] → [Slate Review] → [Order Drafted] → [Order Approved] → [Orders Issued]. Each stage is a clickable step showing date entered, responsible party, and any blockers. Renders as a compact horizontal stepper in the roster and as a full-width bar on `Personnel/Personnel.tsx`.

---

## Epic 7: Cross-Platform Navigation & Role Switching

> The current workspace serves all roles from a shared nav. These items formalize role-based entry and navigation.

### NAV-001 — Role-Aware Landing
- **Module:** MOD-LAND
- **Page(s):** `Landing/Landing.tsx`
- **Adapter:** New: `getCurrentUser()` → synth stub (returns `{ role: 'DETAILER', designator: 'PERS-401', name: 'CDR Clark' }`)
- **Priority:** 🟢 Medium
- **MS365 Target:** Microsoft Entra ID (Azure AD)
- **Status:** ⬜ Backlog
- **Description:** Modify the Smart Pill on the landing page to show role-specific context. A Detailer sees "7 Priority Items — Enter Workspace →". A Branch Head sees "Community Health: 80% — Enter Analytics →". A Placement Coordinator sees "3 Open Billets — Enter Command →". The search bar behavior remains universal. Role is determined by a synthetic user object; in Phase 1B, this comes from Entra ID claims.

### NAV-002 — Workspace Tab Navigation
- **Module:** MOD-DET
- **Page(s):** `Workspace/Workspace.tsx`
- **Adapter:** None
- **Priority:** 🟡 High
- **MS365 Target:** N/A (pure frontend)
- **Status:** ✅ Done (Sprint 1)
- **Description:** Replace the flat roster-only view with a tabbed workspace: [Roster] [Calendar] [Action Center] [Templates]. Each tab renders in the main content area. This organizes the COM, SCH, and ALT features into a coherent workspace without requiring separate pages. Tab state persists in the URL hash for deep linking.

---

## Priority Matrix Summary

| Priority | Count | Items |
|----------|-------|-------|
| 🔴 Critical | 5 | ~~COM-001~~, ~~COM-002~~, ~~SCH-001~~, ~~FRM-001~~, ~~ALT-001~~ |
| 🟡 High | 12 | COM-003, COM-004, ~~SCH-002~~, ~~SCH-003~~, FRM-002, FRM-003, ~~ALT-002~~, ALT-003, RPT-001, RPT-003, WFL-001, WFL-002, ~~NAV-002~~ |
| 🟢 Medium | 8 | COM-005, SCH-004, FRM-004, ALT-004, RPT-002, RPT-004, WFL-003, NAV-001 |
| ⚪ Low | 1 | RPT-005 |

### Recommended Build Order (Frontend Sprints)

| Sprint | Items | Theme |
|--------|-------|-------|
| **Sprint 1** | COM-001, COM-002, NAV-002 | Core comm workflow + tabbed workspace |
| **Sprint 2** | ALT-001, ALT-002, FRM-001 | Action Center + preference tracking |
| **Sprint 3** | SCH-001, SCH-002, SCH-003 | Calendar & scheduling surface |
| **Sprint 4** | COM-003, FRM-002, FRM-003 | Templates + intake collection |
| **Sprint 5** | ALT-003, WFL-003, COM-004 | Escalation system + pipeline |
| **Sprint 6** | RPT-001, RPT-003, RPT-004 | Analytics charts + Power BI prep |
| **Sprint 7** | WFL-001, WFL-002 | Order wizard + slate builder |
| **Sprint 8** | NAV-001, COM-005, ALT-004, FRM-004, SCH-004, RPT-002, RPT-005 | Polish + Phase 1B prep |

---

## Adapter Method Inventory

### Existing (SideCarAdapter.ts)
| Method | Status |
|--------|--------|
| `getSailors(filters)` | ✅ Implemented |
| `getSailor(sailorId)` | ✅ Implemented |
| `getCommLog(sailorId)` | ✅ Implemented |
| `getBillets(commandId)` | ✅ Implemented |
| `getCommands(filters)` | ✅ Implemented |
| `addCommEntry(sailorId, entry)` | ✅ Implemented |
| `getFormStatus(sailorId)` | ✅ Implemented (Sprint 2) |
| `getAllFormStatuses()` | ✅ Implemented (Sprint 2) |
| `getNotifications()` | ✅ Implemented (Sprint 2) |
| `dismissNotification(notificationId)` | ✅ Implemented (Sprint 2) |
| `getAppointments(dateRange)` | ✅ Implemented (Sprint 3) |
| `getBookingLink()` | ✅ Implemented (Sprint 3) |
| `getTemplates()` | ✅ Implemented (Sprint 4) |
| `sendFormLink(sailorId, formType)` | ✅ Implemented (Sprint 4) |
| `getFormResponses(sailorId)` | ✅ Implemented (Sprint 4) |
| `getEscalations()` | ✅ Implemented (Sprint 5) |
| `getOrderStatus(sailorId)` | ✅ Implemented (Sprint 5) |
| `getAllOrderStatuses()` | ✅ Implemented (Sprint 5) |
| `getDataMode()` | ✅ Implemented |
| `getLastUpdated()` | ✅ Implemented |

### New (Required by Backlog — Synth Stubs)
| Method | Backlog Item | Phase 1B Target |
|--------|-------------|-----------------|
| `getAutoLogStatus()` | COM-005 | Graph Mail sync |
| `getAppointments(detailerId, dateRange)` | SCH-001 | Bookings API |
| `getBookingLink(detailerId)` | SCH-002 | Bookings public URL |
| `getNoShows(detailerId, dateRange)` | SCH-004 | Bookings webhook |
| `getActivityMetrics(detailerId, dateRange)` | RPT-002 | Power BI / Graph API |
| `getPowerBIEmbed(reportId)` | RPT-004 | Power BI JS SDK |
| `draftOrder(sailorId, billetId)` | WFL-001 | Power Automate → SharePoint |
| `getSlate(billetId)` | WFL-002 | SharePoint List |
| `addToSlate(billetId, sailorId)` | WFL-002 | SharePoint List |
| `getCurrentUser()` | NAV-001 | Entra ID (Azure AD) |

---

*BACKLOG.md v1.0 — SideCar Product Documentation*
