import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import AdminHome from './dashboard/AdminHome';
import PersonnelRegistry from './personnel/PersonnelRegistry';
import AdminCaseMonitor from './cases/AdminCaseMonitor';
import EvidenceVault from './evidence/EvidenceVault';

// Placeholder for offline modules
function ModuleOffline({ title }) {
  return (
    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}>
      <div style={{ fontSize: 64, marginBottom: 24, filter: 'drop-shadow(0 0 10px rgba(220,38,38,0.3))' }}>⚠️</div>
      <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '15px', color: '#dc2626', letterSpacing: '0.2em', fontWeight: 600 }}>{title.toUpperCase()} MODULE OFFLINE</div>
      <div style={{ fontFamily: '"Barlow", sans-serif', fontSize: '13px', color: '#71717a', marginTop: 12 }}>Access restricted or system under maintenance.</div>
    </div>
  );
}

export default function AdminDashboard() {
  console.log("DEBUG: AdminDashboard Router Initialized");
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminHome />} />
        <Route path="dashboard" element={<AdminHome />} />
        <Route path="personnel" element={<PersonnelRegistry />} />
        <Route path="cases" element={<AdminCaseMonitor />} />
        <Route path="evidence" element={<EvidenceVault />} />
        <Route path="audit" element={<ModuleOffline title="Department Audit" />} />
        <Route path="security" element={<ModuleOffline title="Security Logs" />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
}