import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../common/DashboardLayout';
import MyProfile from '../common/MyProfile';
import EvidenceOverview from './components/EvidenceOverview';
import ManageEvidence from './components/ManageEvidence';
import EvidenceCaseList from './components/EvidenceCaseList';
import RegisterEvidence from './components/RegisterEvidence';

export default function EvidenceDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<EvidenceOverview />} />
        <Route path="/cases" element={<EvidenceCaseList />} />
        <Route path="/register" element={<RegisterEvidence />} />
        <Route path="/logs" element={<ManageEvidence />} />
        <Route path="/profile" element={<MyProfile />} />
      </Routes>
    </DashboardLayout>
  );
}

