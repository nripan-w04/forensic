import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const authUser = JSON.parse(localStorage.getItem('user'));
  const SIDEBAR_W = isMobile ? 0 : (collapsed ? 68 : 220);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;500;600;700;900&family=Barlow:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04040a; }

        .scanlines {
          position: fixed; inset: 0; pointer-events: none; z-index: 999;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 4px);
        }
        .corner-glow {
          position: fixed; width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        
        .admin-main {
          min-height: 100vh;
          padding-top: 80px;
          background: #04040a;
          position: relative;
          z-index: 1;
          transition: margin-left 0.25s ease-in-out;
        }
        .admin-content {
          padding: 32px;
          max-width: 1400px;
          margin: 0 auto;
        }
        @media (max-width: 768px) {
          .admin-content { padding: 20px 16px; }
        }
      `}</style>

      <div className="scanlines" />
      <div className="corner-glow" style={{ top: '-10%', right: '-5%' }} />
      <div className="corner-glow" style={{ bottom: '-20%', left: '-10%', background: 'radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 65%)' }} />

      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(p => !p)} 
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="admin-main" style={{ marginLeft: SIDEBAR_W }}>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </>
  );
}
