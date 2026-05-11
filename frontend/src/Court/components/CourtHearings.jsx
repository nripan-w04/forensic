import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, X, Check, Package, ShieldAlert, Zap, Cpu } from 'lucide-react';
import axios from 'axios';
import { useUI } from '../../common/UIContext';

export default function CourtHearings() {
  const { showToast } = useUI();
  const [search, setSearch] = useState('');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [newHearingDate, setNewHearingDate] = useState('');
  const [judgment, setJudgment] = useState('');
  const [viewingCase, setViewingCase] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [loadingEvidence, setLoadingEvidence] = useState(false);
  const [viewingAnalysis, setViewingAnalysis] = useState(null);

  const fetchCases = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/cases');
      // Court strictly shows cases already filed by the Police
      setCases(res.data.filter(c => c.status === 'FILED_IN_COURT'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchEvidence = async (caseId) => {
    setLoadingEvidence(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/evidence?caseId=${caseId}`);
      setEvidenceList(res.data);
    } catch (err) {
      console.error(err);
      showToast('Error fetching evidence', 'error');
    } finally {
      setLoadingEvidence(false);
    }
  };

  const handleOpenDetails = async (c) => {
    setLoadingEvidence(true); // Reuse loading state or add a new one
    try {
      // Fetch the absolute latest case data to ensure AI insights are present
      const caseRes = await axios.get(`http://localhost:4000/api/cases`);
      const freshCase = caseRes.data.find(item => item._id === c._id);
      
      if (freshCase) {
        setViewingCase(freshCase);
        // Also fetch evidence
        const evRes = await axios.get(`http://localhost:4000/api/evidence?caseId=${freshCase.caseId}`);
        setEvidenceList(evRes.data);
      } else {
        showToast('Error: Case record not found', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error synchronizing case data', 'error');
    } finally {
      setLoadingEvidence(false);
    }
  };


  const handleVerdictChange = async (id, judgment) => {
    try {
      await axios.put(`http://localhost:4000/api/cases/${id}/verdict`, { judgment });
      setCases(cases.filter(c => c._id !== id));
      showToast(`Verdict recorded: Case status updated to CLOSED`, 'success');
      setSelectedCase(null);
    } catch (err) {
      console.error(err);
      showToast('Error recording verdict', 'error');
    }
  };

  const handleAddHearing = async (id) => {
    if (!newHearingDate) return;
    try {
      const res = await axios.put(`http://localhost:4000/api/cases/${id}/hearing`, { date: newHearingDate });
      setCases(cases.map(c => c._id === id ? res.data.case : c));
      showToast('Hearing date scheduled', 'success');
      setNewHearingDate('');
    } catch (err) {
      console.error(err);
      showToast('Failed to schedule hearing', 'error');
    }
  };

  const filtered = cases.filter(c => 
    c.caseId.toLowerCase().includes(search.toLowerCase()) || 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 5, marginTop: 68 }}>
        <div>
          <p className="page-eyebrow">{'//'} LEGAL AFFAIRS</p>
          <h1 className="page-title">
            Active <span>Hearings</span>
          </h1>
        </div>
        <div style={{ position: 'relative', width: 320 }}>
          <Search size={20} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ffffff', opacity: 0.6 }} />
          <input type="text" placeholder="Search court docket..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', height: 48, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '0 16px 0 48px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", fontSize: 16, outline: 'none' }} />
        </div>
      </div>

      <div className="data-card table-wrap" style={{ position: 'relative', overflow: selectedCase ? 'hidden' : 'visible' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Docket / Case ID</th>
              <th>Incident Details</th>
              <th>Case Details</th>
              <th>Legal Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#71717a', fontSize: 12 }}>RETRIEVING COURT RECORDS...</td></tr>}
              {!loading && filtered.map((c, i) => (
                <motion.tr key={c._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <td>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 16, color: '#f4f4f5', fontWeight: 700 }}>{c.caseId}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#3b82f6', marginTop: 4, fontWeight: 600 }}>Date: {c.date}</div>
                  </td>
                  <td>
                    <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 4, fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#ffffff', marginBottom: 6, textTransform: 'uppercase', fontWeight: 700 }}>{c.category}</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, color: '#d4d4d8', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{c.title}</div>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleOpenDetails(c)}
                      style={{ padding: '8px 16px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', borderRadius: 4, fontSize: 12, fontFamily: "'Share Tech Mono', monospace", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}
                    >
                      <Eye size={14} /> VIEW CASE DOSSIER
                    </button>
                  </td>
                  <td>
                    <div style={{
                      padding: '8px 16px', borderRadius: 4, fontFamily: "'Share Tech Mono', monospace", fontSize: 13, textTransform: 'uppercase', textAlign: 'center', fontWeight: 800,
                      background: 'rgba(52,211,153,0.15)',
                      color: '#34d399',
                      border: '1px solid #34d39960',
                      letterSpacing: '0.05em'
                    }}>
                      {c.status}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {c.status === 'FILED_IN_COURT' && (
                        <button 
                           onClick={() => setSelectedCase(c)}
                           style={{ padding: '8px 16px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b98160', color: '#34d399', borderRadius: 4, fontSize: 13, fontFamily: "'Share Tech Mono', monospace", cursor: 'pointer', fontWeight: 800 }}
                        >
                           OPEN DOCKET
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {!loading && filtered.length === 0 && (
               <tr>
                 <td colSpan="4" style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#52525b', fontSize: 11, letterSpacing: '0.1em' }}>NO UPCOMING HEARINGS MATCH QUERY</td>
               </tr>
            )}
          </tbody>
        </table>

        <AnimatePresence>
          {viewingCase && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                style={{ width: '100%', maxWidth: 950, background: '#0a0a12', border: '1px solid rgba(59,130,246,0.4)', borderRadius: 4, maxHeight: '95vh', overflowY: 'auto', position: 'relative', padding: 40 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 24, marginBottom: 32 }}>
                  <div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#3b82f6', fontWeight: 700, letterSpacing: '0.1em' }}>COURT EXHIBIT / FULL CASE DOSSIER: {viewingCase.caseId}</div>
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase', marginTop: 8 }}>{viewingCase.title}</h2>
                  </div>
                  <button onClick={() => setViewingCase(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', padding: '10px 20px', borderRadius: 4, fontFamily: "'Share Tech Mono', monospace", fontSize: 13 }}>CLOSE DOSSIER</button>
                </div>

                {/* SECTION: PRIMARY CASE METADATA */}
                <div style={{ marginBottom: 40 }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#71717a', marginBottom: 20, letterSpacing: '0.2em', fontWeight: 700 }}>// CASE REGISTRY METADATA</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                    {[
                      { label: 'FIR NUMBER', value: viewingCase.firNumber || 'UNASSIGNED' },
                      { label: 'REGISTRATION DATE', value: viewingCase.date },
                      { label: 'CATEGORY', value: viewingCase.category },
                      { label: 'LITIGATION STATUS', value: viewingCase.status },
                      { label: 'LOCATION', value: viewingCase.location },
                      { label: 'INVESTIGATING OFFICER', value: viewingCase.investigatingOfficer || 'PENDING' },
                      { label: 'COURT AUTHORITY', value: viewingCase.courtAuthority || 'HIGH COURT OF JUSTICE' },
                      { label: 'CREATION TIMESTAMP', value: new Date(viewingCase.createdAt).toLocaleString() }
                    ].map((item, idx) => (
                      <div key={idx} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                         <div style={{ fontSize: 12, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 6, fontWeight: 700 }}>{item.label}</div>
                         <div style={{ fontSize: 15, color: '#fff', fontWeight: 600 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION: INCIDENT & INVESTIGATION LOGS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
                   <div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#71717a', marginBottom: 16, letterSpacing: '0.1em', fontWeight: 700 }}>// INCIDENT REPORT</div>
                      <div style={{ padding: 24, background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 4, color: '#d4d4d8', fontSize: 15, lineHeight: 1.8 }}>
                        {viewingCase.description}
                      </div>
                   </div>
                   <div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#71717a', marginBottom: 16, letterSpacing: '0.1em', fontWeight: 700 }}>// POLICE INVESTIGATION NOTES</div>
                      <div style={{ padding: 24, background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.1)', borderRadius: 4, color: '#d4d4d8', fontSize: 15, lineHeight: 1.8 }}>
                        {viewingCase.investigationNotes || 'No official investigation logs recorded by the police department.'}
                      </div>
                   </div>
                </div>

                {/* SECTION: POLICE NEURAL CASE ANALYSIS (MODAL TRIGGER) */}
                <div style={{ marginBottom: 40, border: '1px solid rgba(168,85,247,0.3)', padding: 24, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(168,85,247,0.03)' }}>
                   <div>
                     <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#a855f7', letterSpacing: '0.2em', fontWeight: 700 }}>// NEURAL ANALYSIS TRANSMITTED BY POLICE</div>
                     <div style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>Neural diagnostics captured at filing stage</div>
                   </div>
                   <button 
                     onClick={() => setViewingAnalysis(viewingCase)}
                     style={{ padding: '12px 24px', background: '#a855f7', border: 'none', color: '#000', borderRadius: 4, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}
                   >
                     VIEW NEURAL ANALYSIS
                   </button>
                </div>

                {/* SECTION: LEGAL DOCUMENTS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
                   <div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#71717a', marginBottom: 16, letterSpacing: '0.1em', fontWeight: 700 }}>// OFFICIAL CHARGE SHEET</div>
                      <div style={{ padding: 24, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: 4, color: '#fca5a5', fontSize: 15, lineHeight: 1.8, fontFamily: "'Share Tech Mono', monospace" }}>
                        {viewingCase.chargeSheet || 'CHARGE SHEET NOT YET FILED.'}
                      </div>
                   </div>
                   <div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#71717a', marginBottom: 16, letterSpacing: '0.1em', fontWeight: 700 }}>// LEGAL PRECEDENTS & NOTES</div>
                      <div style={{ padding: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, color: '#d4d4d8', fontSize: 15, lineHeight: 1.8 }}>
                        {viewingCase.legalNotes || 'No legal notes provided with filing.'}
                      </div>
                   </div>
                </div>


                {/* SECTION: SUSPECTS & JUDGMENT */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40 }}>
                   <div>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#71717a', marginBottom: 16, letterSpacing: '0.1em', fontWeight: 700 }}>// IDENTIFIED SUSPECTS</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                        {viewingCase.suspects && viewingCase.suspects.length > 0 ? (
                          viewingCase.suspects.map((s, i) => (
                            <span key={i} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 14, color: '#fff', fontWeight: 600 }}>{s}</span>
                          ))
                        ) : (
                          <span style={{ fontSize: 14, color: '#52525b' }}>NO SUSPECTS REGISTERED</span>
                        )}
                      </div>
                   </div>
                   {viewingCase.judgment && (
                     <div>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#fbbf24', marginBottom: 16, letterSpacing: '0.1em', fontWeight: 700 }}>// FINAL VERDICT & JUDGMENT</div>
                        <div style={{ padding: 24, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 4, color: '#fbbf24', fontSize: 16, fontWeight: 700, lineHeight: 1.8 }}>
                          {viewingCase.judgment}
                        </div>
                     </div>
                   )}
                </div>

                {/* SECTION: EVIDENCE VAULT & NEURAL ANALYSIS */}
                <div style={{ marginTop: 40 }}>
                   <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#3b82f6', marginBottom: 24, letterSpacing: '0.2em', fontWeight: 700 }}>// FORENSIC EVIDENCE VAULT & NEURAL INSIGHTS</div>
                   <div style={{ display: 'grid', gap: 20 }}>
                      {loadingEvidence ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#71717a', fontFamily: "'Share Tech Mono', monospace", fontSize: 14 }}>SYNCHRONIZING WITH FORENSIC DATABASE...</div>
                      ) : evidenceList.length === 0 ? (
                        <div style={{ padding: 40, textAlign: 'center', color: '#52525b', fontFamily: "'Share Tech Mono', monospace", fontSize: 14, border: '1px dashed rgba(255,255,255,0.1)' }}>NO REGISTERED EVIDENCE FOUND FOR THIS DOCKET</div>
                      ) : evidenceList.map((ev, idx) => (
                        <div key={idx} style={{ padding: 24, background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 4 }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                 <Package size={20} color="#3b82f6" />
                                 <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 16, color: '#fff', fontWeight: 700 }}>{ev.evidenceId}</div>
                                 <div style={{ padding: '4px 10px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', borderRadius: 2, fontSize: 12, fontWeight: 700 }}>{ev.type}</div>
                              </div>
                              <div style={{ fontSize: 12, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 12px', borderRadius: 2, fontWeight: 700 }}>STATUS: {ev.status}</div>
                           </div>

                           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
                              <div>
                                 <div style={{ fontSize: 12, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 4 }}>COLLECTED BY</div>
                                 <div style={{ fontSize: 14, color: '#f4f4f5', fontWeight: 600 }}>{ev.collectedBy}</div>
                              </div>
                              <div>
                                 <div style={{ fontSize: 12, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 4 }}>COLLECTION DATE</div>
                                 <div style={{ fontSize: 14, color: '#f4f4f5', fontWeight: 600 }}>{ev.collectedDate}</div>
                              </div>
                              <div>
                                 <div style={{ fontSize: 12, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 4 }}>BARCODE / TRACKING</div>
                                 <div style={{ fontSize: 14, color: '#f4f4f5', fontWeight: 600 }}>{ev.barcode || 'NO_TAG'}</div>
                              </div>
                              <div>
                                 <div style={{ fontSize: 12, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 4 }}>TRANSFER STATUS</div>
                                 <div style={{ fontSize: 14, color: '#f4f4f5', fontWeight: 600 }}>{ev.transferStatus}</div>
                              </div>
                           </div>

                           <div style={{ marginBottom: 24 }}>
                              <div style={{ fontSize: 12, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>EVIDENCE DESCRIPTION</div>
                              <div style={{ fontSize: 15, color: '#d4d4d8', lineHeight: 1.6 }}>{ev.description}</div>
                           </div>

                           {/* LAB FINDINGS & AI BUTTON */}
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                              <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                                 <div style={{ fontSize: 12, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 8, fontWeight: 700 }}>LAB FINDINGS SUMMARY</div>
                                 <div style={{ fontSize: 14, color: '#fff', lineHeight: 1.6 }}>{ev.findingsSummary || 'Analytical reports pending laboratory results.'}</div>
                                 <div style={{ fontSize: 12, color: '#3b82f6', marginTop: 12, fontFamily: "'Share Tech Mono', monospace" }}>ANALYST: {ev.analystName || 'N/A'}</div>
                              </div>

                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}



          {selectedCase && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ width: '100%', maxWidth: 600, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16, marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: '#f4f4f5' }}>DOCKET: {selectedCase.caseId}</h2>
                  <button onClick={() => setSelectedCase(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}>CLOSE</button>
                </div>

                <div style={{ display: 'grid', gap: 24 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: '#ffffff', opacity: 0.6, marginBottom: 8, fontFamily: "'Share Tech Mono', monospace" }}>HEARING HISTORY</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                        {selectedCase.hearingDates?.map((d, idx) => (
                          <div key={idx} style={{ padding: '6px 12px', background: 'rgba(251,191,36,0.1)', border: '1px solid #fbbf2440', color: '#fbbf24', fontSize: 13, borderRadius: 2, fontWeight: 600 }}>
                            {new Date(d).toLocaleDateString()}
                          </div>
                        ))}
                        {(!selectedCase.hearingDates || selectedCase.hearingDates.length === 0) && <div style={{ color: '#52525b', fontSize: 14 }}>No hearings scheduled.</div>}
                      </div>
                     <div style={{ display: 'flex', gap: 8 }}>
                       <input type="date" value={newHearingDate} onChange={e => setNewHearingDate(e.target.value)} style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: 3, flex: 1 }} />
                       <button onClick={() => handleAddHearing(selectedCase._id)} style={{ padding: '8px 16px', background: '#fbbf24', border: 'none', color: '#000', borderRadius: 3, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>ADD HEARING</button>
                     </div>
                   </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: '#ffffff', opacity: 0.6, marginBottom: 8, fontFamily: "'Share Tech Mono', monospace" }}>RECORD FINAL JUDGMENT</label>
                      <textarea 
                         value={judgment} 
                         onChange={e => setJudgment(e.target.value)}
                         placeholder="Enter the final verdict and legal decision..."
                         style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px', borderRadius: 3, minHeight: 120, outline: 'none', fontSize: 15, lineHeight: 1.6 }}
                      />
                      <button 
                         onClick={() => handleVerdictChange(selectedCase._id, judgment)}
                         style={{ marginTop: 16, width: '100%', padding: '16px', background: '#dc2626', border: 'none', color: '#fff', borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}
                      >
                         AUTHORIZE CASE CLOSURE & VERDICT
                      </button>
                    </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          {viewingAnalysis && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.95)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ width: '100%', maxWidth: 800, background: '#0a0a12', border: '1px solid rgba(168,85,247,0.4)', borderRadius: 8, padding: 40, maxHeight: '85vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 20, marginBottom: 32 }}>
                  <div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#a855f7', fontWeight: 700, letterSpacing: '0.2em' }}>// NEURAL ANALYSIS REPORT</div>
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase', marginTop: 4 }}>DOCKET: {viewingAnalysis.caseId}</h2>
                  </div>
                  <button onClick={() => setViewingAnalysis(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#71717a', cursor: 'pointer', padding: '8px 16px', borderRadius: 4, fontFamily: "'Share Tech Mono', monospace", fontSize: 12 }}>CLOSE</button>
                </div>

                <div style={{ display: 'grid', gap: 24 }}>
                   <div style={{ padding: 32, background: 'rgba(168,85,247,0.03)', border: '1px solid rgba(168,85,247,0.1)', borderRadius: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                         <ShieldAlert color="#d8b4fe" size={20} />
                         <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#d8b4fe', fontWeight: 700, letterSpacing: '0.1em' }}>NEURAL STRENGTH ANALYSIS</span>
                      </div>
                      <div style={{ fontSize: 16, color: '#f4f4f5', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{viewingAnalysis.aiStrength || 'Analysis data not available for this case parameter.'}</div>
                   </div>

                   <div style={{ padding: 32, background: 'rgba(59,130,246,0.03)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                         <Zap color="#60a5fa" size={20} />
                         <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#60a5fa', fontWeight: 700, letterSpacing: '0.1em' }}>PRIORITY ASSESSMENT</span>
                      </div>
                      <div style={{ fontSize: 16, color: '#f4f4f5', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{viewingAnalysis.aiPriority || 'No priority heuristics transmitted.'}</div>
                   </div>

                   <div style={{ padding: 32, background: 'rgba(52,211,153,0.03)', border: '1px solid rgba(52,211,153,0.1)', borderRadius: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                         <Cpu color="#34d399" size={20} />
                         <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#34d399', fontWeight: 700, letterSpacing: '0.1em' }}>FORENSIC RECOMMENDATIONS</span>
                      </div>
                      <div style={{ fontSize: 16, color: '#f4f4f5', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{viewingAnalysis.aiRecommendations || 'No automated forensic recommendations recorded.'}</div>
                   </div>
                </div>

                <div style={{ marginTop: 40, padding: 20, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                   <div style={{ fontSize: 11, color: '#52525b', fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.05em' }}>
                      THIS REPORT IS GENERATED BY THE NEURAL SENTRY AI ENGINE AND TRANSMITTED UNDER POLICE SEAL.
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}
