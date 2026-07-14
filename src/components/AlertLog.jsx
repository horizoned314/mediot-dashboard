import { useState, useEffect, useRef } from 'react';
import { isAlert } from '../utils/vitals';
import { ALERT_THRESHOLDS } from '../config';
import { formatTime } from '../utils/vitals';

const MAX_LOG = 30;

/**
 * AlertLog – tracks and displays a rolling history of alert events.
 * Props:
 *   latestData – current MQTT payload (from useMqtt)
 */
export default function AlertLog({ latestData }) {
  const [log, setLog]           = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const prevAlertRef            = useRef(false);
  const listRef                 = useRef(null);

  // Detect new alert events
  useEffect(() => {
    if (!latestData) return;
    const alertNow = isAlert(latestData);

    if (alertNow && !prevAlertRef.current) {
      const reasons = [];
      if (latestData.status_alat === 'ERROR') reasons.push('Sensor ERROR');
      if (latestData.spo2 != null && latestData.spo2 < ALERT_THRESHOLDS.spo2Min)
        reasons.push(`SpO₂ ${latestData.spo2}%`);
      if (latestData.suhu != null && latestData.suhu > ALERT_THRESHOLDS.suhuMax)
        reasons.push(`Suhu ${latestData.suhu}°C`);

      const entry = {
        id:        Date.now(),
        ts:        new Date(),
        patient:   latestData.id_pasien,
        reasons,
        bpm:       latestData.bpm,
        spo2:      latestData.spo2,
        suhu:      latestData.suhu,
      };

      setLog(prev => [entry, ...prev].slice(0, MAX_LOG));

      // Auto-expand when new alert
      setCollapsed(false);
    }
    prevAlertRef.current = alertNow;
  }, [latestData?.bpm, latestData?.spo2, latestData?.suhu, latestData?.status_alat]);

  // Auto-scroll to top (newest)
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [log.length]);

  return (
    <div className="glass-card" style={{ borderColor: log.length > 0 ? 'rgba(239,68,68,0.2)' : undefined }}>
      {/* Header */}
      <div
        onClick={() => setCollapsed(c => !c)}
        style={{
          padding: '12px 18px',
          display: 'flex', alignItems: 'center', gap: '10px',
          cursor: 'pointer',
          borderBottom: collapsed ? 'none' : '1px solid rgba(255,255,255,0.05)',
          userSelect: 'none',
        }}
      >
        <div style={{ fontSize: '14px' }}>🚨</div>
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: log.length > 0 ? '#f87171' : 'rgba(148,163,184,0.4)' }}>
          Alert Log
        </span>
        {log.length > 0 && (
          <span style={{
            fontSize: '10px', fontWeight: 800,
            background: 'rgba(239,68,68,0.15)', color: '#f87171',
            border: '1px solid rgba(239,68,68,0.3)',
            padding: '1px 7px', borderRadius: '99px',
          }}>
            {log.length}
          </span>
        )}
        <div style={{ marginLeft: 'auto', color: 'rgba(148,163,184,0.3)', fontSize: '12px', transition: 'transform 0.2s', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
          ▾
        </div>
      </div>

      {/* Log list */}
      {!collapsed && (
        <div ref={listRef} style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {log.length === 0 ? (
            <div style={{ padding: '16px 18px', fontSize: '12px', color: 'rgba(148,163,184,0.3)', textAlign: 'center' }}>
              Tidak ada alert — semua tanda vital normal ✓
            </div>
          ) : (
            log.map((entry, i) => (
              <div
                key={entry.id}
                className="anim-fade-in"
                style={{
                  padding: '9px 18px',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  background: i === 0 ? 'rgba(239,68,68,0.05)' : 'transparent',
                }}
              >
                {/* Dot */}
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#f87171', marginTop: '5px', flexShrink: 0,
                  boxShadow: i === 0 ? '0 0 6px #f87171' : 'none',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#f87171' }}>
                      {entry.patient}
                    </span>
                    <span className="mono" style={{ fontSize: '10px', color: 'rgba(148,163,184,0.35)' }}>
                      {formatTime(entry.ts)}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(252,165,165,0.7)', lineHeight: 1.4 }}>
                    {entry.reasons.join(' · ')}
                  </div>
                  <div className="mono" style={{ fontSize: '10px', color: 'rgba(148,163,184,0.3)', marginTop: '2px' }}>
                    BPM: {entry.bpm} · SpO₂: {entry.spo2}% · Suhu: {entry.suhu}°C
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
