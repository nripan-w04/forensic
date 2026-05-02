import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, ShieldAlert, Archive } from 'lucide-react';
import axios from 'axios';
import StatCard from '../../Admin/components/StatCard';

export default function EvidenceOverview() {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/evidence');
        setEvidence(res.data || []);
      } catch (err) {
        console.error('Error fetching evidence logistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalCount = evidence.length;
  const inLabCount = evidence.filter(e => e.status === 'SENT_TO_LAB').length;
  const collectedCount = evidence.filter(e => e.status === 'COLLECTED').length;
  const analyzedCount = evidence.filter(e => e.status === 'ANALYZED').length;

  const STATS = [
    { label: 'Total Registered', value: totalCount, icon: Package, color: '#3b82f6', delta: 'Database size' },
    { label: 'In Laboratory', value: inLabCount, icon: Truck, color: '#fbbf24', delta: 'Under analysis' },
    { label: 'Field Collected', value: collectedCount, icon: ShieldAlert, color: '#34d399', delta: 'Awaiting transfer' },
    { label: 'Analyzed Results', value: analyzedCount, icon: Archive, color: '#71717a', delta: 'Reports received' },
  ];

  // Dynamic activity log based on real evidence
  const activities = evidence.slice(0, 5).map(e => ({
    id: e._id,
    tag: e.status,
    text: `Evidence ${e.evidenceId} (${e.type}) - ${e.status.replace(/_/g, ' ')}`,
    time: e.collectedDate || 'Recent',
    color: e.status === 'ANALYZED' ? '#34d399' : (e.status === 'SENT_TO_LAB' ? '#fbbf24' : '#3b82f6')
  }));

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">// FIELD UNIT</p>
          <h1 className="page-title">
            Evidence <span>Logistics</span>
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
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#ef4444', letterSpacing: '0.15em' }}>// PROTOCOL LOG</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase' }}>
            Chain of Custody Events
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <AnimatePresence>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '13px', fontFamily: "'Share Tech Mono', monospace" }}>
                RETRIEVING LOGISTICS DATA...
              </div>
            ) : activities.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '13px', fontFamily: "'Share Tech Mono', monospace" }}>
                NO RECENT LOGISTICS ACTIVITY DETECTED.
              </div>
            ) : (
              activities.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  key={item.id + i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4 }}
                >
                  <div style={{ padding: '4px 8px', background: `${item.color}15`, border: `1px solid ${item.color}30`, borderRadius: 3, fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: item.color, flexShrink: 0, width: 90, textAlign: 'center' }}>
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
