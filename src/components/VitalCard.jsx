import { useRef } from 'react';

// ── Icons ─────────────────────────────────────
const HeartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const O2Icon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>
  </svg>
);
const TempIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
  </svg>
);
const TrendUpIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);

const VITAL_META = {
  bpm: {
    label: 'Heart Rate',
    unit: 'BPM',
    color: '#f87171',
    gradFrom: 'rgba(239,68,68,0.18)',
    gradTo: 'rgba(239,68,68,0)',
    borderColor: 'rgba(239,68,68,0.2)',
    icon: <HeartIcon />,
    normalRange: '60 – 100',
  },
  spo2: {
    label: 'SpO₂',
    unit: '%',
    color: '#60a5fa',
    gradFrom: 'rgba(59,130,246,0.18)',
    gradTo: 'rgba(59,130,246,0)',
    borderColor: 'rgba(59,130,246,0.2)',
    icon: <O2Icon />,
    normalRange: '≥ 95',
  },
  suhu: {
    label: 'Suhu Tubuh',
    unit: '°C',
    color: '#fb923c',
    gradFrom: 'rgba(249,115,22,0.18)',
    gradTo: 'rgba(249,115,22,0)',
    borderColor: 'rgba(249,115,22,0.2)',
    icon: <TempIcon />,
    normalRange: '36.0 – 38.0',
  },
};

/**
 * Premium vital metric card with glassmorphism, gradient accent, and alert animation.
 */
export default function VitalCard({ metricKey, value, alert, animKey }) {
  const meta = VITAL_META[metricKey];
  if (!meta) return null;

  return (
    <div
      key={animKey}
      className={alert ? 'alert-card' : 'glass-card'}
      style={{
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        position: 'relative',
        overflow: 'hidden',
        borderColor: alert ? undefined : meta.borderColor,
        animation: alert ? undefined : 'fade-up 0.4s ease both',
      }}
    >
      {/* Background gradient accent */}
      <div style={{
        position: 'absolute',
        bottom: 0, right: 0,
        width: '120px', height: '120px',
        background: `radial-gradient(circle at 100% 100%, ${meta.gradFrom}, ${meta.gradTo})`,
        pointerEvents: 'none',
        borderRadius: '50%',
        transform: 'translate(30%, 30%)',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <span className="metric-label">{meta.label}</span>
        <div style={{
          width: 30, height: 30, borderRadius: '8px',
          background: `${meta.color}18`,
          border: `1px solid ${meta.color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: meta.color, flexShrink: 0,
        }}>
          {meta.icon}
        </div>
      </div>

      {/* Value */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', marginBottom: '10px' }}>
        <span
          className="mono anim-number"
          style={{
            fontSize: '44px', fontWeight: 800,
            color: alert ? '#f87171' : meta.color,
            lineHeight: 1,
            letterSpacing: '-2px',
            textShadow: alert ? '0 0 20px rgba(239,68,68,0.5)' : `0 0 20px ${meta.color}30`,
          }}
        >
          {value ?? '–'}
        </span>
        <span style={{ fontSize: '13px', color: 'rgba(148,163,184,0.6)', marginBottom: '6px', fontWeight: 500 }}>
          {meta.unit}
        </span>
      </div>

      {/* Normal range */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', color: alert ? '#fca5a5' : 'rgba(148,163,184,0.45)', fontWeight: 500 }}>
          Normal: {meta.normalRange}
        </span>
        {alert && (
          <span style={{
            fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em',
            color: '#f87171', textTransform: 'uppercase',
            animation: 'blink-text 1s infinite',
          }}>
            ⚠ KRITIS
          </span>
        )}
      </div>
    </div>
  );
}

export { VITAL_META };
