import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SideCarAdapter } from '../services/SideCarAdapter';
import { computePRDTier, daysSinceContact } from '../services/PrdEngine';
import type { ISailor, ICommEntry } from '../models/ISailor';
import './PrepCard.css';

interface PrepCardProps {
  sailorId: string;
  onClose: () => void;
  onOpenRecord: (id: string) => void;
}

const COMM_ICONS: Record<string, string> = {
  phone: '📞',
  email: '📧',
  teams: '💬',
  note: '📋',
};

export default function PrepCard({ sailorId, onClose, onOpenRecord }: PrepCardProps) {
  const [sailor, setSailor] = useState<ISailor | null>(null);
  const [recentComms, setRecentComms] = useState<ICommEntry[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      const s = await SideCarAdapter.getSailor(sailorId);
      setSailor(s);
      const log = await SideCarAdapter.getCommLog(sailorId);
      setRecentComms(log.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3));
    }
    load();
  }, [sailorId]);

  const handleCopyBookingLink = async () => {
    const { url } = await SideCarAdapter.getBookingLink();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!sailor) return null;

  const prd = computePRDTier(sailor);
  const contactDays = daysSinceContact(sailor);

  return (
    <>
      <motion.div
        className="prepcard-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="prepcard"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="prepcard__header">
          <div>
            <span className="prepcard__subtitle">Appointment Prep</span>
            <h3 className="prepcard__name">{sailor.lastName}, {sailor.firstName}</h3>
            <span className="prepcard__meta">{sailor.rate} {sailor.payGrade} · {sailor.command}</span>
          </div>
          <button className="prepcard__close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="prepcard__body">
          {/* PRD Status */}
          <div className="prepcard__section">
            <span className="prepcard__section-label">PRD Status</span>
            <div className="prepcard__prd-row">
              <span className={`prd-badge prd-badge--${prd.tier.toLowerCase()}`}>{prd.tier}</span>
              <span className="prepcard__prd-detail">{prd.label} · {sailor.prd}</span>
            </div>
          </div>

          {/* Key Fields */}
          <div className="prepcard__grid">
            <div className="prepcard__field">
              <span className="prepcard__field-label">EAOS</span>
              <span className="prepcard__field-value">{sailor.eaos}</span>
            </div>
            <div className="prepcard__field">
              <span className="prepcard__field-label">Last Contact</span>
              <span className={`prepcard__field-value ${contactDays > 60 ? 'prepcard__field-value--warn' : ''}`}>
                {contactDays}d ago
              </span>
            </div>
            <div className="prepcard__field">
              <span className="prepcard__field-label">Billet</span>
              <span className="prepcard__field-value">{sailor.billet}</span>
            </div>
            <div className="prepcard__field">
              <span className="prepcard__field-label">UIC</span>
              <span className="prepcard__field-value">{sailor.uic}</span>
            </div>
          </div>

          {/* Recent Comms */}
          <div className="prepcard__section">
            <span className="prepcard__section-label">Recent Communications</span>
            {recentComms.length === 0 ? (
              <div className="prepcard__no-comms">No communication history</div>
            ) : (
              <div className="prepcard__comms">
                {recentComms.map((entry, i) => (
                  <div key={i} className="prepcard__comm">
                    <span className="prepcard__comm-icon">{COMM_ICONS[entry.type] || '📋'}</span>
                    <div className="prepcard__comm-body">
                      <span className="prepcard__comm-date">{entry.date}</span>
                      <span className="prepcard__comm-summary">{entry.summary}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="prepcard__actions">
          <button className="prepcard__btn prepcard__btn--primary" onClick={() => onOpenRecord(sailorId)}>
            Open Full Record
          </button>
          <button className="prepcard__btn" onClick={handleCopyBookingLink}>
            {copied ? '✓ Copied!' : '📅 Copy Booking Link'}
          </button>
        </div>
      </motion.div>
    </>
  );
}
