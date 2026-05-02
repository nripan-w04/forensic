import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Users, LayoutDashboard, Shield, Microscope,
  Package, Gavel, Settings, FileText, Activity, X
} from 'lucide-react';
import { useUI } from './UIContext';

export default function Sidebar({ role }) {
  const location = useLocation();
  const { mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu } = useUI();

  // Close sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, setMobileMenuOpen]);

  const getLinks = () => {
    switch (role) {
      case 'Admin':
        return [
          { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { name: 'Personnel', path: '/admin/personnel', icon: Users },
          { name: 'Settings', path: '/admin/settings', icon: Settings },
        ];
      case 'Police Officer':
        return [
          { name: 'Dashboard', path: '/police', icon: LayoutDashboard },
          { name: 'Active Cases', path: '/police/cases', icon: FileText },
          { name: 'Register Case', path: '/police/register', icon: Shield },
          { name: 'Evidence Registry', path: '/police/evidence', icon: Package },
          { name: 'My Profile', path: '/police/profile', icon: Users },
        ];
      case 'Lab Analyst':
        return [
          { name: 'Dashboard', path: '/lab', icon: LayoutDashboard },
          { name: 'Queue', path: '/lab/queue', icon: Activity },
          { name: 'My Profile', path: '/lab/profile', icon: Users },
        ];
      case 'Evidence Collector':
        return [
          { name: 'Dashboard', path: '/evidence', icon: LayoutDashboard },
          { name: 'Link to Case', path: '/evidence/cases', icon: FileText },
          { name: 'Manage Evidence', path: '/evidence/logs', icon: Activity },
          { name: 'My Profile', path: '/evidence/profile', icon: Users }
        ];
      case 'Court Official':
        return [
          { name: 'Dashboard', path: '/court', icon: LayoutDashboard },
          { name: 'Hearings', path: '/court/hearings', icon: Gavel },
          { name: 'Judgments', path: '/court/judgments', icon: FileText },
          { name: 'My Profile', path: '/court/profile', icon: Users }
        ];
      default:
        return [
          { name: 'Dashboard', path: '/', icon: LayoutDashboard }
        ];
    }
  };

  const links = getLinks();

  return (
    <>
      <div 
        className={`sidebar-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      
      <aside className={`dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header" style={{ justifyContent: 'space-between' }}>
          <div>
            <h2 className="sidebar-title">
              FORENSIC<span style={{ color: '#ef4444' }}>SYS</span>
            </h2>
            <p className="sidebar-subtitle">
              {role} Terminal
            </p>
          </div>
          <button 
            className="md-hidden"
            onClick={() => setMobileMenuOpen(false)}
            style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-menu">
          <p className="menu-label">
            // NAVIGATION MENU
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`menu-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} style={{ color: isActive ? '#ef4444' : '#71717a' }} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#111116', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            <span style={{ fontSize: '10px', fontFamily: '"Share Tech Mono", monospace', color: '#71717a', letterSpacing: '0.1em' }}>
              SECURE LINK ACTIVE
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
