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

---

*INTEGRATIONS.md v1.0 — SideCar Directive Library*
