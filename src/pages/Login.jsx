import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../config';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Harap masukkan Username dan Password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${API_CONFIG.baseURL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      if (!res.ok) {
        throw new Error('Kredensial tidak sah atau server menolak akses.');
      }

      const data = await res.json();
      const userData = data.user || {
        username,
        full_name: username.toUpperCase(),
        role: 'Tenaga Medis',
      };
      localStorage.setItem('mediot_user', JSON.stringify(userData));
      if (data.token) localStorage.setItem('mediot_token', data.token);

      navigate('/');
    } catch (err) {
      console.warn('Login server fallback/error:', err.message);
      // Jika server belum siap atau offline, kita tetap izinkan login sbg user kustom setelah notif singkat, atau arahkan pakai Demo
      setError('Gagal terhubung ke server autentikasi Tim B. Silakan gunakan tombol Coba Demo di bawah untuk uji coba.');
    } finally {
      setLoading(false);
    }
  };

  const handleCobaDemo = () => {
    const demoUser = {
      username: 'dr_demo',
      full_name: 'Dr. Budi Santoso',
      role: 'Dokter Spesialis ICU',
      isDemo: true,
    };
    localStorage.setItem('mediot_user', JSON.stringify(demoUser));
    localStorage.setItem('mediot_token', 'demo-jwt-token-9988776655');
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-base)] flex items-center justify-center p-4 relative overflow-hidden font-[Inter]">
      {/* Ambient background glowing glow pulses */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />

      <div className="w-full max-w-[420px] z-10">
        {/* Logo and system title */}
        <div className="text-center mb-8">
          <div className="w-[52px] h-[52px] rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-[0_6px_20px_rgba(59,130,246,0.4)]" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <h1 className="text-[24px] font-extrabold tracking-[-0.03em] text-slate-100 font-normal">
            MedIoT Monitor Pro
          </h1>
          <p className="text-[13px] text-slate-400 mt-1 font-normal tracking-wide">
            Sistem Telemetri &amp; Pemantauan Tanda Vital ICU
          </p>
        </div>

        {/* Login Glass Card */}
        <div className="glass-card p-7 sm:p-8 relative backdrop-blur-2xl border border-white/10 bg-[#050b14]/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl">
          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-300 text-[13px] leading-relaxed">
              <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* Form manual login */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold tracking-wide uppercase text-slate-300 mb-2 font-[JetBrains_Mono]">
                Username Medis
              </label>
              <input
                type="text"
                placeholder="e.g. dr_budi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 text-[14px] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold tracking-wide uppercase text-slate-300 mb-2 font-[JetBrains_Mono]">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 text-[14px] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200 placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-[14px] font-semibold text-white tracking-wide bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_6px_25px_rgba(6,182,212,0.45)] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Membuka Akses…</span>
                </>
              ) : (
                <span>Masuk Sistem</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold font-[JetBrains_Mono]">
              <span className="bg-[#08101d] px-3 text-slate-400">Akses Cepat Pengujian</span>
            </div>
          </div>

          {/* Coba Demo Button */}
          <button
            type="button"
            onClick={handleCobaDemo}
            className="w-full py-3.5 px-4 rounded-xl text-[14px] font-bold tracking-wide text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400/50 shadow-[0_2px_15px_rgba(6,182,212,0.1)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5 group"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Coba Demo</span>
            <svg className="w-4 h-4 text-cyan-400 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <p className="text-[11px] text-slate-400/70 text-center mt-3 font-[JetBrains_Mono]">
            Masuk instan tanpa autentikasi server (Mode Evaluasi Juri &amp; Tim)
          </p>
        </div>

        {/* Footer legal text */}
        <div className="text-center mt-6 text-[11px] text-slate-500 font-[JetBrains_Mono] tracking-wider uppercase">
          GEMASTIK 2026 · IoT Healthcare · Tim A
        </div>
      </div>
    </div>
  );
}
