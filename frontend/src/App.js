import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './common/Home';
import Login from './common/Login';
import Register from './common/Register';
import AdminDashboard from './Admin/AdminDashboard';
import PoliceDashboard from './Police/PoliceDashboard';
import LabDashboard from './Lab/LabDashboard';
import EvidenceDashboard from './EvidenceCollector/EvidenceDashboard';
import CourtDashboard from './Court/CourtDashboard';
import { UIProvider } from './common/UIProvider';
import { AuthProvider, useAuth } from './common/AuthContext';
import { SocketProvider } from './common/SocketContext';
import Navbar from './common/Navbar';
import './App.css';

function AppRoutes() {
  const { user, dashboardPath } = useAuth();
  const role = user?.role;

  return (
    <>
      <div className="grain-overlay" />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user && dashboardPath ? <Navigate to={dashboardPath} replace /> : <Home />} />
        <Route path="/login" element={user && dashboardPath ? <Navigate to={dashboardPath} replace /> : <Login />} />
        <Route path="/register" element={user && dashboardPath ? <Navigate to={dashboardPath} replace /> : <Register />} />
        <Route path="/about" element={<Home />} />
        <Route path="/crime" element={<Home />} />

        {/* Protected Routes - Based on Role */}
        {user && (
          <>
            {role === 'Admin' && <Route path="/admin/*" element={<AdminDashboard />} />}
            {role === 'Police Officer' && <Route path="/police/*" element={<PoliceDashboard />} />}
            {role === 'Lab Analyst' && <Route path="/lab/*" element={<LabDashboard />} />}
            {role === 'Evidence Collector' && <Route path="/evidence/*" element={<EvidenceDashboard />} />}
            {role === 'Court Official' && <Route path="/court/*" element={<CourtDashboard />} />}
          </>
        )}

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <AuthProvider>
          <SocketProvider>
            <AppRoutes />
          </SocketProvider>
        </AuthProvider>
      </UIProvider>
    </BrowserRouter>
  );
}

export default App;
