import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SideCarAdapter } from '../services/SideCarAdapter';
import type { ISailor } from '../models/ISailor';
import { computePRDTier } from '../services/PrdEngine';
import './Topbar.css';

interface TopbarProps {
  showDataMode?: boolean;
}

export default function Topbar({ showDataMode = false }: TopbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISailor[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    const sailors = await SideCarAdapter.getSailors();
    // Multi-term AND search — matches sidecar-concept filterSailors logic
    const terms = q.trim().toLowerCase().split(/\s+/);
    const matched = sailors.filter(s => {
      const text = [s.lastName, s.firstName, s.rate, s.payGrade, s.command, s.uic].join(' ').toLowerCase();
      return terms.every(t => text.includes(t));
    });
    setResults(matched);
    setShowResults(true);
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (results.length > 0) {
        navigate(`/personnel/${results[0].id}`);
        setShowResults(false);
        setQuery('');
      } else {
        const urlIdMatch = query.trim();
        if (urlIdMatch.length > 0) navigate(`/personnel/${urlIdMatch}`);
      }
    }
  };

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

  return (
    <header className="topbar">
      <Link to="/" className="topbar__brand">
        SIDE<span className="topbar__bracket">[</span><span className="topbar__car">CAR</span><span className="topbar__bracket">]</span>
      </Link>

      {location.pathname !== '/' && location.pathname !== '/landing' && (
        <button className="topbar__back" onClick={() => navigate(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
      )}

      <div className="topbar__search" ref={searchRef}>
        <input
          className="topbar__search-input"
          type="text"
          placeholder="Global search (DOD ID, name, command)..."
          value={query}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onKeyDown={handleSearchKeyDown}
        />
        <AnimatePresence>
          {showResults && results.length > 0 && (
            <motion.div
              className="topbar__search-results"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="topbar__search-header">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
              {results.slice(0, 10).map(s => {
                const prd = computePRDTier(s);
                return (
                  <div
                    key={s.id}
                    className="topbar__search-item"
                    onClick={() => {
                      navigate(`/personnel/${s.id}`);
                      setShowResults(false);
                      setQuery('');
                    }}
                  >
                    <span className={getPrdClass(prd.tier)}>{prd.tier === 'EXPIRED' ? 'EXP' : prd.tier}</span>
                    <span className="topbar__search-name">{s.lastName}, {s.firstName}</span>
                    <span className="topbar__search-meta">{s.rate}</span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="topbar__right">
        {showDataMode && (
          <div className="topbar__meta">
            <span className="topbar__data-mode">SYNTH</span>
            <span className="topbar__user">PERS-401</span>
          </div>
        )}
      </div>
    </header>
  );
}
