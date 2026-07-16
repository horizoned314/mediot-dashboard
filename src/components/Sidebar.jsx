import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  {
    to: '/',
    label: 'Live Monitor',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    badge: 'LIVE',
  },
  {
    to: '/history',
    label: 'Riwayat',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Pengaturan',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  // ── Live Clock (fix: update setiap detik) ──
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <aside style={{
      width: '230px',
      minHeight: '100vh',
      background: 'rgba(5,11,20,0.97)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      backdropFilter: 'blur(24px)',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Top gradient accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '200px',
        background: 'linear-gradient(180deg, rgba(59,130,246,0.07) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Logo ── */}
      <div style={{ padding: '22px 18px 18px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(59,130,246,0.4)', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.3px', lineHeight: 1.1, color: '#f1f5f9' }}>MedIoT</div>
            <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(148,163,184,0.5)', marginTop: '1px' }}>
              Monitor Pro
            </div>
          </div>
        </div>

        {/* Live Clock Widget */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div className="dot-green anim-pulse-dot" style={{ flexShrink: 0 }} />
          <div>
            <div style={{
              fontSize: '19px', fontWeight: 700, color: '#f1f5f9', lineHeight: 1,
              fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.5px',
            }}>
              {timeStr}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(148,163,184,0.5)', marginTop: '2px' }}>{dateStr}</div>
          </div>
        </div>
      </div>

      <div className="sep" style={{ margin: '0 18px' }} />

      {/* ── Navigation ── */}
      <nav style={{ padding: '14px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div className="section-title" style={{ paddingLeft: '14px', marginBottom: '8px' }}>Navigasi</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span style={{ flexShrink: 0, opacity: 0.8 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span style={{
                fontSize: '8px', fontWeight: 800, letterSpacing: '0.1em',
                padding: '2px 6px', borderRadius: '99px',
                background: 'rgba(239,68,68,0.15)', color: '#f87171',
                border: '1px solid rgba(239,68,68,0.25)',
                animation: 'blink-text 2s ease infinite',
              }}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sep" style={{ margin: '0 18px' }} />

      {/* ── Footer ── */}
      <div style={{ padding: '16px 18px' }}>
        <div style={{
          background: 'rgba(59,130,246,0.06)',
          border: '1px solid rgba(59,130,246,0.12)',
          borderRadius: '10px', padding: '10px 12px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#60a5fa', marginBottom: '2px' }}>Tim A · Frontend</div>
          <div style={{ fontSize: '10px', color: 'rgba(148,163,184,0.4)' }}>GEMASTIK 2026 · IoT Medis</div>
        </div>
      </div>
    </aside>
  );
}
