/**
 * Premium MQTT status bar component with animated dots and reconnect button.
 */
export default function MqttStatusBar({ status, onReconnect }) {
  const config = {
    connected:    { label: 'Connected',   dotCls: 'dot-green anim-pulse-dot', textColor: '#34d399', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.18)' },
    connecting:   { label: 'Connecting…', dotCls: 'dot-blue  anim-pulse-dot', textColor: '#60a5fa', bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.18)'  },
    disconnected: { label: 'Offline',     dotCls: 'dot-gray',                 textColor: '#64748b', bg: 'rgba(100,116,139,0.06)', border: 'rgba(100,116,139,0.14)' },
    error:        { label: 'Error',       dotCls: 'dot-red  anim-pulse-dot',  textColor: '#f87171', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.18)'   },
  };
  const c = config[status] || config.disconnected;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '7px 14px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: '10px',
      backdropFilter: 'blur(8px)',
    }}>
      <span className={c.dotCls} />
      <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        MQTT
      </span>
      <span style={{ fontSize: '12px', fontWeight: 600, color: c.textColor }}>
        {c.label}
      </span>
      {(status === 'disconnected' || status === 'error') && (
        <button
          className="btn-ghost"
          onClick={onReconnect}
          style={{ marginLeft: '4px', padding: '3px 10px', fontSize: '11px', borderRadius: '7px' }}
        >
          Reconnect
        </button>
      )}
    </div>
  );
}
