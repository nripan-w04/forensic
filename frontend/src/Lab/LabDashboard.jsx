import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../common/DashboardLayout';
import MyProfile from '../common/MyProfile';
import LabOverview from './components/LabOverview';
import LabQueue from './components/LabQueue';



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
