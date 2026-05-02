import React, { useState } from 'react';
import { Search, Bell, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../common/UIContext';

export default function Topbar({ user, isMobile, onMobileMenuClick, sidebarWidth }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { showConfirm, showToast } = useUI();
  
  const userName = user?.name || 'ADMIN';
  const initial = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title: 'Deactivate Admin Session',
      message: 'Are you sure you want to terminate the current administrative session? This will be logged.',
      confirmText: 'Terminate',
      cancelText: 'Stay Active'
    });
    if (confirmed) {
      localStorage.removeItem('user');
      showToast('Admin session terminated', 'info');
      navigate('/login');
    }
  };

  return (
    <header style={{
      position: 'fixed', top: 0, right: 0, left: sidebarWidth,
      height: 64, background: 'rgba(4,4,10,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', alignItems: 'center',
      padding: isMobile ? '0 16px' : '0 28px 0 20px',
      zIndex: 90, gap: 16, transition: 'left 0.25s ease-in-out'
    }}>
      {isMobile && (
        <button onClick={onMobileMenuClick} style={{ background: 'none', border: 'none', color: '#e4e4e7', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Menu size={20} />
        </button>
      )}

      {!isMobile && (
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#3f3f46', letterSpacing: '0.15em' }}>
          ROOT / COMMAND / OVERSIGHT
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Search - Hidden on very small screens */}
      <div style={{ position: 'relative', width: isMobile ? 160 : 240, display: isMobile && window.innerWidth < 400 ? 'none' : 'block' }}>
        <Search size={13} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#3f3f46', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Query personnel..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', height: 36, background: '#0a0a12',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3,
            padding: '0 14px 0 34px', color: '#e4e4e7',
            fontFamily: "'Share Tech Mono', monospace", fontSize: 11, outline: 'none',
          }}
          onFocus={e => e.target.style.borderColor = '#dc2626'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
      </div>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setNotifOpen(p => !p)}
          style={{
            width: 36, height: 36, borderRadius: 3, background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#71717a', transition: 'all 0.2s', position: 'relative',
          }}
        >
          <Bell size={14} />
          <span style={{
            position: 'absolute', top: 6, right: 6, width: 7, height: 7,
            borderRadius: '50%', background: '#dc2626',
            border: '1.5px solid #04040a',
          }} />
        </button>
        {notifOpen && (
          <div style={{
            position: 'absolute', top: 44, right: isMobile ? -50 : 0, width: 260,
            background: '#0a0a12', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4, padding: '10px 0', zIndex: 200,
          }}>
            <div style={{ padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fbbf24', marginTop: 4, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#d4d4d8' }}>System initialized</div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#52525b', marginTop: 2 }}>Just now</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Avatar / Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: 16 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #7f1d1d, #dc2626)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, color: '#fff',
        }}>{initial}</div>
        {!isMobile && (
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, color: '#d4d4d8', fontWeight: 600 }}>{userName.toUpperCase()}</div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 8, color: '#52525b' }}>LEVEL-5 ACCESS</div>
          </div>
        )}
        <button onClick={handleLogout} style={{
          marginLeft: 4, width: 30, height: 30, borderRadius: 3,
          background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#f87171', transition: 'all 0.2s',
        }}>
          <LogOut size={13} />
        </button>
      </div>
    </header>
  );
}
