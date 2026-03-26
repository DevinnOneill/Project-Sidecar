/* ============================================================
   SIDECAR — Shared Logic + Synthetic Data + Adapter Layer
   Version: 1.0
   Authority: Gemini.md, INTEGRATIONS.md, SECURITY.md
   Constraints: C-02 (no fetch), C-03 (synthetic only),
                C-09 (adapter pattern), C-10 (append-only)
   ============================================================ */

'use strict';

/* -----------------------------------------------------------
   SECTION 1: UTILITY FUNCTIONS
   ----------------------------------------------------------- */

/**
 * Calculate months between two dates.
 * @param {Date} from
 * @param {Date} to
 * @returns {number} Months remaining (negative if past)
 */
function monthsBetween(from, to) {
  const years = to.getFullYear() - from.getFullYear();
  const months = to.getMonth() - from.getMonth();
  return years * 12 + months;
}

/**
 * Get today's date (midnight).
 * @returns {Date}
 */
function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Format a date as YYYY-MM-DD.
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

/**
 * Parse a YYYY-MM-DD string into a Date.
 * @param {string} str
 * @returns {Date}
 */
function parseDate(str) {
  const parts = str.split('-');
  return new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10)
  );
}

/* -----------------------------------------------------------
   SECTION 2: PRD COMPUTATION (LOCKED — Gemini.md Section 13)
   ----------------------------------------------------------- */

/**
 * Compute the PRD tier for a Sailor.
 * Implementation locked per Gemini.md Section 13.
 * Tier thresholds, names, and colors require Tier 1 authorization to modify.
 *
 * @param {Object} sailor - Must have a `prd` property (YYYY-MM-DD string)
 * @returns {Object} { tier, color, textColor, priority }
 */
function computePRDTier(sailor) {
  const prdDate = typeof sailor.prd === 'string' ? parseDate(sailor.prd) : sailor.prd;
  const monthsRemaining = monthsBetween(today(), prdDate);

  if (monthsRemaining <= 0) return { tier: 'EXPIRED',  color: 'var(--color-prd-escalated)', textColor: 'var(--color-prd-escalated-text)', priority: 0 };
  if (monthsRemaining <= 3) return { tier: 'CRITICAL', color: 'var(--color-prd-red)',       textColor: 'var(--color-prd-red-text)',       priority: 1 };
  if (monthsRemaining <= 6) return { tier: 'URGENT',   color: 'var(--color-prd-yellow)',    textColor: 'var(--color-prd-yellow-text)',    priority: 2 };
  if (monthsRemaining <= 9) return { tier: 'WATCH',    color: 'var(--color-prd-green)',     textColor: 'var(--color-prd-green-text)',     priority: 3 };
  return                           { tier: 'STABLE',   color: 'var(--color-prd-gray)',      textColor: 'var(--color-prd-gray-text)',      priority: 4 };
}

/**
 * Get the CSS class suffix for a PRD tier.
 * @param {string} tier - One of: EXPIRED, CRITICAL, URGENT, WATCH, STABLE
 * @returns {string}
 */
function prdBadgeClass(tier) {
  const map = {
    'EXPIRED':  'expired',
    'CRITICAL': 'critical',
    'URGENT':   'urgent',
    'WATCH':    'watch',
    'STABLE':   'stable'
  };
  return map[tier] || 'stable';
}

/* -----------------------------------------------------------
   SECTION 3: SYNTHETIC DATA (C-03 compliant)
   All names are phonetic alphabet patterns.
   All DODIDs use 9999XXXXXX pattern.
   All commands are fictional.
   PRD values distributed across all 5 tiers.
   ----------------------------------------------------------- */

var SYNTHETIC_SAILORS = [
  { id: '9999000001', lastName: 'Alpha',   firstName: 'Aaron',  rate: 'IT',  payGrade: 'E5', prd: '2026-02-15', eaos: '2027-06-30', command: 'USS EXAMPLE (CVN-00)',      uic: 'XXXXX', billet: 'LAN Admin',            lastContact: '2026-01-10', detailer: 'PERS-401' },
  { id: '9999000002', lastName: 'Bravo',   firstName: 'Beth',   rate: 'IT',  payGrade: 'E6', prd: '2026-05-20', eaos: '2028-09-15', command: 'NAVSTA TESTPORT',           uic: 'XXXX1', billet: 'ISSM',                 lastContact: '2026-03-01', detailer: 'PERS-401' },
  { id: '9999000003', lastName: 'Charlie', firstName: 'Carlos', rate: 'CTN', payGrade: 'E5', prd: '2026-08-10', eaos: '2027-12-01', command: 'NIOC DEMO',                 uic: 'XXXX2', billet: 'CND Watch Officer',    lastContact: '2026-02-20', detailer: 'PERS-401' },
  { id: '9999000004', lastName: 'Delta',   firstName: 'Diana',  rate: 'YN',  payGrade: 'E4', prd: '2026-12-01', eaos: '2028-03-15', command: 'COMNAVPERSCOM HQ',           uic: 'XXXX3', billet: 'Admin Clerk',           lastContact: '2026-03-20', detailer: 'PERS-401' },
  { id: '9999000005', lastName: 'Echo',    firstName: 'Edwin',  rate: 'IT',  payGrade: 'E7', prd: '2027-03-15', eaos: '2030-01-01', command: 'USS PLACEHOLDER (DDG-00)',   uic: 'XXXX4', billet: 'DIVO IT',              lastContact: '2026-02-01', detailer: 'PERS-401' },
  { id: '9999000006', lastName: 'Foxtrot', firstName: 'Faye',   rate: 'CTN', payGrade: 'E6', prd: '2026-04-01', eaos: '2027-08-20', command: 'NIOC DEMO',                 uic: 'XXXX2', billet: 'Senior CND Analyst',   lastContact: '2026-03-15', detailer: 'PERS-401' },
  { id: '9999000007', lastName: 'Golf',    firstName: 'George', rate: 'IT',  payGrade: 'E4', prd: '2026-01-15', eaos: '2027-04-10', command: 'NAVSTA TESTPORT',           uic: 'XXXX1', billet: 'Help Desk Tech',       lastContact: '2025-12-20', detailer: 'PERS-401' },
  { id: '9999000008', lastName: 'Hotel',   firstName: 'Helen',  rate: 'YN',  payGrade: 'E5', prd: '2026-06-30', eaos: '2028-11-30', command: 'COMNAVPERSCOM HQ',           uic: 'XXXX3', billet: 'Personnel Specialist', lastContact: '2026-03-10', detailer: 'PERS-401' },
  { id: '9999000009', lastName: 'India',   firstName: 'Ivan',   rate: 'CTN', payGrade: 'E7', prd: '2026-09-15', eaos: '2029-06-01', command: 'USS EXAMPLE (CVN-00)',      uic: 'XXXXX', billet: 'Crypto Board Chief',   lastContact: '2026-01-25', detailer: 'PERS-401' },
  { id: '9999000010', lastName: 'Juliet',  firstName: 'Jane',   rate: 'IT',  payGrade: 'E5', prd: '2026-03-10', eaos: '2027-09-01', command: 'USS PLACEHOLDER (DDG-00)',   uic: 'XXXX4', billet: 'Systems Admin',        lastContact: '2026-02-28', detailer: 'PERS-401' },
  { id: '9999000011', lastName: 'Kilo',    firstName: 'Kevin',  rate: 'IT',  payGrade: 'E6', prd: '2027-06-01', eaos: '2029-12-15', command: 'NAVSTA TESTPORT',           uic: 'XXXX1', billet: 'Network Chief',        lastContact: '2026-03-22', detailer: 'PERS-401' },
  { id: '9999000012', lastName: 'Lima',    firstName: 'Laura',  rate: 'CTN', payGrade: 'E4', prd: '2026-07-20', eaos: '2027-10-30', command: 'NIOC DEMO',                 uic: 'XXXX2', billet: 'CND Analyst',          lastContact: '2026-03-05', detailer: 'PERS-401' }
];

var SYNTHETIC_COMM_LOG = [
  { sailorId: '9999000001', date: '2026-01-10', type: 'phone',  summary: 'Discussed upcoming PCS options. Sailor prefers East Coast.' },
  { sailorId: '9999000001', date: '2025-12-05', type: 'email',  summary: 'Sent assignment cycle timeline and MNA instructions.' },
  { sailorId: '9999000002', date: '2026-03-01', type: 'phone',  summary: 'PRD approaching. Reviewed available billets at NIOC locations.' },
  { sailorId: '9999000003', date: '2026-02-20', type: 'email',  summary: 'Sailor requested CONUS shore duty. Noted COLO request pending.' },
  { sailorId: '9999000006', date: '2026-03-15', type: 'phone',  summary: 'PRD critical. Sailor aware. Awaiting billet match.' },
  { sailorId: '9999000007', date: '2025-12-20', type: 'email',  summary: 'PRD expired. Multiple contact attempts. No response.' },
  { sailorId: '9999000007', date: '2026-01-05', type: 'phone',  summary: 'Reached Sailor. Discussed immediate reassignment options.' },
  { sailorId: '9999000010', date: '2026-02-28', type: 'email',  summary: 'PRD next month. Sailor submitted preferences via MNA.' },
  { sailorId: '9999000004', date: '2026-03-20', type: 'phone',  summary: 'Routine check-in. Sailor satisfied with current assignment.' },
  { sailorId: '9999000009', date: '2026-01-25', type: 'email',  summary: 'Chief requesting shore duty for family reasons. Evaluating.' }
];

var SYNTHETIC_BILLETS = [
  { id: 'B001', commandId: 'XXXXX', commandName: 'USS EXAMPLE (CVN-00)',    rate: 'IT',  payGrade: 'E5', title: 'LAN Admin',            filled: true,  sailorId: '9999000001' },
  { id: 'B002', commandId: 'XXXXX', commandName: 'USS EXAMPLE (CVN-00)',    rate: 'CTN', payGrade: 'E7', title: 'Crypto Board Chief',   filled: true,  sailorId: '9999000009' },
  { id: 'B003', commandId: 'XXXXX', commandName: 'USS EXAMPLE (CVN-00)',    rate: 'IT',  payGrade: 'E4', title: 'Help Desk Tech',       filled: false, sailorId: null },
  { id: 'B004', commandId: 'XXXX1', commandName: 'NAVSTA TESTPORT',         rate: 'IT',  payGrade: 'E6', title: 'ISSM',                 filled: true,  sailorId: '9999000002' },
  { id: 'B005', commandId: 'XXXX1', commandName: 'NAVSTA TESTPORT',         rate: 'IT',  payGrade: 'E4', title: 'Help Desk Tech',       filled: true,  sailorId: '9999000007' },
  { id: 'B006', commandId: 'XXXX1', commandName: 'NAVSTA TESTPORT',         rate: 'IT',  payGrade: 'E6', title: 'Network Chief',        filled: true,  sailorId: '9999000011' },
  { id: 'B007', commandId: 'XXXX2', commandName: 'NIOC DEMO',               rate: 'CTN', payGrade: 'E5', title: 'CND Watch Officer',    filled: true,  sailorId: '9999000003' },
  { id: 'B008', commandId: 'XXXX2', commandName: 'NIOC DEMO',               rate: 'CTN', payGrade: 'E6', title: 'Senior CND Analyst',   filled: true,  sailorId: '9999000006' },
  { id: 'B009', commandId: 'XXXX2', commandName: 'NIOC DEMO',               rate: 'CTN', payGrade: 'E4', title: 'CND Analyst',          filled: true,  sailorId: '9999000012' },
  { id: 'B010', commandId: 'XXXX2', commandName: 'NIOC DEMO',               rate: 'CTN', payGrade: 'E5', title: 'CND Analyst',          filled: false, sailorId: null },
  { id: 'B011', commandId: 'XXXX3', commandName: 'COMNAVPERSCOM HQ',        rate: 'YN',  payGrade: 'E4', title: 'Admin Clerk',           filled: true,  sailorId: '9999000004' },
  { id: 'B012', commandId: 'XXXX3', commandName: 'COMNAVPERSCOM HQ',        rate: 'YN',  payGrade: 'E5', title: 'Personnel Specialist', filled: true,  sailorId: '9999000008' },
  { id: 'B013', commandId: 'XXXX4', commandName: 'USS PLACEHOLDER (DDG-00)', rate: 'IT',  payGrade: 'E7', title: 'DIVO IT',              filled: true,  sailorId: '9999000005' },
  { id: 'B014', commandId: 'XXXX4', commandName: 'USS PLACEHOLDER (DDG-00)', rate: 'IT',  payGrade: 'E5', title: 'Systems Admin',        filled: true,  sailorId: '9999000010' },
  { id: 'B015', commandId: 'XXXX4', commandName: 'USS PLACEHOLDER (DDG-00)', rate: 'IT',  payGrade: 'E4', title: 'Network Tech',         filled: false, sailorId: null }
];

var SYNTHETIC_COMMANDS = [
  { id: 'XXXXX', name: 'USS EXAMPLE (CVN-00)',     type: 'Sea',   homeport: 'Testport, VA',  billetCount: 3 },
  { id: 'XXXX1', name: 'NAVSTA TESTPORT',          type: 'Shore', homeport: 'Testport, VA',  billetCount: 3 },
  { id: 'XXXX2', name: 'NIOC DEMO',                type: 'Shore', homeport: 'Demoville, MD', billetCount: 4 },
  { id: 'XXXX3', name: 'COMNAVPERSCOM HQ',         type: 'Shore', homeport: 'Millington, TN', billetCount: 2 },
  { id: 'XXXX4', name: 'USS PLACEHOLDER (DDG-00)', type: 'Sea',   homeport: 'Testport, VA',  billetCount: 3 }
];

/* -----------------------------------------------------------
   SECTION 4: SIDECAR ADAPTER (C-09 compliant)
   All data access routes through this interface.
   Phase 1A: returns embedded synthetic data.
   Phase 1B: will call Microsoft Graph API via GCC High.
   The interface contract does not change between phases.
   ----------------------------------------------------------- */

var SideCarAdapter = {

  /**
   * Get all Sailors, optionally filtered.
   * @param {Object} [filters] - { rate, payGrade, prdTier, commandId }
   * @returns {Promise<Array>}
   */
  getSailors: function(filters) {
    var results = SYNTHETIC_SAILORS.slice();
    if (filters) {
      if (filters.rate) {
        results = results.filter(function(s) { return s.rate === filters.rate; });
      }
      if (filters.payGrade) {
        results = results.filter(function(s) { return s.payGrade === filters.payGrade; });
      }
      if (filters.prdTier) {
        results = results.filter(function(s) { return computePRDTier(s).tier === filters.prdTier; });
      }
      if (filters.commandId) {
        results = results.filter(function(s) { return s.uic === filters.commandId; });
      }
    }
    return Promise.resolve(results);
  },

  /**
   * Get a single Sailor by ID.
   * @param {string} sailorId
   * @returns {Promise<Object|null>}
   */
  getSailor: function(sailorId) {
    var sailor = SYNTHETIC_SAILORS.find(function(s) { return s.id === sailorId; });
    return Promise.resolve(sailor || null);
  },

  /**
   * Get communication log for a Sailor.
   * @param {string} sailorId
   * @returns {Promise<Array>}
   */
  getCommLog: function(sailorId) {
    var entries = SYNTHETIC_COMM_LOG.filter(function(e) { return e.sailorId === sailorId; });
    return Promise.resolve(entries);
  },

  /**
   * Get billets for a command.
   * @param {string} commandId
   * @returns {Promise<Array>}
   */
  getBillets: function(commandId) {
    var billets = SYNTHETIC_BILLETS.filter(function(b) { return b.commandId === commandId; });
    return Promise.resolve(billets);
  },

  /**
   * Get all commands, optionally filtered.
   * @param {Object} [filters] - { type }
   * @returns {Promise<Array>}
   */
  getCommands: function(filters) {
    var results = SYNTHETIC_COMMANDS.slice();
    if (filters) {
      if (filters.type) {
        results = results.filter(function(c) { return c.type === filters.type; });
      }
    }
    return Promise.resolve(results);
  },

  /**
   * Add a communication log entry. Append-only per C-10.
   * @param {string} sailorId
   * @param {Object} entry - { type, summary }
   * @returns {Promise<Object>}
   */
  addCommEntry: function(sailorId, entry) {
    var newEntry = {
      sailorId: sailorId,
      date: formatDate(today()),
      type: entry.type,
      summary: entry.summary
    };
    SYNTHETIC_COMM_LOG.push(newEntry);
    return Promise.resolve(newEntry);
  },

  /**
   * Get the current data mode.
   * @returns {string} 'embedded' | 'csv' | 'api'
   */
  getDataMode: function() {
    return 'embedded';
  },

  /**
   * Get the last updated timestamp.
   * @returns {string} ISO timestamp
   */
  getLastUpdated: function() {
    return new Date().toISOString();
  }
};

/* -----------------------------------------------------------
   SECTION 5: NAVIGATION HELPER
   ----------------------------------------------------------- */

/**
 * Set the active nav link based on current page filename.
 */
function initNavigation() {
  var path = window.location.pathname;
  var filename = path.substring(path.lastIndexOf('/') + 1);
  var links = document.querySelectorAll('.nav__link');
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute('href');
    if (href === filename) {
      links[i].classList.add('nav__link--active');
    } else {
      links[i].classList.remove('nav__link--active');
    }
  }
}

/* -----------------------------------------------------------
   SECTION 6: PAGE INITIALIZATION
   ----------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
});
