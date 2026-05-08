import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Microscope, Package, AlertTriangle, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import StatCard from '../../Admin/components/StatCard';

export default function LabOverview() {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/evidence');
        setEvidence(res.data || []);
      } catch (err) {
        console.error('Error fetching lab data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingAnalysis = evidence.filter(e => e.status === 'SENT_TO_LAB').length;
  const completedAnalyses = evidence.filter(e => e.status === 'ANALYZED').length;
  const awaitingReceipt = evidence.filter(e => e.status === 'LOGGED' || e.status === 'COLLECTED').length;
  
  const STATS = [
    { label: 'COLLECTOR', value: evidence.length, icon: Package, color: '#ef4444', delta: 'Total Registered' },
    { label: 'LAB', value: pendingAnalysis, icon: Microscope, color: '#fbbf24', delta: 'Collector → Lab' },
    { label: 'COURT', value: completedAnalyses, icon: Activity, color: '#34d399', delta: 'Lab → Results' },
    { label: 'POLICE', value: awaitingReceipt, icon: ShieldAlert, color: '#3b82f6', delta: 'Awaiting Hub' },
  ];

  // Activities
  const activities = evidence.slice(0, 5).map(e => ({
    id: e._id,
    tag: e.status.toUpperCase(),
    text: `Evidence ${e.evidenceId} - ${e.type} - Status: ${e.status}`,
    time: e.collectedDate || 'Recent',
    color: e.status === 'ANALYZED' ? '#34d399' : '#fbbf24'
  }));

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">{'//'} FORENSIC LABORATORY</p>
          <h1 className="page-title">
            Analysis <span>Module</span>
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
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#ef4444', letterSpacing: '0.15em' }}>{'//'} RECENT LAB ACTIVITY</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase' }}>
            Equipment & Logs
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <AnimatePresence>
            {loading ? (
               <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '13px', fontFamily: "'Share Tech Mono', monospace" }}>
                 CALIBRATING INSTRUMENTS...
               </div>
            ) : activities.length === 0 ? (
               <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '13px', fontFamily: "'Share Tech Mono', monospace" }}>
                 NO RECENT ACTIVITY DETECTED.
               </div>
            ) : (
                activities.map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4 }}
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
