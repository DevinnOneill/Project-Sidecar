# SideCar Workspace: Comprehensive Refactoring Plan

> **Version:** 1.0 | **Created:** 2026-04-01  
> **Authority:** Product Planning (Non-Governance — Does Not Override Directives)  
> **Domain:** Module-Specific Development Roadmap  
> **Module:** MOD-WORK (`sidecar-app/src/Workspace/Workspace.tsx`)

## 1. Strategic Intent & Persona Shift
The traditional Detailer workspace has artificially capped the user's role as a "Detailing Clerk" reacting to PRD timelines via a monolithic Kanban board. 

The mandate of the SideCar Workspace overhaul is to pivot the user into an **AI-Enabled Career Coach and Force Architect**. We are shifting from a reactionary, timeline-based model to a proactive, predictive model. Rather than managing standard assignments in a visual pipe, the Coach needs a Command Center that prioritizes "intelligent interventions" based on deep behavioral telemetry, Probability of Volunteerism (Pvol), and best-match analytics (BnF).

To achieve this, the Kanban layout is being entirely purged. In its place, we will implement a multi-module **Bento-Box Hub Architecture**. 

## 2. Architectural Paradigm: The Bento-Box Hub
The `pipeline-board-wrapper` (which currently houses the Kanban Board) will be dismantled and replaced by a responsive CSS grid system (`.bento-grid`). 

### Core Layout Principles
- **Persistent Visibility:** The left-hand sidebar ("Priority Interventions", "Today's Schedule", "Action List") remains intact. It is the steady heartbeat of the workspace.
- **Dynamic Hub:** The primary viewport will consist of four high-density "Cards" or "Widgets" arranged in a responsive grid.
- **Modal Isolation:** These widgets are dashboards. Engaging deeply with one of these workflows (e.g., actively writing an order) will use the Glass Cockpit UX standard: it will expand into a full-viewport modal overlay (`.bento-modal`), ensuring the user is never navigated to a disparate page. When closed, they return instantly to the hub.

---

## 3. Widget Design & Structural Specs

### Widget A: Coaching Strategy & Intervention Planner (The "Digital Twin")
*Grid Placement: Primary focus area, spans upper 60% of the Bento Grid.*

**Concept:** The detailer is tipped off to intervene by the "Telemetered Digital Twin" of the Sailor. This widget provides the interface to understand the risk and plan the communication before picking up the phone.

**UI Layout & Hierarchy:**
- **Split-Pane Architecture:**
  - *Left Pane (The Roster):* A condensed vertical feed of Sailors flagged by AI for intervention. Each row displays Name, Rate, and the primary "Driver Token" (e.g., `Sentiment Drop`, `BnF Mismatch`).
  - *Right Pane (The Digital Twin Canvas):* Displays the telemetered intelligence when a Sailor is selected.
- **Digital Twin Canvas Elements:**
  - **Header Block:** Sailor Name, Rate, Days Since Last Contact, and an aggregate "Risk Matrix Score" driving the intervention priority.
  - **Milestone & Empathy Context:** A dedicated alert zone highlighting recent notable changes in the Sailor's life/record. Designed to build instant rapport. Examples:
    - *Celebratory (*`🎉`*)*: Newly acquired NEC, selection for advancement, degree completion.
    - *Empathy (*`❤️`*)*: Recent EFMP enrollment, pending COLO request, identified administrative/pay hardships.
  - **Analytics Block (Sentiment):** A visual sparkline (`<SentimentSparkline />`) mapping a 6-month sentiment trend. Includes a text readout of extracted burnout triggers (e.g., "Critical Stressor: High Admin Friction").
  - **Gap Engine Block (Pvol vs Record):** A visual progress bar depicting the Sailor's objective Competitiveness Score versus the required score for their top Pvol target. A bulleted list below outlines the exact missing qualifications or AQDs causing the gap.
  - **AI Coaching Vector Block:** A stylized inset box (`<CoachingPrompt />`) containing a synthesized coaching script/prompt for the Detailer to utilize (e.g., "Address frustration regarding admin friction. Pitch CSG-staff billet as a pathway to gaining required NEC.").
- **Action Footer:** Buttons to "Launch Appt Prep Card", "Draft Coaching Plan", or "Log Contact".

### Widget B: Orders Writing Hub
*Grid Placement: Lower left quadrant.*

**Concept:** A dedicated command center for executing the technical assignment of Sailors. While Widget A handles the "Why" and "What" (Coaching/Matching), Widget B handles the "How" (Administrative Execution). It functions as an Alert-to-Action queue for stalled processing and the entry point for deep-dive order drafting.

**UI Layout & Hierarchy:** 
- A dense, vertically scrolling high-visibility table (`.orders-widget-table`).
- **Columns/Data:** 
  - `Sailor Name` (Linked to full record)
  - `Target Command / Billet` 
  - `Status Lozenge` (`Drafting`, `Routing`, `Released`, `Mod Pending`, `ORMOD`)
  - `Time-in-Status` (e.g., "4d")
- **Alert-to-Action Visual Emphasis:** 
  - Rows automatically elevate to the top and highlight with a gold/red structural border if stalled (e.g., Pending Branch Approver > 3 days, OBLISERV required but unsigned). 
- **Modal Interaction (Deep Work):** 
  - Clicking any row does not simply expand the widget; it triggers the specific **Orders Workstation Modal**. 
  - This isolated modal provides the actual drafting tools: Accounting Data checks, Obliserv (EAOS vs PRD) verification, En Route Training pipeline construction, and routing checklists.

### Widget C: Slating & Assignment Overview
*Grid Placement: Lower right quadrant.*

**Concept:** The Force Architecture engine. This widget allows the Coach to shift from individual assignments to analyzing the supply/demand health of their entire community, and to rapidly approve Best Navy Fit (BnF) algorithmic matches.

**UI Layout & Hierarchy:**
- **Macro-Metrics (Top Ribbon):** Three large, bold metric cards displaying: "Available Billets (Current Window)", "Unslated Inventory", and "Projected Match Rate".
- **Supply/Demand Deficit Bar:** A centralized horizontal bar graphic visualizing the net deficit/surplus for the user's specific community (e.g., IT E-5).
- **Pending Proposed Matches (Bottom Feed):** A list of AI-generated optimal matches (`Sailor Y -> Billet Z`). 
- **Modal Interaction (Deep Work):**
  - Clicking the widget frame launches the **Slating Optimizer Modal**. This is an immersive, split-screen UI showing the Unslated Pool on the left, and Open Requisitions on the right, enabling drag-and-drop manual slating or algorithmic execution.

### Widget D: Separations Tracker
*Grid Placement: Smallest footprint, anchored centrally on the right edge or below Orders Writing, utilizing high-alert "Glass Cockpit" styling.*

**Concept:** Acute crisis management. This widget identifies personnel actively flagged in NSIPS for separation. It shifts the Detailer's mindset from "routine assignment" to "tactical retention or smooth offboarding."

**UI Layout & Hierarchy:**
- **High-Alert Aesthetic:** Encased in a crimson/gold structural border (`.widget--critical`) to draw immediate eye movement if populated.
- **Data Table:** A tight, dense list of Sailors with an active C-WAY or NSIPS separation intent.
  - `Sailor Name` & `Intent Date`
  - `Stated Driver`: The primary reason for separation (e.g., `Civilian Sector Pay`, `Geographic Instability`).
  - `Loss Impact Score`: An AI-calculated metric (0-100) assessing the cost to the Navy if this Sailor leaves (based on holding critical NECs, leadership evals, etc.).
  - `AI Recommendation Lozenge`: Suggests either `[RETAIN]` (for High Impact losses) or `[PROCESS]` (for low impact).
- **Modal Interaction (Deep Work):**
  - Clicking a row launches the **Retention/Offboarding Modal**. 
  - If the AI suggests `[RETAIN]`, the Modal automatically generates a "Retention Pitch" (e.g., surfacing lucrative re-enlistment bonuses, highly-desirable OCONUS billets available, or specialized schools). 
  - If `[PROCESS]`, it surfaces the smooth administrative offboarding checklist to ensure the Sailor transitions positively to the civilian sector or reserves, maintaining good faith.

---

## 4. Synthetic Data Scaffolding Requirements
Because SideCar is currently a decoupled concept prototype (C-03 Constraint: Synthetic Only), we must build the underlying data structures in `sidecar-app/src/services/SyntheticData.ts` to support these new bento widgets. 

### `SYNTHETIC_DIGITAL_TWIN`
Provides the deep telemetry for the **Intervention Planner**.
- `sailorId`
- `notableEvents`: Array of objects (e.g., `{ type: 'celebratory', text: 'Selected for advancement to E-6' }` or `{ type: 'empathy', text: 'Recent EFMP Category 4 update' }`).
- `sentimentTrend`: Array of integers indicating recent burnout/morale trend.
- `burnoutTriggers`: Array of identified stressors.
- `competitivenessGaps`: Array of missing qualifications needed for their Pvol target.
- `aiCoachingPrompt`: Generated text snippet for the coach.

### `SYNTHETIC_ORDERS_STATUS`
Drives the **Orders Writing** widget.
- `sailorId`
- `targetCommand`, `targetBillet`
- `status` (`Drafting`, `Routing`, `Released`, `Mod Pending`)
- `daysInStatus`: Integer
- `administrativeBlockers`: Array (e.g., `["OBLISERV Required: EAOS < 24mo", "Awaiting Medical Screening"]`) 
- `routingStep`: String (e.g., `Branch Head Approval`)

### `SYNTHETIC_SLATING_BOARD`
Drives the **Slating & Assignment** widget.
- `communityMetrics`: Object containing `availableBillets`, `unslatedSailors`, `deficitScore`.
- `proposedMatches`: Array of objects (e.g., `{ sailorId: '123', billetId: 'B007', bnfScore: 92, status: 'Pending Review' }`).

### `SYNTHETIC_SEPARATIONS`
Drives the **Separations Tracker** widget.
- `sailorId`
- `intentDate`, `statedDriver` (String: e.g., 'Work/Life Balance')
- `lossImpactScore`: Integer (1-100)
- `aiRecommendation`: String (`RETAIN` or `PROCESS`)
- `retentionPitch`: String (e.g., "Offer SRB multiplier and guaranteed Hawaii orders.")

---

## 5. Advancements in Core Workflows

### Advanced Prep Cards (The "Why")
Currently, the `PrepCard` component is generic. It will be refactored to hook directly into the new `SYNTHETIC_DIGITAL_TWIN` dataset. Detailers will clearly see a Sailor's predictive profile *before* a Microsoft Bookings call begins.

### Mass Operations Parity
The hub must support force-level actions. We will introduce a "Select Mode" toggle inside the Bento Hub which transforms the interfaces to allow multi-select. 
- Example UX: The Coach can select 15 Sailors inside the Intervention Planner with similar "Competitiveness Gaps" and launch a Mass Action email providing a standardized coaching plan to all 15 simultaneously.

## 6. Execution Phases
Once this plan is approved and transitioned to an Implementation Plan artifact, development will proceed in the following order:

1. **Phase 1: Data Scaffolding & Layout Purge:** Strip the Kanban board from HTML/CSS. Build the Grid layout. Inject the new synthetic data models into `SyntheticData.ts`.
2. **Phase 2: Bento Widget Construction:** Build the HTML/CSS structural shells for the 4 core widgets based on the specs above, populating them with the new dummy data.
3. **Phase 3: The Coaching Strategy UI:** Implement the split-pane UI for the Intervention Planner, wiring up the UI to represent the Digital Twin telemetry (Events, Pvol, Sentiment Sparklines, AI Coaching Prompts).
4. **Phase 4: Workflow Parity:** Overhaul the Prep Card and enable Mass Actions.
