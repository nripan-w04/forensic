import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield, Users, FileText, Settings,
  BarChart2, Lock, LayoutDashboard, Database,
  ChevronRight, X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', path: '/admin/dashboard', label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'personnel', path: '/admin/personnel', label: 'Personnel',      icon: Users           },
  { id: 'cases',     path: '/admin/cases',     label: 'Case Files',     icon: FileText        },
  { id: 'evidence',  path: '/admin/evidence',  label: 'Evidence Vault', icon: Database        },
  
];

export default function Sidebar({ collapsed, onToggle, isMobile, mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const sidebarContent = (
    <>
      {/* Brand */}
      <div style={{
        height: 64, display: 'flex', alignItems: 'center',
        padding: (collapsed && !isMobile) ? '0 18px' : '0 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        gap: 12, flexShrink: 0, justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6,
            background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Shield size={16} color="#fff" />
          </div>
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, fontSize: 16, color: '#f4f4f5', letterSpacing: '0.06em', lineHeight: 1.1 }}>Forensic</div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#dc2626', letterSpacing: '0.2em' }}>COMMAND SYS</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {isMobile && (
          <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname.includes(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              title={(collapsed && !isMobile) ? item.label : undefined}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 12, padding: (collapsed && !isMobile) ? '10px 18px' : '10px 20px',
                background: isActive ? 'rgba(220,38,38,0.1)' : 'transparent',
                borderLeft: `2px solid ${isActive ? '#dc2626' : 'transparent'}`,
                borderRight: 'none', borderTop: 'none', borderBottom: 'none',
                cursor: 'pointer', transition: 'all 0.18s',
                color: isActive ? '#f87171' : '#ffffff',
                textDecoration: 'none'
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#ffffff'; }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <AnimatePresence>
                {(!collapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {(!collapsed || isMobile) && isActive && (
                <ChevronRight size={12} style={{ marginLeft: 'auto', color: '#dc2626' }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle (Desktop only) */}
      {!isMobile && (
        <button
          onClick={onToggle}
          style={{
            width: '100%', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)',
            color: '#ffffff', cursor: 'pointer', transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = '#ffffff'}
        >
          <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.25 }}>
            <ChevronRight size={16} />
          </motion.div>
        </button>
      )}
    </>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)', zIndex: 99
              }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              style={{
                position: 'fixed', left: 0, top: 0, bottom: 0, width: 260,
                background: '#070710', borderRight: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', flexDirection: 'column', zIndex: 100
              }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{
        position: 'fixed', left: 0, top: 0, bottom: 0,
        background: '#070710', borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', zIndex: 100, overflow: 'hidden',
      }}
    >
      {sidebarContent}
    </motion.aside>
  );
}
