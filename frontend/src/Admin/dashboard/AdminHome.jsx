import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, Database, Shield, Activity, TrendingUp, Server, Lock, Globe, Zap, Microscope } from 'lucide-react';
import axios from 'axios';
import StatCard from '../components/StatCard';

export default function AdminHome() {
  const [stats, setStats] = useState({
    users: 0,
    cases: 0,
    evidence: 0,
    pendingUsers: 0,
    openCases: 0,
    analyzedEvidence: 0,
    sentToLab: 0
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
          analyzedEvidence: evidence.filter(e => e?.status === 'ANALYZED').length,
          sentToLab: evidence.filter(e => e?.status === 'SENT_TO_LAB').length
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
    { label: 'Staff Members', value: stats.users, delta: `+${stats.pendingUsers} pending`, icon: Users, color: '#3b82f6' },
    { label: 'COLLECTOR', value: stats.evidence, delta: 'Total Registered', icon: Database, color: '#ef4444' },
    { label: 'LAB', value: stats.sentToLab, delta: 'Collector → Lab', icon: Microscope, color: '#fbbf24' },
    { label: 'COURT', value: stats.analyzedEvidence, delta: 'Lab → Results', icon: Activity, color: '#34d399' },
  ];

  return (
    <>
      {/* NEW: Header Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, rgba(10, 10, 18, 0.8) 100%)', 
          padding: '40px 32px', 
          borderRadius: 8, 
          border: '1px solid rgba(255,255,255,0.05)',
          marginBottom: 32,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="page-eyebrow" style={{ fontSize: 10, color: '#ffffff', letterSpacing: '0.3em', fontWeight: 500, marginBottom: 12, opacity: 0.6 }}>
            SYSTEM STATUS: OK · {new Date().toLocaleDateString()}
          </p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 42, fontWeight: 300, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
            Welcome back, <span style={{ fontWeight: 600 }}>Admin</span>
          </h1>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: '#71717a', marginTop: 12, maxWidth: 600, lineHeight: 1.6 }}>
            This is your main control panel. You can manage users, track cases, and monitor system security from here.
          </p>
          
          <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={14} color="#22d3ee" />
              <span style={{ fontSize: 11, color: '#ffffff', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>System Uptime: 99.9%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={14} color="#3b82f6" />
              <span style={{ fontSize: 11, color: '#ffffff', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>Secure Nodes: 12</span>
            </div>
          </div>
        </div>
      </motion.div>

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
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, color: '#ffffff', letterSpacing: '0.15em', marginBottom: 4, fontWeight: 400 }}>{'//'} CASE STATUS</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 500, color: '#ffffff', textTransform: 'uppercase' }}>
                Case Summary
              </div>
            </div>
            <TrendingUp size={28} color="#10b981" />
          </div>

          <div style={{ display: 'grid', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: '#71717a', fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>INVESTIGATIONS</span>
                <span style={{ fontSize: 10, color: '#ffffff', fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{Math.round((stats.openCases / (stats.cases || 1)) * 100)}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.openCases / (stats.cases || 1)) * 100}%` }} style={{ height: '100%', background: '#dc2626', borderRadius: 3 }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: '#71717a', fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>FORENSIC PROCESSING</span>
                <span style={{ fontSize: 10, color: '#ffffff', fontWeight: 500, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{Math.round((stats.analyzedEvidence / (stats.evidence || 1)) * 100)}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.analyzedEvidence / (stats.evidence || 1)) * 100}%` }} style={{ height: '100%', background: '#a855f7', borderRadius: 3 }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 32, padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, color: '#71717a', textTransform: 'uppercase' }}>SYSTEM STATUS: ALL DEPARTMENTS OPERATIONAL</span>
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
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, color: '#ffffff', letterSpacing: '0.15em', marginBottom: 4, fontWeight: 400 }}>{'//'} ACTIVITY LOG</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 500, color: '#ffffff', textTransform: 'uppercase' }}>
              Latest Actions
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <AnimatePresence>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '10px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  SYNCING WITH DATABASE...
                </div>
              ) : recentActions.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '10px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  NO RECENT ACTIVITY DETECTED.
                </div>
              ) : (
                recentActions.map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    key={item.id + i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4 }}
                  >
                    <div style={{ padding: '2px 6px', background: `${item.color}15`, border: `1px solid ${item.color}30`, borderRadius: 2, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 8, color: item.color, flexShrink: 0, width: 70, textAlign: 'center', fontWeight: 500 }}>
                      {item.tag}
                    </div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#ffffff', flex: 1, fontWeight: 300 }}>{item.text}</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, color: '#71717a' }}>{new Date(item.time).toLocaleTimeString()}</div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, color: '#ffffff', letterSpacing: '0.15em', marginBottom: 4, fontWeight: 400 }}>{'//'} SYSTEM HEALTH</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 300, color: '#ffffff' }}>System <span style={{ fontWeight: 600 }}>Overview</span></h2>
        </div>

        <div className="responsive-grid-3">
          {/* Node Status */}
          <motion.div whileHover={{ y: -5 }} className="data-card" style={{ padding: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ padding: 8, background: 'rgba(34, 211, 238, 0.1)', borderRadius: 8, display: 'flex' }}>
                <Server size={18} color="#22d3ee" />
              </div>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#ffffff', fontWeight: 500 }}>Servers</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <div key={n} style={{ height: 4, background: n === 5 ? 'rgba(255,255,255,0.1)' : '#22d3ee', borderRadius: 2, boxShadow: n === 5 ? 'none' : '0 0 10px rgba(34, 211, 238, 0.4)' }} />
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 10, color: '#71717a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>4/5 SERVERS ACTIVE · 24MS</div>
          </motion.div>

          {/* Security Protocols */}
          <motion.div whileHover={{ y: -5 }} className="data-card" style={{ padding: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ padding: 8, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 8, display: 'flex' }}>
                <Lock size={18} color="#3b82f6" />
              </div>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#ffffff', fontWeight: 500 }}>Security Status</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', background: '#3b82f6' }} />
              </div>
              <span style={{ fontSize: 11, color: '#ffffff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>92%</span>
            </div>
            <div style={{ marginTop: 12, fontSize: 10, color: '#71717a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ENCRYPTION: ENABLED</div>
          </motion.div>

          {/* Network Traffic */}
          <motion.div whileHover={{ y: -5 }} className="data-card" style={{ padding: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ padding: 8, background: 'rgba(168, 85, 247, 0.1)', borderRadius: 8, display: 'flex' }}>
                <Globe size={18} color="#a855f7" />
              </div>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#ffffff', fontWeight: 500 }}>Traffic Load</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 20 }}>
              {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.7].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h * 100}%`, background: '#a855f7', borderRadius: 1 }} />
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 10, color: '#71717a', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TRAFFIC LOAD: NOMINAL</div>
          </motion.div>
      </div>
    </div>
      {/* NEW: System Diagnostics Footer */}
      <div style={{ marginTop: 28, padding: 24, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: 9, color: '#71717a', fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: 'uppercase', marginBottom: 4 }}>Memory Usage</div>
              <div style={{ fontSize: 13, color: '#ffffff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>1.2GB / 8GB</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#71717a', fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: 'uppercase', marginBottom: 4 }}>CPU Load</div>
              <div style={{ fontSize: 13, color: '#ffffff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>14%</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#71717a', fontFamily: "'Plus Jakarta Sans', sans-serif", textTransform: 'uppercase', marginBottom: 4 }}>Active Processes</div>
              <div style={{ fontSize: 13, color: '#ffffff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>124</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#10b981', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>● ALL SYSTEMS NOMINAL</div>
            <div style={{ fontSize: 9, color: '#71717a', fontFamily: "'Plus Jakarta Sans', sans-serif", marginTop: 2 }}>LAST SYNC: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
