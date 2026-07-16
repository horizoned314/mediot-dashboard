import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ToastManager from './components/ToastManager';

import LiveDashboard from './pages/LiveDashboard';
import HistoryDashboard from './pages/HistoryDashboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// ── Page transition wrapper ────────────────────────────────────
function AnimatedPage({ children }) {
  const ref = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'none';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!ref.current) return;
      el.style.transition = 'opacity 0.28s ease, transform 0.28s cubic-bezier(.16,1,.3,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }));
  }, [pathname]);

  return (
    <div ref={ref} style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      {children}
    </div>
  );
}

function AppInner() {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#050b14' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <AnimatedPage>
          <Routes>
            <Route path="/"         element={<LiveDashboard />} />
            <Route path="/history"  element={<HistoryDashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*"         element={<NotFound />} />
          </Routes>
        </AnimatedPage>
      </main>
      <ToastManager />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
