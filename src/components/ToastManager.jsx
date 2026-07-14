import { useState, useEffect, useRef } from 'react';

/**
 * Global Toast Notification System
 * Usage: import { toast } from './ToastManager'
 *        toast.success('Berhasil!') | toast.error('Gagal!') | toast.warn('Peringatan!')
 */

// ── Event bus ─────────────────────────────────────────────────
let _listeners = [];
const bus = {
  emit:   (toast) => _listeners.forEach(fn => fn(toast)),
  listen: (fn) => { _listeners.push(fn); return () => { _listeners = _listeners.filter(f => f !== fn); }; },
};

// ── Public API ─────────────────────────────────────────────────
let _id = 0;
export const toast = {
  success: (msg, opts) => bus.emit({ id: ++_id, type: 'success', msg, ...opts }),
  error:   (msg, opts) => bus.emit({ id: ++_id, type: 'error',   msg, ...opts }),
  warn:    (msg, opts) => bus.emit({ id: ++_id, type: 'warn',    msg, ...opts }),
  info:    (msg, opts) => bus.emit({ id: ++_id, type: 'info',    msg, ...opts }),
  alert:   (msg, opts) => bus.emit({ id: ++_id, type: 'alert',   msg, ...opts }),
};

// ── Toast config ───────────────────────────────────────────────
const CONFIG = {
  success: { icon: '✓', color: '#34d399', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)', label: 'Berhasil'    },
  error:   { icon: '✕', color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',  label: 'Error'       },
  warn:    { icon: '⚠', color: '#fb923c', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)', label: 'Peringatan'  },
  info:    { icon: 'ℹ', color: '#60a5fa', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)', label: 'Info'        },
  alert:   { icon: '🚨', color: '#f87171', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.5)',   label: 'KRITIS'      },
};

// ── Single Toast Item ──────────────────────────────────────────
function ToastItem({ toast: t, onRemove }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const cfg = CONFIG[t.type] || CONFIG.info;
  const duration = t.duration ?? (t.type === 'alert' ? 8000 : 4000);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(t.id), 350);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setExiting(true);
    setTimeout(() => onRemove(t.id), 350);
  }

  return (
    <div
      onClick={dismiss}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        padding: '13px 15px',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: '12px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        cursor: 'pointer',
        maxWidth: '360px',
        minWidth: '280px',
        transition: 'all 0.35s cubic-bezier(.16,1,.3,1)',
        transform: visible && !exiting ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.95)',
        opacity: visible && !exiting ? 1 : 0,
        animation: t.type === 'alert' ? 'pulse-red 2s ease infinite' : undefined,
      }}
    >
      {/* Icon */}
      <div style={{
        width: 30, height: 30, borderRadius: '8px', flexShrink: 0,
        background: `${cfg.color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', color: cfg.color,
      }}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: cfg.color, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '3px' }}>
          {cfg.label}
        </div>
        <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.45 }}>{t.msg}</div>
      </div>

      {/* Close */}
      <div style={{ color: 'rgba(148,163,184,0.4)', fontSize: '16px', flexShrink: 0, marginTop: '-1px' }}>×</div>
    </div>
  );
}

// ── Toast Container (render di App) ────────────────────────────
export default function ToastManager() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsub = bus.listen(t => setToasts(prev => [...prev, t].slice(-5)));
    return unsub;
  }, []);

  const remove = id => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      display: 'flex', flexDirection: 'column', gap: '10px',
      zIndex: 9999, pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onRemove={remove} />
        </div>
      ))}
    </div>
  );
}
