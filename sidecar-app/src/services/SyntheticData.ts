import type {
  ISailor, ICommEntry, IBillet, ICommand, IFormStatus,
  IFormResponse, IAppointment, ITemplate, IOrderStatus,
  IPipelineStage
} from '../models/ISailor';
import { today, formatDate } from './PrdEngine';

/* -------------------------------------------------------
   SYNTHETIC SAILORS
   12 phonetic-alphabet Sailors across IT, CTN, YN rates.
   PRD values distributed across all 5 tiers.
   ------------------------------------------------------- */
export const SYNTHETIC_SAILORS: ISailor[] = [
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

export const SYNTHETIC_COMM_LOG: ICommEntry[] = [
  { sailorId: '9999000001', date: '2026-01-10', type: 'phone',  summary: 'Discussed upcoming PCS options. Sailor prefers East Coast.' },
  { sailorId: '9999000001', date: '2025-12-05', type: 'email',  summary: 'Sent assignment cycle timeline and MNA instructions.' },
  { sailorId: '9999000001', date: '2025-11-15', type: 'phone',  summary: 'Initial PRD counseling. Sailor acknowledged 90-day window.' },
  { sailorId: '9999000001', date: '2025-10-20', type: 'email',  summary: 'Sent welcome aboard email with detailer contact info and PRD timeline.' },
  { sailorId: '9999000002', date: '2026-03-01', type: 'phone',  summary: 'PRD approaching. Reviewed available billets at NIOC locations.' },
  { sailorId: '9999000002', date: '2026-02-10', type: 'email',  summary: 'Sent billet listing for E-6 IT positions at shore commands.' },
  { sailorId: '9999000002', date: '2026-01-15', type: 'note',   summary: 'Sailor submitted MNA preferences — top 3: NIOC MD, NAVSTA Norfolk, SPAWAR SD.' },
  { sailorId: '9999000003', date: '2026-02-20', type: 'email',  summary: 'Sailor requested CONUS shore duty. Noted COLO request pending.' },
  { sailorId: '9999000003', date: '2026-01-28', type: 'phone',  summary: 'Discussed COLO options with spouse at JBAB. Evaluating E-5 CTN billets.' },
  { sailorId: '9999000004', date: '2026-03-20', type: 'phone',  summary: 'Routine check-in. Sailor satisfied with current assignment.' },
  { sailorId: '9999000004', date: '2026-02-05', type: 'email',  summary: 'Sailor confirmed intent to reenlist. EAOS extension submitted.' },
  { sailorId: '9999000005', date: '2026-02-01', type: 'email',  summary: 'Annual PRD counseling. No action required — PRD 15+ months out.' },
  { sailorId: '9999000006', date: '2026-03-15', type: 'phone',  summary: 'PRD critical. Sailor aware. Awaiting billet match.' },
  { sailorId: '9999000006', date: '2026-02-28', type: 'email',  summary: 'Sent E-6 CTN billet options: NIOC HI, NIOC GA, NSA TX.' },
  { sailorId: '9999000006', date: '2026-02-10', type: 'note',   summary: 'Branch head flagged: high-value operator. Prioritize NIOC placement.' },
  { sailorId: '9999000007', date: '2025-12-20', type: 'email',  summary: 'PRD expired. Multiple contact attempts. No response.' },
  { sailorId: '9999000007', date: '2026-01-05', type: 'phone',  summary: 'Reached Sailor. Discussed immediate reassignment options.' },
  { sailorId: '9999000007', date: '2026-01-15', type: 'note',   summary: 'Sailor unresponsive to follow-up. Escalating to command triad.' },
  { sailorId: '9999000008', date: '2026-03-10', type: 'email',  summary: 'Sent YN E-5 billet options at CONUS shore commands.' },
  { sailorId: '9999000008', date: '2026-02-22', type: 'phone',  summary: 'Sailor has EFMP dependent — requires Category 4 location.' },
  { sailorId: '9999000009', date: '2026-01-25', type: 'email',  summary: 'Chief requesting shore duty for family reasons. Evaluating.' },
  { sailorId: '9999000009', date: '2026-02-15', type: 'phone',  summary: 'Discussed E-7 shore billets. Chief prefers mid-Atlantic region.' },
  { sailorId: '9999000010', date: '2026-02-28', type: 'email',  summary: 'PRD next month. Sailor submitted preferences via MNA.' },
  { sailorId: '9999000010', date: '2026-03-05', type: 'phone',  summary: 'Confirmed billet match at NAVSTA Norfolk. Orders pending branch approval.' },
  { sailorId: '9999000011', date: '2026-03-22', type: 'email',  summary: 'Annual counseling email sent. PRD 14 months out. No action needed.' },
  { sailorId: '9999000012', date: '2026-03-05', type: 'phone',  summary: 'Sailor inquired about cross-rate to IT. Referred to career counselor.' },
  { sailorId: '9999000012', date: '2026-02-18', type: 'email',  summary: 'Sent CTN E-4 billet listing. Sailor prefers West Coast.' }
];

export const SYNTHETIC_BILLETS: IBillet[] = [
  { id: 'B001', commandId: 'XXXXX', commandName: 'USS EXAMPLE (CVN-00)',     rate: 'IT',  payGrade: 'E5', title: 'LAN Admin',            filled: true,  sailorId: '9999000001' },
  { id: 'B002', commandId: 'XXXXX', commandName: 'USS EXAMPLE (CVN-00)',     rate: 'CTN', payGrade: 'E7', title: 'Crypto Board Chief',   filled: true,  sailorId: '9999000009' },
  { id: 'B003', commandId: 'XXXXX', commandName: 'USS EXAMPLE (CVN-00)',     rate: 'IT',  payGrade: 'E4', title: 'Help Desk Tech',       filled: false, sailorId: null },
  { id: 'B004', commandId: 'XXXX1', commandName: 'NAVSTA TESTPORT',          rate: 'IT',  payGrade: 'E6', title: 'ISSM',                 filled: true,  sailorId: '9999000002' },
  { id: 'B005', commandId: 'XXXX1', commandName: 'NAVSTA TESTPORT',          rate: 'IT',  payGrade: 'E4', title: 'Help Desk Tech',       filled: true,  sailorId: '9999000007' },
  { id: 'B006', commandId: 'XXXX1', commandName: 'NAVSTA TESTPORT',          rate: 'IT',  payGrade: 'E6', title: 'Network Chief',        filled: true,  sailorId: '9999000011' },
  { id: 'B007', commandId: 'XXXX2', commandName: 'NIOC DEMO',                rate: 'CTN', payGrade: 'E5', title: 'CND Watch Officer',    filled: true,  sailorId: '9999000003' },
  { id: 'B008', commandId: 'XXXX2', commandName: 'NIOC DEMO',                rate: 'CTN', payGrade: 'E6', title: 'Senior CND Analyst',   filled: true,  sailorId: '9999000006' },
  { id: 'B009', commandId: 'XXXX2', commandName: 'NIOC DEMO',                rate: 'CTN', payGrade: 'E4', title: 'CND Analyst',          filled: true,  sailorId: '9999000012' },
  { id: 'B010', commandId: 'XXXX2', commandName: 'NIOC DEMO',                rate: 'CTN', payGrade: 'E5', title: 'CND Analyst',          filled: false, sailorId: null },
  { id: 'B011', commandId: 'XXXX3', commandName: 'COMNAVPERSCOM HQ',         rate: 'YN',  payGrade: 'E4', title: 'Admin Clerk',           filled: true,  sailorId: '9999000004' },
  { id: 'B012', commandId: 'XXXX3', commandName: 'COMNAVPERSCOM HQ',         rate: 'YN',  payGrade: 'E5', title: 'Personnel Specialist', filled: true,  sailorId: '9999000008' },
  { id: 'B013', commandId: 'XXXX4', commandName: 'USS PLACEHOLDER (DDG-00)', rate: 'IT',  payGrade: 'E7', title: 'DIVO IT',              filled: true,  sailorId: '9999000005' },
  { id: 'B014', commandId: 'XXXX4', commandName: 'USS PLACEHOLDER (DDG-00)', rate: 'IT',  payGrade: 'E5', title: 'Systems Admin',        filled: true,  sailorId: '9999000010' },
  { id: 'B015', commandId: 'XXXX4', commandName: 'USS PLACEHOLDER (DDG-00)', rate: 'IT',  payGrade: 'E4', title: 'Network Tech',         filled: false, sailorId: null }
];

export const SYNTHETIC_COMMANDS: ICommand[] = [
  { id: 'XXXXX', name: 'USS EXAMPLE (CVN-00)',     type: 'Sea',   homeport: 'Testport, VA',  billetCount: 3 },
  { id: 'XXXX1', name: 'NAVSTA TESTPORT',          type: 'Shore', homeport: 'Testport, VA',  billetCount: 3 },
  { id: 'XXXX2', name: 'NIOC DEMO',                type: 'Shore', homeport: 'Demoville, MD', billetCount: 4 },
  { id: 'XXXX3', name: 'COMNAVPERSCOM HQ',         type: 'Shore', homeport: 'Millington, TN', billetCount: 2 },
  { id: 'XXXX4', name: 'USS PLACEHOLDER (DDG-00)', type: 'Sea',   homeport: 'Testport, VA',  billetCount: 3 }
];

export const SYNTHETIC_FORM_STATUS: IFormStatus[] = [
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

export const SYNTHETIC_FORM_RESPONSES: IFormResponse[] = [
  {
    sailorId: '9999000002', formType: 'prd_preferences', submittedDate: '2026-01-20',
    billetChoices: [
      { rank: 1, billet: 'ISSM', command: 'NIOC Maryland', location: 'Fort Meade, MD' },
      { rank: 2, billet: 'Network Chief', command: 'NAVSTA Norfolk', location: 'Norfolk, VA' },
      { rank: 3, billet: 'ISSM', command: 'SPAWAR San Diego', location: 'San Diego, CA' }
    ],
    geoPreference: 'East Coast preferred, will accept West Coast',
    seaShore: 'Shore duty requested (completing sea tour)',
    coloStatus: { requested: false, spouseInfo: null },
    efmpStatus: { enrolled: false, category: null },
    specialCircumstances: 'None'
  },
  {
    sailorId: '9999000009', formType: 'prd_preferences', submittedDate: '2026-02-10',
    billetChoices: [
      { rank: 1, billet: 'Senior Enlisted Advisor', command: 'NSA Washington', location: 'Washington, DC' },
      { rank: 2, billet: 'Division Chief', command: 'NIOC Georgia', location: 'Fort Gordon, GA' },
      { rank: 3, billet: 'CND Department Chief', command: 'NIOC Hawaii', location: 'Pearl Harbor, HI' }
    ],
    geoPreference: 'Mid-Atlantic strongly preferred for family stability',
    seaShore: 'Shore duty (completing second sea tour)',
    coloStatus: { requested: true, spouseInfo: 'Spouse AD Navy YN1, currently JBAB' },
    efmpStatus: { enrolled: true, category: 'Category 3 — dependent requires specialty care' },
    specialCircumstances: 'Request proximity to Walter Reed for dependent medical care'
  },
  {
    sailorId: '9999000010', formType: 'prd_preferences', submittedDate: '2026-02-25',
    billetChoices: [
      { rank: 1, billet: 'Systems Admin', command: 'NAVSTA Norfolk', location: 'Norfolk, VA' },
      { rank: 2, billet: 'LAN Admin', command: 'NAVSTA Mayport', location: 'Mayport, FL' },
      { rank: 3, billet: 'IT Helpdesk Lead', command: 'NAVSTA Rota', location: 'Rota, Spain' }
    ],
    geoPreference: 'Southeast US, open to OCONUS',
    seaShore: 'Shore duty requested',
    coloStatus: { requested: false, spouseInfo: null },
    efmpStatus: { enrolled: false, category: null },
    specialCircumstances: 'Interested in overseas accompanied tour'
  }
];

export const PIPELINE_STAGES: IPipelineStage[] = [
  { key: 'pref_collection', label: 'Prefs', fullLabel: 'Preference Collection' },
  { key: 'billet_matching', label: 'Match', fullLabel: 'Billet Matching' },
  { key: 'slate_review',    label: 'Slate', fullLabel: 'Slate Review' },
  { key: 'order_drafted',   label: 'Draft', fullLabel: 'Order Drafted' },
  { key: 'order_approved',  label: 'Appvd', fullLabel: 'Order Approved' },
  { key: 'orders_issued',   label: 'Issued', fullLabel: 'Orders Issued' }
];

export const SYNTHETIC_ORDER_STATUS: IOrderStatus[] = [
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

export const SYNTHETIC_TEMPLATES: ITemplate[] = [
  { id: 'TPL-001', name: 'PRD Window Opening', description: '90-day notice — PRD window is now open', subject: 'PRD Window Opening — {{sailorName}}, {{rate}} {{payGrade}}', body: 'Good morning {{sailorName}},\n\nThis email is to notify you that your Projected Rotation Date (PRD) of {{prd}} is now within the 90-day assignment window.' },
  { id: 'TPL-002', name: 'PRD Approaching — Action Required', description: '30-day notice — immediate action needed', subject: 'ACTION REQUIRED: PRD Approaching — {{sailorName}}, {{rate}} {{payGrade}}', body: '{{sailorName}},\n\nYour Projected Rotation Date (PRD) of {{prd}} is within 30 days. Orders must be released imminently.' },
  { id: 'TPL-003', name: 'Billet Options Available', description: 'Billet listing for sailor review', subject: 'Billet Options for Review — {{sailorName}}, {{rate}} {{payGrade}}', body: '{{sailorName}},\n\nBased on your rate ({{rate}}) and pay grade ({{payGrade}}), the following billet options are available.' },
  { id: 'TPL-004', name: 'COLO/EFMP Request Acknowledgment', description: 'Acknowledge receipt of co-location or EFMP request', subject: 'COLO/EFMP Request Received — {{sailorName}}, {{rate}} {{payGrade}}', body: '{{sailorName}},\n\nThis email confirms receipt of your COLO and/or EFMP request.' },
  { id: 'TPL-005', name: 'Order Modification Status Update', description: 'Status update on pending order modifications', subject: 'Order Modification Status — {{sailorName}}, {{rate}} {{payGrade}}', body: '{{sailorName}},\n\nThis email is to provide a status update regarding your pending order modification request.' }
];

/** Generate dynamic appointments for this week */
function generateAppointments(): IAppointment[] {
  const now = today();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const weekday = (offset: number) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return formatDate(d);
  };
  return [
    { id: 'APT-001', sailorId: '9999000001', date: weekday(0), time: '0830', duration: 30, type: 'phone',     reason: 'PRD expired — discuss immediate reassignment options' },
    { id: 'APT-002', sailorId: '9999000007', date: weekday(0), time: '1000', duration: 30, type: 'phone',     reason: 'Follow-up on escalation to command triad' },
    { id: 'APT-003', sailorId: '9999000002', date: weekday(0), time: '1400', duration: 45, type: 'video',     reason: 'Review E-6 IT billet options at NIOC locations' },
    { id: 'APT-004', sailorId: '9999000003', date: weekday(1), time: '0900', duration: 30, type: 'phone',     reason: 'COLO request update — spouse orders to JBAB confirmed' },
    { id: 'APT-005', sailorId: '9999000006', date: weekday(1), time: '1030', duration: 45, type: 'video',     reason: 'PRD critical — finalize billet selection' },
    { id: 'APT-006', sailorId: '9999000008', date: weekday(1), time: '1300', duration: 30, type: 'phone',     reason: 'EFMP Category 4 location verification' },
    { id: 'APT-007', sailorId: '9999000012', date: weekday(1), time: '1500', duration: 30, type: 'in-person', reason: 'Walk-in: cross-rate to IT inquiry follow-up' },
    { id: 'APT-008', sailorId: '9999000010', date: weekday(2), time: '0900', duration: 30, type: 'phone',     reason: 'Confirm NAVSTA Norfolk billet match — orders pending' },
    { id: 'APT-009', sailorId: '9999000009', date: weekday(2), time: '1100', duration: 45, type: 'video',     reason: 'E-7 shore duty review — mid-Atlantic region billets' },
    { id: 'APT-010', sailorId: '9999000004', date: weekday(2), time: '1330', duration: 30, type: 'phone',     reason: 'Routine check-in — reenlistment extension status' },
    { id: 'APT-011', sailorId: '9999000001', date: weekday(2), time: '1500', duration: 30, type: 'phone',     reason: 'Second contact attempt — PCS timeline coordination' },
    { id: 'APT-012', sailorId: '9999000005', date: weekday(3), time: '0830', duration: 30, type: 'phone',     reason: 'Annual PRD counseling — stable, no action needed' },
    { id: 'APT-013', sailorId: '9999000006', date: weekday(3), time: '1000', duration: 30, type: 'video',     reason: 'Branch head coordination — high-value operator placement' },
    { id: 'APT-014', sailorId: '9999000011', date: weekday(3), time: '1300', duration: 30, type: 'phone',     reason: 'Annual counseling follow-up — PRD window briefing' },
    { id: 'APT-015', sailorId: '9999000003', date: weekday(3), time: '1530', duration: 45, type: 'in-person', reason: 'In-person COLO coordination with spouse detailer' },
    { id: 'APT-016', sailorId: '9999000002', date: weekday(4), time: '0900', duration: 30, type: 'phone',     reason: 'PRD window final review — orders submission deadline' },
    { id: 'APT-017', sailorId: '9999000009', date: weekday(4), time: '1100', duration: 45, type: 'video',     reason: 'Chief community manager coordination call' },
    { id: 'APT-018', sailorId: '9999000007', date: weekday(4), time: '1400', duration: 30, type: 'phone',     reason: 'Escalation resolution — Sailor response received' }
  ];
}

export const SYNTHETIC_APPOINTMENTS: IAppointment[] = generateAppointments();
