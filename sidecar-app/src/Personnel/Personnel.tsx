import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SideCarAdapter } from '../services/SideCarAdapter';
import { computePRDTier, daysSinceContact } from '../services/PrdEngine';
import { PIPELINE_STAGES } from '../services/SyntheticData';
import type {
  ISailor, ICommEntry, IOrderStatus, IFormResponse,
  IBilletHistory, IQualification, IEducation, IPersonalInfo, ICompassInsights
} from '../models/ISailor';
import Topbar from '../components/Topbar';
import './Personnel.css';

/* ── Fallback synthetic data for new fields ────────────────── */
const FALLBACK_BILLET_HISTORY: IBilletHistory[] = [
  { uic: 'XXXX4', command: 'USS PLACEHOLDER (DDG-00)', billet: 'Systems Admin', startDate: '2024-06-15', detachDate: '2026-06-14' },
  { uic: 'XXXX1', command: 'NAVSTA TESTPORT', billet: 'Help Desk Supervisor', startDate: '2021-07-01', detachDate: '2024-06-14' },
  { uic: 'XXXXX', command: 'USS EXAMPLE (CVN-00)', billet: 'IT Technician', startDate: '2018-09-10', detachDate: '2021-06-30' },
];

const FALLBACK_QUALIFICATIONS: IQualification[] = [
  { year: '2025', code: '742A', title: 'Network Security Vulnerability Technician', dateEarned: '2025-03-14' },
  { year: '2023', code: '746A', title: 'ISSM (Information Systems Security Manager)', dateEarned: '2023-08-22' },
  { year: '2021', code: '741A', title: 'Help Desk Technician', dateEarned: '2021-01-10' },
  { year: '2020', code: '0100', title: 'Basic Enlisted Submarine Qualification', dateEarned: '2020-05-01' },
];

const FALLBACK_EDUCATION: IEducation[] = [
  { degree: 'B.S.', year: '2024', major: 'Cybersecurity', university: 'UMGC (Online)' },
  { degree: 'A.A.S.', year: '2021', major: 'Information Technology', university: 'CCAF' },
];

const FALLBACK_PERSONAL_INFO: IPersonalInfo = {
  family: 'Married, 2 dependents (spouse + 1 child, age 7)',
  dutyStation: 'Naval Station Norfolk, VA',
  contactInfo: 'DSN: 564-1234 | NMCI: lastname.firstname@navy.mil',
  efmp: 'Not enrolled',
  limdu: 'None active',
  pfa: 'Passed (Outstanding) — Last cycle: MAR 2026',
};

const FALLBACK_COMPASS_INSIGHTS: ICompassInsights = {
  topRegions: 'Hampton Roads, VA — San Diego, CA — Pensacola, FL',
  trendingJobs: 'ISSM, Cyber Ops Watch Officer, Network Admin (Shore)',
  memberNotes: 'Prefers East Coast for family stability. Interested in cyber career path.',
  shortTermFocus: 'Complete ISSM certification; gain watch officer experience',
  longTermGoal: 'Warrant Officer (CWO2) — Cyber Warfare Technician',
  activeEducation: 'B.S. Cybersecurity — UMGC (12 credits remaining)',
  retentionIntent: 'Intends to reenlist — career Sailor',
  savedBillets: [
    'ISSM — NIOC Maryland, Fort Meade, MD',
    'Cyber Ops Watch Officer — NIOC Georgia, Fort Eisenhower, GA',
    'Network Admin — NAVSTA Norfolk, Norfolk, VA',
  ],
};

/* ── Maximize icon SVG ─────────────────────────────────────── */
function MaximizeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2h5V0H0v7h2V2zM14 14h-5v2h7V9h-2v5z" fill="currentColor" />
      <path d="M14 2h-5V0h7v7h-2V2zM2 14h5v2H0V9h2v5z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 3.5L3.5 12.5M3.5 3.5l9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Accordion Sub-component ───────────────────────────────── */
interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  return (
    <div className={`accordion ${open ? 'accordion--open' : ''}`}>
      <button className="accordion__trigger" onClick={() => setOpen(prev => !prev)} type="button">
        <span className="accordion__chevron">{open ? '\u25BC' : '\u25B6'}</span>
        <span className="accordion__title">{title}</span>
      </button>
      {open && <div className="accordion__body">{children}</div>}
    </div>
  );
}

/* ── RevealOnScroll — progressive disclosure wrapper ──────── */
const revealVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function RevealOnScroll({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── DataModule wrapper ────────────────────────────────────── */
interface DataModuleProps {
  id: string;
  title: string;
  column: 'left' | 'right';
  expandedModule: string | null;
  onExpand: (id: string | null) => void;
  children: React.ReactNode;
}

function DataModule({ id, title, column, expandedModule, onExpand, children }: DataModuleProps) {
  const isExpanded: boolean = expandedModule === id;
  const titleClass: string = column === 'left' ? 'data-module-title data-module-title--gold' : 'data-module-title data-module-title--navy';

  return (
    <div className={`data-module ${isExpanded ? 'modal-mode' : ''}`} data-module-id={id}>
      <div className="data-module-header">
        <h2 className={titleClass}>{title}</h2>
        <button
          className="data-module-expand-btn"
          onClick={() => onExpand(isExpanded ? null : id)}
          type="button"
          aria-label={isExpanded ? 'Close modal' : 'Expand module'}
        >
          {isExpanded ? <CloseIcon /> : <MaximizeIcon />}
        </button>
      </div>
      <div className="data-module-content">
        {children}
      </div>
    </div>
  );
}

/* ── Helper: determine if enlisted ─────────────────────────── */
function isEnlisted(payGrade: string): boolean {
  return payGrade.startsWith('E');
}

/* ================================================================
   PERSONNEL — Main Component
   ================================================================ */
export default function Personnel() {
  const { id } = useParams<{ id: string }>();
  const [sailor, setSailor] = useState<ISailor | null>(null);
  const [commLog, setCommLog] = useState<ICommEntry[]>([]);
  const [orderStatus, setOrderStatus] = useState<IOrderStatus | null>(null);
  const [formResponse, setFormResponse] = useState<IFormResponse | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── Data loading (C-09: all through SideCarAdapter) ───── */
  useEffect(() => {
    async function load(): Promise<void> {
      if (!id) return;
      const s: ISailor | null = await SideCarAdapter.getSailor(id);
      if (!s) return;
      setSailor(s);
      const log: ICommEntry[] = await SideCarAdapter.getCommLog(id);
      setCommLog(log.sort((a: ICommEntry, b: ICommEntry) => b.date.localeCompare(a.date)));
      const os: IOrderStatus | null = await SideCarAdapter.getOrderStatus(id);
      setOrderStatus(os);
      const fr: IFormResponse | null = await SideCarAdapter.getFormResponses(id);
      setFormResponse(fr);
    }
    load();
  }, [id]);

  /* ── Escape key to close modal ─────────────────────────── */
  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    if (e.key === 'Escape' && expandedModule) {
      setExpandedModule(null);
    }
  }, [expandedModule]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  /* ── Radar chart ───────────────────────────────────────── */
  useEffect(() => {
    if (!sailor || !canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    const width: number = canvas.width;
    const height: number = canvas.height;
    const centerX: number = width / 2;
    const centerY: number = height / 2;
    const radius: number = Math.min(centerX, centerY) - 20;
    const numPoints: number = 5;
    const angleStep: number = (Math.PI * 2) / numPoints;

    ctx.clearRect(0, 0, width, height);

    const current: number[] = [78, 85, 62, 90, 70];
    const target: number[] = [85, 90, 80, 95, 85];

    // Grid
    const styles: CSSStyleDeclaration = getComputedStyle(document.documentElement);
    const borderColor: string = styles.getPropertyValue('--color-border').trim() || '#D4CFC7';
    const mutedColor: string = styles.getPropertyValue('--color-text-muted').trim() || '#999999';
    const goldColor: string = styles.getPropertyValue('--color-gold').trim() || '#9A7A0A';
    const stableColor: string = styles.getPropertyValue('--color-prd-stable-text').trim() || '#166534';

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const r: number = (radius / 4) * i;
      ctx.beginPath();
      for (let j = 0; j < numPoints; j++) {
        const angle: number = (Math.PI / 2) - (j * angleStep);
        const x: number = centerX + r * Math.cos(angle);
        const y: number = centerY - r * Math.sin(angle);
        if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Axes
    ctx.beginPath();
    for (let j = 0; j < numPoints; j++) {
      const angle: number = (Math.PI / 2) - (j * angleStep);
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY - radius * Math.sin(angle));
    }
    ctx.stroke();

    // Labels
    const labels: string[] = ['Technical', 'Leadership', 'Quals', 'Evals', 'PRT'];
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = mutedColor;
    ctx.textAlign = 'center';
    for (let j = 0; j < numPoints; j++) {
      const angle: number = (Math.PI / 2) - (j * angleStep);
      const lx: number = centerX + (radius + 16) * Math.cos(angle);
      const ly: number = centerY - (radius + 16) * Math.sin(angle);
      ctx.fillText(labels[j], lx, ly + 4);
    }

    function drawPoly(data: number[], fillColor: string, strokeColor: string): void {
      if (!ctx) return;
      ctx.beginPath();
      for (let j = 0; j < numPoints; j++) {
        const angle: number = (Math.PI / 2) - (j * angleStep);
        const r: number = radius * (data[j] / 100);
        const x: number = centerX + r * Math.cos(angle);
        const y: number = centerY - r * Math.sin(angle);
        if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    drawPoly(target, `${goldColor}1A`, goldColor);
    drawPoly(current, `${stableColor}33`, stableColor);
  }, [sailor]);

  /* ── Loading state ─────────────────────────────────────── */
  if (!sailor) {
    return (
      <div className="personnel">
        <Topbar />
        <div className="personnel__loading">Loading sailor record...</div>
      </div>
    );
  }

  /* ── Derived values ────────────────────────────────────── */
  const prd = computePRDTier(sailor);
  const cd: number = daysSinceContact(sailor);
  const getPrdClass = (tier: string): string => `prd-badge prd-badge--${tier.toLowerCase()}`;
  const getContactClass = (days: number): string => {
    if (days > 60) return 'contact--critical';
    if (days > 30) return 'contact--stale';
    if (days > 14) return 'contact--aging';
    return 'contact--healthy';
  };

  const currentStageIdx: number = orderStatus
    ? PIPELINE_STAGES.findIndex(p => p.key === orderStatus.currentStage)
    : -1;

  /* ── Resolve data with fallbacks ───────────────────────── */
  const billetHistory: IBilletHistory[] = sailor.billetHistory ?? FALLBACK_BILLET_HISTORY;
  const qualifications: IQualification[] = sailor.qualifications ?? FALLBACK_QUALIFICATIONS;
  const education: IEducation[] = sailor.education ?? FALLBACK_EDUCATION;
  const personalInfo: IPersonalInfo = sailor.personalInfo ?? FALLBACK_PERSONAL_INFO;
  const compassInsights: ICompassInsights = sailor.compassInsights ?? FALLBACK_COMPASS_INSIGHTS;
  const qualLabel: string = isEnlisted(sailor.payGrade) ? 'NECs' : 'AQDs';

  const handleExpand = (moduleId: string | null): void => {
    setExpandedModule(moduleId);
  };

  return (
    <div className="personnel">
      <Topbar />

      {/* Modal backdrop */}
      {expandedModule && (
        <div
          className="modal-backdrop"
          onClick={() => setExpandedModule(null)}
          role="presentation"
        />
      )}

      <main className="personnel__content">
        {/* ── Header Card (full width) ─────────────────── */}
        <motion.section
          className="person-header"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="person-header__top">
            <span className={getPrdClass(prd.tier)}>{prd.tier}</span>
            <h1 className="person-header__name">{sailor.lastName}, {sailor.firstName}</h1>
          </div>
          <div className="person-header__grid">
            <div className="person-header__field">
              <span className="person-header__label">Rate / Grade</span>
              <span className="person-header__value">{sailor.rate} {sailor.payGrade}</span>
            </div>
            <div className="person-header__field">
              <span className="person-header__label">Command</span>
              <span className="person-header__value">{sailor.command}</span>
            </div>
            <div className="person-header__field">
              <span className="person-header__label">UIC</span>
              <span className="person-header__value person-header__value--data">{sailor.uic}</span>
            </div>
            <div className="person-header__field">
              <span className="person-header__label">Billet</span>
              <span className="person-header__value">{sailor.billet}</span>
            </div>
            <div className="person-header__field">
              <span className="person-header__label">PRD</span>
              <span className="person-header__value person-header__value--data">{sailor.prd} ({prd.label})</span>
            </div>
            <div className="person-header__field">
              <span className="person-header__label">EAOS</span>
              <span className="person-header__value person-header__value--data">{sailor.eaos}</span>
            </div>
            <div className="person-header__field">
              <span className="person-header__label">Last Contact</span>
              <span className={`person-header__value person-header__value--data ${getContactClass(cd)}`}>
                {sailor.lastContact} ({cd}d ago)
              </span>
            </div>
            <div className="person-header__field">
              <span className="person-header__label">Detailer</span>
              <span className="person-header__value">{sailor.detailer}</span>
            </div>
          </div>
        </motion.section>

        {/* ── Pipeline (full width) ────────────────────── */}
        {orderStatus && (
          <motion.section
            className="pipeline-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="section-title">Order Pipeline</h2>
            <div className="pipeline">
              {PIPELINE_STAGES.map((stage, i) => (
                <div
                  key={stage.key}
                  className={`pipeline__stage ${i <= currentStageIdx ? 'pipeline__stage--complete' : ''} ${i === currentStageIdx ? 'pipeline__stage--current' : ''}`}
                >
                  <div className="pipeline__dot" />
                  <span className="pipeline__label">{stage.fullLabel}</span>
                </div>
              ))}
            </div>
            {orderStatus.blockers && (
              <div className="pipeline__blocker">
                Blocker: {orderStatus.blockers}
              </div>
            )}
          </motion.section>
        )}

        {/* ── Two-Column Module Layout ─────────────────── */}
        <div className="personnel__columns">

          {/* ════ LEFT COLUMN — Career ════ */}
          <div className="personnel__left">

            {/* MOD: Career / Orders */}
            <DataModule id="mod-orders" title="Career / Orders" column="left" expandedModule={expandedModule} onExpand={handleExpand}>
              <div className="orders-grid">
                <div className="orders-field">
                  <span className="orders-label">Command</span>
                  <span className="orders-value">{sailor.command}</span>
                </div>
                <div className="orders-field">
                  <span className="orders-label">UIC</span>
                  <span className="orders-value orders-value--data">{sailor.uic}</span>
                </div>
                <div className="orders-field">
                  <span className="orders-label">BSC</span>
                  <span className="orders-value orders-value--data">{sailor.bsc ?? 'N/A'}</span>
                </div>
                <div className="orders-field">
                  <span className="orders-label">Billet</span>
                  <span className="orders-value">{sailor.billet}</span>
                </div>
                <div className="orders-field">
                  <span className="orders-label">COG</span>
                  <span className="orders-value orders-value--data">{sailor.designator ?? 'N/A'}</span>
                </div>
                <div className="orders-field">
                  <span className="orders-label">PRD / Avail Date</span>
                  <span className="orders-value orders-value--data">{sailor.prd}</span>
                </div>
              </div>
              <Accordion title="Proposed Orders">
                {orderStatus ? (
                  <div className="proposed-orders">
                    <p className="proposed-orders__stage">
                      <strong>Stage:</strong> {PIPELINE_STAGES.find(s => s.key === orderStatus.currentStage)?.fullLabel ?? orderStatus.currentStage}
                    </p>
                    <p className="proposed-orders__date"><strong>Stage Date:</strong> {orderStatus.stageDate}</p>
                    {orderStatus.blockers && (
                      <p className="proposed-orders__blocker"><strong>Blocker:</strong> {orderStatus.blockers}</p>
                    )}
                  </div>
                ) : (
                  <p className="mod-empty">No proposed orders on file.</p>
                )}
              </Accordion>
            </DataModule>

            {/* MOD: Billet History */}
            <RevealOnScroll>
            <DataModule id="mod-billet" title="Billet History" column="left" expandedModule={expandedModule} onExpand={handleExpand}>
              <table className="mod-table">
                <thead>
                  <tr>
                    <th>UIC</th>
                    <th>Command</th>
                    <th>Billet</th>
                    <th>Start</th>
                    <th>Detach</th>
                  </tr>
                </thead>
                <tbody>
                  {billetHistory.map((bh: IBilletHistory, i: number) => (
                    <tr key={i}>
                      <td>{bh.uic}</td>
                      <td>{bh.command}</td>
                      <td>{bh.billet}</td>
                      <td>{bh.startDate}</td>
                      <td>{bh.detachDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataModule>
            </RevealOnScroll>

            {/* MOD: Qualifications & Education */}
            <RevealOnScroll delay={0.05}>
            <DataModule id="mod-quals" title={`Qualifications & Education`} column="left" expandedModule={expandedModule} onExpand={handleExpand}>
              <h3 className="mod-subtitle">{qualLabel}</h3>
              <ol className="quals-list">
                {qualifications.map((q: IQualification, i: number) => (
                  <li key={i} className="quals-list__item">
                    <span className="quals-list__code">{q.code}</span>
                    <span className="quals-list__title">{q.title}</span>
                  </li>
                ))}
              </ol>
              <Accordion title={`${qualLabel} Descriptions`}>
                <div className="quals-detail">
                  {qualifications.map((q: IQualification, i: number) => (
                    <div key={i} className="quals-detail__entry">
                      <span className="quals-detail__code">{q.code}</span>
                      <span className="quals-detail__title">{q.title}</span>
                      <span className="quals-detail__date">Earned: {q.dateEarned}</span>
                    </div>
                  ))}
                </div>
              </Accordion>

              <h3 className="mod-subtitle mod-subtitle--spaced">Education</h3>
              <table className="mod-table">
                <thead>
                  <tr>
                    <th>Degree</th>
                    <th>Year</th>
                    <th>Major</th>
                    <th>University</th>
                  </tr>
                </thead>
                <tbody>
                  {education.map((ed: IEducation, i: number) => (
                    <tr key={i}>
                      <td>{ed.degree}</td>
                      <td>{ed.year}</td>
                      <td>{ed.major}</td>
                      <td>{ed.university}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataModule>
            </RevealOnScroll>

            {/* MOD: Personal Information */}
            <RevealOnScroll delay={0.1}>
            <DataModule id="mod-personal" title="Personal Information" column="left" expandedModule={expandedModule} onExpand={handleExpand}>
              <Accordion title="Family / Dependents" defaultOpen>
                <p className="mod-text">{personalInfo.family ?? 'No data on file.'}</p>
              </Accordion>
              <Accordion title="Duty Station">
                <p className="mod-text">{personalInfo.dutyStation ?? 'No data on file.'}</p>
              </Accordion>
              <Accordion title="PRD">
                <p className="mod-text">{sailor.prd} — {prd.label}</p>
              </Accordion>
              <Accordion title="Contact Info">
                <p className="mod-text">{personalInfo.contactInfo ?? 'No data on file.'}</p>
              </Accordion>
              <Accordion title="EFMP">
                <p className="mod-text">{personalInfo.efmp ?? 'Not enrolled'}</p>
              </Accordion>
              <Accordion title="LIMDU / OPSDEF">
                <p className="mod-text">{personalInfo.limdu ?? 'None active'}</p>
              </Accordion>
              <Accordion title="PFA History">
                <p className="mod-text">{personalInfo.pfa ?? 'No PFA data on file.'}</p>
              </Accordion>
            </DataModule>
            </RevealOnScroll>

            {/* MOD: Radar Chart (Competitiveness) */}
            <RevealOnScroll delay={0.15}>
            <div className="data-module">
              <div className="data-module-header">
                <h2 className="data-module-title data-module-title--gold">Competitiveness Profile</h2>
              </div>
              <div className="data-module-content">
                <div className="radar-wrap">
                  <canvas ref={canvasRef} width={280} height={280} className="radar-canvas" />
                  <div className="radar-legend">
                    <span className="radar-legend__item"><span className="radar-legend__dot radar-legend__dot--current" /> Current</span>
                    <span className="radar-legend__item"><span className="radar-legend__dot radar-legend__dot--target" /> Target</span>
                  </div>
                </div>
              </div>
            </div>
            </RevealOnScroll>

            {/* MOD: Preferences */}
            {formResponse && (
              <RevealOnScroll delay={0.2}>
              <DataModule id="mod-prefs" title="Preferences Submitted" column="left" expandedModule={expandedModule} onExpand={handleExpand}>
                <div className="prefs">
                  {formResponse.billetChoices.map(c => (
                    <div key={c.rank} className="prefs__choice">
                      <span className="prefs__rank">#{c.rank}</span>
                      <div className="prefs__info">
                        <span className="prefs__billet">{c.billet}</span>
                        <span className="prefs__location">{c.command} — {c.location}</span>
                      </div>
                    </div>
                  ))}
                  <div className="prefs__details">
                    <span><strong>Geo:</strong> {formResponse.geoPreference}</span>
                    <span><strong>Sea/Shore:</strong> {formResponse.seaShore}</span>
                    {formResponse.coloStatus.requested && (
                      <span><strong>COLO:</strong> {formResponse.coloStatus.spouseInfo}</span>
                    )}
                    {formResponse.efmpStatus.enrolled && (
                      <span><strong>EFMP:</strong> {formResponse.efmpStatus.category}</span>
                    )}
                    {formResponse.specialCircumstances !== 'None' && (
                      <span><strong>Special:</strong> {formResponse.specialCircumstances}</span>
                    )}
                  </div>
                </div>
              </DataModule>
              </RevealOnScroll>
            )}
          </div>

          {/* ════ RIGHT COLUMN — Compass ════ */}
          <div className="personnel__right">

            {/* MOD: Compass Info Insights */}
            <DataModule id="mod-compass" title="Compass Info Insights" column="right" expandedModule={expandedModule} onExpand={handleExpand}>
              <div className="compass-section">
                <div className="compass-field">
                  <span className="compass-label">Top Searched Regions</span>
                  <span className="compass-value">{compassInsights.topRegions ?? 'No data'}</span>
                </div>
                <div className="compass-field">
                  <span className="compass-label">Trending Job Prefs</span>
                  <span className="compass-value">{compassInsights.trendingJobs ?? 'No data'}</span>
                </div>
                <div className="compass-field">
                  <span className="compass-label">Member Notes</span>
                  <span className="compass-value">{compassInsights.memberNotes ?? 'None'}</span>
                </div>
              </div>
              <Accordion title="Career Intentions" defaultOpen>
                <div className="compass-intentions">
                  <div className="compass-field">
                    <span className="compass-label">Short-Term Focus</span>
                    <span className="compass-value">{compassInsights.shortTermFocus ?? 'Not specified'}</span>
                  </div>
                  <div className="compass-field">
                    <span className="compass-label">Long-Term Goal</span>
                    <span className="compass-value">{compassInsights.longTermGoal ?? 'Not specified'}</span>
                  </div>
                  <div className="compass-field">
                    <span className="compass-label">Active Education</span>
                    <span className="compass-value">{compassInsights.activeEducation ?? 'None on record'}</span>
                  </div>
                  <div className="compass-field">
                    <span className="compass-label">Retention Intent</span>
                    <span className="compass-value">{compassInsights.retentionIntent ?? 'Unknown'}</span>
                  </div>
                </div>
              </Accordion>
            </DataModule>

            {/* MOD: Application History */}
            <RevealOnScroll>
            <DataModule id="mod-apps" title="Application History" column="right" expandedModule={expandedModule} onExpand={handleExpand}>
              <h3 className="mod-subtitle">Saved / Favorited Billets</h3>
              {compassInsights.savedBillets && compassInsights.savedBillets.length > 0 ? (
                <ul className="saved-billets">
                  {compassInsights.savedBillets.map((b: string, i: number) => (
                    <li key={i} className="saved-billets__item">{b}</li>
                  ))}
                </ul>
              ) : (
                <p className="mod-empty">No saved billets.</p>
              )}

              <h3 className="mod-subtitle mod-subtitle--spaced">Formal Application History</h3>
              {formResponse ? (
                <table className="mod-table">
                  <thead>
                    <tr>
                      <th>Form</th>
                      <th>Submitted</th>
                      <th>Top Choice</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{formResponse.formType}</td>
                      <td>{formResponse.submittedDate}</td>
                      <td>{formResponse.billetChoices[0]?.billet ?? 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="mod-empty">No formal applications on record.</p>
              )}
            </DataModule>
            </RevealOnScroll>

            {/* MOD: Communication Log */}
            <RevealOnScroll delay={0.05}>
            <DataModule id="mod-comm" title="Communication Log" column="right" expandedModule={expandedModule} onExpand={handleExpand}>
              <div className="comm-header">
                <span className="comm-count">{commLog.length} entries</span>
              </div>
              <div className="comm-timeline">
                {commLog.map((entry: ICommEntry, i: number) => (
                  <div key={i} className="comm-item">
                    <span className="comm-item__icon">
                      {entry.type === 'phone' ? '\u260E' : entry.type === 'email' ? '\u2709' : entry.type === 'teams' ? '\u{1F4AC}' : '\u{1F4CB}'}
                    </span>
                    <div className="comm-item__body">
                      <span className="comm-item__date">{entry.date}</span>
                      <span className="comm-item__summary">{entry.summary}</span>
                    </div>
                  </div>
                ))}
                {commLog.length === 0 && <p className="mod-empty">No communication entries.</p>}
              </div>
            </DataModule>
            </RevealOnScroll>
          </div>
        </div>
      </main>
    </div>
  );
}
