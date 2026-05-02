import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../common/DashboardLayout';
import AdminHome from './dashboard/AdminHome';
import PersonnelRegistry from './personnel/PersonnelRegistry';
import AdminCaseMonitor from './cases/AdminCaseMonitor';
import EvidenceVault from './evidence/EvidenceVault';
import MyProfile from '../common/MyProfile';

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/dashboard" element={<AdminHome />} />
        <Route path="/personnel" element={<PersonnelRegistry />} />
        <Route path="/cases" element={<AdminCaseMonitor />} />
        <Route path="/evidence" element={<EvidenceVault />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
}