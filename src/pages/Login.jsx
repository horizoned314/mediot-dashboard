import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../config';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uFocus, setUFocus] = useState(false);
  const [pFocus, setPFocus] = useState(false);

  // Allow scroll on login — body/html has overflow:hidden from main app
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    };
  }, []);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password.trim()) {
      setError('Harap isi Nomor ID Medis dan Kata Sandi.');
      return;
    }
    setLoading(true);
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_CONFIG.baseURL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      }).finally(() => clearTimeout(tid));
      if (!res.ok) throw new Error('invalid');
      const data = await res.json();
      const user = data.user || { username, full_name: username, role: 'Spesialis Medis' };
      localStorage.setItem('mediot_user', JSON.stringify(user));
      if (data.token) localStorage.setItem('mediot_token', data.token);
      navigate('/');
    } catch {
      setError('Koneksi gagal atau kredensial salah. Gunakan Coba Demo untuk akses instan tanpa server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCobaDemo = () => {
    localStorage.setItem('mediot_user', JSON.stringify({
      username: 'dr_demo',
      full_name: 'Dr. Budi Santoso',
      role: 'Dokter Spesialis ICU Jaga',
      isDemo: true,
    }));
    localStorage.setItem('mediot_token', 'demo-jwt-9988776655');
    navigate('/');
  };

  return (
    <>
      {/* ── Global styles scoped to login page ── */}
      <style>{`
        .lp-input { transition: border-color .18s, box-shadow .18s; }
        .lp-input:focus { outline: none; }
        .lp-btn-primary:hover { opacity: .92; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(59,130,246,.5) !important; }
        .lp-btn-primary:active { transform: translateY(0); }
        .lp-btn-demo:hover { background: rgba(6,182,212,.2) !important; border-color: rgba(6,182,212,.6) !important; }
        .lp-btn-demo:active { transform: scale(.98); }
        .lp-eye:hover { color: #94a3b8 !important; }
        @keyframes lp-ecg {
          0%   { stroke-dashoffset: 400; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes lp-fadein {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lp-card { animation: lp-fadein .45s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <div style={S.page}>
        {/* Ambient blobs */}
        <div style={{ ...S.blob, top: '5%', left: '10%', width: 560, height: 560, background: 'radial-gradient(circle, rgba(59,130,246,.14) 0%, transparent 65%)' }} />
        <div style={{ ...S.blob, bottom: '5%', right: '5%', width: 480, height: 480, background: 'radial-gradient(circle, rgba(6,182,212,.12) 0%, transparent 65%)' }} />

        {/* ── CARD ── */}
        <div className="lp-card" style={S.card}>

          {/* Gradient top accent line */}
          <div style={S.cardAccent} />

          {/* ── HEADER: Title + Logo ── */}
          <div style={S.headerRow}>
            <div style={{ flex: 1 }}>
              <div style={S.eyebrow}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#10b981', marginRight: 6, verticalAlign: 'middle', boxShadow: '0 0 8px #10b981' }} />
                Sistem Telemetri ICU
              </div>
              <h1 style={S.title}>
                MEDIOT<br />
                <span style={S.titleCyan}>MONITOR</span>
              </h1>
            </div>

            {/* Logo box */}
            <div style={S.logoWrap}>
              <div style={S.logoBox}>
                {/* ECG icon */}
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="url(#ecg-g)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="ecg-g" x1="0" y1="0" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Decorative animated ECG line */}
          <div style={{ marginBottom: 28, overflow: 'hidden', height: 18 }}>
            <svg viewBox="0 0 480 18" width="100%" height="18" preserveAspectRatio="none" style={{ display: 'block' }}>
              <path
                d="M0,9 L80,9 L95,9 L100,2 L108,16 L116,2 L124,9 L140,9 L480,9"
                fill="none"
                stroke="url(#ecg-line)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="400"
                style={{ animation: 'lp-ecg 1.8s ease forwards', strokeDashoffset: 400 }}
              />
              <defs>
                <linearGradient id="ecg-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(59,130,246,0)" />
                  <stop offset="20%" stopColor="#3b82f6" />
                  <stop offset="60%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="rgba(6,182,212,0)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* ── ERROR ── */}
          {error && (
            <div style={S.errorBox}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* ── FORM ── */}
          <form onSubmit={handleManualLogin}>

            {/* Username */}
            <div style={S.fieldGroup}>
              <label style={S.label}>Nomor ID Medis / Username</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg style={S.icoLeft} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={uFocus ? '#06b6d4' : '#475569'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  className="lp-input"
                  type="text"
                  placeholder="Ketik username atau ID medis..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setUFocus(true)}
                  onBlur={() => setUFocus(false)}
                  autoComplete="username"
                  style={{
                    ...S.input,
                    borderColor: uFocus ? 'rgba(6,182,212,.6)' : 'rgba(255,255,255,.1)',
                    boxShadow: uFocus ? '0 0 0 3px rgba(6,182,212,.12)' : 'none',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={S.fieldGroup}>
              <label style={S.label}>Kata Sandi</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg style={S.icoLeft} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={pFocus ? '#06b6d4' : '#475569'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  className="lp-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPFocus(true)}
                  onBlur={() => setPFocus(false)}
                  autoComplete="current-password"
                  style={{
                    ...S.input,
                    paddingRight: 52,
                    borderColor: pFocus ? 'rgba(6,182,212,.6)' : 'rgba(255,255,255,.1)',
                    boxShadow: pFocus ? '0 0 0 3px rgba(6,182,212,.12)' : 'none',
                  }}
                />
                <button
                  type="button"
                  className="lp-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ ...S.eyeBtn, color: '#475569' }}
                  aria-label={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Primary button */}
            <button
              className="lp-btn-primary"
              type="submit"
              disabled={loading}
              style={{ ...S.btnPrimary, opacity: loading ? .65 : 1 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  MEMBUKA SESI...
                </span>
              ) : 'MASUK KE SISTEM'}
            </button>
          </form>

          {/* Divider */}
          <div style={S.divider}>
            <div style={S.dividerLine} />
            <span style={S.dividerLabel}>atau akses cepat</span>
            <div style={S.dividerLine} />
          </div>

          {/* ── COBA DEMO CARD ── */}
          <div style={S.demoCard}>
            {/* Doctor info strip */}
            <div style={S.demoProfile}>
              <div style={S.demoAvatar}>B</div>
              <div>
                <div style={S.demoName}>Dr. Budi Santoso</div>
                <div style={S.demoRole}>Spesialis ICU Jaga · ID: DR-ICU-001</div>
              </div>
              <span style={S.demoBadge}>DEMO</span>
            </div>

            <button
              className="lp-btn-demo"
              type="button"
              onClick={handleCobaDemo}
              style={S.btnDemo}
            >
              <span>Coba Demo</span>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <p style={S.demoNote}>Masuk instan tanpa autentikasi server · Mode Evaluasi &amp; Presentasi</p>
          </div>

        </div>

        {/* Footer */}
        <p style={S.footer}>GEMASTIK 2026 · IoT Healthcare Division · Tim A</p>
      </div>
    </>
  );
}

/* ────────────────────────────────────────
   TOKENS — all values via named constants,
   follows 8 pt grid, Hallmark-compliant
──────────────────────────────────────── */
const S = {
  page: {
    minHeight: '100vh',
    width: '100%',
    background: '#030910',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
    fontFamily: "'Inter', system-ui, sans-serif",
    WebkitFontSmoothing: 'antialiased',
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'relative',
  },

  blob: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(90px)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  card: {
    width: '100%',
    maxWidth: 480,
    background: 'rgba(7, 16, 34, 0.97)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 32,
    padding: '44px 44px 40px',
    boxShadow: '0 0 0 1px rgba(6,182,212,.07), 0 24px 80px rgba(0,0,0,.7)',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  },

  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: 'linear-gradient(90deg, rgba(59,130,246,0) 0%, #3b82f6 30%, #06b6d4 60%, rgba(6,182,212,0) 100%)',
    borderRadius: '32px 32px 0 0',
  },

  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 4,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: 'rgba(148,163,184,.65)',
    marginBottom: 10,
    fontFamily: "'JetBrains Mono', monospace",
  },

  title: {
    fontSize: 34,
    fontWeight: 900,
    lineHeight: 1.08,
    letterSpacing: '-0.025em',
    color: '#f1f5f9',
    margin: 0,
    textTransform: 'uppercase',
  },

  titleCyan: {
    background: 'linear-gradient(135deg, #38bdf8, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  logoWrap: {
    flexShrink: 0,
    width: 88,
    height: 88,
    padding: 6,
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.1)',
    borderRadius: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoBox: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(5,14,29,.95), rgba(2,8,18,1))',
    border: '1px solid rgba(6,182,212,.25)',
    borderRadius: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.06), 0 0 20px rgba(6,182,212,.12)',
  },

  errorBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '13px 16px',
    borderRadius: 14,
    background: 'rgba(239,68,68,.08)',
    border: '1px solid rgba(239,68,68,.2)',
    color: '#fca5a5',
    fontSize: 13,
    lineHeight: 1.5,
    marginBottom: 20,
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: 600,
    color: '#cbd5e1',
    marginBottom: 10,
    letterSpacing: '-0.01em',
  },

  icoLeft: {
    position: 'absolute',
    left: 17,
    pointerEvents: 'none',
    transition: 'stroke .18s',
  },

  input: {
    width: '100%',
    height: 54,
    paddingLeft: 48,
    paddingRight: 18,
    background: 'rgba(10,20,40,.9)',
    border: '1.5px solid rgba(255,255,255,.1)',
    borderRadius: 14,
    color: '#f1f5f9',
    fontSize: 14.5,
    fontFamily: "'Inter', system-ui, sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    letterSpacing: '-0.01em',
  },

  eyeBtn: {
    position: 'absolute',
    right: 14,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 4,
    borderRadius: 6,
    transition: 'color .15s',
  },

  btnPrimary: {
    width: '100%',
    height: 54,
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    border: 'none',
    borderRadius: 14,
    color: '#fff',
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(37,99,235,.4), inset 0 1px 0 rgba(255,255,255,.18)',
    transition: 'all .2s ease',
    fontFamily: "'Inter', system-ui, sans-serif",
    marginTop: 8,
  },

  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '28px 0 20px',
  },

  dividerLine: {
    flex: 1,
    height: 1,
    background: 'rgba(255,255,255,.07)',
  },

  dividerLabel: {
    fontSize: 11,
    color: 'rgba(148,163,184,.45)',
    fontWeight: 500,
    letterSpacing: '0.08em',
    fontFamily: "'JetBrains Mono', monospace",
    flexShrink: 0,
    textTransform: 'uppercase',
  },

  demoCard: {
    background: 'rgba(6,182,212,.05)',
    border: '1.5px solid rgba(6,182,212,.2)',
    borderRadius: 18,
    padding: '18px 20px 16px',
  },

  demoProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },

  demoAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(6,182,212,.3)',
  },

  demoName: {
    fontSize: 13.5,
    fontWeight: 700,
    color: '#e2e8f0',
    letterSpacing: '-0.01em',
  },

  demoRole: {
    fontSize: 11,
    color: 'rgba(148,163,184,.6)',
    fontFamily: "'JetBrains Mono', monospace",
    marginTop: 1,
  },

  demoBadge: {
    marginLeft: 'auto',
    flexShrink: 0,
    padding: '3px 9px',
    borderRadius: 6,
    background: 'rgba(6,182,212,.15)',
    border: '1px solid rgba(6,182,212,.3)',
    color: '#67e8f9',
    fontSize: 10,
    fontWeight: 800,
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.1em',
  },

  btnDemo: {
    width: '100%',
    height: 50,
    background: 'rgba(6,182,212,.12)',
    border: '1.5px solid rgba(6,182,212,.35)',
    borderRadius: 12,
    color: '#67e8f9',
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    transition: 'all .18s ease',
    fontFamily: "'Inter', system-ui, sans-serif",
  },

  demoNote: {
    textAlign: 'center',
    fontSize: 11,
    color: 'rgba(148,163,184,.38)',
    marginTop: 10,
    fontFamily: "'JetBrains Mono', monospace",
    lineHeight: 1.5,
  },

  footer: {
    marginTop: 32,
    fontSize: 10.5,
    color: 'rgba(71,85,105,.5)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontFamily: "'JetBrains Mono', monospace",
    textAlign: 'center',
  },
};
