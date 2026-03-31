import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SideCarAdapter } from '../services/SideCarAdapter';
import { computePRDTier, daysSinceContact } from '../services/PrdEngine';
import type { ISailor, IOrderStatus } from '../models/ISailor';
import { PIPELINE_STAGES } from '../services/SyntheticData';
import Topbar from '../components/Topbar';
import './Analytics.css';

export default function Analytics() {
  const [sailors, setSailors] = useState<ISailor[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<IOrderStatus[]>([]);

  useEffect(() => {
    async function load() {
      const s = await SideCarAdapter.getSailors();
      setSailors(s);
      const os = await SideCarAdapter.getAllOrderStatuses();
      setOrderStatuses(os);
    }
    load();
  }, []);

  // PRD Distribution
  const prdDist = { EXPIRED: 0, CRITICAL: 0, URGENT: 0, WATCH: 0, STABLE: 0 };
  sailors.forEach(s => { prdDist[computePRDTier(s).tier]++; });

  // Contact Health
  const contactDist = { healthy: 0, aging: 0, stale: 0, critical: 0 };
  sailors.forEach(s => {
    const d = daysSinceContact(s);
    if (d > 60) contactDist.critical++;
    else if (d > 30) contactDist.stale++;
    else if (d > 14) contactDist.aging++;
    else contactDist.healthy++;
  });

  // Pipeline Distribution
  const pipelineDist: Record<string, number> = {};
  PIPELINE_STAGES.forEach(p => { pipelineDist[p.key] = 0; });
  orderStatuses.forEach(os => { pipelineDist[os.currentStage]++; });

  // Rate Mix
  const rateMix: Record<string, number> = {};
  sailors.forEach(s => { rateMix[s.rate] = (rateMix[s.rate] || 0) + 1; });

  const maxBar = Math.max(...Object.values(prdDist), 1);
  const maxContact = Math.max(...Object.values(contactDist), 1);
  const maxPipeline = Math.max(...Object.values(pipelineDist), 1);

  return (
    <div className="analytics-page">
      <Topbar />

      <main className="analytics-page__content">
        <h1 className="page-title">Portfolio Analytics</h1>

        {/* Summary Cards */}
        <div className="summary-row">
          <motion.div className="summary-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <span className="summary-card__value">{sailors.length}</span>
            <span className="summary-card__label">Total Sailors</span>
          </motion.div>
          <motion.div className="summary-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <span className="summary-card__value summary-card__value--alert">{prdDist.EXPIRED + prdDist.CRITICAL}</span>
            <span className="summary-card__label">Require Action</span>
          </motion.div>
          <motion.div className="summary-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="summary-card__value">{contactDist.stale + contactDist.critical}</span>
            <span className="summary-card__label">Stale Contacts</span>
          </motion.div>
          <motion.div className="summary-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <span className="summary-card__value">{orderStatuses.filter(o => o.blockers).length}</span>
            <span className="summary-card__label">Active Blockers</span>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {/* PRD Distribution */}
          <motion.div className="chart-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="section-title">PRD Distribution</h2>
            <div className="bar-chart">
              {Object.entries(prdDist).map(([tier, count]) => (
                <div key={tier} className="bar-row">
                  <span className={`bar-label prd-color--${tier.toLowerCase()}`}>{tier}</span>
                  <div className="bar-track">
                    <motion.div
                      className={`bar-fill bar-fill--${tier.toLowerCase()}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxBar) * 100}%` }}
                      transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className="bar-value">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Health */}
          <motion.div className="chart-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h2 className="section-title">Contact Health</h2>
            <div className="bar-chart">
              {Object.entries(contactDist).map(([status, count]) => (
                <div key={status} className="bar-row">
                  <span className={`bar-label contact-color--${status}`}>{status}</span>
                  <div className="bar-track">
                    <motion.div
                      className={`bar-fill bar-fill--contact-${status}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxContact) * 100}%` }}
                      transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className="bar-value">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pipeline */}
          <motion.div className="chart-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="section-title">Pipeline Stage Distribution</h2>
            <div className="bar-chart">
              {PIPELINE_STAGES.map(stage => (
                <div key={stage.key} className="bar-row">
                  <span className="bar-label">{stage.fullLabel}</span>
                  <div className="bar-track">
                    <motion.div
                      className="bar-fill bar-fill--pipeline"
                      initial={{ width: 0 }}
                      animate={{ width: `${(pipelineDist[stage.key] / maxPipeline) * 100}%` }}
                      transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className="bar-value">{pipelineDist[stage.key]}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Rate Mix */}
          <motion.div className="chart-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h2 className="section-title">Rate Mix</h2>
            <div className="rate-chips">
              {Object.entries(rateMix).map(([rate, count]) => (
                <div key={rate} className="rate-chip">
                  <span className="rate-chip__name">{rate}</span>
                  <span className="rate-chip__count">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
