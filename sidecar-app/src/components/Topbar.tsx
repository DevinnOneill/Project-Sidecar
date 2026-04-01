import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISailor[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      // Do not hide results automatically on short queries so the Advanced Search button remains visible
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

      <motion.div className="topbar__search" ref={searchRef} layoutId="global-search" transition={{ duration: 0.8, ease: "easeInOut" }}>
        <input
          className="topbar__search-input"
          type="text"
          placeholder="Global search (DOD ID, name, command)..."
          value={query}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleSearchKeyDown}
        />
        <AnimatePresence>
          {showResults && (
            <motion.div
              className="topbar__search-results"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {results.length > 0 && (
                <div className="topbar__search-header">
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </div>
              )}
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
              
              <div 
                className="topbar__search-advanced" 
                onClick={() => navigate('/advanced-search')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', fontWeight: 600, color: 'var(--color-gold)', cursor: 'pointer', borderTop: '1px solid var(--color-border-subtle)', background: 'var(--color-bg-sunken)' }}
              >
                <span style={{ fontSize: '1.2rem' }}>🔍</span> Advanced Search...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="topbar__right">
        <motion.div 
          className="topbar__nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Link to="/workspace" className="topbar__nav-link" title="Detailer">📊</Link>
          <Link to="/command" className="topbar__nav-link" title="Placement">⚓</Link>
          <Link to="/analytics" className="topbar__nav-link" title="Executive View">📈</Link>
        </motion.div>
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
