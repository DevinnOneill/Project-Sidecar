import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SideCarAdapter } from '../services/SideCarAdapter';
import { computePRDTier, daysSinceContact } from '../services/PrdEngine';
import { PIPELINE_STAGES } from '../services/SyntheticData';
import type { ISailor, INotification, IOrderStatus, ICommEntry, IAppointment, IPrdResult } from '../models/ISailor';
import Topbar from '../components/Topbar';
import './Workspace.css';

type Tab = 'roster' | 'calendar' | 'actions';

interface EnrichedSailor {
  sailor: ISailor;
  prd: IPrdResult;
  contactDays: number;
  orderStatus: IOrderStatus | null;
}

export default function Workspace() {
  const [tab, setTab] = useState<Tab>('roster');
  const [sailors, setSailors] = useState<EnrichedSailor[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [selectedSailor, setSelectedSailor] = useState<ISailor | null>(null);
  const [commLog, setCommLog] = useState<ICommEntry[]>([]);
  const [commPanelOpen, setCommPanelOpen] = useState(false);
  const [sortKey, setSortKey] = useState<'prd' | 'name' | 'contact'>('prd');

  // Load data
  useEffect(() => {
    async function load() {
      const s = await SideCarAdapter.getSailors();
      const statuses = await SideCarAdapter.getAllOrderStatuses();
      const enriched = s.map(sailor => ({
        sailor,
        prd: computePRDTier(sailor),
        contactDays: daysSinceContact(sailor),
        orderStatus: statuses.find(o => o.sailorId === sailor.id) || null
      }));
      setSailors(enriched);

      const n = await SideCarAdapter.getNotifications();
      setNotifications(n);

      // Get this week's appointments
      const now = new Date();
      const dayOfWeek = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);
      const fmt = (d: Date) => d.toISOString().slice(0, 10);
      const appts = await SideCarAdapter.getAppointments({ start: fmt(monday), end: fmt(friday) });
      setAppointments(appts);
    }
    load();
  }, []);

  // Sort sailors
  const sorted = [...sailors].sort((a, b) => {
    if (sortKey === 'prd') {
      const order: Record<string, number> = { EXPIRED: 0, CRITICAL: 1, URGENT: 2, WATCH: 3, STABLE: 4 };
      return (order[a.prd.tier] ?? 5) - (order[b.prd.tier] ?? 5);
    }
    if (sortKey === 'name') return a.sailor.lastName.localeCompare(b.sailor.lastName);
    if (sortKey === 'contact') return b.contactDays - a.contactDays;
    return 0;
  });

  // Open comm panel
  const openCommPanel = async (sailor: ISailor) => {
    setSelectedSailor(sailor);
    const log = await SideCarAdapter.getCommLog(sailor.id);
    setCommLog(log.sort((a, b) => b.date.localeCompare(a.date)));
    setCommPanelOpen(true);
  };

  const getPrdClass = (tier: string) => `prd-badge prd-badge--${tier.toLowerCase()}`;
  const getContactClass = (days: number) => {
    if (days > 60) return 'contact--critical';
    if (days > 30) return 'contact--stale';
    if (days > 14) return 'contact--aging';
    return 'contact--healthy';
  };
  const getPipelineLabel = (stage: string) => PIPELINE_STAGES.find(p => p.key === stage)?.label || '—';

  // Group appointments by day
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const appointmentsByDay: Record<string, IAppointment[]> = {};
  appointments.forEach(a => {
    if (!appointmentsByDay[a.date]) appointmentsByDay[a.date] = [];
    appointmentsByDay[a.date].push(a);
  });
  const sortedDays = Object.keys(appointmentsByDay).sort();

  return (
    <div className="workspace">
      <Topbar showDataMode />

      {/* Tab Bar */}
      <div className="tab-bar">
        {(['roster', 'calendar', 'actions'] as Tab[]).map(t => (
          <button
            key={t}
            className={`tab-bar__tab ${tab === t ? 'tab-bar__tab--active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'roster' && `Roster (${sailors.length})`}
            {t === 'calendar' && `Calendar (${appointments.length})`}
            {t === 'actions' && `Actions (${notifications.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="workspace__content">
        {/* ROSTER TAB */}
        {tab === 'roster' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="roster">
            {/* Sort controls */}
            <div className="roster__controls">
              <span className="roster__sort-label">Sort by:</span>
              {(['prd', 'name', 'contact'] as const).map(k => (
                <button
                  key={k}
                  className={`roster__sort-btn ${sortKey === k ? 'roster__sort-btn--active' : ''}`}
                  onClick={() => setSortKey(k)}
                >
                  {k === 'prd' ? 'PRD Tier' : k === 'name' ? 'Name' : 'Contact'}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="roster__table-wrap">
              <table className="roster__table">
                <thead>
                  <tr>
                    <th>PRD</th>
                    <th>Name</th>
                    <th>Rate</th>
                    <th>Grade</th>
                    <th>Command</th>
                    <th>Billet</th>
                    <th>Contact</th>
                    <th>Pipeline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((item, i) => (
                    <motion.tr
                      key={item.sailor.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="roster__row"
                      onClick={() => openCommPanel(item.sailor)}
                    >
                      <td><span className={getPrdClass(item.prd.tier)}>{item.prd.tier === 'EXPIRED' ? 'EXP' : item.prd.label}</span></td>
                      <td className="roster__name">{item.sailor.lastName}, {item.sailor.firstName}</td>
                      <td className="roster__data">{item.sailor.rate}</td>
                      <td className="roster__data">{item.sailor.payGrade}</td>
                      <td className="roster__command">{item.sailor.command}</td>
                      <td className="roster__billet">{item.sailor.billet}</td>
                      <td><span className={`roster__contact ${getContactClass(item.contactDays)}`}>{item.contactDays}d</span></td>
                      <td><span className="roster__pipeline">{item.orderStatus ? getPipelineLabel(item.orderStatus.currentStage) : '—'}</span></td>
                      <td>
                        <div className="roster__actions">
                          <button className="roster__action-btn" title="Email" onClick={e => { e.stopPropagation(); }}>📧</button>
                          <button className="roster__action-btn" title="Call" onClick={e => { e.stopPropagation(); }}>📞</button>
                          <button className="roster__action-btn" title="Note" onClick={e => { e.stopPropagation(); }}>📋</button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* CALENDAR TAB */}
        {tab === 'calendar' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="calendar">
            <div className="calendar__week">
              {sortedDays.map((date, di) => (
                <div key={date} className="calendar__day">
                  <div className="calendar__day-header">
                    <span className="calendar__day-name">{dayNames[di] || date}</span>
                    <span className="calendar__day-date">{date}</span>
                  </div>
                  <div className="calendar__appointments">
                    {appointmentsByDay[date].map(apt => (
                      <div key={apt.id} className="calendar__apt" onClick={() => apt.sailor && openCommPanel({ ...apt.sailor, id: apt.sailorId, uic: '', billet: '', lastContact: '', detailer: '' } as ISailor)}>
                        <span className="calendar__apt-time">{apt.time}</span>
                        <span className="calendar__apt-type">
                          {apt.type === 'phone' ? '📞' : apt.type === 'video' ? '📹' : '🤝'}
                        </span>
                        <div className="calendar__apt-info">
                          <span className="calendar__apt-name">
                            {apt.sailor ? `${apt.sailor.lastName}, ${apt.sailor.firstName}` : 'Unknown'}
                          </span>
                          <span className="calendar__apt-reason">{apt.reason}</span>
                        </div>
                        <span className="calendar__apt-duration">{apt.duration}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ACTIONS TAB */}
        {tab === 'actions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="action-center">
            <h2 className="action-center__title">Action Center</h2>
            {notifications.length === 0 ? (
              <div className="action-center__empty">No pending notifications</div>
            ) : (
              <div className="action-center__list">
                {notifications.map((n, i) => (
                  <motion.div
                    key={n.id}
                    className={`notification notification--${n.type}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span className="notification__icon">{n.icon}</span>
                    <div className="notification__body">
                      <span className="notification__title">{n.title}</span>
                      <span className="notification__message">{n.message}</span>
                    </div>
                    <button
                      className="notification__dismiss"
                      onClick={async () => {
                        await SideCarAdapter.dismissNotification(n.id);
                        setNotifications(prev => prev.filter(x => x.id !== n.id));
                      }}
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Comm Panel Slide-out */}
      <AnimatePresence>
        {commPanelOpen && selectedSailor && (
          <>
            <motion.div
              className="comm-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommPanelOpen(false)}
            />
            <motion.aside
              className="comm-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="comm-panel__header">
                <div>
                  <span className={getPrdClass(computePRDTier(selectedSailor).tier)}>
                    {computePRDTier(selectedSailor).tier}
                  </span>
                  <h3 className="comm-panel__name">{selectedSailor.lastName}, {selectedSailor.firstName}</h3>
                  <span className="comm-panel__meta">{selectedSailor.rate} {selectedSailor.payGrade} · {selectedSailor.command}</span>
                </div>
                <button className="comm-panel__close" onClick={() => setCommPanelOpen(false)}>✕</button>
              </div>

              <div className="comm-panel__details">
                <div className="comm-panel__field">
                  <span className="comm-panel__label">PRD</span>
                  <span className="comm-panel__value">{selectedSailor.prd}</span>
                </div>
                <div className="comm-panel__field">
                  <span className="comm-panel__label">EAOS</span>
                  <span className="comm-panel__value">{selectedSailor.eaos}</span>
                </div>
                <div className="comm-panel__field">
                  <span className="comm-panel__label">Billet</span>
                  <span className="comm-panel__value">{selectedSailor.billet}</span>
                </div>
                <div className="comm-panel__field">
                  <span className="comm-panel__label">Last Contact</span>
                  <span className={`comm-panel__value ${getContactClass(daysSinceContact(selectedSailor))}`}>
                    {selectedSailor.lastContact} ({daysSinceContact(selectedSailor)}d ago)
                  </span>
                </div>
              </div>

              <div className="comm-panel__timeline-header">
                <h4>Communication Log</h4>
                <span className="comm-panel__count">{commLog.length} entries</span>
              </div>

              <div className="comm-panel__timeline">
                {commLog.map((entry, i) => (
                  <div key={i} className="comm-entry">
                    <span className="comm-entry__icon">
                      {entry.type === 'phone' ? '📞' : entry.type === 'email' ? '📧' : entry.type === 'teams' ? '💬' : '📋'}
                    </span>
                    <div className="comm-entry__body">
                      <span className="comm-entry__date">{entry.date}</span>
                      <span className="comm-entry__summary">{entry.summary}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link to={`/personnel/${selectedSailor.id}`} className="comm-panel__view-full">
                View Full Record →
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
