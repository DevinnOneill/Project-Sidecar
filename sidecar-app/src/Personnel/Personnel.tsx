import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SideCarAdapter } from '../services/SideCarAdapter';
import { computePRDTier, daysSinceContact } from '../services/PrdEngine';
import { PIPELINE_STAGES } from '../services/SyntheticData';
import type { ISailor, ICommEntry, IOrderStatus, IFormResponse } from '../models/ISailor';
import Topbar from '../components/Topbar';
import './Personnel.css';

export default function Personnel() {
  const { id } = useParams<{ id: string }>();
  const [sailor, setSailor] = useState<ISailor | null>(null);
  const [commLog, setCommLog] = useState<ICommEntry[]>([]);
  const [orderStatus, setOrderStatus] = useState<IOrderStatus | null>(null);
  const [formResponse, setFormResponse] = useState<IFormResponse | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const s = await SideCarAdapter.getSailor(id);
      if (!s) return;
      setSailor(s);
      const log = await SideCarAdapter.getCommLog(id);
      setCommLog(log.sort((a, b) => b.date.localeCompare(a.date)));
      const os = await SideCarAdapter.getOrderStatus(id);
      setOrderStatus(os);
      const fr = await SideCarAdapter.getFormResponses(id);
      setFormResponse(fr);
    }
    load();
  }, [id]);

  // Render radar chart when sailor loads
  useEffect(() => {
    if (!sailor || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const numPoints = 5;
    const angleStep = (Math.PI * 2) / numPoints;

    ctx.clearRect(0, 0, width, height);

    // Synthetic qualification scores
    const current = [78, 85, 62, 90, 70];
    const target = [85, 90, 80, 95, 85];

    // Draw grid
    ctx.strokeStyle = '#D4CFC7';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const r = (radius / 4) * i;
      ctx.beginPath();
      for (let j = 0; j < numPoints; j++) {
        const angle = (Math.PI / 2) - (j * angleStep);
        const x = centerX + r * Math.cos(angle);
        const y = centerY - r * Math.sin(angle);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Draw axes
    ctx.beginPath();
    for (let j = 0; j < numPoints; j++) {
      const angle = (Math.PI / 2) - (j * angleStep);
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + radius * Math.cos(angle), centerY - radius * Math.sin(angle));
    }
    ctx.stroke();

    // Draw labels
    const labels = ['Technical', 'Leadership', 'Quals', 'Evals', 'PRT'];
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#999';
    ctx.textAlign = 'center';
    for (let j = 0; j < numPoints; j++) {
      const angle = (Math.PI / 2) - (j * angleStep);
      const lx = centerX + (radius + 16) * Math.cos(angle);
      const ly = centerY - (radius + 16) * Math.sin(angle);
      ctx.fillText(labels[j], lx, ly + 4);
    }

    function drawPoly(data: number[], fillColor: string, strokeColor: string) {
      if (!ctx) return;
      ctx.beginPath();
      for (let j = 0; j < numPoints; j++) {
        const angle = (Math.PI / 2) - (j * angleStep);
        const r = radius * (data[j] / 100);
        const x = centerX + r * Math.cos(angle);
        const y = centerY - r * Math.sin(angle);
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    drawPoly(target, 'rgba(154, 122, 10, 0.1)', '#9A7A0A');
    drawPoly(current, 'rgba(26, 122, 62, 0.2)', '#1A7A3E');
  }, [sailor]);

  if (!sailor) {
    return (
      <div className="personnel">
        <Topbar />
        <div className="personnel__loading">Loading sailor record...</div>
      </div>
    );
  }

  const prd = computePRDTier(sailor);
  const cd = daysSinceContact(sailor);
  const getPrdClass = (tier: string) => `prd-badge prd-badge--${tier.toLowerCase()}`;
  const getContactClass = (days: number) => {
    if (days > 60) return 'contact--critical';
    if (days > 30) return 'contact--stale';
    if (days > 14) return 'contact--aging';
    return 'contact--healthy';
  };

  const currentStageIdx = orderStatus
    ? PIPELINE_STAGES.findIndex(p => p.key === orderStatus.currentStage)
    : -1;

  return (
    <div className="personnel">
      <Topbar />

      <main className="personnel__content">
        {/* Header Card */}
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
          </div>
        </motion.section>

        {/* Pipeline Stage */}
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
                <div key={stage.key} className={`pipeline__stage ${i <= currentStageIdx ? 'pipeline__stage--complete' : ''} ${i === currentStageIdx ? 'pipeline__stage--current' : ''}`}>
                  <div className="pipeline__dot" />
                  <span className="pipeline__label">{stage.fullLabel}</span>
                </div>
              ))}
            </div>
            {orderStatus.blockers && (
              <div className="pipeline__blocker">
                ⚠ Blocker: {orderStatus.blockers}
              </div>
            )}
          </motion.section>
        )}

        <div className="personnel__columns">
          {/* Left: Radar + Preferences */}
          <div className="personnel__left">
            {/* Pvol Radar Chart */}
            <motion.section
              className="card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="section-title">Competitiveness Profile</h2>
              <div className="radar-wrap">
                <canvas ref={canvasRef} width={280} height={280} className="radar-canvas" />
                <div className="radar-legend">
                  <span className="radar-legend__item"><span className="radar-legend__dot radar-legend__dot--current" /> Current</span>
                  <span className="radar-legend__item"><span className="radar-legend__dot radar-legend__dot--target" /> Target</span>
                </div>
              </div>
            </motion.section>

            {/* Preferences */}
            {formResponse && (
              <motion.section
                className="card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="section-title">Preferences Submitted</h2>
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
              </motion.section>
            )}
          </div>

          {/* Right: Comm Log */}
          <motion.div
            className="personnel__right"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="card">
              <div className="comm-header">
                <h2 className="section-title">Communication Log</h2>
                <span className="comm-count">{commLog.length} entries</span>
              </div>
              <div className="comm-timeline">
                {commLog.map((entry, i) => (
                  <div key={i} className="comm-item">
                    <span className="comm-item__icon">
                      {entry.type === 'phone' ? '📞' : entry.type === 'email' ? '📧' : entry.type === 'teams' ? '💬' : '📋'}
                    </span>
                    <div className="comm-item__body">
                      <span className="comm-item__date">{entry.date}</span>
                      <span className="comm-item__summary">{entry.summary}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
