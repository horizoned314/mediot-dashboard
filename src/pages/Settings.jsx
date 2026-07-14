import { useState, useEffect } from 'react';
import { MQTT_CONFIG, API_CONFIG, CHART_WINDOW } from '../config';

// ── Section Label ──────────────────────────────
const SectionLabel = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
    <div className="section-title" style={{ whiteSpace: 'nowrap' }}>{children}</div>
    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
  </div>
);

// ── Field component ───────────────────────────
const Field = ({ id, label, hint, value, onChange, type = 'text', prefix }) => (
  <div>
    <label htmlFor={id} style={{
      display: 'block', fontSize: '11px', fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      color: 'rgba(148,163,184,0.45)', marginBottom: '7px',
    }}>
      {label}
    </label>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {prefix && (
        <span style={{
          position: 'absolute', left: '12px',
          fontSize: '12px', color: 'rgba(148,163,184,0.35)',
          fontFamily: 'JetBrains Mono, monospace',
          pointerEvents: 'none',
        }}>{prefix}</span>
      )}
      <input
        id={id}
        className="input-glass"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ paddingLeft: prefix ? '36px' : undefined }}
      />
    </div>
    {hint && (
      <div style={{ fontSize: '11px', color: 'rgba(148,163,184,0.3)', marginTop: '5px', lineHeight: 1.4 }}>
        {hint}
      </div>
    )}
  </div>
);

export default function Settings() {
  const [host,    setHost]    = useState('');
  const [port,    setPort]    = useState('');
  const [topic,   setTopic]   = useState('');
  const [apiBase, setApiBase] = useState('');
  const [window_, setWindow_] = useState('');
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    setHost(   localStorage.getItem('mqtt_host')    || MQTT_CONFIG.host);
    setPort(   localStorage.getItem('mqtt_port')    || String(MQTT_CONFIG.port));
    setTopic(  localStorage.getItem('mqtt_topic')   || MQTT_CONFIG.topic);
    setApiBase(localStorage.getItem('api_base')     || API_CONFIG.baseURL);
    setWindow_(localStorage.getItem('chart_window') || String(CHART_WINDOW));
  }, []);

  function save() {
    localStorage.setItem('mqtt_host',    host);
    localStorage.setItem('mqtt_port',    port);
    localStorage.setItem('mqtt_topic',   topic);
    localStorage.setItem('api_base',     apiBase);
    localStorage.setItem('chart_window', window_);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function reset() {
    localStorage.clear();
    setHost(   MQTT_CONFIG.host);
    setPort(   String(MQTT_CONFIG.port));
    setTopic(  MQTT_CONFIG.topic);
    setApiBase(API_CONFIG.baseURL);
    setWindow_(String(CHART_WINDOW));
  }

  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      padding: '28px 28px 40px',
      position: 'relative',
    }}>
      <div className="mesh-bg" />

      <div style={{ maxWidth: '620px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Header ─────────────────────────────── */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Pengaturan
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(148,163,184,0.45)', lineHeight: 1.5 }}>
            Konfigurasi koneksi MQTT broker dan REST API Tim B. Perubahan aktif setelah halaman di-refresh.
          </p>
        </div>

        {/* ── MQTT Section ─────────────────────── */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
          <SectionLabel>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ fontSize: '14px' }}>📡</span> MQTT Broker
            </span>
          </SectionLabel>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '12px' }}>
              <Field
                id="s-host"
                label="Host / IP Broker"
                hint="Hostname atau IP server Mosquitto"
                value={host}
                onChange={setHost}
                prefix="ws://"
              />
              <Field
                id="s-port"
                label="WebSocket Port"
                hint="Default: 9001"
                value={port}
                onChange={setPort}
                type="number"
              />
            </div>
            <Field
              id="s-topic"
              label="Subscribe Topic"
              hint="Topic MQTT yang di-subscribe — sesuai kontrak Tim C"
              value={topic}
              onChange={setTopic}
            />
            <Field
              id="s-win"
              label="Chart Window"
              hint="Jumlah titik data yang ditampilkan di grafik real-time"
              value={window_}
              onChange={setWindow_}
              type="number"
            />
          </div>

          {/* Preview */}
          <div style={{
            marginTop: '16px',
            padding: '12px 14px',
            background: 'rgba(6,182,212,0.05)',
            border: '1px solid rgba(6,182,212,0.12)',
            borderRadius: '10px',
            fontSize: '11px',
            fontFamily: 'JetBrains Mono, monospace',
            color: 'rgba(6,182,212,0.7)',
          }}>
            ws://{host}:{port}/mqtt → <span style={{ color: 'rgba(6,182,212,1)' }}>{topic}</span>
          </div>
        </div>

        {/* ── API Section ─────────────────────── */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <SectionLabel>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ fontSize: '14px' }}>🔌</span> REST API — Tim B
            </span>
          </SectionLabel>

          <Field
            id="s-api"
            label="Base URL FastAPI"
            hint="URL server FastAPI Tim B yang sudah berjalan"
            value={apiBase}
            onChange={setApiBase}
          />

          {/* Preview */}
          <div style={{
            marginTop: '14px',
            padding: '12px 14px',
            background: 'rgba(139,92,246,0.05)',
            border: '1px solid rgba(139,92,246,0.12)',
            borderRadius: '10px',
            fontSize: '11px',
            fontFamily: 'JetBrains Mono, monospace',
            color: 'rgba(139,92,246,0.7)',
          }}>
            GET <span style={{ color: 'rgba(139,92,246,1)' }}>{apiBase + '/api/v1/history/{id_pasien}?limit=50'}</span>
          </div>
        </div>

        {/* ── Actions ─────────────────────────── */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button id="btn-save-settings" className="btn-gradient" onClick={save} style={{ minWidth: '130px' }}>
            {saved ? '✓ Tersimpan!' : '💾 Simpan Pengaturan'}
          </button>
          <button id="btn-reset-settings" className="btn-ghost" onClick={reset}>
            Reset Default
          </button>
        </div>

        {/* ── Success Toast ────────────────────── */}
        {saved && (
          <div className="anim-fade-up" style={{
            marginTop: '16px',
            padding: '13px 18px',
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#34d399',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '16px' }}>✓</span>
            Pengaturan tersimpan. Kembali ke <strong>Live Monitor</strong> lalu tekan <strong>Reconnect</strong>.
          </div>
        )}

        {/* ── Info Box ─────────────────────────── */}
        <div style={{
          marginTop: '20px',
          padding: '16px 18px',
          background: 'rgba(59,130,246,0.05)',
          border: '1px solid rgba(59,130,246,0.1)',
          borderRadius: '12px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            ℹ Catatan Integrasi
          </div>
          <ul style={{ fontSize: '12px', color: 'rgba(148,163,184,0.5)', lineHeight: 1.7, paddingLeft: '16px' }}>
            <li>Mosquitto harus aktif di port <code style={{ color: '#60a5fa', fontFamily: 'JetBrains Mono' }}>9001</code> (WebSocket)</li>
            <li>FastAPI Tim B harus berjalan dan CORS diaktifkan</li>
            <li>Gunakan MQTTX untuk test publish data dummy</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
