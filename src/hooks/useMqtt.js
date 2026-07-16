import { useState, useCallback, useRef, useEffect } from 'react';
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

export function useMqtt() {
  const [status,      setStatus]      = useState('disconnected');
  const [demoMode,    setDemoMode]    = useState(false);
  const [patients,    setPatients]    = useState({});
  const [selectedId,  setSelectedId]  = useState(null);

  const clientRef    = useRef(null);
  const demoTimerRef = useRef(null);
  const demoPingRef  = useRef(0);

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
    
    // PERBAIKAN: Bersihkan prefix ws:// atau wss:// jika user mengetiknya di Halaman Pengaturan
    const cleanHost = host.replace(/^wss?:\/\//, '');
    const url   = `ws://${cleanHost}:${port}/mqtt`;
    
    const cid   = `mediot-${Math.random().toString(16).slice(2, 8)}`;
    setStatus('connecting');

    const { default: mqtt } = await import('mqtt');
    const client = mqtt.connect(url, { clientId: cid, clean: true, reconnectPeriod: 5000, connectTimeout: 10000 });
    
    client.on('connect', () => { 
      setStatus('connected'); 
      client.subscribe(topic, { qos: 1 });
      console.log(`[MQTT SUKSES] Terhubung ke ${url} & subscribe topik: ${topic}`);
    });
    
    client.on('message', (_t, payload) => { 
      try { 
        const parsed = JSON.parse(payload.toString());
        pushData(parsed); 
      } catch (e) {
        console.error("[MQTT ERROR] Gagal parse JSON:", e);
      } 
    });
    
    client.on('reconnect',  () => setStatus('connecting'));
    client.on('disconnect', () => setStatus('disconnected'));
    client.on('error',      (err) => { setStatus('error'); console.error("[MQTT ERROR]:", err); });
    client.on('close',      () => setStatus('disconnected'));
    clientRef.current = client;
  }, [pushData]);

  // ── PERBAIKAN KRITIS: Auto-Connect saat halaman dibuka ────────
  useEffect(() => {
    connect();
    
    // Cleanup: Putuskan koneksi saat pengguna menutup atau pindah halaman web
    return () => {
      if (clientRef.current) {
        try { clientRef.current.end(true); } catch (_) {}
      }
      if (demoTimerRef.current) {
        clearInterval(demoTimerRef.current);
      }
    };
  }, [connect]);

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
      DEMO_PATIENTS.forEach((pid, i) => {
        if (_demoTick % 1 === 0 || i === 0) {
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