# INTEGRATIONS.md — System Adapter Contracts

> **Version:** 1.0 | **Domain:** Adapter Layer, Data Source Interfaces, Offline Behavior
> **Authority:** Tier 1
> **Loaded By:** Every session involving data access or adapter modifications

---

## 1. The Integration Rule

**Constitutional Constraint C-09:** No page, no component, no function communicates directly with a data source. Every data access routes through the `SideCarAdapter` interface in `app.js`. A direct data call is an architectural violation. The session halts.

## 2. Adapter Interface Contract

```javascript
const SideCarAdapter = {
  // READ operations
  getSailors:      function(filters)     { /* returns Promise<Sailor[]> */ },
  getSailor:       function(sailorId)    { /* returns Promise<Sailor>   */ },
  getCommLog:      function(sailorId)    { /* returns Promise<CommEntry[]> */ },
  getBillets:      function(commandId)   { /* returns Promise<Billet[]> */ },
  getCommands:     function(filters)     { /* returns Promise<Command[]> */ },

  // WRITE operations (append-only per C-10)
  addCommEntry:    function(sailorId, entry) { /* returns Promise<CommEntry> */ },

  // METADATA
  getDataMode:     function() { /* returns 'embedded' | 'csv' | 'api' */ },
  getLastUpdated:  function() { /* returns ISO timestamp */ }
};
```

### Contract Rules
- Every method returns a Promise (even in Phase 1A embedded mode — wrap in `Promise.resolve()`)
- Read operations never modify data
- Write operations are append-only (Constraint C-10)
- The calling code never checks `getDataMode()` to change behavior — it calls the same interface regardless
- Filters are plain objects: `{ rate: 'IT', payGrade: 'E5', prdTier: 'CRITICAL' }`

## 3. Phase 1A Implementation (Embedded Data)

```javascript
// Phase 1A: adapter returns synthetic data from app.js
SideCarAdapter.getSailors = function(filters) {
  let results = SYNTHETIC_SAILORS; // defined in app.js
  if (filters) {
    if (filters.rate) results = results.filter(s => s.rate === filters.rate);
    if (filters.prdTier) results = results.filter(s => computePRDTier(s).tier === filters.prdTier);
    // ... additional filters
  }
  return Promise.resolve(results);
};
```

## 4. Phase 1A+ Implementation (CSV File Picker — Mac Only)

```javascript
// Mac development mode: CSV parsed client-side
SideCarAdapter.getSailors = function(filters) {
  if (!window._csvData) return Promise.resolve([]);
  let results = window._csvData;
  // ... same filter logic
  return Promise.resolve(results);
};
```

The CSV parser is vanilla JavaScript. No Papa Parse. No external libraries. The parser handles:
- Quoted fields with commas
- Standard CSV escaping (double-quote within quotes)
- Header row mapping to Sailor object properties
- Date string normalization

## 5. Phase 1B Target (Graph API — Future)

```javascript
// Phase 1B: adapter calls Microsoft Graph API through GCC High
SideCarAdapter.getSailors = async function(filters) {
  const response = await fetch(GRAPH_ENDPOINT + '/sailors', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  let results = await response.json();
  // ... same filter logic
  return results;
};
```

**The calling code in page3.html, page4.html, etc. does not change between phases.** Only the adapter implementation changes.

## 6. Data Source Map

| Source | Phase 1A | Phase 1B+ | Data Provided |
|---|---|---|---|
| MyNavy Assignment | Synthetic in `app.js` | Graph API adapter | Assignment cycles, billet matches |
| NSIPS | Synthetic in `app.js` | Graph API adapter | Service records, PII, status flags |
| Outlook/Exchange | Synthetic in `app.js` | Graph API adapter | Communication logs |
| Detailer Spreadsheets | CSV file picker | SharePoint adapter | Local tracking data, notes |

## 7. Offline Behavior

Every module defines what happens when data is unavailable:

| Module | Online Behavior | Offline Behavior |
|---|---|---|
| Page 3 (Dashboard) | Full table render from adapter | Display last-loaded data with "DATA STALE" banner |
| Page 4 (Sailor Record) | Full profile from adapter | Display cached record with timestamp |
| Page 5 (Command Manning) | Full manning calculation | Display last-known manning with warning |
| Page 6 (Placement) | Cross-portfolio view | Display last-loaded snapshot |
| Comm Log (all pages) | Live append via adapter | Queue entries locally, sync on reconnect |

**In Phase 1A (embedded data), offline behavior is the default behavior.** The data is always present. But the offline patterns must be coded now so Phase 1B has the scaffolding.

## 8. Legacy System Landscape

SideCar replaces or overlays nine legacy systems. Every developer must understand what these systems are and why they exist — the adapter interface is designed to abstract them away, but the *data shapes* these systems produce define what the adapter must accept in Phase 1B.

| System | Full Name | Role | Data It Holds | Integration Challenge |
|---|---|---|---|---|
| **OAIS** | Officer Assignment Information System | Officer detailing + order writing | Officer assignments, PII, billet proposals | Mainframe. Screen scraping via Reflection/Extra!. No API. |
| **EAIS** | Enlisted Assignment Information System | Enlisted detailing | Enlisted assignments, sequential processing | Mainframe. Same screen scraping constraints as OAIS. |
| **ODIS** | Online Distribution Information System | Ad-hoc personnel/activity queries | Personnel records, activity data, billet maps | Primary query interface. Data dictionary defines our field schema. |
| **MNA** | MyNavy Assignment | Sailor-facing marketplace | Billet advertisements, Sailor preferences | Web-based. Complex RBAC. Manual account provisioning. |
| **NSIPS** | Navy Standard Integrated Personnel System | Authoritative personnel records | PII, dependency data, pay records, separation status | Limited API. CUI/PII controls. Data quality variable. |
| **ADE** | Authoritative Data Environment | Modern enterprise data platform | Validated, containerized data pipelines | **Phase 1B target.** Strict data governance. API-first. |
| **Jupiter** | Enterprise Data Environment | Discoverable enterprise data | Cross-domain operational analytics | API-first mandate. Requires data silo elimination. |
| **TFMMS** | Total Force Manpower Management System | Manpower requirements/balancing | Billet-position-personnel relationships | Batch processing. Complex relational data. Not real-time. |
| **Oracle** | Various Oracle Databases | Backend for multiple legacy systems | Proprietary schemas, stored procedures | Poorly documented. Business logic embedded in stored procs. |

### Why This Matters for Phase 1A Development

Even though Phase 1A uses synthetic data, the adapter interface and data shapes must be designed so they can accept data from any of these sources in Phase 1B without interface changes. When you build a filter for "rate" or "pay grade," you are designing for fields that will eventually come from ODIS/ADE. The adapter abstracts the source — but the data shape must be correct now.

## 9. ODIS Data Dictionary (Key Fields)

The ODIS Library Dictionary defines the field schema that SideCar's adapter will consume. These are the actual field names and types from the Navy's data systems. Phase 1A synthetic data must mirror these shapes.

### Personnel Fields
| ODIS Field | Type | SideCar Usage |
|---|---|---|
| `PRD` | Numeric(6), YYYYMM | Core urgency driver. Triggers negotiation window. Powers the 5-tier PRD system. |
| `EAOS` | Numeric(6), YYYYMM | Separation eligibility. Delta with PRD drives order eligibility. |
| `DODID` | Char(10) | Unique personnel key. Synthetic pattern: `9999XXXXXX`. |
| `DESIG` | Char(4) | Primary specialty (e.g., 1110 = SWO). Primary filter in dashboards. |
| `PAYGRADE` | Numeric(3) | Rank. Used for billet-rank matching validation. |
| `AQD` | Char(3) | Additional qualifications. Cross-referenced against billet AQDs. |
| `SUBSPEC` | Char(5) | Subspecialty expertise level from education/experience. |
| `NEC` | Char(4) | Enlisted skill classification. |
| `ACC` | Char(3) | Accounting category (student, transient, operational). Prevents assigning non-distributable personnel. |
| `NOBC` | Char(4) | Officer billet classification from service. Used by slate scoring. |
| `AVAIL.DT` | Numeric(6), YYYYMM | Availability date (distinct from PRD — critical for students, medical holds). |

### Activity/Billet Fields
| ODIS Field | Type | SideCar Usage |
|---|---|---|
| `ACTYCODE` | Char(10) | Activity code: 4 type + 4 hull/squadron + 2 parent/component. |
| `AUIC/PUIC` | Char(5) | Unit Identification Code (Actual/Parent). Builds command hierarchy trees. |
| `BSC` | Numeric(5) | Billet Sequence Code — primary key linking a requirement to a person. |
| `GEOLOC` | Char(8) | Geographic location: 2 country + 2 state + 4 city. Used by COLO/EFMP algorithms. |
| `O.BA/E.BA` | Numeric(5) | Billets Authorized (Officer/Enlisted). Denominator for manning %. |

### Transaction Fields
| ODIS Field | Type | SideCar Usage |
|---|---|---|
| `CHOP.DESK` | Char(7) | BUPERS desk that must approve a proposal. Drives workflow routing. |
| `FILL.DECISION` | Char(1) | Billet approved for posting. Triggers MNA marketplace visibility. |
| `CIC` | Char(8) | Customer ID Code. Ties PCS action to financial accounting. |

## 10. Data Freshness Requirement

Because SideCar operates on disconnected CSV data (Phase 1A) or batch-refreshed API data (Phase 1B), every screen must prominently display:

```
Data Last Refreshed: [YYYY-MM-DD HH:MM]
```

This timestamp must use `SideCarAdapter.getLastUpdated()` and render in:
- **Font:** `--font-data` (DM Mono)
- **Size:** `--type-data-xs` (11px)
- **Color:** `--color-text-dim`
- **Position:** Topbar, right-aligned

**This is not optional.** The disconnected data architecture means users must always know how stale their view is. A Detailer making assignment decisions on data that is 48 hours old needs to know that.

## 11. Phased Integration Strategy

| Phase | Data Source | Adapter Behavior | Legacy Systems |
|---|---|---|---|
| **1A (Now)** | Synthetic embedded in `app.js` | `Promise.resolve(SYNTHETIC_DATA)` | No connection |
| **1A+ (Dev)** | CSV file picker (Mac only) | Client-side parse → `Promise.resolve(parsed)` | No connection |
| **1B (Near-term)** | ADE via Microsoft Graph API / GCC High | `fetch()` to Graph endpoint → `Promise.resolve(response)` | OAIS/EAIS still handle transactions |
| **2 (2027)** | ADE + direct database access | Full CRUD through adapter | OAIS/EAIS decommissioned |

The adapter interface contract (`SideCarAdapter.*`) does not change between phases. Only the implementation behind each method changes. This is why C-09 (adapter-only pattern) is constitutional — it is the mechanism that makes phased migration possible.

---

*INTEGRATIONS.md v2.0 — SideCar Directive Library*
