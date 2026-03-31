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
  {
    id: '9999000001', lastName: 'Alpha',   firstName: 'Aaron',   middleInitial: 'J.',
    rate: 'IT',  payGrade: 'E5', prd: '2026-02-15', eaos: '2027-06-30',
    command: 'USS COMMAND NAME', uic: 'USS', billet: 'LAN ADMIN',
    lastContact: '2026-01-10', detailer: 'PERS-401',
    reportDate: '2023-08-10', entryDate: '2017-06-01',
    seaShoreCode: 'SEA', seaToursCompleted: 2, shoreToursCompleted: 1,
    dateOfRateAdvancement: '2022-03-01',
    quals: ['SW'], necCodes: ['2780', '9502'],
    clearanceLevel: 'SECRET', clearanceExpDate: '2027-06-01',
    lastEvalDate: '2025-10-15', lastEvalAvg: 3.6, lastEvalPromoRec: 'P',
    pvolCurrent: [72, 65, 80, 60, 55], pvolTarget: [85, 80, 85, 80, 70],
    flags: { limdu: true, legalHold: true, colo: true, efmp: true, promoHold: true, opsdef: true, hyt: false, adminHold: false, promoSelect: true },
    bsc: 'XXXXX', binNumber: '99900000', cogCode: 'Placement officer info\n(XXXXX)',
    billetHistory: [
      { uic: '2780', command: 'USS COMMAND', billet: 'Billet', startDate: '12/26/2021', detachDate: '12/12/2021' },
      { uic: '2780', command: 'USS COMMAND', billet: 'Billet', startDate: '12/11/2021', detachDate: '13/14/2021' },
      { uic: '2510', command: 'USS COMMAND', billet: 'Billet', startDate: '12/28/2021', detachDate: '12/21/2021' },
      { uic: '2510', command: 'USS COMMAND', billet: 'Billet', startDate: '12/26/2021', detachDate: '12/13/2021' }
    ],
    aqdMatrix: [
      { yy: '1', aqd: '4', col1: '4', col2: '5', col3: '10' },
      { yy: '2', aqd: '2', col1: '5', col2: '8', col3: '10' },
      { yy: '3', aqd: '3', col1: '5', col2: '8', col3: '11' },
      { yy: '4', aqd: '3', col1: '6', col2: '9', col3: '12' }
    ],
    education: [
      { degree: 'Degree', year: 'Year', major: 'Major', university: 'University' },
      { degree: 'Degree', year: '2006', major: 'Major', university: 'University' },
      { degree: 'Degree', year: '2007', major: 'Major', university: 'University' },
      { degree: 'Degree', year: '2009', major: 'Convincaication', university: 'University' }
    ],
    personalInfo: {
      family: 'Colocation info - Spouse Name\nBranch\nDOD ID',
      dutyStation: 'Duty Station',
      prd: '', contact: '', efmp: '', limdu: '', pfa: ''
    }
  },
  {
    id: '9999000002', lastName: 'Bravo',   firstName: 'Beth',    middleInitial: 'M.',
    rate: 'IT',  payGrade: 'E6', prd: '2026-05-20', eaos: '2028-09-15',
    command: 'NAVSTA TESTPORT', uic: 'XXXX1', billet: 'ISSM',
    lastContact: '2026-03-01', detailer: 'PERS-401', reportDate: '2023-01-15', entryDate: '2014-09-15',
    seaShoreCode: 'SHORE', seaToursCompleted: 2, shoreToursCompleted: 1, dateOfRateAdvancement: '2021-09-16',
    quals: ['SW', 'AW'], necCodes: ['2735', '2780'], clearanceLevel: 'TS/SCI', clearanceExpDate: '2029-01-01',
    lastEvalDate: '2025-12-01', lastEvalAvg: 4.0, lastEvalPromoRec: 'EP',
    pvolCurrent: [88, 90, 75, 85, 78], pvolTarget: [90, 90, 85, 90, 85],
    flags: { limdu: false, legalHold: false, colo: false, efmp: false, promoHold: false, opsdef: false, hyt: false, adminHold: false },
    bsc: '12345', binNumber: '9234567', cogCode: 'PERS-408\n(XXXXX)',
    billetHistory: [{ uic: 'XXXX1', command: 'NAVSTA TESTPORT', billet: 'ISSM', startDate: '01/15/2023', detachDate: 'Present' }],
    aqdMatrix: [{ yy: '1', aqd: '4', col1: '7', col2: '7', col3: '10' }],
    education: [{ degree: 'B.S.', year: '2020', major: 'Computer Sci', university: 'UMGC' }],
    personalInfo: { family: 'None', dutyStation: 'Norfolk', prd: '', contact: '', efmp: '', limdu: '', pfa: '' }
  },
  {
    id: '9999000003', lastName: 'Charlie', firstName: 'Carlos',  middleInitial: 'R.',
    rate: 'CTN', payGrade: 'E5', prd: '2026-08-10', eaos: '2027-12-01', command: 'NIOC DEMO', uic: 'XXXX2', billet: 'CND Watch Officer',
    lastContact: '2026-02-20', detailer: 'PERS-401', reportDate: '2024-02-01', entryDate: '2018-03-15',
    seaShoreCode: 'SHORE', seaToursCompleted: 1, shoreToursCompleted: 1, dateOfRateAdvancement: '2023-03-16',
    quals: ['SW'], necCodes: ['2791', '9502'], clearanceLevel: 'TS/SCI', clearanceExpDate: '2028-03-01',
    lastEvalDate: '2025-11-15', lastEvalAvg: 3.8, lastEvalPromoRec: 'P',
    pvolCurrent: [70, 80, 60, 72, 65], pvolTarget: [85, 85, 80, 80, 75],
    flags: { limdu: false, legalHold: false, colo: true, efmp: false, promoHold: false, opsdef: false, hyt: false, adminHold: false },
    bsc: '45678', binNumber: '8392100', cogCode: 'PERS-408\n(XXXXX)'
  },
  {
    id: '9999000004', lastName: 'Delta', firstName: 'Diana', middleInitial: 'S.',
    rate: 'YN', payGrade: 'E4', prd: '2026-12-01', eaos: '2028-03-15', command: 'COMNAVPERSCOM HQ', uic: 'XXXX3', billet: 'Admin Clerk',
    lastContact: '2026-03-20', detailer: 'PERS-401', reportDate: '2025-01-10', entryDate: '2021-06-01',
    seaShoreCode: 'SHORE', seaToursCompleted: 0, shoreToursCompleted: 1, dateOfRateAdvancement: '2024-03-16',
    quals: [], necCodes: ['9502'], clearanceLevel: 'SECRET', clearanceExpDate: '2028-06-01',
    lastEvalDate: '2025-12-15', lastEvalAvg: 3.4, lastEvalPromoRec: 'P',
    pvolCurrent: [55, 50, 30, 60, 62], pvolTarget: [70, 65, 50, 70, 70],
    flags: { limdu: false, legalHold: false, colo: false, efmp: false, promoHold: false, opsdef: false, hyt: false, adminHold: false }
  },
  {
    id: '9999000005', lastName: 'Echo', firstName: 'Edwin', middleInitial: 'T.',
    rate: 'IT', payGrade: 'E7', prd: '2027-03-15', eaos: '2030-01-01', command: 'USS PLACEHOLDER (DDG-00)', uic: 'XXXX4', billet: 'DIVO IT',
    lastContact: '2026-02-01', detailer: 'PERS-401', reportDate: '2024-07-01', entryDate: '2008-05-15',
    seaShoreCode: 'SEA', seaToursCompleted: 4, shoreToursCompleted: 2, dateOfRateAdvancement: '2019-09-16',
    quals: ['SW', 'AW', 'SUW'], necCodes: ['2780', '2735', '9502'], clearanceLevel: 'TS/SCI', clearanceExpDate: '2026-05-01',
    lastEvalDate: '2025-10-01', lastEvalAvg: 4.0, lastEvalPromoRec: 'EP',
    pvolCurrent: [95, 92, 98, 88, 80], pvolTarget: [95, 95, 95, 95, 90],
    flags: { limdu: false, legalHold: false, colo: false, efmp: false, promoHold: false, opsdef: false, hyt: false, adminHold: false }
  },
  {
    id: '9999000006', lastName: 'Foxtrot', firstName: 'Faye', middleInitial: 'A.',
    rate: 'CTN', payGrade: 'E6', prd: '2026-04-01', eaos: '2027-08-20', command: 'NIOC DEMO', uic: 'XXXX2', billet: 'Senior CND Analyst',
    lastContact: '2026-03-15', detailer: 'PERS-401', reportDate: '2023-06-20', entryDate: '2013-07-01',
    seaShoreCode: 'SHORE', seaToursCompleted: 2, shoreToursCompleted: 2, dateOfRateAdvancement: '2020-09-16',
    quals: ['SW', 'AW'], necCodes: ['2791', '2780'], clearanceLevel: 'TS/SCI', clearanceExpDate: '2030-07-01',
    lastEvalDate: '2025-12-01', lastEvalAvg: 3.9, lastEvalPromoRec: 'EP',
    pvolCurrent: [85, 88, 70, 82, 76], pvolTarget: [90, 90, 85, 90, 85],
    flags: { limdu: true, legalHold: false, colo: false, efmp: false, promoHold: false, opsdef: false, hyt: false, adminHold: false }
  },
  {
    id: '9999000007', lastName: 'Golf', firstName: 'George', middleInitial: 'K.',
    rate: 'IT', payGrade: 'E4', prd: '2026-01-15', eaos: '2027-04-10', command: 'NAVSTA TESTPORT', uic: 'XXXX1', billet: 'Help Desk Tech',
    lastContact: '2025-12-20', detailer: 'PERS-401', reportDate: '2023-10-01', entryDate: '2020-01-15',
    seaShoreCode: 'SHORE', seaToursCompleted: 0, shoreToursCompleted: 1, dateOfRateAdvancement: '2023-03-16',
    quals: [], necCodes: ['2780'], clearanceLevel: 'SECRET', clearanceExpDate: '2027-01-01',
    lastEvalDate: '2025-09-15', lastEvalAvg: 3.2, lastEvalPromoRec: 'P',
    pvolCurrent: [50, 48, 35, 55, 60], pvolTarget: [65, 65, 55, 65, 65],
    flags: { limdu: false, legalHold: true, colo: false, efmp: false, promoHold: false, opsdef: false, hyt: false, adminHold: false }
  },
  {
    id: '9999000008', lastName: 'Hotel', firstName: 'Helen', middleInitial: 'B.',
    rate: 'YN', payGrade: 'E5', prd: '2026-06-30', eaos: '2028-11-30', command: 'COMNAVPERSCOM HQ', uic: 'XXXX3', billet: 'Personnel Specialist',
    lastContact: '2026-03-10', detailer: 'PERS-401', reportDate: '2024-03-01', entryDate: '2016-08-20',
    seaShoreCode: 'SHORE', seaToursCompleted: 1, shoreToursCompleted: 2, dateOfRateAdvancement: '2022-09-16',
    quals: ['SW'], necCodes: ['9502'], clearanceLevel: 'SECRET', clearanceExpDate: '2026-08-01',
    lastEvalDate: '2025-11-01', lastEvalAvg: 3.7, lastEvalPromoRec: 'MP',
    pvolCurrent: [74, 68, 65, 70, 72], pvolTarget: [80, 80, 75, 80, 80],
    flags: { limdu: false, legalHold: false, colo: false, efmp: true, promoHold: false, opsdef: false, hyt: false, adminHold: false }
  },
  {
    id: '9999000009', lastName: 'India', firstName: 'Ivan', middleInitial: 'C.',
    rate: 'CTN', payGrade: 'E7', prd: '2026-09-15', eaos: '2029-06-01', command: 'USS EXAMPLE (CVN-00)', uic: 'XXXXX', billet: 'Crypto Board Chief',
    lastContact: '2026-01-25', detailer: 'PERS-401', reportDate: '2023-11-15', entryDate: '2005-03-01',
    seaShoreCode: 'SEA', seaToursCompleted: 5, shoreToursCompleted: 2, dateOfRateAdvancement: '2016-09-16',
    quals: ['SW', 'AW', 'SUW'], necCodes: ['2791', '2780', '2735'], clearanceLevel: 'TS/SCI', clearanceExpDate: '2031-03-01',
    lastEvalDate: '2025-10-15', lastEvalAvg: 4.0, lastEvalPromoRec: 'EP',
    pvolCurrent: [96, 94, 99, 90, 85], pvolTarget: [98, 96, 98, 95, 92],
    flags: { limdu: false, legalHold: false, colo: true, efmp: true, promoHold: false, opsdef: false, hyt: false, adminHold: false }
  },
  {
    id: '9999000010', lastName: 'Juliet', firstName: 'Jane', middleInitial: 'L.',
    rate: 'IT', payGrade: 'E5', prd: '2026-03-10', eaos: '2027-09-01', command: 'USS PLACEHOLDER (DDG-00)', uic: 'XXXX4', billet: 'Systems Admin',
    lastContact: '2026-02-28', detailer: 'PERS-401', reportDate: '2024-04-20', entryDate: '2018-08-01',
    seaShoreCode: 'SEA', seaToursCompleted: 2, shoreToursCompleted: 1, dateOfRateAdvancement: '2022-03-16',
    quals: ['SW', 'AW'], necCodes: ['2780', '9502'], clearanceLevel: 'SECRET', clearanceExpDate: '2028-08-01',
    lastEvalDate: '2025-11-15', lastEvalAvg: 3.8, lastEvalPromoRec: 'P',
    pvolCurrent: [78, 75, 82, 70, 68], pvolTarget: [85, 80, 85, 80, 75],
    flags: { limdu: false, legalHold: false, colo: false, efmp: false, promoHold: false, opsdef: false, hyt: false, adminHold: false }
  },
  {
    id: '9999000011', lastName: 'Kilo', firstName: 'Kevin', middleInitial: 'P.',
    rate: 'IT', payGrade: 'E6', prd: '2027-06-01', eaos: '2029-12-15', command: 'NAVSTA TESTPORT', uic: 'XXXX1', billet: 'Network Chief',
    lastContact: '2026-03-22', detailer: 'PERS-401', reportDate: '2024-10-01', entryDate: '2012-11-01',
    seaShoreCode: 'SHORE', seaToursCompleted: 3, shoreToursCompleted: 2, dateOfRateAdvancement: '2019-03-16',
    quals: ['SW', 'AW'], necCodes: ['2780', '2735', '9502'], clearanceLevel: 'TS/SCI', clearanceExpDate: '2029-11-01',
    lastEvalDate: '2025-12-01', lastEvalAvg: 3.9, lastEvalPromoRec: 'EP',
    pvolCurrent: [88, 85, 78, 84, 80], pvolTarget: [92, 90, 88, 90, 88],
    flags: { limdu: false, legalHold: false, colo: false, efmp: false, promoHold: false, opsdef: false, hyt: false, adminHold: false }
  },
  {
    id: '9999000012', lastName: 'Lima', firstName: 'Laura', middleInitial: 'D.',
    rate: 'CTN', payGrade: 'E4', prd: '2026-07-20', eaos: '2027-10-30', command: 'NIOC DEMO', uic: 'XXXX2', billet: 'CND Analyst',
    lastContact: '2026-03-05', detailer: 'PERS-401', reportDate: '2024-09-15', entryDate: '2021-02-01',
    seaShoreCode: 'SHORE', seaToursCompleted: 0, shoreToursCompleted: 1, dateOfRateAdvancement: '2024-03-16',
    quals: [], necCodes: ['2791'], clearanceLevel: 'TS/SCI', clearanceExpDate: '2028-02-01',
    lastEvalDate: '2025-10-01', lastEvalAvg: 3.5, lastEvalPromoRec: 'P',
    pvolCurrent: [60, 65, 40, 58, 62], pvolTarget: [70, 72, 60, 70, 70],
    flags: { limdu: false, legalHold: false, colo: false, efmp: false, promoHold: false, opsdef: false, hyt: false, adminHold: false }
  }
];

var SYNTHETIC_COMM_LOG = [
  // Alpha, Aaron — EXPIRED, multiple contacts
  { sailorId: '9999000001', date: '2026-01-10', type: 'phone',  summary: 'Discussed upcoming PCS options. Sailor prefers East Coast.' },
  { sailorId: '9999000001', date: '2025-12-05', type: 'email',  summary: 'Sent assignment cycle timeline and MNA instructions.' },
  { sailorId: '9999000001', date: '2025-11-15', type: 'phone',  summary: 'Initial PRD counseling. Sailor acknowledged 90-day window.' },
  { sailorId: '9999000001', date: '2025-10-20', type: 'email',  summary: 'Sent welcome aboard email with detailer contact info and PRD timeline.' },

  // Bravo, Beth — CRITICAL
  { sailorId: '9999000002', date: '2026-03-01', type: 'phone',  summary: 'PRD approaching. Reviewed available billets at NIOC locations.' },
  { sailorId: '9999000002', date: '2026-02-10', type: 'email',  summary: 'Sent billet listing for E-6 IT positions at shore commands.' },
  { sailorId: '9999000002', date: '2026-01-15', type: 'note',   summary: 'Sailor submitted MNA preferences — top 3: NIOC MD, NAVSTA Norfolk, SPAWAR SD.' },

  // Charlie, Carlos — URGENT
  { sailorId: '9999000003', date: '2026-02-20', type: 'email',  summary: 'Sailor requested CONUS shore duty. Noted COLO request pending.' },
  { sailorId: '9999000003', date: '2026-01-28', type: 'phone',  summary: 'Discussed COLO options with spouse at JBAB. Evaluating E-5 CTN billets.' },

  // Delta, Diana — WATCH
  { sailorId: '9999000004', date: '2026-03-20', type: 'phone',  summary: 'Routine check-in. Sailor satisfied with current assignment.' },
  { sailorId: '9999000004', date: '2026-02-05', type: 'email',  summary: 'Sailor confirmed intent to reenlist. EAOS extension submitted.' },

  // Echo, Edwin — STABLE
  { sailorId: '9999000005', date: '2026-02-01', type: 'email',  summary: 'Annual PRD counseling. No action required — PRD 15+ months out.' },

  // Foxtrot, Faye — CRITICAL, multiple contacts
  { sailorId: '9999000006', date: '2026-03-15', type: 'phone',  summary: 'PRD critical. Sailor aware. Awaiting billet match.' },
  { sailorId: '9999000006', date: '2026-02-28', type: 'email',  summary: 'Sent E-6 CTN billet options: NIOC HI, NIOC GA, NSA TX.' },
  { sailorId: '9999000006', date: '2026-02-10', type: 'note',   summary: 'Branch head flagged: high-value operator. Prioritize NIOC placement.' },

  // Golf, George — EXPIRED, stale contact
  { sailorId: '9999000007', date: '2025-12-20', type: 'email',  summary: 'PRD expired. Multiple contact attempts. No response.' },
  { sailorId: '9999000007', date: '2026-01-05', type: 'phone',  summary: 'Reached Sailor. Discussed immediate reassignment options.' },
  { sailorId: '9999000007', date: '2026-01-15', type: 'note',   summary: 'Sailor unresponsive to follow-up. Escalating to command triad.' },

  // Hotel, Helen — CRITICAL
  { sailorId: '9999000008', date: '2026-03-10', type: 'email',  summary: 'Sent YN E-5 billet options at CONUS shore commands.' },
  { sailorId: '9999000008', date: '2026-02-22', type: 'phone',  summary: 'Sailor has EFMP dependent — requires Category 4 location.' },

  // India, Ivan — URGENT
  { sailorId: '9999000009', date: '2026-01-25', type: 'email',  summary: 'Chief requesting shore duty for family reasons. Evaluating.' },
  { sailorId: '9999000009', date: '2026-02-15', type: 'phone',  summary: 'Discussed E-7 shore billets. Chief prefers mid-Atlantic region.' },

  // Juliet, Jane — EXPIRED
  { sailorId: '9999000010', date: '2026-02-28', type: 'email',  summary: 'PRD next month. Sailor submitted preferences via MNA.' },
  { sailorId: '9999000010', date: '2026-03-05', type: 'phone',  summary: 'Confirmed billet match at NAVSTA Norfolk. Orders pending branch approval.' },

  // Kilo, Kevin — STABLE
  { sailorId: '9999000011', date: '2026-03-22', type: 'email',  summary: 'Annual counseling email sent. PRD 14 months out. No action needed.' },

  // Lima, Laura — URGENT
  { sailorId: '9999000012', date: '2026-03-05', type: 'phone',  summary: 'Sailor inquired about cross-rate to IT. Referred to career counselor.' },
  { sailorId: '9999000012', date: '2026-02-18', type: 'email',  summary: 'Sent CTN E-4 billet listing. Sailor prefers West Coast.' }
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

var SYNTHETIC_FORM_STATUS = [
  { sailorId: '9999000001', status: 'overdue',  sentDate: '2025-11-01', dueDate: '2025-12-01', receivedDate: null },
  { sailorId: '9999000002', status: 'received', sentDate: '2026-01-10', dueDate: '2026-02-10', receivedDate: '2026-01-20' },
  { sailorId: '9999000003', status: 'sent',     sentDate: '2026-02-15', dueDate: '2026-03-15', receivedDate: null },
  { sailorId: '9999000004', status: 'not_sent', sentDate: null,         dueDate: null,         receivedDate: null },
  { sailorId: '9999000005', status: 'not_sent', sentDate: null,         dueDate: null,         receivedDate: null },
  { sailorId: '9999000006', status: 'overdue',  sentDate: '2026-01-15', dueDate: '2026-02-15', receivedDate: null },
  { sailorId: '9999000007', status: 'overdue',  sentDate: '2025-10-01', dueDate: '2025-11-01', receivedDate: null },
  { sailorId: '9999000008', status: 'sent',     sentDate: '2026-03-01', dueDate: '2026-04-01', receivedDate: null },
  { sailorId: '9999000009', status: 'received', sentDate: '2026-01-20', dueDate: '2026-02-20', receivedDate: '2026-02-10' },
  { sailorId: '9999000010', status: 'received', sentDate: '2026-02-01', dueDate: '2026-03-01', receivedDate: '2026-02-25' },
  { sailorId: '9999000011', status: 'not_sent', sentDate: null,         dueDate: null,         receivedDate: null },
  { sailorId: '9999000012', status: 'sent',     sentDate: '2026-02-25', dueDate: '2026-03-25', receivedDate: null }
];

var DISMISSED_NOTIFICATION_IDS = [];

/**
 * Generate current-week appointment data dynamically.
 * Appointments are always relative to "today" so the calendar always has data.
 */
var SYNTHETIC_APPOINTMENTS = (function() {
  var now = today();
  var dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
  // Find Monday of this week
  var monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  function weekday(offset) {
    var d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return formatDate(d);
  }

  return [
    // Monday (offset 0) — 3 appointments
    { id: 'APT-001', sailorId: '9999000001', date: weekday(0), time: '0830', duration: 30, type: 'phone',     reason: 'PRD expired — discuss immediate reassignment options' },
    { id: 'APT-002', sailorId: '9999000007', date: weekday(0), time: '1000', duration: 30, type: 'phone',     reason: 'Follow-up on escalation to command triad' },
    { id: 'APT-003', sailorId: '9999000002', date: weekday(0), time: '1400', duration: 45, type: 'video',     reason: 'Review E-6 IT billet options at NIOC locations' },

    // Tuesday (offset 1) — 4 appointments
    { id: 'APT-004', sailorId: '9999000003', date: weekday(1), time: '0900', duration: 30, type: 'phone',     reason: 'COLO request update — spouse orders to JBAB confirmed' },
    { id: 'APT-005', sailorId: '9999000006', date: weekday(1), time: '1030', duration: 45, type: 'video',     reason: 'PRD critical — finalize billet selection (NIOC HI vs GA)' },
    { id: 'APT-006', sailorId: '9999000008', date: weekday(1), time: '1300', duration: 30, type: 'phone',     reason: 'EFMP Category 4 location verification' },
    { id: 'APT-007', sailorId: '9999000012', date: weekday(1), time: '1500', duration: 30, type: 'in-person', reason: 'Walk-in: cross-rate to IT inquiry follow-up' },

    // Wednesday (offset 2) — 4 appointments
    { id: 'APT-008', sailorId: '9999000010', date: weekday(2), time: '0900', duration: 30, type: 'phone',     reason: 'Confirm NAVSTA Norfolk billet match — orders pending' },
    { id: 'APT-009', sailorId: '9999000009', date: weekday(2), time: '1100', duration: 45, type: 'video',     reason: 'E-7 shore duty review — mid-Atlantic region billets' },
    { id: 'APT-010', sailorId: '9999000004', date: weekday(2), time: '1330', duration: 30, type: 'phone',     reason: 'Routine check-in — reenlistment extension status' },
    { id: 'APT-011', sailorId: '9999000001', date: weekday(2), time: '1500', duration: 30, type: 'phone',     reason: 'Second contact attempt — PCS timeline coordination' },

    // Thursday (offset 3) — 4 appointments
    { id: 'APT-012', sailorId: '9999000005', date: weekday(3), time: '0830', duration: 30, type: 'phone',     reason: 'Annual PRD counseling — stable, no action needed' },
    { id: 'APT-013', sailorId: '9999000006', date: weekday(3), time: '1000', duration: 30, type: 'video',     reason: 'Branch head coordination — high-value operator placement' },
    { id: 'APT-014', sailorId: '9999000011', date: weekday(3), time: '1300', duration: 30, type: 'phone',     reason: 'Annual counseling follow-up — PRD window briefing' },
    { id: 'APT-015', sailorId: '9999000003', date: weekday(3), time: '1530', duration: 45, type: 'in-person', reason: 'In-person COLO coordination with spouse detailer' },

    // Friday (offset 4) — 3 appointments
    { id: 'APT-016', sailorId: '9999000002', date: weekday(4), time: '0900', duration: 30, type: 'phone',     reason: 'PRD window final review — orders submission deadline' },
    { id: 'APT-017', sailorId: '9999000009', date: weekday(4), time: '1100', duration: 45, type: 'video',     reason: 'Chief community manager coordination call' },
    { id: 'APT-018', sailorId: '9999000007', date: weekday(4), time: '1400', duration: 30, type: 'phone',     reason: 'Escalation resolution — Sailor response received' }
  ];
})();

var SYNTHETIC_TEMPLATES = [
  {
    id: 'TPL-001',
    name: 'PRD Window Opening',
    description: '90-day notice — PRD window is now open',
    subject: 'PRD Window Opening — {{sailorName}}, {{rate}} {{payGrade}}',
    body: 'Good morning {{sailorName}},\n\nThis email is to notify you that your Projected Rotation Date (PRD) of {{prd}} is now within the 90-day assignment window. Please be advised:\n\n• Your current command: {{command}}\n• Your rate/grade: {{rate}} {{payGrade}}\n\nI am your assigned detailer and am available to discuss billet options and assignment preferences. Please submit your preference worksheet at your earliest convenience.\n\nI can be reached via phone or email. Please reference your PRD when contacting me.\n\nVery Respectfully,\nPERS-401 Detailer'
  },
  {
    id: 'TPL-002',
    name: 'PRD Approaching — Action Required',
    description: '30-day notice — immediate action needed',
    subject: 'ACTION REQUIRED: PRD Approaching — {{sailorName}}, {{rate}} {{payGrade}}',
    body: '{{sailorName}},\n\nYour Projected Rotation Date (PRD) of {{prd}} is within 30 days. Orders must be released imminently to ensure a smooth PCS transition.\n\nIf you have not already done so, please:\n1. Submit your billet preference worksheet\n2. Update your contact information\n3. Confirm any COLO/EFMP requirements\n\nCurrent assignment: {{command}}\n\nPlease contact me immediately to finalize your assignment.\n\nVery Respectfully,\nPERS-401 Detailer'
  },
  {
    id: 'TPL-003',
    name: 'Billet Options Available',
    description: 'Billet listing for sailor review',
    subject: 'Billet Options for Review — {{sailorName}}, {{rate}} {{payGrade}}',
    body: '{{sailorName}},\n\nBased on your rate ({{rate}}) and pay grade ({{payGrade}}), the following billet options are available for your upcoming PCS cycle:\n\n[BILLET LIST - See SideCar workspace for current listings]\n\nPlease review these options and rank your top 3 preferences. Consider the following factors:\n• Sea/Shore rotation requirements\n• Geographic preferences\n• COLO/EFMP requirements (if applicable)\n\nCurrent PRD: {{prd}}\nCurrent Command: {{command}}\n\nPlease respond with your ranked preferences at your earliest convenience.\n\nVery Respectfully,\nPERS-401 Detailer'
  },
  {
    id: 'TPL-004',
    name: 'COLO/EFMP Request Acknowledgment',
    description: 'Acknowledge receipt of co-location or EFMP request',
    subject: 'COLO/EFMP Request Received — {{sailorName}}, {{rate}} {{payGrade}}',
    body: '{{sailorName}},\n\nThis email confirms receipt of your co-location (COLO) and/or Exceptional Family Member Program (EFMP) request.\n\nI am reviewing your request against available billets that meet the specified requirements. Please ensure your EFMP documentation is current in NSIPS.\n\nSailor: {{sailorName}}\nRate/Grade: {{rate}} {{payGrade}}\nCurrent Command: {{command}}\nPRD: {{prd}}\n\nI will follow up within 5 business days with available options that accommodate your request.\n\nVery Respectfully,\nPERS-401 Detailer'
  },
  {
    id: 'TPL-005',
    name: 'Order Modification Status Update',
    description: 'Status update on pending order modifications',
    subject: 'Order Modification Status — {{sailorName}}, {{rate}} {{payGrade}}',
    body: '{{sailorName}},\n\nThis email is to provide a status update regarding your pending order modification request.\n\nSailor: {{sailorName}}\nRate/Grade: {{rate}} {{payGrade}}\nCurrent Command: {{command}}\nPRD: {{prd}}\n\n[STATUS UPDATE]\n\nPlease contact me if you have any questions regarding this modification.\n\nVery Respectfully,\nPERS-401 Detailer'
  }
];

var SYNTHETIC_FORM_RESPONSES = [
  {
    sailorId: '9999000002',
    formType: 'prd_preferences',
    submittedDate: '2026-01-20',
    billetChoices: [
      { rank: 1, billet: 'ISSM', command: 'NIOC Maryland', location: 'Fort Meade, MD', rotation: 'Shore', matchScore: 94 },
      { rank: 2, billet: 'Network Chief', command: 'NAVSTA Norfolk', location: 'Norfolk, VA', rotation: 'Shore', matchScore: 88 },
      { rank: 3, billet: 'ISSM', command: 'SPAWAR San Diego', location: 'San Diego, CA', rotation: 'Shore', matchScore: 81 }
    ],
    geoPreference: 'East Coast preferred, will accept West Coast',
    seaShore: 'Shore duty requested (completing sea tour)',
    coloStatus: { requested: false, spouseInfo: null },
    efmpStatus: { enrolled: false, category: null },
    specialCircumstances: 'None',
    pastApplications: [
      { appDate: '2025-08-15', command: 'NIOC Hawaii', billet: 'ISSM', location: 'Pearl Harbor, HI', outcome: 'Declined' },
      { appDate: '2025-04-01', command: 'NAVSTA Norfolk', billet: 'Network Chief', location: 'Norfolk, VA', outcome: 'Applied' }
    ]
  },
  {
    sailorId: '9999000009',
    formType: 'prd_preferences',
    submittedDate: '2026-02-10',
    billetChoices: [
      { rank: 1, billet: 'Senior Enlisted Advisor', command: 'NSA Washington', location: 'Washington, DC', rotation: 'Shore', matchScore: 97 },
      { rank: 2, billet: 'Division Chief', command: 'NIOC Georgia', location: 'Fort Gordon, GA', rotation: 'Shore', matchScore: 91 },
      { rank: 3, billet: 'CND Department Chief', command: 'NIOC Hawaii', location: 'Pearl Harbor, HI', rotation: 'Shore', matchScore: 85 }
    ],
    geoPreference: 'Mid-Atlantic strongly preferred for family stability',
    seaShore: 'Shore duty (completing second sea tour)',
    coloStatus: { requested: true, spouseInfo: 'Spouse AD Navy YN1, currently JBAB' },
    efmpStatus: { enrolled: true, category: 'Category 3 — dependent requires specialty care' },
    specialCircumstances: 'Request proximity to Walter Reed for dependent medical care',
    pastApplications: [
      { appDate: '2025-09-01', command: 'NSA Washington', billet: 'Senior Enlisted Advisor', location: 'Washington, DC', outcome: 'Matched' },
      { appDate: '2025-05-10', command: 'NIOC Maryland', billet: 'Division Chief', location: 'Fort Meade, MD', outcome: 'Applied' },
      { appDate: '2024-11-20', command: 'NIOC Georgia', billet: 'CND Dept Chief', location: 'Fort Gordon, GA', outcome: 'Declined' }
    ]
  },
  {
    sailorId: '9999000010',
    formType: 'prd_preferences',
    submittedDate: '2026-02-25',
    billetChoices: [
      { rank: 1, billet: 'Systems Admin', command: 'NAVSTA Norfolk', location: 'Norfolk, VA', rotation: 'Shore', matchScore: 92 },
      { rank: 2, billet: 'LAN Admin', command: 'NAVSTA Mayport', location: 'Mayport, FL', rotation: 'Shore', matchScore: 84 },
      { rank: 3, billet: 'IT Helpdesk Lead', command: 'NAVSTA Rota', location: 'Rota, Spain', rotation: 'OCONUS Shore', matchScore: 78 }
    ],
    geoPreference: 'Southeast US, open to OCONUS',
    seaShore: 'Shore duty requested',
    coloStatus: { requested: false, spouseInfo: null },
    efmpStatus: { enrolled: false, category: null },
    specialCircumstances: 'Interested in overseas accompanied tour',
    pastApplications: [
      { appDate: '2025-10-05', command: 'NAVSTA Norfolk', billet: 'Systems Admin', location: 'Norfolk, VA', outcome: 'Matched' }
    ]
  }
];

/* -----------------------------------------------------------
   SYNTHETIC COMPASS DATA (Sailor self-reported goals)
   Separate from preference form — this is career narrative
   ----------------------------------------------------------- */
var SYNTHETIC_COMPASS = [
  { sailorId: '9999000001', goalShortTerm: 'Advance to IT1', goalLongTerm: 'Lateral transfer to officer candidate program', education: 'Associate degree in Networking (in progress)', advancementIntent: 'advance', notes: 'Very motivated sailor, interested in OCS after E-6.' },
  { sailorId: '9999000002', goalShortTerm: 'Make Chief board this cycle', goalLongTerm: 'Become a Cyber Warrant Officer (CWO)', education: 'B.S. Computer Science (completed)', advancementIntent: 'advance', notes: 'Top performer. Strong EP trend. Recommend for senior billet.' },
  { sailorId: '9999000003', goalShortTerm: 'Shore duty near family in D.C. area', goalLongTerm: 'Retire from Navy after 20 years', education: 'No current enrollment', advancementIntent: 'advance', notes: 'COLO request pending spouse orders. Do not assign outside JBAB area without coordination.' },
  { sailorId: '9999000004', goalShortTerm: 'Advance to YN3 / complete reenlistment', goalLongTerm: 'Work as a federal HR specialist post-service', education: 'GED completed; considering college', advancementIntent: 'advance', notes: 'Junior sailor, still orienting to the fleet.' },
  { sailorId: '9999000005', goalShortTerm: 'Successfully complete current sea tour', goalLongTerm: 'CPO Mesa or CWO after final sea tour', education: 'M.S. Cybersecurity (completed)', advancementIntent: 'advance', notes: '18-year sailor. Exceptional leader. Succession planning needed at billet.' },
  { sailorId: '9999000006', goalShortTerm: 'Recover from LIMDU and return to full duty', goalLongTerm: 'Make Chief, stay in CTN community', education: 'Continuing ed in cyber analysis', advancementIntent: 'advance', notes: 'LIMDU active — consult medical before assigning operational billet.' },
  { sailorId: '9999000007', goalShortTerm: 'Resolve legal situation and PCS', goalLongTerm: 'Separate at EAOS and enter IT sector', education: 'No current enrollment', advancementIntent: 'separate', notes: 'Legal hold active. Assignment cannot proceed until hold is lifted.' },
  { sailorId: '9999000008', goalShortTerm: 'Find EFMP-compatible Cat 4 billet', goalLongTerm: 'Reenlist and continue shore rotation', education: 'Online HR certification', advancementIntent: 'advance', notes: 'EFMP Category 4 hardship. Only Category 4 locations are viable.' },
  { sailorId: '9999000009', goalShortTerm: 'Secure COLO billet near JBAB', goalLongTerm: 'Retire with 24 years of service', education: 'B.S. Management (completed)', advancementIntent: 'retire', notes: 'Top senior enlisted. Orders nearly finalized. COLO coordination with spouse detailer required.' },
  { sailorId: '9999000010', goalShortTerm: 'Report to NAVSTA Norfolk', goalLongTerm: 'Make E-6 and consider lateral transfer', education: 'Taking Comptia Security+ prep course', advancementIntent: 'advance', notes: 'Orders issued. Interested in OCONUS for follow-on tour.' },
  { sailorId: '9999000011', goalShortTerm: 'Complete current shore tour', goalLongTerm: 'Finish 20 years and retire', education: 'B.S. IT Management (completed)', advancementIntent: 'retire', notes: '14-year sailor. Mature, skilled CPO material. Stable. No action required until next PRD window.' },
  { sailorId: '9999000012', goalShortTerm: 'Consider cross-rate to IT', goalLongTerm: 'Work in federal cyber sector post-service', education: 'CompTIA Security+ in progress', advancementIntent: 'separate', notes: 'Junior sailor exploring cross-rate or separation options at EAOS.' }
];


var SYNTHETIC_COMMANDS = [
  { id: 'XXXXX', name: 'USS EXAMPLE (CVN-00)',     type: 'Sea',   homeport: 'Testport, VA',  billetCount: 3 },
  { id: 'XXXX1', name: 'NAVSTA TESTPORT',          type: 'Shore', homeport: 'Testport, VA',  billetCount: 3 },
  { id: 'XXXX2', name: 'NIOC DEMO',                type: 'Shore', homeport: 'Demoville, MD', billetCount: 4 },
  { id: 'XXXX3', name: 'COMNAVPERSCOM HQ',         type: 'Shore', homeport: 'Millington, TN', billetCount: 2 },
  { id: 'XXXX4', name: 'USS PLACEHOLDER (DDG-00)', type: 'Sea',   homeport: 'Testport, VA',  billetCount: 3 }
];

/* -----------------------------------------------------------
   SYNTHETIC ORDER STATUS (WFL-003)
   6-stage pipeline: Preference Collection → Billet Matching →
   Slate Review → Order Drafted → Order Approved → Orders Issued
   ----------------------------------------------------------- */

var PIPELINE_STAGES = [
  { key: 'pref_collection', label: 'Prefs', fullLabel: 'Preference Collection' },
  { key: 'billet_matching', label: 'Match', fullLabel: 'Billet Matching' },
  { key: 'slate_review',    label: 'Slate', fullLabel: 'Slate Review' },
  { key: 'order_drafted',   label: 'Draft', fullLabel: 'Order Drafted' },
  { key: 'order_approved',  label: 'Appvd', fullLabel: 'Order Approved' },
  { key: 'orders_issued',   label: 'Issued', fullLabel: 'Orders Issued' }
];

var SYNTHETIC_ORDER_STATUS = [
  { sailorId: '9999000001', currentStage: 'billet_matching', stageDate: '2026-02-01', blockers: 'Awaiting sailor preference update' },
  { sailorId: '9999000002', currentStage: 'slate_review',    stageDate: '2026-03-10', blockers: null },
  { sailorId: '9999000003', currentStage: 'pref_collection', stageDate: '2026-02-20', blockers: 'COLO request pending spouse orders' },
  { sailorId: '9999000004', currentStage: 'pref_collection', stageDate: '2026-03-15', blockers: null },
  { sailorId: '9999000005', currentStage: 'pref_collection', stageDate: '2026-03-01', blockers: null },
  { sailorId: '9999000006', currentStage: 'order_drafted',   stageDate: '2026-03-20', blockers: null },
  { sailorId: '9999000007', currentStage: 'billet_matching', stageDate: '2026-01-20', blockers: 'No available E-4 IT billets' },
  { sailorId: '9999000008', currentStage: 'pref_collection', stageDate: '2026-03-05', blockers: 'EFMP location restriction' },
  { sailorId: '9999000009', currentStage: 'order_approved',  stageDate: '2026-03-18', blockers: null },
  { sailorId: '9999000010', currentStage: 'orders_issued',   stageDate: '2026-03-22', blockers: null },
  { sailorId: '9999000011', currentStage: 'pref_collection', stageDate: '2026-03-25', blockers: null },
  { sailorId: '9999000012', currentStage: 'billet_matching', stageDate: '2026-03-08', blockers: null }
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
   * Get form/preference intake status for a Sailor.
   * @param {string} sailorId
   * @returns {Promise<Object|null>}
   */
  getFormStatus: function(sailorId) {
    var record = SYNTHETIC_FORM_STATUS.find(function(f) { return f.sailorId === sailorId; });
    return Promise.resolve(record || null);
  },

  /**
   * Get all form statuses.
   * @returns {Promise<Array>}
   */
  getAllFormStatuses: function() {
    return Promise.resolve(SYNTHETIC_FORM_STATUS.slice());
  },

  /**
   * Get computed notifications for the Action Center.
   * Notifications are generated dynamically from current data state.
   * @returns {Promise<Array>}
   */
  getNotifications: function() {
    var notifications = [];
    var now = today();
    var idCounter = 0;

    for (var i = 0; i < SYNTHETIC_SAILORS.length; i++) {
      var s = SYNTHETIC_SAILORS[i];
      var prd = computePRDTier(s);
      var prdDate = parseDate(s.prd);
      var mo = monthsBetween(now, prdDate);
      var contactDays = Math.floor((now.getTime() - parseDate(s.lastContact).getTime()) / (1000 * 60 * 60 * 24));

      // PRD-based notifications
      if (prd.tier === 'CRITICAL') {
        notifications.push({
          id: 'n-' + (idCounter++),
          type: 'prd_critical',
          priority: 1,
          icon: '<svg class="svg-icon svg-icon--md svg-icon--critical"><use href="#icon-alert"></use></svg>',
          title: 'PRD CRITICAL',
          message: s.lastName + ', ' + s.firstName + ' (' + s.rate + ' ' + s.payGrade + ') — PRD in ' + mo + ' month(s). Orders required.',
          sailorId: s.id,
          date: s.prd
        });
      }

      // Stale contact notifications (> 30 days)
      if (contactDays > 30) {
        notifications.push({
          id: 'n-' + (idCounter++),
          type: 'stale_contact',
          priority: 2,
          icon: '<svg class="svg-icon svg-icon--md svg-icon--critical"><use href="#icon-phone-stale"></use></svg>',
          title: 'CONTACT STALE',
          message: s.lastName + ', ' + s.firstName + ' — Last contact ' + contactDays + ' days ago. Follow-up recommended.',
          sailorId: s.id,
          date: s.lastContact
        });
      }

      // Form overdue notifications
      var form = SYNTHETIC_FORM_STATUS.find(function(f) { return f.sailorId === s.id; });
      if (form && form.status === 'overdue') {
        notifications.push({
          id: 'n-' + (idCounter++),
          type: 'form_overdue',
          priority: 1,
          icon: '<svg class="svg-icon svg-icon--md svg-icon--urgent"><use href="#icon-warning"></use></svg>',
          title: 'PREFS OVERDUE',
          message: s.lastName + ', ' + s.firstName + ' — Preference form sent ' + form.sentDate + ', due ' + form.dueDate + '. No response received.',
          sailorId: s.id,
          date: form.dueDate
        });
      }
    }

    // Sort by priority then date
    notifications.sort(function(a, b) {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(a.date) - new Date(b.date);
    });

    // Filter out dismissed
    notifications = notifications.filter(function(n) {
      return DISMISSED_NOTIFICATION_IDS.indexOf(n.id) === -1;
    });

    return Promise.resolve(notifications);
  },

  /**
   * Dismiss a notification by ID.
   * @param {string} notificationId
   * @returns {Promise<void>}
   */
  dismissNotification: function(notificationId) {
    if (DISMISSED_NOTIFICATION_IDS.indexOf(notificationId) === -1) {
      DISMISSED_NOTIFICATION_IDS.push(notificationId);
    }
    return Promise.resolve();
  },

  /**
   * Get appointments within a date range, enriched with sailor data.
   * @param {Object} dateRange - { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }
   * @returns {Promise<Array>}
   */
  getAppointments: function(dateRange) {
    var results = SYNTHETIC_APPOINTMENTS.filter(function(a) {
      return a.date >= dateRange.start && a.date <= dateRange.end;
    });
    // Enrich with sailor info
    var enriched = results.map(function(a) {
      var sailor = SYNTHETIC_SAILORS.find(function(s) { return s.id === a.sailorId; });
      return {
        id: a.id,
        sailorId: a.sailorId,
        date: a.date,
        time: a.time,
        duration: a.duration,
        type: a.type,
        reason: a.reason,
        sailor: sailor ? {
          lastName: sailor.lastName,
          firstName: sailor.firstName,
          rate: sailor.rate,
          payGrade: sailor.payGrade,
          command: sailor.command,
          prd: sailor.prd,
          eaos: sailor.eaos
        } : null
      };
    });
    return Promise.resolve(enriched);
  },

  /**
   * Get the detailer's booking link (Phase 1B: Microsoft Bookings).
   * @returns {Promise<Object>}
   */
  getBookingLink: function() {
    return Promise.resolve({
      url: 'https://outlook.office365.com/bes2/bookings/s/PERS401-Detailer/schedule',
      label: 'PERS-401 Detailer Booking Page'
    });
  },

  /**
   * Get all email templates.
   * @returns {Promise<Array>}
   */
  getTemplates: function() {
    return Promise.resolve(SYNTHETIC_TEMPLATES.slice());
  },

  /**
   * Send a form link to a Sailor. Updates synthetic status.
   * @param {string} sailorId
   * @param {string} formType - 'prd_preferences' | 'colo_request' | 'efmp_intake' | 'special_circumstances'
   * @returns {Promise<Object>}
   */
  sendFormLink: function(sailorId, formType) {
    var todayStr = formatDate(today());
    var dueStr = formatDate(new Date(today().getTime() + 14 * 24 * 60 * 60 * 1000));
    // Update or create form status entry
    var existing = SYNTHETIC_FORM_STATUS.find(function(f) { return f.sailorId === sailorId; });
    if (existing) {
      existing.status = 'sent';
      existing.sentDate = todayStr;
      existing.dueDate = dueStr;
      existing.receivedDate = null;
    } else {
      SYNTHETIC_FORM_STATUS.push({
        sailorId: sailorId,
        status: 'sent',
        sentDate: todayStr,
        dueDate: dueStr,
        receivedDate: null
      });
    }
    return Promise.resolve({
      sent: true,
      formType: formType,
      formUrl: 'https://forms.office.com/Pages/ResponsePage.aspx?id=PERS401_' + formType
    });
  },

  /**
   * Get form responses / preference data for a Sailor.
   * @param {string} sailorId
   * @returns {Promise<Object|null>}
   */
  getFormResponses: function(sailorId) {
    var response = SYNTHETIC_FORM_RESPONSES.find(function(r) { return r.sailorId === sailorId; });
    return Promise.resolve(response || null);
  },

  /**
   * Compute escalations from compound risk factors.
   * Escalation triggers:
   *   - PRD CRITICAL + no contact >30d
   *   - PRD CRITICAL + form overdue
   * @returns {Promise<Array>}
   */
  getEscalations: function() {
    var now = today();
    var escalations = [];
    for (var i = 0; i < SYNTHETIC_SAILORS.length; i++) {
      var sailor = SYNTHETIC_SAILORS[i];
      var prd = computePRDTier(sailor);
      var contactDate = parseDate(sailor.lastContact);
      var daysSinceContact = Math.floor((now.getTime() - contactDate.getTime()) / (1000 * 60 * 60 * 24));
      var formEntry = SYNTHETIC_FORM_STATUS.find(function(f) { return f.sailorId === sailor.id; });
      var formOverdue = formEntry && formEntry.status === 'overdue';
      var reasons = [];

      if (prd.tier === 'CRITICAL' && daysSinceContact > 30) {
        reasons.push('PRD critical + no contact >' + daysSinceContact + 'd');
      }
      if (prd.tier === 'CRITICAL' && formOverdue) {
        reasons.push('PRD critical + preference form overdue');
      }

      if (reasons.length > 0) {
        escalations.push({
          sailorId: sailor.id,
          sailor: sailor,
          prdTier: prd.tier,
          daysSinceContact: daysSinceContact,
          formStatus: formEntry ? formEntry.status : 'not_sent',
          reasons: reasons,
          severity: 'critical'
        });
      }
    }
    // Sort by severity (critical first)
    escalations.sort(function(a, b) {
      if (a.severity === 'critical' && b.severity !== 'critical') return -1;
      if (a.severity !== 'critical' && b.severity === 'critical') return 1;
      return b.daysSinceContact - a.daysSinceContact;
    });
    return Promise.resolve(escalations);
  },

  /**
   * Get the assignment workflow status for a Sailor.
   * @param {string} sailorId
   * @returns {Promise<Object|null>}
   */
  getOrderStatus: function(sailorId) {
    var status = SYNTHETIC_ORDER_STATUS.find(function(s) { return s.sailorId === sailorId; });
    return Promise.resolve(status || null);
  },

  /**
   * Get Project Compass self-report data for a Sailor.
   * @param {string} sailorId
   * @returns {Promise<Object|null>}
   */
  getCompass: function(sailorId) {
    var entry = SYNTHETIC_COMPASS.find(function(c) { return c.sailorId === sailorId; });
    return Promise.resolve(entry || null);
  },

  /**
   * Get all order statuses (batch).
   * @returns {Promise<Array>}
   */
  getAllOrderStatuses: function() {
    return Promise.resolve(SYNTHETIC_ORDER_STATUS.slice());
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
   SECTION 5: HIGH-FIDELITY GRAPHICS ENGINE
   Pure DOM and Canvas visualizations (Zero Dependencies)
   ----------------------------------------------------------- */

/**
 * Render a DOM-based competitiveness bar.
 * @param {string} containerId - The ID of the container element
 * @param {number} sailorScore - Current Sailor's score
 * @param {number} peerAverage - The average score for the peer group
 */
function renderCompetitivenessBar(containerId, sailorScore, peerAverage) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var maxScore = 100;
  var sailorPct = Math.min((sailorScore / maxScore) * 100, 100);
  var peerPct = Math.min((peerAverage / maxScore) * 100, 100);

  // Determine color based on standing
  var isCompetitive = sailorScore >= peerAverage;
  var barColor = isCompetitive ? 'var(--color-prd-green-text)' : 'var(--color-prd-yellow-text)';

  var html = '<div style="position: relative; width: 100%; height: 24px; background: var(--color-bg-sunken); border-radius: var(--radius-sm); margin-top: 8px;">';
  
  // Peer Average Marker
  html += '<div style="position: absolute; left: ' + peerPct + '%; top: -4px; bottom: -4px; width: 2px; background: var(--color-text-muted); z-index: 10;" title="Peer Average: ' + peerAverage + '"></div>';
  
  // Sailor Bar
  html += '<div style="position: absolute; left: 0; top: 0; bottom: 0; width: ' + sailorPct + '%; background: ' + barColor + '; border-radius: var(--radius-sm); transition: width 0.5s ease-out;" title="Sailor Score: ' + sailorScore + '"></div>';

  html += '</div>';
  
  // Labels
  html += '<div style="display: flex; justify-content: space-between; margin-top: 4px; font-family: var(--font-data); font-size: 0.75rem; color: var(--color-text-muted);">';
  html += '<span>Score: <strong style="color: var(--color-text-primary);">' + sailorScore + '</strong></span>';
  html += '<span>Peer Avg: ' + peerAverage + '</span>';
  html += '</div>';

  container.innerHTML = html;
}

/**
 * Render a Canvas-based Pvol Radar Chart.
 * @param {string} canvasId
 * @param {Array<number>} currentQuals - Array of 5 values (0-100)
 * @param {Array<number>} targetQuals - Array of 5 target values (0-100)
 */
function renderPvolRadarChart(canvasId, currentQuals, targetQuals) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var width = canvas.width;
  var height = canvas.height;
  var centerX = width / 2;
  var centerY = height / 2;
  var radius = Math.min(centerX, centerY) - 20;

  ctx.clearRect(0, 0, width, height);

  var numPoints = 5;
  var angleStep = (Math.PI * 2) / numPoints;

  // Draw background grid
  ctx.strokeStyle = '#D4CFC7'; // var(--color-border-subtle)
  ctx.lineWidth = 1;
  for (var i = 1; i <= 4; i++) {
    var r = (radius / 4) * i;
    ctx.beginPath();
    for (var j = 0; j < numPoints; j++) {
      var angle = (Math.PI / 2) - (j * angleStep);
      var x = centerX + r * Math.cos(angle);
      var y = centerY - r * Math.sin(angle);
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Draw axes
  ctx.beginPath();
  for (var j = 0; j < numPoints; j++) {
    var angle = (Math.PI / 2) - (j * angleStep);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(angle), centerY - radius * Math.sin(angle));
  }
  ctx.stroke();

  function drawPoly(data, fillColor, strokeColor) {
    ctx.beginPath();
    for (var j = 0; j < numPoints; j++) {
      var angle = (Math.PI / 2) - (j * angleStep);
      var r = radius * (data[j] / 100);
      var x = centerX + r * Math.cos(angle);
      var y = centerY - r * Math.sin(angle);
      if (j === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Target Quals Poly
  drawPoly(targetQuals, 'rgba(154, 122, 10, 0.1)', '#9A7A0A'); // Yellow (Pvol Target)

  // Current Quals Poly
  drawPoly(currentQuals, 'rgba(26, 122, 62, 0.2)', '#1A7A3E'); // Green (Current)
}

/* -----------------------------------------------------------
   SECTION 6: NAVIGATION HELPER
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
