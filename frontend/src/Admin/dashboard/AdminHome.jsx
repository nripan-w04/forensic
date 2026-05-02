import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, Database, Shield, Activity, TrendingUp } from 'lucide-react';
import axios from 'axios';
import StatCard from '../components/StatCard';

export default function AdminHome() {
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

        const users = usersRes.data || [];
        const cases = casesRes.data || [];
        const evidence = evidenceRes.data || [];

        setStats({
          users: users.length,
          cases: cases.length,
          evidence: evidence.length,
          pendingUsers: users.filter(u => u?.status === 'Pending').length,
          openCases: cases.filter(c => c?.status !== 'CLOSED').length,
          analyzedEvidence: evidence.filter(e => e?.status === 'ANALYZED').length
        });

        const combined = [
          ...users.slice(-3).map(u => ({ id: u._id, tag: 'PERSONNEL', text: `New registration: ${u.name}`, time: u.createdAt || new Date(), color: '#3b82f6' })),
          ...cases.slice(-3).map(c => ({ id: c._id, tag: 'CASE FILE', text: `New case filed: ${c.caseId}`, time: c.createdAt || new Date(), color: '#dc2626' })),
          ...evidence.slice(-3).map(e => ({ id: e._id, tag: 'EVIDENCE', text: `Evidence logged: ${e.evidenceId}`, time: e.createdAt || new Date(), color: '#a855f7' }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

        setRecentActions(combined);
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const STATS = [
    { label: 'Active Personnel', value: stats.users, delta: `+${stats.pendingUsers} pending`, icon: Users, color: '#3b82f6' },
    { label: 'Total Cases', value: stats.cases, delta: `${stats.openCases} active`, icon: FileText, color: '#dc2626' },
    { label: 'Evidence Items', value: stats.evidence, delta: `${stats.analyzedEvidence} analyzed`, icon: Database, color: '#a855f7' },
    { label: 'System Security', value: 'Level 5', delta: 'Secure', icon: Shield, color: '#10b981' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">{'//'} OVERSIGHT AUTHORITY · LEVEL-5 CLEARANCE</p>
          <h1 className="page-title">
            Command <span>Center</span>
          </h1>
        </div>
      </div>

      <div className="responsive-grid-4" style={{ marginBottom: 28 }}>
        {STATS.map((s, i) => <StatCard key={i} stat={s} index={i} />)}
      </div>

      <div className="responsive-grid-2" style={{ gap: 20 }}>
        {/* Workload Audit */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="data-card"
          style={{ padding: 24 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ef4444', letterSpacing: '0.15em', marginBottom: 4 }}>{'//'} WORKLOAD AUDIT</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase' }}>
                Case Distribution
              </div>
            </div>
            <TrendingUp size={28} color="#10b981" />
          </div>

          <div style={{ display: 'grid', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", textTransform: 'uppercase' }}>INVESTIGATIONS</span>
                <span style={{ fontSize: 12, color: '#f4f4f5', fontWeight: 700 }}>{Math.round((stats.openCases / (stats.cases || 1)) * 100)}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.openCases / (stats.cases || 1)) * 100}%` }} style={{ height: '100%', background: '#dc2626', borderRadius: 3 }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", textTransform: 'uppercase' }}>FORENSIC PROCESSING</span>
                <span style={{ fontSize: 12, color: '#f4f4f5', fontWeight: 700 }}>{Math.round((stats.analyzedEvidence / (stats.evidence || 1)) * 100)}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.analyzedEvidence / (stats.evidence || 1)) * 100}%` }} style={{ height: '100%', background: '#a855f7', borderRadius: 3 }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 32, padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', textTransform: 'uppercase' }}>SYSTEM STATUS: ALL DEPARTMENTS OPERATIONAL</span>
            </div>
          </div>
        </motion.div>

        {/* Live Logs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="data-card"
          style={{ padding: 24 }}
        >
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ef4444', letterSpacing: '0.15em', marginBottom: 4 }}>{'//'} SYSTEM LOGS</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase' }}>
              Live Activity Feed
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <AnimatePresence>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '12px', fontFamily: "'Share Tech Mono', monospace" }}>
                  SYNCING WITH DATABASE...
                </div>
              ) : recentActions.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '12px', fontFamily: "'Share Tech Mono', monospace" }}>
                  NO RECENT ACTIVITY DETECTED.
                </div>
              ) : (
                recentActions.map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    key={item.id + i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4 }}
                  >
                    <div style={{ padding: '2px 6px', background: `${item.color}15`, border: `1px solid ${item.color}30`, borderRadius: 2, fontFamily: "'Share Tech Mono', monospace", fontSize: 8, color: item.color, flexShrink: 0, width: 70, textAlign: 'center' }}>
                      {item.tag}
                    </div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#d4d4d8', flex: 1 }}>{item.text}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#71717a' }}>{new Date(item.time).toLocaleTimeString()}</div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
}
