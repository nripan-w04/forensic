import React from 'react';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUI } from './UIContext';

export default function DashboardNavbar({ user }) {
  const { toggleMobileMenu } = useUI();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getProfilePath = () => {
    switch(user?.role) {
      case 'Admin': return '/admin/profile';
      case 'Police Officer': return '/police/profile';
      case 'Lab Analyst': return '/lab/profile';
      case 'Evidence Collector': return '/evidence/profile';
      case 'Court Official': return '/court/profile';
      default: return '/';
    }
  };

  return (
    <nav className="dashboard-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden"
          style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px' }}
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="user-profile">
        <div className="user-info">
          <p className="user-name">
            {user?.name || 'Agent'}
          </p>
          <p className="user-role">
            {user?.role || 'Guest'}
          </p>
        </div>
        <Link to={getProfilePath()} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s' }} title="My Profile" onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}>
          <UserIcon size={18} />
        </Link>
        
        <div className="nav-divider" />

        <button 
          onClick={handleLogout}
          className="logout-btn"
          title="Disconnect"
        >
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
