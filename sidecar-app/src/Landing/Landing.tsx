import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SideCarAdapter } from '../services/SideCarAdapter';
import { computePRDTier, daysSinceContact } from '../services/PrdEngine';
import type { ISailor, INotification, IOrderStatus, IPrdResult } from '../models/ISailor';
import { PIPELINE_STAGES } from '../services/SyntheticData';
import './Landing.css';

type RoleMode = 'Detailer' | 'Placement';

export default function Landing() {
  const [role, setRole] = useState<RoleMode>('Detailer');
  const [roleOpen, setRoleOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISailor[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hoveredSailor, setHoveredSailor] = useState<ISailor | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const [actionItems, setActionItems] = useState<Array<{ sailor: ISailor; prdResult: IPrdResult; contactDays: number; orderStatus: IOrderStatus | null; notifications: INotification[] }>>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const searchRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Load action items on mount
  useEffect(() => {
    async function loadActions() {
      const sailors = await SideCarAdapter.getSailors();
      const notifications = await SideCarAdapter.getNotifications();
      const orderStatuses = await SideCarAdapter.getAllOrderStatuses();
      setNotificationCount(notifications.length);

      const enriched = sailors.map((s) => {
        const prdResult = computePRDTier(s);
        const cd = daysSinceContact(s);
        const orderStatus = orderStatuses.find(o => o.sailorId === s.id) || null;
        const sailorNotifications = notifications.filter(n => n.sailorId === s.id);
        return { sailor: s, prdResult, contactDays: cd, orderStatus, notifications: sailorNotifications };
      });

      // Sort by urgency hierarchy: EXPIRED → CRITICAL → stale contacts → rest
      enriched.sort((a, b) => {
        const tierOrder: Record<string, number> = { EXPIRED: 0, CRITICAL: 1, URGENT: 2, WATCH: 3, STABLE: 4 };
        const tierDiff = (tierOrder[a.prdResult.tier] ?? 5) - (tierOrder[b.prdResult.tier] ?? 5);
        if (tierDiff !== 0) return tierDiff;
        return b.contactDays - a.contactDays;
      });

      setActionItems(enriched);
    }
    loadActions();
  }, []);

  // Search handler
  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    const sailors = await SideCarAdapter.getSailors();
    const lower = q.toLowerCase();
    const matched = sailors.filter(s =>
      s.lastName.toLowerCase().includes(lower) ||
      s.firstName.toLowerCase().includes(lower) ||
      s.rate.toLowerCase().includes(lower) ||
      s.command.toLowerCase().includes(lower) ||
      s.id.includes(q)
    );
    setResults(matched);
    setShowResults(true);
  }, []);

  // Hover card
  const handleMouseEnter = (sailor: ISailor, e: React.MouseEvent) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setHoverPos({ x: rect.right + 12, y: rect.top });
    setHoveredSailor(sailor);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setHoveredSailor(null), 200);
  };

  // Close results on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getPrdClass = (tier: string) => `prd-badge prd-badge--${tier.toLowerCase()}`;

  const getContactClass = (days: number) => {
    if (days > 60) return 'contact--critical';
    if (days > 30) return 'contact--stale';
    if (days > 14) return 'contact--aging';
    return 'contact--healthy';
  };

  const getPipelineLabel = (stage: string) => {
    return PIPELINE_STAGES.find(p => p.key === stage)?.label || '—';
  };

  return (
    <div className="landing">
      {/* Corner Brackets */}
      <div className="corner corner--tl" /><div className="corner corner--tr" />
      <div className="corner corner--bl" /><div className="corner corner--br" />

      {/* Version tag */}
      <div className="version-tag">SIDECAR v1.0</div>

      {/* Main centered content */}
      <main className="landing__center">
        {/* Brand */}
        <motion.div
          className="brand"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="brand__logotype">
            SIDE<span className="brand__bracket">[</span><span className="brand__car">CAR</span><span className="brand__bracket">]</span>
          </h1>
        </motion.div>

        {/* Intelligence Bar */}
        <motion.div
          className="intel-bar"
          ref={searchRef}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Role Selector */}
          <div className="role-selector">
            <button
              className="role-selector__button"
              onClick={() => setRoleOpen(!roleOpen)}
              aria-expanded={roleOpen}
            >
              {role}
              <svg className="role-selector__chevron" width="10" height="6" viewBox="0 0 10 6">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </button>
            <AnimatePresence>
              {roleOpen && (
                <motion.div
                  className="role-selector__dropdown"
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  <button
                    className={`role-selector__option ${role === 'Detailer' ? 'role-selector__option--active' : ''}`}
                    onClick={() => { setRole('Detailer'); setRoleOpen(false); }}
                  >
                    <div className="role-selector__option-text">
                      <span>Detailer</span>
                      <span className="role-selector__option-desc">Rank sailors by PRD urgency</span>
                    </div>
                  </button>
                  <button
                    className={`role-selector__option ${role === 'Placement' ? 'role-selector__option--active' : ''}`}
                    onClick={() => { setRole('Placement'); setRoleOpen(false); }}
                  >
                    <div className="role-selector__option-text">
                      <span>Placement</span>
                      <span className="role-selector__option-desc">Rank commands by manning risk</span>
                    </div>
                  </button>
                  <button
                    className="role-selector__option"
                    onClick={() => { setRoleOpen(false); navigate('/advanced-search'); }}
                  >
                    <div className="role-selector__option-text">
                      <span>Advanced Search</span>
                      <span className="role-selector__option-desc">Build custom SQL-like data queries</span>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Input */}
          <input
            className="intel-bar__input"
            type="text"
            placeholder={role === 'Detailer'
              ? 'Search sailors, billets, commands...'
              : 'Search commands, billets, manning...'}
            value={query}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
          />

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && results.length > 0 && (
              <motion.div
                className="search-results"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="search-results__header">
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </div>
                {results.map(s => {
                  const prd = computePRDTier(s);
                  return (
                    <div
                      key={s.id}
                      className="search-results__item"
                      onMouseEnter={(e) => handleMouseEnter(s, e)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => { /* navigate to personnel page */ }}
                    >
                      <span className={getPrdClass(prd.tier)}>{prd.tier}</span>
                      <span className="search-results__name">
                        {s.lastName}, {s.firstName}
                      </span>
                      <span className="search-results__meta">
                        {s.rate} {s.payGrade}
                      </span>
                      <span className="search-results__command">{s.command}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>



        {/* Smart Pill — Workspace Summary */}
        <motion.div
          className="smart-pill"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="smart-pill__content">
            <span className="smart-pill__label">
              {role === 'Detailer' ? 'Workspace Summary' : 'Command Summary'}
            </span>
            <span className="smart-pill__count">
              {notificationCount} priority items
            </span>
          </div>
          <Link className="smart-pill__link" to="/workspace">
            Enter {role === 'Detailer' ? 'Workspace' : 'Command'} →
          </Link>
        </motion.div>

        {/* Action Queue — priority work items */}
        <motion.section
          className="action-queue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="action-queue__header">
            <h2 className="action-queue__title">Action Queue</h2>
            <span className="action-queue__count">{actionItems.length} sailors in portfolio</span>
          </div>

          <div className="action-queue__list">
            {actionItems.map((item, index) => (
              <motion.div
                key={item.sailor.id}
                className={`action-card ${item.prdResult.tier === 'EXPIRED' || item.prdResult.tier === 'CRITICAL' ? 'action-card--urgent' : ''}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + index * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={(e) => handleMouseEnter(item.sailor, e)}
                onMouseLeave={handleMouseLeave}
              >
                {/* PRD Badge */}
                <span className={getPrdClass(item.prdResult.tier)}>
                  {item.prdResult.tier === 'EXPIRED' ? 'EXP' : item.prdResult.label}
                </span>

                {/* Sailor Identity */}
                <div className="action-card__identity">
                  <span className="action-card__name">
                    {item.sailor.lastName}, {item.sailor.firstName}
                  </span>
                  <span className="action-card__rate">{item.sailor.rate} {item.sailor.payGrade}</span>
                </div>

                {/* Command */}
                <span className="action-card__command">{item.sailor.command}</span>

                {/* Contact staleness */}
                <span className={`action-card__contact ${getContactClass(item.contactDays)}`}>
                  {item.contactDays}d
                </span>

                {/* Pipeline stage */}
                <span className="action-card__pipeline">
                  {item.orderStatus ? getPipelineLabel(item.orderStatus.currentStage) : '—'}
                </span>

                {/* Alert dot */}
                {item.notifications.length > 0 && (
                  <span className="action-card__alert" title={`${item.notifications.length} alert(s)`}>
                    {item.notifications.length}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Hover Card */}
      <AnimatePresence>
        {hoveredSailor && (
          <motion.div
            className="hover-card"
            style={{ top: hoverPos.y, left: Math.min(hoverPos.x, window.innerWidth - 320) }}
            initial={{ opacity: 0, x: -8, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            onMouseEnter={() => hoverTimeout.current && clearTimeout(hoverTimeout.current)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="hover-card__header">
              <span className={getPrdClass(computePRDTier(hoveredSailor).tier)}>
                {computePRDTier(hoveredSailor).tier}
              </span>
              <h3 className="hover-card__name">
                {hoveredSailor.lastName}, {hoveredSailor.firstName}
              </h3>
            </div>
            <div className="hover-card__grid">
              <div className="hover-card__field">
                <span className="hover-card__label">Rate/Grade</span>
                <span className="hover-card__value">{hoveredSailor.rate} {hoveredSailor.payGrade}</span>
              </div>
              <div className="hover-card__field">
                <span className="hover-card__label">Command</span>
                <span className="hover-card__value">{hoveredSailor.command}</span>
              </div>
              <div className="hover-card__field">
                <span className="hover-card__label">PRD</span>
                <span className="hover-card__value hover-card__value--data">{hoveredSailor.prd}</span>
              </div>
              <div className="hover-card__field">
                <span className="hover-card__label">EAOS</span>
                <span className="hover-card__value hover-card__value--data">{hoveredSailor.eaos}</span>
              </div>
              <div className="hover-card__field">
                <span className="hover-card__label">Last Contact</span>
                <span className={`hover-card__value hover-card__value--data ${getContactClass(daysSinceContact(hoveredSailor))}`}>
                  {hoveredSailor.lastContact} ({daysSinceContact(hoveredSailor)}d ago)
                </span>
              </div>
              <div className="hover-card__field">
                <span className="hover-card__label">Billet</span>
                <span className="hover-card__value">{hoveredSailor.billet}</span>
              </div>
            </div>
            <div className="hover-card__footer">
              Click to open record →
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
