import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, AlertTriangle, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import StatCard from '../../Admin/components/StatCard';

export default function PoliceOverview() {
  const [cases, setCases] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [caseRes, evidenceRes] = await Promise.all([
          axios.get('http://localhost:4000/api/cases'),
          axios.get('http://localhost:4000/api/evidence')
        ]);
        setCases(caseRes.data || []);
        setEvidence(evidenceRes.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const activeCasesCount = cases.filter(c => c.status !== 'CLOSED').length;
  const inLabCount = cases.filter(c => c.status === 'SENT_TO_LAB').length;
  const reportsReadyCount = cases.filter(c => c.status === 'REPORT_READY' || c.status === 'ANALYZED').length;

  const STATS = [
    { label: 'Active Cases', value: activeCasesCount, icon: Search, color: '#3b82f6', delta: 'Ongoing investigations' },
    { label: 'In Forensic Lab', value: inLabCount, icon: FileText, color: '#fbbf24', delta: 'Awaiting lab action' },
    { label: 'Reports Ready', value: reportsReadyCount, icon: AlertTriangle, color: '#34d399', delta: 'Available for review' },
    { label: 'Total Investigations', value: cases.length, icon: ShieldAlert, color: '#ef4444', delta: 'Total records' },
  ];

  // Combine cases and evidence to create a dynamic activity log, sorted by date in memory
  // In a real application, created/updated timestamps would be preferred.
  // We'll mimic activity by using the latest 4 cases/evidence.
  const activities = [
    ...cases.map(c => ({
      id: c._id,
      tag: 'CASE UPDATE',
      text: `Case ${c.caseId} registered: ${c.title}.`,
      time: c.date || 'Recent',
      color: '#3b82f6'
    })),
    ...evidence.map(e => ({
      id: e._id,
      tag: 'EVIDENCE LOG',
      text: `Evidence ${e.evidenceId} logged for ${e.caseId}.`,
      time: e.collectedDate || 'Recent',
      color: '#fbbf24'
    }))
  ].slice(0, 5); // Take the latest 5 items assuming they are fetched in sort order from backend

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">{'//'} POLICE DEPARTMENT</p>
          <h1 className="page-title">
            Investigation <span>Terminal</span>
          </h1>
        </div>
      </div>

      <div className="responsive-grid-4" style={{ marginBottom: 28 }}>
        {STATS.map((s, i) => <StatCard key={i} stat={s} index={i} />)}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: 24 }}
      >
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#ef4444', letterSpacing: '0.15em' }}>{'//'} RECENT ACTIVITY LOG</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase' }}>
            Precinct Dispatch Updates
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <AnimatePresence>
            {loading ? (
               <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '13px', fontFamily: "'Share Tech Mono', monospace" }}>
                 SYNCING WITH FORENSIC MAINFRAME...
               </div>
            ) : activities.length === 0 ? (
               <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '13px', fontFamily: "'Share Tech Mono', monospace" }}>
                 NO RECENT DISPATCH ACTIVITY DETECTED.
               </div>
            ) : (
                activities.map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    key={item.id + i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4 }}
                  >
                    <div style={{ padding: '4px 8px', background: `${item.color}15`, border: `1px solid ${item.color}30`, borderRadius: 3, fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: item.color, flexShrink: 0, width: 80, textAlign: 'center' }}>
                      {item.tag}
                    </div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#d4d4d8', flex: 1 }}>{item.text}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#71717a' }}>{item.time}</div>
                  </motion.div>
                ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
