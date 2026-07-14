// 404 Not Found page
export default function NotFound() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '16px', position: 'relative',
    }}>
      <div className="mesh-bg" />
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '96px', fontWeight: 900,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          lineHeight: 1, marginBottom: '12px',
          fontFamily: 'JetBrains Mono, monospace',
        }}>404</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
          Halaman tidak ditemukan
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(148,163,184,0.4)', marginBottom: '24px' }}>
          URL yang kamu minta tidak ada dalam sistem.
        </div>
        <a href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '10px 24px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
          color: 'white', fontWeight: 600, fontSize: '14px',
          textDecoration: 'none', boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
        }}>
          ← Kembali ke Dashboard
        </a>
      </div>
    </div>
  );
}
