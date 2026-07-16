import { useState } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { API_CONFIG } from '../config';
import { getStatusBadge, formatDateTime, isAlert } from '../utils/vitals';
import { exportCSV } from '../utils/exportCSV';
import { toast } from '../components/ToastManager';

const VITAL_COLORS = { bpm: '#f87171', spo2: '#60a5fa', suhu: '#fb923c' };

// ── Icons ──────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

// ── Stat Card ──────────────────────────────────────────────────
const StatCard = ({ label, value, unit, color, icon }) => (
  <div className="glass-card" style={{ padding: '16px 18px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.4)' }}>{label}</span>
      <span style={{ fontSize: '16px' }}>{icon}</span>
    </div>
    <div className="mono" style={{ fontSize: '28px', fontWeight: 800, color: color || '#f1f5f9', letterSpacing: '-0.5px', lineHeight: 1 }}>
      {value ?? '–'}
    </div>
    {unit && <div style={{ fontSize: '11px', color: 'rgba(148,163,184,0.3)', marginTop: '3px' }}>{unit}</div>}
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

// ── Custom Chart Tooltip ───────────────────────────────────────
const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10,22,40,0.95)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '10px', padding: '10px 14px', fontSize: '11px', backdropFilter: 'blur(16px)',
    }}>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.stroke, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, marginBottom: '2px' }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

// ── Quick Filter Buttons ───────────────────────────────────────
const QUICK_LIMITS = [10, 25, 50, 100, 200];

export default function HistoryDashboard() {
  const [patientId, setPatientId] = useState('P-001');
  const [limit, setLimit]         = useState(50);
  const [data, setData]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [fetched, setFetched]     = useState(false);

  const apiBase = localStorage.getItem('api_base') || API_CONFIG.baseURL;

  async function fetchHistory() {
    if (!patientId.trim()) return;
    setLoading(true); setError(null); setFetched(false);
    try {
      const url = `${apiBase}${API_CONFIG.historyEndpoint}/${encodeURIComponent(patientId.trim())}?limit=${limit}`;
      const res = await axios.get(url, { timeout: 10000 });
      const rows = Array.isArray(res.data) ? res.data : [];
      setData(rows);
      setFetched(true);
      toast.success(`${rows.length} data berhasil dimuat untuk ${patientId.trim()}`);
    } catch (e) {
      const msg = e.response?.data?.detail || e.message || 'Gagal mengambil data.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    if (!data.length) return;
    const filename = `riwayat_${patientId.trim()}_${new Date().toISOString().slice(0,10)}.csv`;
    exportCSV(data, filename);
    toast.success(`CSV berhasil diunduh: ${filename}`);
  }

  const avg = key => data.length
    ? (data.reduce((s, d) => s + (Number(d[key]) || 0), 0) / data.length).toFixed(1)
    : null;

  const chartData = data.map((d, i) => ({ ...d, _i: i }));

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-[28px_28px_40px] flex flex-col gap-[18px] relative">
      <div className="mesh-bg" />

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '5px', color: '#f1f5f9' }}>
          Riwayat Vital Signs
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <code style={{ fontSize: '11px', color: 'rgba(139,92,246,0.8)', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '6px', padding: '2px 8px', fontFamily: 'JetBrains Mono, monospace' }}>
            GET /api/v1/history/{'{id_pasien}'}
          </code>
        </div>
      </div>

      {/* ── Search Form ────────────────────────────────────── */}
      <div className="glass-card" style={{ padding: '20px 22px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 180px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.45)', marginBottom: '7px' }}>
              ID Pasien
            </label>
            <input
              id="input-patient-id"
              className="input-glass"
              placeholder="Contoh: P-001"
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchHistory()}
            />
          </div>

          {/* Quick limit buttons */}
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.45)', marginBottom: '7px' }}>
              Limit Data
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {QUICK_LIMITS.map(n => (
                <button
                  key={n}
                  onClick={() => setLimit(n)}
                  style={{
                    padding: '7px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                    border: `1px solid ${limit === n ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    background: limit === n ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
                    color: limit === n ? '#60a5fa' : 'rgba(148,163,184,0.5)',
                    cursor: 'pointer', transition: 'all 0.15s',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            id="btn-fetch-history"
            className="btn-gradient"
            onClick={fetchHistory}
            disabled={loading}
            style={{ height: '42px', minWidth: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}
          >
            {loading ? (
              <><div className="anim-spin" style={{ width: 13, height: 13, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />Mengambil…</>
            ) : (
              <><SearchIcon />Ambil Data</>
            )}
          </button>
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────────── */}
      {error && (
        <div className="anim-fade-up" style={{
          padding: '14px 18px', background: 'rgba(239,68,68,0.07)',
          border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px',
          color: '#fca5a5', fontSize: '13px', position: 'relative', zIndex: 1,
        }}>❌ {error}</div>
      )}

      {/* ── Results ────────────────────────────────────────── */}
      {fetched && !error && (
        <>
          {/* Stats */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <SectionLabel>Statistik — {patientId}</SectionLabel>
            <div className="res-grid-4 gap-3 mt-[10px]">
              <StatCard label="Total Data" value={data.length}   unit="record" color="#60a5fa" icon="📊" />
              <StatCard label="Avg BPM"    value={avg('bpm')}    unit="bpm"    color="#f87171" icon="❤️" />
              <StatCard label="Avg SpO₂"   value={avg('spo2')}   unit="%"      color="#60a5fa" icon="🫁" />
              <StatCard label="Avg Suhu"   value={avg('suhu')}   unit="°C"     color="#fb923c" icon="🌡️" />
            </div>
          </div>

          {data.length > 0 ? (
            <>
              {/* Chart */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <SectionLabel>Grafik Riwayat</SectionLabel>
                <div className="glass-card" style={{ padding: '18px 16px 12px', marginTop: '10px' }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                      <XAxis
                        dataKey="_i"
                        tickFormatter={i => { const d = chartData[i]; return d ? formatDateTime(d.waktu).slice(0,5) : ''; }}
                        tick={{ fontSize: 9, fill: 'rgba(148,163,184,0.35)', fontFamily: 'JetBrains Mono' }}
                        tickLine={false} axisLine={false}
                        interval={Math.max(1, Math.floor(data.length / 8))}
                      />
                      <YAxis tick={{ fontSize: 9, fill: 'rgba(148,163,184,0.35)', fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: 'rgba(148,163,184,0.55)' }} />
                      <Line type="monotone" dataKey="bpm"  stroke={VITAL_COLORS.bpm}  strokeWidth={1.5} dot={false} name="BPM"  activeDot={{ r: 3 }} />
                      <Line type="monotone" dataKey="spo2" stroke={VITAL_COLORS.spo2} strokeWidth={1.5} dot={false} name="SpO₂" activeDot={{ r: 3 }} />
                      <Line type="monotone" dataKey="suhu" stroke={VITAL_COLORS.suhu} strokeWidth={1.5} dot={false} name="Suhu" activeDot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Table */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <SectionLabel
                  right={
                    <button
                      id="btn-export-csv"
                      className="btn-ghost"
                      onClick={handleExport}
                      style={{ fontSize: '11px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
                    >
                      <DownloadIcon />
                      Export CSV
                    </button>
                  }
                >
                  Tabel Riwayat
                </SectionLabel>

                <div className="glass-card mt-[10px] overflow-x-auto">
                  <div className="min-w-[550px]">
                    {/* Header */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: '48px 1fr 90px 80px 90px 100px',
                      padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '8px',
                    }}>
                    {['#','Waktu','BPM','SpO₂','Suhu','Status'].map(h => (
                      <span key={h} style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.3)' }}>{h}</span>
                    ))}
                  </div>

                  {/* Body */}
                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {data.map((row, i) => {
                      const rowAlert = isAlert(row);
                      const bd = getStatusBadge(row.status_alat);
                      return (
                        <div
                          key={i}
                          style={{
                            display: 'grid', gridTemplateColumns: '48px 1fr 90px 80px 90px 100px',
                            padding: '9px 20px', gap: '8px',
                            borderBottom: '1px solid rgba(255,255,255,0.025)',
                            background: rowAlert ? 'rgba(239,68,68,0.04)' : 'transparent',
                            alignItems: 'center', transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = rowAlert ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = rowAlert ? 'rgba(239,68,68,0.04)' : 'transparent'}
                        >
                          <span className="mono" style={{ fontSize: '11px', color: 'rgba(148,163,184,0.25)' }}>{i + 1}</span>
                          <span style={{ fontSize: '12px', color: 'rgba(148,163,184,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatDateTime(row.waktu)}</span>
                          <span className="mono" style={{ fontSize: '13px', fontWeight: 700, color: VITAL_COLORS.bpm }}>{row.bpm}</span>
                          <span className="mono" style={{ fontSize: '13px', fontWeight: 700, color: VITAL_COLORS.spo2 }}>{row.spo2}%</span>
                          <span className="mono" style={{ fontSize: '13px', fontWeight: 700, color: VITAL_COLORS.suhu }}>{row.suhu}</span>
                          <span><span className={`badge ${bd.cls}`}>{bd.label}</span></span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Footer */}
                  <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(148,163,184,0.3)' }}>
                      Menampilkan {data.length} record
                    </span>
                    <button
                      className="btn-ghost"
                      onClick={handleExport}
                      style={{ fontSize: '11px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <DownloadIcon /> Download CSV
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(148,163,184,0.35)' }}>
                Tidak ada data untuk <span style={{ color: '#60a5fa' }}>{patientId}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Empty State ────────────────────────────────────── */}
      {!fetched && !loading && !error && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '14px', paddingTop: '60px', position: 'relative', zIndex: 1,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '20px',
            background: 'rgba(139,92,246,0.08)',
            border: '1px solid rgba(139,92,246,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', animation: 'float 3s ease-in-out infinite',
          }}>📋</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(148,163,184,0.4)', marginBottom: '6px' }}>Belum ada data</div>
            <div style={{ fontSize: '13px', color: 'rgba(148,163,184,0.25)' }}>
              Masukkan ID pasien dan klik <span style={{ color: '#60a5fa', fontWeight: 600 }}>Ambil Data</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
