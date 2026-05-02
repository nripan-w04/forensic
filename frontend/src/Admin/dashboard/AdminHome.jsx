import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, FileText, Database, Shield,
  Activity, Clock, TrendingUp, Layers
} from 'lucide-react';
import axios from 'axios';
import StatCard from '../components/StatCard';

export default function AdminHome() {
  console.log("DEBUG: AdminHome Mounting...");
  const [stats, setStats] = useState({
    users: 0,
    cases: 0,
    evidence: 0,
    pendingUsers: 0,
    openCases: 0,
    analyzedEvidence: 0
  });
  const [recentActions, setRecentActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, casesRes, evidenceRes] = await Promise.all([
          axios.get('http://localhost:4000/api/users'),
          axios.get('http://localhost:4000/api/cases'),
          axios.get('http://localhost:4000/api/evidence')
        ]);

        console.log("DEBUG: Admin Dashboard Data Received", { users: usersRes.data, cases: casesRes.data, evidence: evidenceRes.data });

        const users = usersRes.data || [];
        const cases = casesRes.data || [];
        const evidence = evidenceRes.data || [];

        if (users.length === 0 && cases.length === 0 && evidence.length === 0) {
          console.warn("DEBUG: Dashboard received empty datasets from all endpoints.");
        }

        setStats({
          users: users.length,
          cases: cases.length,
          evidence: evidence.length,
          pendingUsers: users.filter(u => u?.status === 'Pending').length,
          openCases: cases.filter(c => c?.status !== 'CLOSED').length,
          analyzedEvidence: evidence.filter(e => e?.status === 'ANALYZED').length
        });

        // Generate realistic activity log
        const combined = [
          ...users.slice(-3).map(u => ({ type: 'USER', label: `New registration: ${u.name}`, time: u.createdAt || new Date(), color: '#3b82f6' })),
          ...cases.slice(-3).map(c => ({ type: 'CASE', label: `New case filed: ${c.caseId}`, time: c.createdAt || new Date(), color: '#dc2626' })),
          ...evidence.slice(-3).map(e => ({ type: 'EVIDENCE', label: `Evidence logged: ${e.evidenceId}`, time: e.createdAt || new Date(), color: '#a855f7' }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

        setRecentActions(combined);
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Active Personnel', value: stats.users, delta: `+${stats.pendingUsers} pending`, icon: Users, color: '#3b82f6' },
    { label: 'Total Cases', value: stats.cases, delta: `${stats.openCases} active`, icon: FileText, color: '#dc2626' },
    { label: 'Evidence Items', value: stats.evidence, delta: `${stats.analyzedEvidence} analyzed`, icon: Database, color: '#a855f7' },
    { label: 'System Security', value: 'Level 5', delta: 'Secure', icon: Shield, color: '#10b981' },
  ];

  if (loading) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Share Tech Mono', monospace", color: '#ffffff', fontSize: 14 }}>
        INITIALIZING COMMAND INTERFACE...
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 40, position: 'relative', zIndex: 10 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#dc2626', letterSpacing: '0.25em', marginBottom: 8, fontWeight: 700 }}>
          // OVERSIGHT AUTHORITY · LEVEL-5 CLEARANCE
        </div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 52, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
          Command Center
        </h1>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        {statCards.map((stat, i) => (
          <StatCard key={i} stat={stat} index={i} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: 24 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#ffffff', opacity: 0.6, marginBottom: 8, fontWeight: 700 }}>// CASE DISTRIBUTION</div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>Workload Audit</h3>
            </div>
            <TrendingUp size={32} color="#34d399" />
          </div>

          <div style={{ display: 'grid', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 17, color: '#ffffff', fontFamily: "'Share Tech Mono', monospace", fontWeight: 700 }}>POLICE INVESTIGATIONS</span>
                <span style={{ fontSize: 17, color: '#ffffff', fontWeight: 700 }}>{Math.round((stats.openCases / (stats.cases || 1)) * 100)}%</span>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 5 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.openCases / (stats.cases || 1)) * 100}%` }} style={{ height: '100%', background: '#dc2626', borderRadius: 5 }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 17, color: '#ffffff', fontFamily: "'Share Tech Mono', monospace", fontWeight: 700 }}>FORENSIC LAB PROCESSING</span>
                <span style={{ fontSize: 17, color: '#ffffff', fontWeight: 700 }}>{Math.round((stats.analyzedEvidence / (stats.evidence || 1)) * 100)}%</span>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 5 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.analyzedEvidence / (stats.evidence || 1)) * 100}%` }} style={{ height: '100%', background: '#a855f7', borderRadius: 5 }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 17, color: '#ffffff', fontFamily: "'Share Tech Mono', monospace", fontWeight: 700 }}>COURT PROCEEDINGS</span>
                <span style={{ fontSize: 17, color: '#ffffff', fontWeight: 700 }}>34%</span>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 5 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '34%' }} style={{ height: '100%', background: '#fbbf24', borderRadius: 5 }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 40, padding: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ffffff' }}>SYSTEM STATUS: ALL DEPARTMENTS OPERATIONAL</span>
            </div>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: 24 }}
        >
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#ffffff', opacity: 0.6, marginBottom: 8, fontWeight: 700 }}>// SYSTEM LOGS</div>
          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: 24 }}>Live Activity</h3>

          <div className="custom-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxHeight: 400, overflowY: 'auto', paddingRight: 8 }}>
            {recentActions.map((action, i) => (
              <div key={i} style={{ display: 'flex', gap: 16 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: action.color, marginTop: 4 }} />
                  {i !== recentActions.length - 1 && <div style={{ position: 'absolute', top: 16, left: 5.5, width: 1, height: '100%', background: 'rgba(255,255,255,0.1)' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#ffffff', fontSize: 18, fontWeight: 700 }}>{action.label}</div>
                  <div style={{ color: '#ffffff', opacity: 0.7, fontSize: 14, fontFamily: "'Share Tech Mono', monospace", marginTop: 4, fontWeight: 600 }}>
                    {new Date(action.time).toLocaleTimeString()} · SECURE LOG
                  </div>
                </div>
              </div>
            ))}
            {recentActions.length === 0 && (
              <div style={{ color: '#ffffff', opacity: 0.3, fontSize: 12, textAlign: 'center', padding: '40px 0' }}>NO RECENT ACTIVITY DETECTED</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
