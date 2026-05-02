import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, FileText, CheckCircle, Scale } from 'lucide-react';
import axios from 'axios';
import StatCard from '../../Admin/components/StatCard';

export default function CourtOverview() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/cases');
        setCases(res.data || []);
      } catch (err) {
        console.error('Error fetching court data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeHearings = cases.filter(c => c.status === 'FILED_IN_COURT').length;
  const closedCases = cases.filter(c => c.status === 'CLOSED').length;
  const inInvestigation = cases.filter(c => c.status !== 'CLOSED' && c.status !== 'FILED_IN_COURT').length;

  const STATS = [
    { label: 'Active Hearings', value: activeHearings, icon: Gavel, color: '#fbbf24', delta: 'Pending verdict' },
    { label: 'Closed Cases', value: closedCases, icon: CheckCircle, color: '#34d399', delta: 'Final judgments' },
    { label: 'Pre-Court Review', value: inInvestigation, icon: FileText, color: '#60a5fa', delta: 'Evidence phase' },
    { label: 'Total Case Files', value: cases.length, icon: Scale, color: '#ef4444', delta: 'Judicial registry' },
  ];

  // Activities
  const activities = cases.slice(0, 5).map(c => ({
    id: c._id,
    tag: c.status.toUpperCase(),
    text: `Case ${c.caseId} - ${c.title} - Status changed to: ${c.status}`,
    time: c.date || 'Recent',
    color: c.status === 'FILED_IN_COURT' ? '#fbbf24' : (c.status === 'CLOSED' ? '#34d399' : '#60a5fa')
  }));

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">{'//'} LEGAL AFFAIRS</p>
          <h1 className="page-title">
            Court <span>Terminal</span>
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
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#dc2626', letterSpacing: '0.15em' }}>{'//'} RECENT LEGAL ACTIVITY</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>
            Court Registry Updates
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <AnimatePresence>
            {loading ? (
               <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '13px', fontFamily: "'Share Tech Mono', monospace" }}>
                 CONTACTING COURT RECORDS...
               </div>
            ) : activities.length === 0 ? (
               <div style={{ padding: '20px', textAlign: 'center', color: '#71717a', fontSize: '13px', fontFamily: "'Share Tech Mono', monospace" }}>
                 NO RECENT JUDGMENT ACTIVITY DETECTED.
               </div>
            ) : (
                activities.map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 4 }}
                  >
                    <div style={{ padding: '6px 12px', background: `${item.color}15`, border: `1px solid ${item.color}30`, borderRadius: 3, fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: item.color, flexShrink: 0, width: 100, textAlign: 'center', fontWeight: 700 }}>
                      {item.tag}
                    </div>
                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 16, color: '#ffffff', flex: 1, fontWeight: 500 }}>{item.text}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#71717a' }}>{item.time}</div>
                  </motion.div>
                ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
