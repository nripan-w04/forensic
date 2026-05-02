import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from './AuthContext';

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const role = user?.role || 'Guest';

  return (
    <div className="dashboard-root">
      <Sidebar role={role} />
      
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="scanlines" />
        
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
