import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../common/DashboardLayout';
import MyProfile from '../common/MyProfile';
import LabOverview from './components/LabOverview';
import LabQueue from './components/LabQueue';

function LabReports() {
  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">{'//'} FORENSIC LABORATORY</p>
          <h1 className="page-title">
            Analysis <span>Reports</span>
          </h1>
        </div>
      </div>
      <div className="data-card" style={{ textAlign: 'center', padding: '100px 20px', background: 'rgba(10,10,18,0.4)', border: '1px dashed rgba(255,255,255,0.1)' }}>
        <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '15px', color: '#60a5fa', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600 }}>
          REPORTS GENERATION MODULE INITIALIZING...
        </div>
        <div style={{ fontFamily: '"Barlow", sans-serif', fontSize: '13px', color: '#71717a', marginTop: 16 }}>
          Syncing with Judicial Records and Lab Results
        </div>
      </div>
    </>
  );
}

export default function LabDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<LabOverview />} />
        <Route path="/queue" element={<LabQueue />} />
        <Route path="/profile" element={<MyProfile />} />
      </Routes>
    </DashboardLayout>
  );
}
