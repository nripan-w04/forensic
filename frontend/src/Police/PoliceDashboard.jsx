import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../common/DashboardLayout';
import MyProfile from '../common/MyProfile';
import PoliceOverview from './components/PoliceOverview';
import RegisterCase from './components/RegisterCase';
import ActiveCases from './components/ActiveCases';
import PoliceEvidenceView from './components/PoliceEvidenceView';

export default function PoliceDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<PoliceOverview />} />
        <Route path="/cases" element={<ActiveCases />} />
        <Route path="/register" element={<RegisterCase />} />
        <Route path="/evidence" element={<PoliceEvidenceView />} />
        <Route path="/profile" element={<MyProfile />} />
      </Routes>
    </DashboardLayout>
  );
}
