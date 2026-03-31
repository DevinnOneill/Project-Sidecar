import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SideCarAdapter } from '../services/SideCarAdapter';
import { computePRDTier } from '../services/PrdEngine';
import type { ISailor, ICommand as ICmd, IBillet } from '../models/ISailor';
import Topbar from '../components/Topbar';
import './Command.css';

export default function Command() {
  const [commands, setCommands] = useState<ICmd[]>([]);
  const [billets, setBillets] = useState<IBillet[]>([]);
  const [sailors, setSailors] = useState<ISailor[]>([]);
  const [selectedCmd, setSelectedCmd] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const cmds = await SideCarAdapter.getCommands();
      setCommands(cmds);
      const allBillets = await SideCarAdapter.getAllBillets();
      setBillets(allBillets);
      const allSailors = await SideCarAdapter.getSailors();
      setSailors(allSailors);
    }
    load();
  }, []);

  const cmdBillets = (cmdId: string) => billets.filter(b => b.commandId === cmdId);
  const cmdSailors = (cmdId: string) => sailors.filter(s => s.uic === cmdId);

  const manningPct = (cmdId: string) => {
    const total = cmdBillets(cmdId).length;
    const filled = cmdBillets(cmdId).filter(b => b.filled).length;
    return total > 0 ? Math.round((filled / total) * 100) : 0;
  };

  const getRiskClass = (pct: number) => {
    if (pct >= 90) return 'risk--low';
    if (pct >= 75) return 'risk--moderate';
    if (pct >= 50) return 'risk--elevated';
    return 'risk--critical';
  };

  const getPrdClass = (tier: string) => `prd-badge prd-badge--${tier.toLowerCase()}`;
  const selected = commands.find(c => c.id === selectedCmd);

  return (
    <div className="command-page">
      <Topbar />

      <main className="command-page__content">
        <h1 className="page-title">Command Overview</h1>

        {/* Command Cards */}
        <div className="command-grid">
          {commands.map((cmd, i) => {
            const pct = manningPct(cmd.id);
            return (
              <motion.div
                key={cmd.id}
                className={`command-card ${selectedCmd === cmd.id ? 'command-card--selected' : ''}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setSelectedCmd(selectedCmd === cmd.id ? null : cmd.id)}
              >
                <div className="command-card__header">
                  <h3 className="command-card__name">{cmd.name}</h3>
                  <span className={`command-card__type command-card__type--${cmd.type.toLowerCase()}`}>
                    {cmd.type}
                  </span>
                </div>
                <div className="command-card__meta">
                  <span>{cmd.homeport}</span>
                  <span>{cmd.billetCount} billets</span>
                </div>
                <div className="command-card__manning">
                  <div className="manning-bar">
                    <div className={`manning-bar__fill ${getRiskClass(pct)}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`manning-pct ${getRiskClass(pct)}`}>{pct}% manned</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selected && (
          <motion.section
            className="command-detail"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="section-title">{selected.name} — Billets & Personnel</h2>
            <div className="command-detail__grid">
              {/* Billets */}
              <div>
                <h3 className="subsection-title">Billets</h3>
                <table className="detail-table">
                  <thead>
                    <tr>
                      <th>Billet</th>
                      <th>Rate</th>
                      <th>Grade</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cmdBillets(selected.id).map(b => (
                      <tr key={b.id}>
                        <td className="detail-table__title">{b.title}</td>
                        <td className="detail-table__data">{b.rate}</td>
                        <td className="detail-table__data">{b.payGrade}</td>
                        <td>
                          <span className={`fill-status ${b.filled ? 'fill-status--filled' : 'fill-status--vacant'}`}>
                            {b.filled ? 'Filled' : 'Vacant'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Personnel */}
              <div>
                <h3 className="subsection-title">Assigned Personnel</h3>
                <div className="personnel-list">
                  {cmdSailors(selected.id).map(s => {
                    const prd = computePRDTier(s);
                    return (
                      <Link key={s.id} to={`/personnel/${s.id}`} className="personnel-item">
                        <span className={getPrdClass(prd.tier)}>{prd.tier === 'EXPIRED' ? 'EXP' : prd.label}</span>
                        <span className="personnel-item__name">{s.lastName}, {s.firstName}</span>
                        <span className="personnel-item__meta">{s.rate} {s.payGrade}</span>
                      </Link>
                    );
                  })}
                  {cmdSailors(selected.id).length === 0 && (
                    <div className="empty-state">No personnel assigned</div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
