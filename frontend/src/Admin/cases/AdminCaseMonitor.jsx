import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, X } from 'lucide-react';
import axios from 'axios';

export default function AdminCaseMonitor() {
  const [cases, setCases] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [search, setSearch] = useState('');
  const [viewingCase, setViewingCase] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [caseRes, evidenceRes] = await Promise.all([
          axios.get('http://localhost:4000/api/cases'),
          axios.get('http://localhost:4000/api/evidence')
        ]);
        setCases(caseRes.data || []);
        setEvidence(evidenceRes.data || []);
      } catch (err) {
        console.error("Audit Failure:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">{'//'} OVERSIGHT AUTHORITY · GLOBAL MONITOR</p>
          <h1 className="page-title">
            Case <span>Registry</span>
          </h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="data-card"
      >
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ef4444', marginBottom: 4 }}>{'//'} SYSTEM OVERSIGHT</div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>Global Case Monitor</h3>
          </div>
          <div style={{ position: 'relative' }}>
             <Search size={18} color="#71717a" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
             <input 
              type="text" 
              placeholder="Filter by Officer or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px 10px 42px', borderRadius: 4, color: '#ffffff', fontSize: 14, outline: 'none', width: 280, fontFamily: "'Share Tech Mono', monospace" }}
            />
          </div>
        </div>
        
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Officer</th>
                <th>Incident</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#71717a', fontSize: 13 }}>
                    AUDITING GLOBAL RECORDS...
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#71717a', fontSize: 13 }}>
                    NO ACTIVE CASES FOUND IN SYSTEM.
                  </td>
                </tr>
              ) : (
                cases.filter(c => 
                  c.caseId.toLowerCase().includes(search.toLowerCase()) || 
                  (c.investigatingOfficer && c.investigatingOfficer.toLowerCase().includes(search.toLowerCase()))
                ).map((c, i) => (
                  <tr key={c._id}>
                    <td style={{ color: '#3b82f6', fontFamily: "'Share Tech Mono', monospace", fontWeight: 700 }}>{c.caseId}</td>
                    <td>{c.investigatingOfficer || 'UNASSIGNED'}</td>
                    <td style={{ fontWeight: 600 }}>{c.title}</td>
                    <td>
                      <div className={`badge ${c.status === 'CLOSED' ? 'badge-approved' : 'badge-pending'}`}>
                        {c.status}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => setViewingCase(c)}
                        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '6px 14px', borderRadius: 4, fontSize: 11, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", textTransform: 'uppercase' }}
                      >
                        Summary
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {viewingCase && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(4,4,10,0.95)', backdropFilter: 'blur(10px)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ width: '100%', maxWidth: 1000, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ef4444', marginBottom: 4 }}>OVERSIGHT SUMMARY · {viewingCase.caseId}</div>
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase' }}>{viewingCase.title}</h2>
                  </div>
                  <button 
                    onClick={() => setViewingCase(null)} 
                    style={{ background: '#ef4444', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '10px 20px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Share Tech Mono', monospace", fontSize: 12, fontWeight: 700 }}
                  >
                    <X size={16} /> CLOSE
                  </button>
               </div>

               <div className="responsive-grid-2" style={{ gap: 32 }}>
                  {/* Left Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 12, letterSpacing: '0.1em' }}>{'//'} 1. INVESTIGATION OVERVIEW</div>
                      <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div>
                              <label style={{ display: 'block', fontSize: 10, color: '#71717a', marginBottom: 4 }}>FIR NUMBER</label>
                              <div style={{ color: '#f4f4f5', fontSize: 14, fontWeight: 700 }}>{viewingCase.firNumber || 'N/A'}</div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: 10, color: '#71717a', marginBottom: 4 }}>CRIME TYPE</label>
                              <div style={{ color: '#f4f4f5', fontSize: 14, fontWeight: 700 }}>{viewingCase.category || 'N/A'}</div>
                            </div>
                         </div>
                         <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 10, color: '#71717a', marginBottom: 4 }}>LOCATION & DATE</label>
                            <div style={{ color: '#f4f4f5', fontSize: 13 }}>{viewingCase.location} · {viewingCase.date}</div>
                         </div>
                         <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: 10, color: '#71717a', marginBottom: 4 }}>DESCRIPTION</label>
                            <p style={{ color: '#d4d4d8', fontSize: 13, lineHeight: 1.5 }}>{viewingCase.description}</p>
                         </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 12, letterSpacing: '0.1em' }}>{'//'} 2. PERSONNEL AUDIT</div>
                      <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div>
                              <label style={{ display: 'block', fontSize: 10, color: '#71717a', marginBottom: 4 }}>OFFICER</label>
                              <div style={{ color: '#3b82f6', fontSize: 14, fontWeight: 700 }}>{viewingCase.investigatingOfficer || 'PENDING'}</div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: 10, color: '#71717a', marginBottom: 4 }}>COURT AUTHORITY</label>
                              <div style={{ color: '#f4f4f5', fontSize: 14, fontWeight: 700 }}>{viewingCase.courtAuthority || 'REVIEW PENDING'}</div>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Evidence */}
                  <div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 12, letterSpacing: '0.1em' }}>{'//'} 3. FORENSIC MATRIX</div>
                    <div style={{ display: 'grid', gap: 12 }}>
                      {evidence.filter(e => e.caseId === viewingCase.caseId).map(e => (
                        <div key={e._id} style={{ padding: 16, background: '#111116', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#3b82f6' }}>{e.evidenceId}</span>
                            <span style={{ fontSize: 9, padding: '2px 8px', background: 'rgba(168,85,247,0.1)', borderRadius: 2, color: '#d8b4fe', textTransform: 'uppercase' }}>{e.type}</span>
                          </div>
                          <div style={{ fontSize: 13, color: '#d4d4d8' }}>{e.description}</div>
                        </div>
                      ))}
                      {evidence.filter(e => e.caseId === viewingCase.caseId).length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 4, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }}>
                          NO EVIDENCE RECORDS DETECTED.
                        </div>
                      )}
                    </div>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
