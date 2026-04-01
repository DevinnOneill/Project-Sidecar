import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SideCarAdapter } from '../services/SideCarAdapter';
import { computePRDTier, daysSinceContact } from '../services/PrdEngine';
import type { ISailor } from '../models/ISailor';
import { AdvancedSearchPanel } from '../AdvancedSearch/AdvancedSearch';
import './Landing.css';

export default function Landing() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISailor[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hoveredSailor, setHoveredSailor] = useState<ISailor | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      // Do not hide results automatically on short queries so the Advanced Search button remains visible
      return;
    }
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

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (results.length > 0) {
        navigate(`/personnel/${results[0].id}`);
      }
    }
  };

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

  return (
    <motion.div 
      className="landing"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
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
          layoutId="global-search"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Search Input */}
          <input
            className="intel-bar__input"
            type="text"
            placeholder="Search sailors, billets, commands..."
            value={query}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => setShowResults(true)}
            onKeyDown={handleSearchKeyDown}
          />

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                className="search-results"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {results.length > 0 && (
                  <div className="search-results__header">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </div>
                )}
                {results.map(s => {
                  const prd = computePRDTier(s);
                  return (
                    <div
                      key={s.id}
                      className="search-results__item"
                      onMouseEnter={(e) => handleMouseEnter(s, e)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => { navigate(`/personnel/${s.id}`); }}
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
                
                <div 
                  className="search-results__advanced" 
                  onClick={() => { setShowAdvanced(true); setShowResults(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', fontWeight: 600, color: 'var(--color-gold)', cursor: 'pointer', borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-sunken)' }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🔍</span> Advanced Search...
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Advanced Search Embed */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 60, boxShadow: 'var(--shadow-xl)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
              >
                <AdvancedSearchPanel onClose={() => setShowAdvanced(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>



        {/* Hero Cards Navigation */}
        <AnimatePresence mode="wait">
          <motion.div
            className="hero-nav"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/workspace" className="hero-card">
              <span className="hero-card__icon">📊</span>
              <span className="hero-card__label">Detailer</span>
            </Link>
            <Link to="/command" className="hero-card">
              <span className="hero-card__icon">⚓</span>
              <span className="hero-card__label">Placement</span>
            </Link>
            <Link to="/analytics" className="hero-card">
              <span className="hero-card__icon">📈</span>
              <span className="hero-card__label">Executive View</span>
            </Link>
          </motion.div>
        </AnimatePresence>
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

    </motion.div>
  );
}
