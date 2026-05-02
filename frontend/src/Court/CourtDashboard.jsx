import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../common/DashboardLayout';
import MyProfile from '../common/MyProfile';
import CourtOverview from './components/CourtOverview';
import CourtHearings from './components/CourtHearings';
import CourtJudgments from './components/CourtJudgments';

export default function CourtDashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<CourtOverview />} />
        <Route path="/hearings" element={<CourtHearings />} />
        <Route path="/judgments" element={<CourtJudgments />} />
        <Route path="/profile" element={<MyProfile />} />
      </Routes>
    </DashboardLayout>
  );
}
