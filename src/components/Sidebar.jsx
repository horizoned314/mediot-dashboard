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
    <aside className="res-sidebar shrink-0 relative z-50 bg-[rgba(5,11,20,0.97)] backdrop-blur-xl">
      {/* Top gradient accent */}
      <div className="res-hide-mobile absolute top-0 left-0 right-0 h-[200px] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(59,130,246,0.07) 0%, transparent 100%)' }} />

      {/* ── Logo (Desktop Only) ── */}
      <div className="res-hide-mobile p-[22px_18px_18px] relative">
        <div className="flex items-center gap-[10px] mb-4">
          <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(59,130,246,0.4)]" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div>
            <div className="font-extrabold text-[16px] tracking-[-0.3px] leading-[1.1] text-slate-100">MedIoT</div>
            <div className="text-[9px] font-semibold tracking-[0.14em] uppercase text-slate-400/50 mt-[1px]">
              Monitor Pro
            </div>
          </div>
        </div>

        {/* Live Clock Widget */}
        <div className="bg-white/5 border border-white/10 rounded-[10px] p-[10px_12px] flex items-center gap-[10px]">
          <div className="dot-green anim-pulse-dot shrink-0" />
          <div>
            <div className="text-[19px] font-bold text-slate-100 leading-none tracking-[-0.5px] font-[JetBrains_Mono]">
              {timeStr}
            </div>
            <div className="text-[10px] text-slate-400/50 mt-[2px]">{dateStr}</div>
          </div>
        </div>
      </div>

      <div className="res-hide-mobile sep mx-[18px]" />

      {/* ── Navigation ── */}
      <nav className="res-nav-container flex-1 flex gap-[2px] p-2 md:p-[14px_12px]">
        <div className="res-hide-mobile section-title pl-[14px] mb-[8px]">Navigasi</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-link flex flex-col md:flex-row items-center justify-center md:justify-start !p-2 md:!p-[10px_14px] !gap-1 md:!gap-[10px] rounded-lg ${isActive ? 'active' : ''}`}
          >
            <span className="shrink-0 opacity-80 md:opacity-100 scale-125 md:scale-100">{item.icon}</span>
            <span className="flex-1 text-[10px] md:text-[13px] text-center md:text-left leading-tight">{item.label}</span>
            {item.badge && (
              <span className="hidden md:inline-block text-[8px] font-extrabold tracking-[0.1em] px-[6px] py-[2px] rounded-full bg-red-500/15 text-red-400 border border-red-500/25 animate-[blink-text_2s_ease_infinite]">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="res-hide-mobile sep mx-[18px]" />

      {/* ── Footer (Desktop Only) ── */}
      <div className="res-hide-mobile p-[16px_18px]">
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-[10px] p-[10px_12px]">
          <div className="text-[11px] font-semibold text-blue-400 mb-[2px]">Tim A · Frontend</div>
          <div className="text-[10px] text-slate-400/40">GEMASTIK 2026 · IoT Medis</div>
        </div>
      </div>
    </aside>
  );
}
