import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Activity, Search, X } from 'lucide-react';
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#dc2626', letterSpacing: '0.25em', marginBottom: 6 }}>
          // OVERSIGHT AUTHORITY · GLOBAL MONITOR
        </div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 42, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.03em', lineHeight: 1 }}>
          Case <span>Files</span>
        </h1>
      </motion.div>

      <div className="data-card" style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#dc2626', marginBottom: 4 }}>// SYSTEM OVERSIGHT</div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>Global Case Monitor</h3>
          </div>
          <div style={{ position: 'relative' }}>
             <input 
              type="text" 
              placeholder="Filter by Officer or Case ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 4, color: '#ffffff', fontSize: 14, outline: 'none', width: 250, fontFamily: "'Share Tech Mono', monospace" }}
            />
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 13, fontFamily: "'Share Tech Mono', monospace", color: '#ffffff' }}>ID</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 13, fontFamily: "'Share Tech Mono', monospace", color: '#ffffff' }}>OFFICER</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 13, fontFamily: "'Share Tech Mono', monospace", color: '#ffffff' }}>INCIDENT</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: 13, fontFamily: "'Share Tech Mono', monospace", color: '#ffffff' }}>STATUS</th>
                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: 13, fontFamily: "'Share Tech Mono', monospace", color: '#ffffff' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#ffffff', fontSize: 11, letterSpacing: '0.12em' }}>
                    AUDITING GLOBAL RECORDS...
                  </td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#ffffff', fontSize: 11, letterSpacing: '0.12em' }}>
                    NO ACTIVE CASES FOUND IN SYSTEM
                  </td>
                </tr>
              ) : (
                cases.filter(c => 
                  c.caseId.toLowerCase().includes(search.toLowerCase()) || 
                  (c.investigatingOfficer && c.investigatingOfficer.toLowerCase().includes(search.toLowerCase()))
                ).map((c, i) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontFamily: "'Share Tech Mono', monospace", color: '#3b82f6' }}>{c.caseId}</td>
                    <td style={{ padding: '14px 20px', fontSize: 15, color: '#ffffff' }}>{c.investigatingOfficer || 'UNASSIGNED'}</td>
                    <td style={{ padding: '14px 20px', fontSize: 16, color: '#ffffff', fontWeight: 600 }}>{c.title}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: 2, background: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontSize: 11, border: '1px solid rgba(59,130,246,0.2)', fontFamily: "'Share Tech Mono', monospace" }}>{c.status}</span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button 
                        onClick={() => setViewingCase(c)}
                        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '4px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace" }}
                      >
                        SUMMARY
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {viewingCase && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.95)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ width: '100%', maxWidth: 1000, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: 40, maxHeight: '90vh', overflowY: 'auto' }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                  <div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#dc2626', marginBottom: 8 }}>OVERSIGHT SUMMARY · {viewingCase.caseId}</div>
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase' }}>{viewingCase.title}</h2>
                  </div>
                  <button 
                    onClick={() => setViewingCase(null)} 
                    style={{ background: '#dc2626', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '12px 24px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Share Tech Mono', monospace", fontSize: 13, fontWeight: 700 }}
                  >
                    <X size={16} /> CLOSE
                  </button>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                  {/* Left Column: Investigative & Legal */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {/* Incident Summary */}
                    <div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#ffffff', marginBottom: 16, letterSpacing: '0.1em' }}>1. INVESTIGATION OVERVIEW</div>
                      <div style={{ padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                            <div>
                              <label style={{ display: 'block', fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 4 }}>FIR NUMBER</label>
                              <div style={{ color: '#ffffff', fontSize: 15, fontWeight: 700 }}>{viewingCase.firNumber || 'N/A'}</div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 4 }}>CRIME TYPE</label>
                              <div style={{ color: '#ffffff', fontSize: 15, fontWeight: 700 }}>{viewingCase.category || 'N/A'}</div>
                            </div>
                         </div>
                         <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 4 }}>INCIDENT LOCATION & DATE</label>
                            <div style={{ color: '#ffffff', fontSize: 14 }}>{viewingCase.location} · {viewingCase.date}</div>
                         </div>
                         <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 4 }}>SUMMARY DESCRIPTION</label>
                            <p style={{ color: '#ffffff', fontSize: 14, lineHeight: 1.6 }}>{viewingCase.description}</p>
                         </div>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div>
                              <label style={{ display: 'block', fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 4 }}>OFFICER IN CHARGE</label>
                              <div style={{ color: '#60a5fa', fontSize: 14, fontWeight: 600 }}>{viewingCase.investigatingOfficer || 'UNASSIGNED'}</div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 4 }}>EVIDENCE TEAM</label>
                              <div style={{ color: '#ffffff', fontSize: 14 }}>{viewingCase.assignedEvidenceTeam || 'N/A'}</div>
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Personnel Audit Section */}
                    <div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#ffffff', marginBottom: 16, letterSpacing: '0.1em' }}>2. PERSONNEL AUDIT</div>
                      <div style={{ padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                            <div>
                              <label style={{ display: 'block', fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 4 }}>INVESTIGATING OFFICER</label>
                              <div style={{ color: '#60a5fa', fontSize: 15, fontWeight: 700 }}>{viewingCase.investigatingOfficer || 'PENDING ASSIGNMENT'}</div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 4 }}>COURT AUTHORITY</label>
                              <div style={{ color: '#ffffff', fontSize: 15, fontWeight: 700 }}>{viewingCase.courtAuthority || 'JUDICIAL REVIEW PENDING'}</div>
                            </div>
                         </div>
                         <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20 }}>
                            <label style={{ display: 'block', fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 12 }}>LAB ANALYSTS (BY EVIDENCE)</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                               {evidence.filter(e => e.caseId === viewingCase.caseId && e.findingsSummary).map((e, idx) => (
                                 <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: 4 }}>
                                    <span style={{ fontSize: 12, color: '#ffffff' }}>{e.analystName || 'Senior Lab Analyst'}</span>
                                    <span style={{ fontSize: 9, color: '#ffffff', opacity: 0.5, fontFamily: "'Share Tech Mono', monospace" }}>REF: {e.evidenceId}</span>
                                 </div>
                               ))}
                               {evidence.filter(e => e.caseId === viewingCase.caseId && e.findingsSummary).length === 0 && (
                                 <div style={{ fontSize: 12, color: '#ffffff', opacity: 0.3, fontStyle: 'italic' }}>NO LAB ANALYSIS RECORDED YET</div>
                               )}
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Suspects & Legal */}
                    <div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#ffffff', marginBottom: 16, letterSpacing: '0.1em' }}>3. JUDICIAL & LEGAL STATUS</div>
                      <div style={{ padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                         <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 8 }}>IDENTIFIED SUSPECTS</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                               {viewingCase.suspects && viewingCase.suspects.length > 0 ? viewingCase.suspects.map((s, idx) => (
                                 <span key={idx} style={{ padding: '4px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 4, fontSize: 12 }}>{s}</span>
                               )) : <span style={{ color: '#ffffff', opacity: 0.3, fontSize: 12 }}>NO SUSPECTS LOGGED</span>}
                            </div>
                         </div>
                         <div style={{ marginBottom: 20 }}>
                            <label style={{ display: 'block', fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 4 }}>LEGAL COUNSEL NOTES</label>
                            <p style={{ color: '#ffffff', fontSize: 14, fontStyle: 'italic' }}>{viewingCase.legalNotes || 'NO LEGAL NOTES RECORDED'}</p>
                         </div>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div>
                              <label style={{ display: 'block', fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 4 }}>COURT STATUS</label>
                              <div style={{ color: '#fbbf24', fontSize: 13, fontFamily: "'Share Tech Mono', monospace" }}>{viewingCase.status}</div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 4 }}>HEARING COUNT</label>
                              <div style={{ color: '#ffffff', fontSize: 14 }}>{viewingCase.hearingDates?.length || 0} SCHEDULED</div>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Evidence Deep-Dive */}
                  <div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#ffffff', marginBottom: 16, letterSpacing: '0.1em' }}>3. FORENSIC EVIDENCE MATRIX</div>
                    <div style={{ display: 'grid', gap: 16 }}>
                      {evidence.filter(e => e.caseId === viewingCase.caseId).map(e => (
                        <div key={e._id} style={{ padding: 20, background: '#111116', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                            <div>
                              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#3b82f6', display: 'block' }}>{e.evidenceId}</span>
                              <span style={{ fontSize: 11, color: '#ffffff', opacity: 0.5 }}>Barcode: {e.barcode || 'UNASSIGNED'}</span>
                            </div>
                            <span style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 4, color: '#d8b4fe', textTransform: 'uppercase' }}>{e.type}</span>
                          </div>
                          
                          <div style={{ fontSize: 14, color: '#ffffff', marginBottom: 16, padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 4 }}>{e.description}</div>
                          
                          <div style={{ display: 'grid', gap: 12 }}>
                             {e.preliminaryAI && (
                               <div style={{ padding: '8px 12px', background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 4 }}>
                                 <div style={{ fontSize: 9, color: '#34d399', marginBottom: 4, fontFamily: "'Share Tech Mono', monospace" }}>// PRELIMINARY AI SCAN</div>
                                 <div style={{ fontSize: 13, color: '#ffffff', fontWeight: 600 }}>{e.preliminaryAI}</div>
                               </div>
                             )}
                             
                             {e.findingsSummary && (
                               <div style={{ padding: '8px 12px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 4 }}>
                                 <div style={{ fontSize: 9, color: '#60a5fa', marginBottom: 4, fontFamily: "'Share Tech Mono', monospace" }}>// LAB ANALYSIS FINDINGS</div>
                                 <div style={{ fontSize: 13, color: '#ffffff' }}>{e.findingsSummary}</div>
                               </div>
                             )}

                             <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                                <div style={{ fontSize: 9, color: '#ffffff', opacity: 0.4, marginBottom: 6, fontFamily: "'Share Tech Mono', monospace" }}>CHAIN OF CUSTODY</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                   {e.chainOfCustody?.map((log, lidx) => (
                                     <span key={lidx} style={{ fontSize: 10, color: '#ffffff', opacity: 0.8, background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 2 }}>{log.to}</span>
                                   ))}
                                </div>
                             </div>
                          </div>
                        </div>
                      ))}
                      {evidence.filter(e => e.caseId === viewingCase.caseId).length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 4, color: '#ffffff', opacity: 0.3, fontFamily: "'Share Tech Mono', monospace", fontSize: 12 }}>
                          NO EVIDENCE RECORDS ASSOCIATED WITH THIS CASE
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
