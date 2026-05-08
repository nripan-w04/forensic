import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, FileText, ShieldAlert, Zap, Search as SearchIcon, Cpu } from 'lucide-react';
import axios from 'axios';

export default function PoliceEvidenceView() {
  const [search, setSearch] = useState('');
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingReport, setViewingReport] = useState(null);
  const [viewingInsight, setViewingInsight] = useState(null);


  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/evidence');
        setEvidence(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvidence();
  }, []);

  const filtered = evidence.filter(e =>
    e.evidenceId.toLowerCase().includes(search.toLowerCase()) ||
    e.caseId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 5 }}>
        <div>
          <p className="page-eyebrow">// RECORDS DEPARTMENT</p>
          <h1 className="page-title">
            Evidence <span>Registry</span>
          </h1>
        </div>
        <div style={{ position: 'relative', width: 250 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
          <input type="text" placeholder="Search case or evidence ID..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', height: 38, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '0 14px 0 36px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, outline: 'none' }} />
        </div>
      </div>

      <div className="data-card table-wrap" style={{ position: 'relative' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Tag ID / Case</th>
              <th>Type / Description</th>
              <th>Collector</th>
              <th>Custody Status</th>
              <th>Neural Insights</th>
              <th>Lab Reports</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#71717a', fontSize: 12 }}>UNLOCKING CUSTODY LOGS...</td></tr>}
              {!loading && filtered.map((e, i) => (
                <motion.tr key={e._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <td>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#f4f4f5', fontWeight: 600 }}>{e.evidenceId}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#3b82f6', marginTop: 4 }}>Case: {e.caseId}</div>
                  </td>
                  <td>
                    <div style={{ display: 'inline-block', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: 2, fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#a1a1aa', marginBottom: 4, textTransform: 'uppercase' }}>{e.type}</div>
                    <div style={{ fontSize: 15, color: '#d4d4d8', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 15, color: '#e4e4e7' }}>{e.collectedBy}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginTop: 4 }}>{e.collectedDate}</div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '4px 8px', borderRadius: 3, fontFamily: "'Share Tech Mono', monospace", fontSize: 14, textTransform: 'uppercase',
                        background: e.status === 'Logged' ? 'rgba(59,130,246,0.1)' : e.status === 'In Lab' ? 'rgba(251,191,36,0.1)' : e.status === 'Analyzed' ? 'rgba(52,211,153,0.1)' : 'rgba(113,113,122,0.1)',
                        color: e.status === 'Logged' ? '#60a5fa' : e.status === 'In Lab' ? '#fbbf24' : e.status === 'Analyzed' ? '#34d399' : '#a1a1aa',
                        border: `1px solid ${e.status === 'Logged' ? '#60a5fa40' : e.status === 'In Lab' ? '#fbbf2440' : e.status === 'Analyzed' ? '#34d39940' : '#71717a40'}`
                      }}
                    >
                      {e.status}
                    </div>
                  </td>
                   <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {e.aiStrength && (
                        <button 
                          onClick={() => setViewingInsight({ title: 'STRENGTH ANALYSIS', content: e.aiStrength, color: '#d8b4fe', icon: <ShieldAlert size={14} /> })}
                          style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', color: '#d8b4fe', padding: '4px 8px', borderRadius: 4, fontSize: 9, fontFamily: "'Share Tech Mono', monospace", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content' }}
                        >
                          <ShieldAlert size={12} /> STR
                        </button>
                      )}
                      {e.aiPriority && (
                        <button 
                          onClick={() => setViewingInsight({ title: 'PRIORITY ASSESSMENT', content: e.aiPriority, color: '#60a5fa', icon: <Zap size={14} /> })}
                          style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', padding: '4px 8px', borderRadius: 4, fontSize: 9, fontFamily: "'Share Tech Mono', monospace", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content' }}
                        >
                          <Zap size={12} /> PRI
                        </button>
                      )}
                      {e.aiRecommendations && (
                        <button 
                          onClick={() => setViewingInsight({ title: 'EVIDENCE RECOMMENDATIONS', content: e.aiRecommendations, color: '#34d399', icon: <Cpu size={14} /> })}
                          style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', padding: '4px 8px', borderRadius: 4, fontSize: 9, fontFamily: "'Share Tech Mono', monospace", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content' }}
                        >
                          <Cpu size={12} /> REC
                        </button>
                      )}
                      {!e.aiStrength && !e.aiPriority && !e.aiRecommendations && (
                        <span style={{ fontSize: 10, color: '#52525b', fontFamily: "'Share Tech Mono', monospace" }}>NO DIAGNOSTICS</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="custom-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', maxWidth: 120, paddingBottom: 4 }}>
                      {e.labReports?.map((path, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => setViewingReport(`http://localhost:4000/${path}`)}
                          style={{ flexShrink: 0, padding: '4px 8px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 3, color: '#34d399', fontSize: 9, display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Share Tech Mono', monospace", cursor: 'pointer' }}
                        >
                          <FileText size={12} /> {idx + 1}
                        </button>
                      ))}
                      {(!e.labReports || e.labReports.length === 0) && (
                        <span style={{ fontSize: 10, color: '#52525b', fontFamily: "'Share Tech Mono', monospace" }}>PENDING</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#52525b', fontSize: 11, letterSpacing: '0.1em' }}>NO EVIDENCE MATCHING QUERY</td>
              </tr>
            )}
          </tbody>
        </table>


        {/* Insight Detail Modal */}
        <AnimatePresence>
          {viewingInsight && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setViewingInsight(null)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001 }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{ width: '100%', maxWidth: 500, background: '#0a0a12', border: `1px solid ${viewingInsight.color}40`, borderRadius: 8, overflow: 'hidden' }}
              >
                <div style={{ padding: '20px 24px', background: `${viewingInsight.color}05`, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ color: viewingInsight.color }}>{viewingInsight.icon}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: viewingInsight.color, fontWeight: 700, letterSpacing: '0.1em' }}>{viewingInsight.title}</div>
                  </div>
                  <button onClick={() => setViewingInsight(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <div className="custom-scroll" style={{ padding: 32, maxHeight: '60vh', overflowY: 'auto' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, padding: 24, color: '#f4f4f5', fontSize: 16, fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {viewingInsight.content}
                  </div>
                </div>
                <div style={{ padding: '0 32px 32px 32px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setViewingInsight(null)} style={{ background: viewingInsight.color, color: '#000', border: 'none', padding: '8px 24px', borderRadius: 4, fontFamily: "'Share Tech Mono', monospace", fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>ACKNOWLEDGE</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Report Viewer Modal */}
        <AnimatePresence>
          {viewingReport && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setViewingReport(null)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ width: '90vw', height: '90vh', background: '#0a0a12', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 8, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              >
                <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#34d399', fontWeight: 700 }}>FORENSIC_ANALYSIS_REPORT.PDF</div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <a href={viewingReport} download style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399', padding: '6px 12px', borderRadius: 4, textDecoration: 'none', fontSize: 11, fontFamily: "'Share Tech Mono', monospace" }}>DOWNLOAD</a>
                    <button onClick={() => setViewingReport(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={20} /></button>
                  </div>
                </div>
                <iframe src={viewingReport} title="Lab Report" style={{ width: '100%', height: '100%', border: 'none' }} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
