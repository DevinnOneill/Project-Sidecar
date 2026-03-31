# SideCar Workspace: Strategic Vision & Development Plan

> **Domain:** Module-Specific Development Roadmap
> **Module:** MOD-WORK (`app/workspace.html`)
> **Date:** March 2026

---

## 1. Core Purpose

The `workspace.html` module is the primary operational surface for Navy Detailers and Placement Coordinators. Its strategic mandate is to shift the user's role from a transactional "Detailing Clerk" to an **AI-Enabled Career Coach** and **Force Architect**. 

This document synthesizes the strategic vision, current architectural audit findings, and the targeted development roadmap required to empower this persona shift and successfully sunset legacy platforms (EAIS, OAIS, ODIS).

## 2. The Operational Philosophy (The Scale Problem)

Detailers manage portfolios of thousands of constituents. The workspace is explicitly designed **not** to display all constituents at once. Doing so violates the "Glass Cockpit" usability principle and creates immense cognitive overload.

Instead, the workspace must operate as an **Alert-to-Action queue**. It must intelligently filter the noise, surfacing only the fraction of Sailors (e.g., 40-50 out of 3,000) who require immediate intervention on any given day. 

This urgency must be defined by:
- Expired statutory/administrative timelines (PRD/EAOS).
- Contact staleness thresholds.
- **Crucially:** Behavioral telemetry and strategic signals (e.g., sudden drops in sentiment, high retention risk, or unaddressed qualification gaps affecting long-range competitiveness).

## 3. Current State Audit (March 2026 Baseline)

The workspace currently serves as a highly capable and elite CRM, but it treats all urgency as timeline-based rather than strategically diagnostic.

### Foundational Strengths (Clerk & CRM Capabilities)
- **Retention UI:** Strong implementation of escalation flags and locked semantic color-coding for PRD urgency.
- **Communications Log:** Effective, timestamped timeline view of communications.
- **Contact Management:** Highly visible tracking of contact staleness (e.g., "77d ago") and bucketing by health.
- **Microsoft Bookings Structure:** Solid Calendar integration providing automated structure for appointments.
- **Pipeline Tracking:** Clear, horizontal visual tracking of assignment states (Prefs → Match → Slate).

### Strategic Deficiencies (The Career Coach Gap)
- **Predictive Depth:** Complete lack of Probability of Volunteerism (Pvol) analytics.
- **Record Quality Synthesis:** No qualitative or comparative reading of a Sailor's record competitiveness against their peer group.
- **Coaching Gap Analysis:** The interface fails to map a Sailor's current record quality and qualifications against the requirements of their high-Pvol billets.
- **Qualitative Motivators:** Fails to surface the *why* a Sailor serves—behavioral telemetry and sentiment derived from MyCompass data.
- **Bookings Prep Cards:** Currently act as raw operational summaries rather than strategic pre-briefing tools. They lack Pvol objectives, competitiveness gaps, and synthesized retention risk data.

## 4. Development Roadmap & Required Workflows

To elevate the workspace from a CRM to a Force Architecture tool, the following capabilities must be integrated:

### Phase 1: Predictive & Diagnostic Injection
- **Pvol Integration:** Inject Probability of Volunteerism metrics into the main roster table and primary Sailor detail panel. Let the coach see what the Sailor wants before they even ask.
- **Competitiveness Gap Engine:** Implement a visual diagnostic comparing a Sailor's current qualifications with the hard requirements of their Pvol target billets early in their tour.
- **Advanced Prep Cards:** Overhaul the Bookings modal. A Prep Card must tell the Coach *exactly* what strategic gap needs to be discussed during the call to maximize the Sailor's opportunity.

### Phase 2: Missing Core Workflows
1. **Mass Update Functionality:** To efficiently shape the force architecture across thousands of records, the workspace needs bulk operational capabilities directly tied to the communication engine (e.g., logging a sweeping Subspec/AQD attainment or broadcasting a critical billet gap to a highly-filtered cohort).
2. **Separations Tracker:** A high-visibility, dedicated workflow that ingests live NSIPS separation status. Sailors filing for separation represent acute retention risks that demand immediate, specialized coach intervention outside the normal PRD rotation pipeline.
3. **Automated Coaching Gap Pathway:** A 1-click workflow to instantly draft and send a Sailor a personalized, actionable plan for qualification attainment based on their Pvol targets.

## 5. Conclusion

The current `workspace.html` provides a massive quality-of-life improvement for basic portfolio management. However, its true value lies in its potential predictive capability. All future development on this module must prioritize diagnostic intelligence over raw data display. Only by fully integrating Pvol, record quality synthesis, and automated gap analysis will SideCar fulfill its mandate to create AI-Enabled Career Coaches out of today's detailers.
