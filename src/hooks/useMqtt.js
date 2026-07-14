import { useState, useCallback, useRef } from 'react';
import { CHART_WINDOW } from '../config';

// ── Demo data generator ────────────────────────────────────────
let _demoTick = 0;
const DEMO_PATIENTS = ['P-001', 'P-002'];

function generateDemoPayload(patientId, tick) {
  const offset = patientId === 'P-002' ? Math.PI : 0; // phase offset
  const bpm  = Math.round(72  + Math.sin(tick * 0.18 + offset) * 12 + (Math.random() - 0.5) * 4);
  const spo2 = Math.round(97  + Math.sin(tick * 0.09 + offset) * 2  + (Math.random() - 0.5) * 1);
  const suhu = parseFloat((36.8 + Math.sin(tick * 0.12 + offset) * 0.6 + (Math.random() - 0.5) * 0.2).toFixed(2));
  const spike = (tick % 40 === 0 && patientId === 'P-001');

  return {
    id_pasien:   patientId,
    waktu:       new Date().toISOString(),
    bpm:         spike ? 118 : Math.max(55, Math.min(130, bpm)),
    spo2:        spike ? 91  : Math.max(90, Math.min(100, spo2)),
    suhu:        spike ? 38.7 : Math.max(35.5, Math.min(40, suhu)),
    status_alat: 'OK',
    _ts:         Date.now(),
  };
}

/**
 * useMqtt – manages MQTT + demo mode with multi-patient tracking.
 *
 * Returns:
 *  status, reconnect, demoMode, toggleDemo
 *  patients: Map<id_pasien, { latestData, history }>
 *  patientIds: string[]            – sorted list of all seen patients
 *  selectedId: string | null       – currently viewed patient
 *  setSelectedId: fn
 *  latestData: object | null       – shortcut to selectedId's latest
 *  history: object[]               – shortcut to selectedId's history
 */
export function useMqtt() {
  const [status,      setStatus]      = useState('disconnected');
  const [demoMode,    setDemoMode]    = useState(false);
  // Map: id_pasien → { latestData, history }
  const [patients,    setPatients]    = useState({}); // plain object for React compat
  const [selectedId,  setSelectedId]  = useState(null);

  const clientRef    = useRef(null);
  const demoTimerRef = useRef(null);
  const demoPingRef  = useRef(0); // alternates between patients

  // ── Push one reading into the patients map ────────────────────
  const pushData = useCallback((data) => {
    const id       = data.id_pasien ?? 'UNKNOWN';
    const enriched = { ...data, _ts: data._ts || Date.now() };
    const WINDOW   = parseInt(localStorage.getItem('chart_window') || String(CHART_WINDOW), 10);

    setPatients(prev => {
      const entry  = prev[id] || { latestData: null, history: [] };
      const newHist = [...entry.history, enriched].slice(-WINDOW);
      return { ...prev, [id]: { latestData: enriched, history: newHist } };
    });

    // Auto-select first patient seen
    setSelectedId(prev => prev ?? id);
  }, []);

  // ── MQTT real connect ─────────────────────────────────────────
  const connect = useCallback(async () => {
    if (clientRef.current) {
      try { clientRef.current.end(true); } catch (_) {}
      clientRef.current = null;
    }
    const host  = localStorage.getItem('mqtt_host')  || 'localhost';
    const port  = localStorage.getItem('mqtt_port')  || '9001';
    const topic = localStorage.getItem('mqtt_topic') || 'healthcare/patient/vitals';
    const url   = `ws://${host}:${port}/mqtt`;
    const cid   = `mediot-${Math.random().toString(16).slice(2, 8)}`;
    setStatus('connecting');

    const { default: mqtt } = await import('mqtt');
    const client = mqtt.connect(url, { clientId: cid, clean: true, reconnectPeriod: 5000, connectTimeout: 10000 });
    client.on('connect',    () => { setStatus('connected'); client.subscribe(topic, { qos: 1 }); });
    client.on('message',    (_t, payload) => { try { pushData(JSON.parse(payload.toString())); } catch (_) {} });
    client.on('reconnect',  () => setStatus('connecting'));
    client.on('disconnect', () => setStatus('disconnected'));
    client.on('error',      () => setStatus('error'));
    client.on('close',      () => setStatus('disconnected'));
    clientRef.current = client;
  }, [pushData]);

  // ── Demo mode ─────────────────────────────────────────────────
  const startDemo = useCallback(() => {
    _demoTick = 0;
    demoPingRef.current = 0;
    setPatients({});
    setSelectedId(null);
    setStatus('connected');
    setDemoMode(true);

    demoTimerRef.current = setInterval(() => {
      _demoTick++;
      // Alternate between patients every tick (offset by half second via index)
      DEMO_PATIENTS.forEach((pid, i) => {
        if (_demoTick % 1 === 0 || i === 0) { // P-001 every tick, P-002 every 2 ticks
          if (i === 0 || _demoTick % 2 === 0) {
            pushData(generateDemoPayload(pid, _demoTick + i * 7));
          }
        }
      });
    }, 1000);
  }, [pushData]);

  const stopDemo = useCallback(() => {
    clearInterval(demoTimerRef.current);
    setDemoMode(false);
    setStatus('disconnected');
    setPatients({});
    setSelectedId(null);
  }, []);

  const toggleDemo = useCallback(() => {
    if (demoMode) stopDemo(); else startDemo();
  }, [demoMode, startDemo, stopDemo]);

  const reconnect = useCallback(() => {
    if (demoMode) stopDemo();
    connect();
  }, [demoMode, stopDemo, connect]);

  // ── Derived shortcuts for selected patient ────────────────────
  const selected    = selectedId ? (patients[selectedId] || null) : null;
  const latestData  = selected?.latestData || null;
  const history     = selected?.history    || [];
  const patientIds  = Object.keys(patients).sort();

  return {
    status, reconnect, demoMode, toggleDemo,
    patients, patientIds,
    selectedId, setSelectedId,
    latestData, history,
  };
}
