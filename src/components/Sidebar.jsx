import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  {
    to: '/',
    label: 'Live Monitor',
    badge: 'LIVE',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'Riwayat',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Pengaturan',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('mediot_user');
    localStorage.removeItem('mediot_token');
    window.location.href = '/login';
  };

  const user = JSON.parse(
    localStorage.getItem('mediot_user') ||
    '{"full_name":"Dr. Pengguna","role":"Spesialis Medis"}'
  );

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });
  const initial = user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="res-sidebar shrink-0 relative z-50" style={{ background: '#040c1a', borderRight: '1px solid rgba(255,255,255,0.07)' }}>

      {/* ── Desktop Sidebar ──────────────────────────────── */}
      <div className="res-hide-mobile flex flex-col h-full">

        {/* Top glow accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 180, background: 'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* ── Brand ── */}
        <div style={{ padding: '22px 18px 16px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Logo icon */}
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            {/* Brand text */}
            <div>
              <div style={{ fontWeight: 900, fontSize: 17, letterSpacing: '-0.4px', color: '#f1f5f9', lineHeight: 1 }}>MedIoT</div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(6,182,212,0.6)', marginTop: 2 }}>
                Monitor
              </div>
            </div>
          </div>
        </div>

        {/* ── Live Clock ── */}
        <div style={{ margin: '0 14px 16px', padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block', animation: 'blink-text 2s ease infinite', flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>
              Live
            </span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: 22, color: '#f1f5f9', letterSpacing: '-0.5px', lineHeight: 1 }}>
            {timeStr}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.4)', marginTop: 4 }}>{dateStr}</div>
        </div>

        {/* ── Navigation ── */}
        <nav style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.25)', padding: '0 8px', marginBottom: 6 }}>
            Menu
          </div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 12,
                textDecoration: 'none',
                position: 'relative',
                transition: 'all 0.18s ease',
                background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(59,130,246,0.25)' : '1px solid transparent',
                color: isActive ? '#93c5fd' : 'rgba(148,163,184,0.55)',
              })}
            >
              {({ isActive }) => (
                <>
                  {/* Active left indicator */}
                  {isActive && (
                    <div style={{
                      position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                      width: 3, height: '60%', borderRadius: '0 2px 2px 0',
                      background: 'linear-gradient(180deg, #3b82f6, #06b6d4)',
                    }} />
                  )}
                  {/* Icon */}
                  <span style={{ color: isActive ? '#60a5fa' : 'rgba(148,163,184,0.4)', flexShrink: 0, display: 'flex' }}>
                    {item.icon}
                  </span>
                  {/* Label */}
                  <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 700 : 500, letterSpacing: '-0.01em' }}>
                    {item.label}
                  </span>
                  {/* Badge */}
                  {item.badge && (
                    <span style={{
                      fontSize: 8, fontWeight: 800, letterSpacing: '0.1em',
                      padding: '2px 7px', borderRadius: 99,
                      background: 'rgba(239,68,68,0.12)',
                      color: '#f87171',
                      border: '1px solid rgba(239,68,68,0.25)',
                      animation: 'blink-text 2.5s ease infinite',
                    }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 14px' }} />

        {/* ── User Profile & Logout ── */}
        <div style={{ padding: '10px 14px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 14,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14, color: 'white',
              boxShadow: '0 3px 10px rgba(6,182,212,0.3)',
            }}>
              {initial}
            </div>
            {/* Info */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.full_name}
              </div>
              <div style={{ fontSize: 9.5, color: 'rgba(148,163,184,0.45)', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.role}
              </div>
            </div>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              title="Keluar"
              style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: 'transparent', border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(148,163,184,0.4)', transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(148,163,184,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Footer tag ── */}
        <div style={{ padding: '8px 14px 16px', textAlign: 'center' }}>
          <div style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(59,130,246,0.35)', fontFamily: 'JetBrains Mono, monospace',
            padding: '6px 10px', borderRadius: 8,
            background: 'rgba(59,130,246,0.04)',
            border: '1px solid rgba(59,130,246,0.08)',
          }}>
            Tim A · GEMASTIK 2026
          </div>
        </div>
      </div>

      {/* ── Mobile Bottom Nav ──────────────────────────────── */}
      <nav className="res-hide-desktop flex items-center justify-around h-full px-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${isActive ? 'text-blue-400' : 'text-slate-500'}`}
          >
            {({ isActive }) => (
              <>
                <span style={{ color: isActive ? '#60a5fa' : 'rgba(148,163,184,0.4)', transform: isActive ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.15s' }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? '#93c5fd' : 'rgba(148,163,184,0.4)' }}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}
