import { useEffect, useRef } from 'react';
import { useMqtt } from '../hooks/useMqtt';
import VitalCard from '../components/VitalCard';
import LiveChart from '../components/LiveChart';
import MqttStatusBar from '../components/MqttStatusBar';
import GaugeChart from '../components/GaugeChart';
import AlertLog from '../components/AlertLog';
import { isAlert, getStatusBadge, formatDateTime } from '../utils/vitals';
import { ALERT_THRESHOLDS } from '../config';
import { toast } from '../components/ToastManager';

// ── Patient Avatar ─────────────────────────────────────────────
const PatientAvatar = ({ id }) => (
  <div style={{
    width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 800, fontSize: '14px', color: 'white',
    boxShadow: '0 3px 10px rgba(59,130,246,0.35)',
  }}>
    {id?.[0]?.toUpperCase() ?? 'P'}
  </div>
);

// ── Section Label ──────────────────────────────────────────────
const SectionLabel = ({ children, right }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
    <div className="section-title" style={{ whiteSpace: 'nowrap' }}>{children}</div>
    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
    {right}
  </div>
);

// ── Chart skeleton ─────────────────────────────────────────────
const ChartSkeleton = () => (
  <div className="glass-card" style={{ padding: '14px 14px 10px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
      <div className="skeleton" style={{ width: 80, height: 14 }} />
      <div className="skeleton" style={{ width: 36, height: 18 }} />
    </div>
    <div className="skeleton" style={{ width: '100%', height: 100, borderRadius: '8px' }} />
  </div>
);

// ── Gauge skeleton ─────────────────────────────────────────────
const GaugeSkeleton = () => (
  <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
    <div className="skeleton" style={{ width: 120, height: 80, borderRadius: '50% 50% 0 0' }} />
    <div className="skeleton" style={{ width: 60, height: 10 }} />
  </div>
);

export default function LiveDashboard() {
  const {
    status, latestData, history, reconnect,
    demoMode, toggleDemo,
    patients, patientIds, selectedId, setSelectedId,
  } = useMqtt();

  const alertActive = isAlert(latestData);
  const badge       = getStatusBadge(latestData?.status_alat);
  const spo2Alert   = latestData?.spo2 != null && latestData.spo2 < ALERT_THRESHOLDS.spo2Min;
  const suhuAlert   = latestData?.suhu != null && latestData.suhu > ALERT_THRESHOLDS.suhuMax;
  const errAlert    = latestData?.status_alat === 'ERROR';

  // ── Toast + browser notification on alert ─────────────────────
  const prevAlertRef = useRef(false);
  useEffect(() => {
    if (alertActive && !prevAlertRef.current) {
      const msg = [
        errAlert  ? 'Sensor ERROR!' : '',
        spo2Alert ? `SpO₂ ${latestData?.spo2}%` : '',
        suhuAlert ? `Suhu ${latestData?.suhu}°C` : '',
      ].filter(Boolean).join(' | ');

      toast.alert(`⚠ KRITIS [${latestData?.id_pasien}]: ${msg}`, { duration: 8000 });
      if (Notification.permission === 'granted') {
        new Notification('⚠ MedIoT – Kondisi Kritis!', { body: `${latestData?.id_pasien}: ${msg}`, icon: '/favicon.svg' });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(p => {
          if (p === 'granted') new Notification('⚠ MedIoT – Kondisi Kritis!', { body: `${latestData?.id_pasien}: ${msg}`, icon: '/favicon.svg' });
        });
      }
    }
    prevAlertRef.current = alertActive;
  }, [alertActive, latestData?.bpm]);

  useEffect(() => {
    if (demoMode) toast.info('🎮 Demo aktif — P-001 & P-002 simulasi berjalan');
  }, [demoMode]);

  return (
    <div style={{
      flex: 1, overflowY: 'auto', overflowX: 'hidden',
      padding: '24px 28px 36px',
      display: 'flex', flexDirection: 'column', gap: '16px',
      position: 'relative',
    }}>
      <div className="mesh-bg" />

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', position: 'relative', zIndex: 1 }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '4px', color: '#f1f5f9' }}>
            Live Monitor
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <code style={{ fontSize: '10px', color: 'rgba(6,182,212,0.8)', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: '6px', padding: '2px 8px', fontFamily: 'JetBrains Mono, monospace' }}>
              healthcare/patient/vitals
            </code>
            <span style={{ fontSize: '10px', color: 'rgba(148,163,184,0.3)' }}>· ws:9001</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn-ghost"
            onClick={toggleDemo}
            style={{
              fontSize: '12px', padding: '6px 13px',
              borderColor: demoMode ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.08)',
              color: demoMode ? '#a78bfa' : 'rgba(148,163,184,0.6)',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            {demoMode ? '⏹' : '▶'} {demoMode ? 'Stop Demo' : 'Demo Mode'}
          </button>
          <MqttStatusBar status={status} onReconnect={reconnect} />
        </div>
      </div>

      {/* ── Demo Banner ─────────────────────────────────────── */}
      {demoMode && (
        <div className="anim-fade-up" style={{
          padding: '10px 16px',
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', gap: '10px',
          position: 'relative', zIndex: 1,
        }}>
          <span style={{ fontSize: '14px' }}>🎮</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#a78bfa' }}>Demo Mode Aktif</span>
            <span style={{ fontSize: '11px', color: 'rgba(167,139,250,0.55)', marginLeft: '8px' }}>Data simulasi P-001 & P-002 berjalan real-time</span>
          </div>
          <button className="btn-ghost" onClick={toggleDemo} style={{ fontSize: '11px', padding: '4px 12px', borderColor: 'rgba(139,92,246,0.3)', color: '#a78bfa' }}>Stop</button>
        </div>
      )}

      {/* ── Alert Banner ─────────────────────────────────────── */}
      {alertActive && (
        <div className="anim-fade-up" style={{
          padding: '12px 16px', background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.4)', borderRadius: '12px',
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          boxShadow: '0 4px 20px rgba(239,68,68,0.15)', position: 'relative', zIndex: 1,
        }}>
          <div style={{ width: 30, height: 30, borderRadius: '9px', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#f87171', marginBottom: '3px', animation: 'blink-text 1.5s infinite' }}>⚠ KONDISI KRITIS — {latestData?.id_pasien}</div>
            <div style={{ fontSize: '12px', color: 'rgba(252,165,165,0.75)', lineHeight: 1.5 }}>
              {errAlert  && '🔴 Sensor ERROR. '}
              {spo2Alert && `🔵 SpO₂ ${latestData.spo2}% (min ${ALERT_THRESHOLDS.spo2Min}%). `}
              {suhuAlert && `🟠 Suhu ${latestData.suhu}°C (max ${ALERT_THRESHOLDS.suhuMax}°C). `}
            </div>
          </div>
        </div>
      )}

      {/* ── Patient Tabs ─────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SectionLabel>Pasien</SectionLabel>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
          {patientIds.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(148,163,184,0.35)', fontSize: '13px', padding: '10px 0' }}>
              <div className="anim-spin" style={{ width: 14, height: 14, border: '2px solid rgba(59,130,246,0.2)', borderTopColor: '#3b82f6', borderRadius: '50%' }} />
              {status === 'connected' ? 'Menunggu data pasien…' : 'Belum terhubung ke broker.'}
              {status === 'disconnected' && !demoMode && (
                <span onClick={toggleDemo} style={{ color: '#a78bfa', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}>
                  Coba Demo?
                </span>
              )}
            </div>
          ) : (
            patientIds.map(pid => {
              const pData   = patients[pid]?.latestData;
              const pAlert  = isAlert(pData);
              const isActive = pid === selectedId;
              return (
                <button
                  key={pid}
                  onClick={() => setSelectedId(pid)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '7px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${isActive ? (pAlert ? 'rgba(239,68,68,0.5)' : 'rgba(59,130,246,0.4)') : 'rgba(255,255,255,0.07)'}`,
                    background: isActive ? (pAlert ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)') : 'rgba(255,255,255,0.03)',
                    color: isActive ? (pAlert ? '#f87171' : '#60a5fa') : 'rgba(148,163,184,0.5)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif',
                    animation: pAlert && isActive ? 'pulse-red 1.8s ease-in-out infinite' : undefined,
                  }}
                >
                  <PatientAvatar id={pid} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{pid}</div>
                    {pData && (
                      <div className="mono" style={{ fontSize: '9px', color: 'rgba(148,163,184,0.4)', marginTop: '1px' }}>
                        {pData.bpm}bpm · {pData.spo2}% · {pData.suhu}°
                      </div>
                    )}
                  </div>
                  {pAlert && (
                    <span style={{ fontSize: '10px', animation: 'blink-text 1s infinite' }}>⚠</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Gauge Row ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SectionLabel>Gauge Vital Signs — {selectedId ?? '–'}</SectionLabel>
        <div className="glass-card" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0',
          padding: '20px 8px 14px',
          marginTop: '10px',
          alignItems: 'center',
        }}>
          {!latestData ? (
            <><GaugeSkeleton /><GaugeSkeleton /><GaugeSkeleton /></>
          ) : (
            <>
              <GaugeChart
                label="BPM" unit="bpm" value={latestData?.bpm}
                min={40} max={160} color="#f87171"
                dangerMin={60} dangerMax={100} size={150}
              />
              <GaugeChart
                label="SpO₂" unit="%" value={latestData?.spo2}
                min={85} max={100} color="#60a5fa"
                dangerMin={ALERT_THRESHOLDS.spo2Min} size={150}
              />
              <GaugeChart
                label="Suhu" unit="°C" value={latestData?.suhu}
                min={35} max={41} color="#fb923c"
                dangerMax={ALERT_THRESHOLDS.suhuMax} size={150}
              />
            </>
          )}
        </div>
      </div>

      {/* ── Vital Cards ──────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SectionLabel>Detail Tanda Vital</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '10px' }}>
          <VitalCard metricKey="bpm"  value={latestData?.bpm}  alert={errAlert}  animKey={latestData?.bpm} />
          <VitalCard metricKey="spo2" value={latestData?.spo2} alert={spo2Alert} animKey={latestData?.spo2} />
          <VitalCard metricKey="suhu" value={latestData?.suhu} alert={suhuAlert} animKey={latestData?.suhu} />
        </div>
      </div>

      {/* ── Charts ───────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <SectionLabel>
          Grafik Real-time
          <span style={{ fontSize: '10px', color: 'rgba(148,163,184,0.3)', marginLeft: '6px' }}>({history.length} titik · klik ⏸ untuk freeze)</span>
        </SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '10px' }}>
          {history.length === 0 ? (
            <><ChartSkeleton /><ChartSkeleton /><ChartSkeleton /></>
          ) : (
            <>
              <LiveChart data={history} dataKey="bpm" />
              <LiveChart data={history} dataKey="spo2" refLine={{ value: ALERT_THRESHOLDS.spo2Min, label: `Min ${ALERT_THRESHOLDS.spo2Min}%` }} />
              <LiveChart data={history} dataKey="suhu" refLine={{ value: ALERT_THRESHOLDS.suhuMax, label: `Max ${ALERT_THRESHOLDS.suhuMax}°C` }} />
            </>
          )}
        </div>
      </div>

      {/* ── Alert Log ────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AlertLog latestData={latestData} />
      </div>

      {/* ── Raw Payload ──────────────────────────────────────── */}
      {latestData && (
        <div className="glass-card anim-fade-up" style={{ padding: '14px 18px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="section-title">Raw MQTT Payload</span>
            <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.1em', color: '#34d399', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: '99px' }}>
              {demoMode ? 'DEMO' : 'LIVE'}
            </span>
          </div>
          <pre className="mono" style={{
            fontSize: '11px', color: '#86efac', background: 'rgba(0,0,0,0.3)',
            padding: '12px 14px', borderRadius: '8px', overflowX: 'auto',
            border: '1px solid rgba(16,185,129,0.07)', lineHeight: 1.7,
          }}>
            {JSON.stringify({ ...latestData, _ts: undefined }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
