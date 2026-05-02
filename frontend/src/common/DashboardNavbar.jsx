import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardNavbar({ user }) {
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getProfilePath = () => {
    switch(user?.role) {
      case 'Police Officer': return '/police/profile';
      case 'Lab Analyst': return '/lab/profile';
      case 'Evidence Collector': return '/evidence/profile';
      case 'Court Official': return '/court/profile';
      default: return '/';
    }
  };

  return (
    <nav className="dashboard-nav">
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
