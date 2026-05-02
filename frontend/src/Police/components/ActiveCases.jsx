import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Eye, Edit, Trash2, X, Check, Activity, Package, FileText, Gavel } from 'lucide-react';
import axios from 'axios';
import { useUI } from '../../common/UIContext';
import { useSocket } from '../../common/SocketContext';

export default function ActiveCases() {
  const { showToast, showConfirm } = useUI();
  const socket = useSocket();
  const [search, setSearch] = useState('');
  const [cases, setCases] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCase, setEditingCase] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(null);
  const [filingLegal, setFilingLegal] = useState(null);
  const [legalData, setLegalData] = useState({ chargeSheet: '', legalNotes: '' });

  const fetchCases = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/cases');
      setCases(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvidence = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/evidence');
      setEvidence(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCases();
    fetchEvidence();

    if (socket) {
      socket.on('case_status_updated', () => fetchCases());
      socket.on('evidence_added', () => { fetchCases(); fetchEvidence(); });
      socket.on('report_uploaded', () => { fetchCases(); fetchEvidence(); });
      
      return () => {
        socket.off('case_status_updated');
        socket.off('evidence_added');
        socket.off('report_uploaded');
      };
    }
  }, [socket]);

  useEffect(() => {
    if (viewingDetails) {
      const updated = cases.find(c => c._id === viewingDetails._id);
      if (updated) setViewingDetails(updated);
    }
  }, [cases]);

  const [investigatingItem, setInvestigatingItem] = useState(null);
  const [investigationData, setInvestigationData] = useState({ notes: '', suspects: '' });

  const handleInvestigationUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/cases/${investigatingItem._id}/investigation`, {
        notes: investigationData.notes,
        suspects: investigationData.suspects.split(',').map(s => s.trim()).filter(s => s !== '')
      });
      setCases(cases.map(c => c._id === investigatingItem._id ? { ...c, status: 'UNDER_INVESTIGATION' } : c));
      showToast('Investigation findings recorded', 'success');
      setInvestigatingItem(null);
    } catch (err) {
      console.error(err);
      showToast('Update failed', 'error');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/api/cases/${id}`, { status: newStatus });
      setCases(cases.map(c => c._id === id ? { ...c, status: newStatus } : c));
      showToast(`Case status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error updating status module', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm({
      title: 'Permanent Deletion',
      message: 'Are you sure you want to permanently delete this case record? This action is immutable and will be logged.',
      confirmText: 'Delete Record',
      cancelText: 'Abort'
    });
    if (!confirmed) return;
    try {
      await axios.delete(`http://localhost:4000/api/cases/${id}`);
      setCases(cases.filter(c => c._id !== id));
      showToast('Case record successfully purged', 'info');
    } catch (err) {
      console.error(err);
      showToast('Unauthorized: Error purging record', 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:4000/api/cases/${editingCase._id}`, editingCase);
      setCases(cases.map(c => c._id === editingCase._id ? res.data.case : c));
      showToast('Case record updated successfully', 'success');
      setEditingCase(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to update case record: Check system permissions', 'error');
    }
  };

  const handleLegalFiling = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/cases/${filingLegal._id}/legal`, legalData);
      setCases(cases.map(c => c._id === filingLegal._id ? { ...c, status: 'FILED_IN_COURT' } : c));
      showToast('Case successfully filed in Court!', 'success');
      setFilingLegal(null);
      setLegalData({ chargeSheet: '', legalNotes: '' });
      if (viewingDetails) setViewingDetails(null);
    } catch (err) {
      console.error(err);
      showToast('Legal filing failed', 'error');
    }
  };

  const filtered = cases.filter(c => 
    c.caseId.toLowerCase().includes(search.toLowerCase()) || 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 5 }}>
        <div>
          <p className="page-eyebrow">// TRACKING MODULE</p>
          <h1 className="page-title">
            Active <span>Cases</span>
          </h1>
        </div>
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
          <input type="text" placeholder="Search case ID or title..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', height: 42, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '0 14px 0 40px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", fontSize: 13, outline: 'none' }} />
        </div>
      </div>

      <div className="data-card table-wrap" style={{ position: 'relative', overflow: editingCase || investigatingItem ? 'hidden' : 'visible' }}>
        <table className="data-table">
          <thead>
            <tr>
               <th>Case Identifier / FIR</th>
              <th>Incident Details / Officer</th>
              <th>Location</th>
              <th>Status Module</th>
              <th style={{ textAlign: 'right', paddingRight: 22 }}>Manage</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#71717a', fontSize: 12 }}>RETRIEVING CASE FILES...</td></tr>}
              {!loading && filtered.map((c, i) => (
                <motion.tr key={c._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <td>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 16, color: '#3b82f6', fontWeight: 700 }}>{c.caseId}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ffffff', opacity: 0.7, marginTop: 4, fontWeight: 600 }}>FIR: {c.firNumber || 'N/A'}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#a1a1aa', marginTop: 2 }}>{c.date}</div>
                  </td>
                  <td>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, color: '#ffffff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{c.title}</div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                      <div style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(255,255,255,0.08)', borderRadius: 4, fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#ffffff', fontWeight: 600 }}>{c.category}</div>
                      <div style={{ fontSize: 14, color: '#60a5fa', fontWeight: 600 }}>• {c.investigatingOfficer || 'No Officer'}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e4e4e7' }}>
                      <MapPin size={16} color="#dc2626" />
                      <span style={{ fontSize: 15, fontWeight: 500 }}>{c.location}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{
                        padding: '8px 16px', borderRadius: 4, fontFamily: "'Share Tech Mono', monospace", fontSize: 13, textTransform: 'uppercase', textAlign: 'center', fontWeight: 800,
                        background: c.status === 'CLOSED' ? 'rgba(52,211,153,0.15)' : c.status === 'REPORT_READY' ? 'rgba(251,191,36,0.15)' : 'rgba(59,130,246,0.15)',
                        color: c.status === 'CLOSED' ? '#34d399' : c.status === 'REPORT_READY' ? '#fbbf24' : '#60a5fa',
                        border: `1px solid ${c.status === 'CLOSED' ? '#34d39960' : c.status === 'REPORT_READY' ? '#fbbf2460' : '#60a5fa60'}`,
                        letterSpacing: '0.05em'
                      }}>
                        {c.status}
                    </div>
                  </td>
                   <td style={{ textAlign: 'right', paddingRight: 22 }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button onClick={() => setViewingDetails(c)} style={{ background: 'transparent', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 3, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', cursor: 'pointer', transition: 'all 0.2s' }} title="View Progress">
                           <Activity size={20} />
                        </button>
                        {c.status === 'REPORT_READY' && (
                          <button onClick={() => { setInvestigatingItem(c); setInvestigationData({ notes: c.investigationNotes || '', suspects: c.suspects?.join(', ') || '' }); }} style={{ background: 'transparent', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 3, padding: '4px 8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#d8b4fe', cursor: 'pointer', transition: 'all 0.2s', fontSize: 10, fontFamily: "'Share Tech Mono', monospace" }} title="Update Investigation">
                             <Eye size={20} style={{ marginRight: 4 }} /> <span className='text-xs'>REVIEW</span>
                          </button>
                        )}
                        {c.status !== 'CLOSED' && c.status !== 'FILED_IN_COURT' && (
                          <>
                            <button onClick={() => setEditingCase(c)} style={{ background: 'transparent', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 3, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', cursor: 'pointer', transition: 'all 0.2s' }} title="Edit Case">
                               <Edit size={20} />
                            </button>
                            <button onClick={() => handleDelete(c._id)} style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 3, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', cursor: 'pointer', transition: 'all 0.2s' }} title="Delete Case">
                               <Trash2 size={20} />
                            </button>
                          </>
                        )}
                      </div>
                   </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {!loading && filtered.length === 0 && (
               <tr>
                 <td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#52525b', fontSize: 11, letterSpacing: '0.1em' }}>NO CASES EXCEEDING QUERY PARAMETERS</td>
               </tr>
            )}
          </tbody>
        </table>

        {/* Case Details & Real-time Progress Modal */}
        <AnimatePresence>
          {viewingDetails && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                style={{ width: '100%', maxWidth: 800, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 24, marginBottom: 24 }}>
                  <div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#ef4444' }}>CASE DOSSIER: {viewingDetails.caseId}</div>
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase', marginTop: 4 }}>{viewingDetails.title}</h2>
                  </div>
                  <button onClick={() => setViewingDetails(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#71717a', cursor: 'pointer', padding: 8, borderRadius: 4 }}><X size={20} /></button>
                </div>

                {/* Progress Tracker */}
                <div style={{ marginBottom: 40 }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#71717a', marginBottom: 20, letterSpacing: '0.2em' }}>PROGRESS STATUS</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 12, left: 0, right: 0, h: 2, background: 'rgba(255,255,255,0.05)', zIndex: 1 }} />
                    {[
                      { step: 'OPEN', label: 'Registered' },
                      { step: 'COLLECTED', label: 'Evidence' },
                      { step: 'SENT_TO_LAB', label: 'In Lab' },
                      { step: 'REPORT_READY', label: 'Analyzed' },
                      { step: 'UNDER_INVESTIGATION', label: 'Finalizing' },
                      { step: 'FILED_IN_COURT', label: 'Legal' },
                      { step: 'CLOSED', label: 'Closed' }
                    ].map((s, idx) => {
                      const stages = ['OPEN', 'COLLECTED', 'SENT_TO_LAB', 'REPORT_READY', 'UNDER_INVESTIGATION', 'FILED_IN_COURT', 'CLOSED'];
                      const currentIdx = stages.indexOf(viewingDetails.status);
                      const isComplete = idx <= currentIdx;
                      return (
                        <div key={s.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, position: 'relative', zIndex: 2, width: '14%' }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: isComplete ? '#ef4444' : '#111116', border: `2px solid ${isComplete ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isComplete ? '0 0 15px rgba(239,68,68,0.3)' : 'none' }}>
                            {isComplete && <Check size={12} color="#fff" />}
                          </div>
                          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 8, color: isComplete ? '#f4f4f5' : '#52525b', textAlign: 'center' }}>{s.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="responsive-grid-2" style={{ gap: 32 }}>
                  <div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#71717a', marginBottom: 16 }}>COLLECTED EVIDENCE</div>
                    <div style={{ display: 'grid', gap: 12 }}>
                      {evidence.filter(e => e.caseId === viewingDetails.caseId).map(e => (
                        <div key={e._id} style={{ padding: 16, background: '#111116', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#3b82f6' }}>{e.evidenceId}</span>
                            <span style={{ fontSize: 9, padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: 2, color: '#a1a1aa' }}>{e.type}</span>
                          </div>
                          <div style={{ fontSize: 13, color: '#d4d4d8', marginBottom: 12 }}>{e.description}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {e.labReports?.map((path, idx) => (
                              <a key={idx} href={`http://localhost:4000/${path}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399', textDecoration: 'none', fontSize: 11, fontFamily: "'Share Tech Mono', monospace", padding: '4px 10px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 4, fontWeight: 700 }}>
                                <FileText size={14} /> REPORT_{idx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                      {evidence.filter(e => e.caseId === viewingDetails.caseId).length === 0 && (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#52525b', fontSize: 12, border: '1px dashed rgba(255,255,255,0.05)' }}>NO EVIDENCE LOGGED YET</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#71717a', marginBottom: 16 }}>INVESTIGATION DETAILS</div>
                    <div style={{ display: 'grid', gap: 20 }}>
                      <div style={{ padding: 16, background: 'rgba(239,68,68,0.02)', border: '1px solid rgba(239,68,68,0.05)', borderRadius: 4 }}>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#ef4444', marginBottom: 8 }}>INCIDENT LOG</div>
                        <p style={{ fontSize: 14, color: '#d4d4d8', lineHeight: 1.6 }}>{viewingDetails.description}</p>
                      </div>
                      
                      {viewingDetails.investigationNotes && (
                        <div style={{ padding: 16, background: 'rgba(59,130,246,0.02)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 4 }}>
                          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#3b82f6', marginBottom: 8 }}>OFFICER NOTES</div>
                          <p style={{ fontSize: 14, color: '#d4d4d8', lineHeight: 1.6 }}>{viewingDetails.investigationNotes}</p>
                        </div>
                      )}

                      <div>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#71717a', marginBottom: 8 }}>IDENTIFIED SUSPECTS</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {viewingDetails.suspects?.map((s, idx) => (
                            <span key={idx} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, fontSize: 12, color: '#f4f4f5' }}>{s}</span>
                          ))}
                        </div>
                      </div>

                      {viewingDetails.hearingDates?.length > 0 && (
                        <div style={{ padding: 16, background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 4 }}>
                          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#fbbf24', marginBottom: 8 }}>SCHEDULED HEARINGS</div>
                          <div style={{ display: 'grid', gap: 8 }}>
                            {viewingDetails.hearingDates.map((date, idx) => (
                              <div key={idx} style={{ fontSize: 13, color: '#fef08a', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Session #{idx + 1}</span>
                                <span style={{ fontFamily: "'Share Tech Mono', monospace" }}>{new Date(date).toLocaleDateString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {viewingDetails.status === 'UNDER_INVESTIGATION' && (
                        <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20 }}>
                          <button 
                            onClick={() => setFilingLegal(viewingDetails)}
                            style={{ width: '100%', padding: '12px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                          >
                             <Gavel size={16} /> DRAFT & TRANSMIT TO COURT
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal Overlay */}
        <AnimatePresence>
          {editingCase && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                style={{ width: '100%', maxWidth: 500, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: 24, paddingBottom: 16 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase' }}>Update Case Record</div>
                  <button onClick={() => setEditingCase(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <form onSubmit={handleEditSubmit} style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 6 }}>INCIDENT TITLE</label>
                    <input type="text" value={editingCase.title} onChange={e => setEditingCase({...editingCase, title: e.target.value})} required style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none' }} />
                  </div>
                  <div className="responsive-grid-2">
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 6 }}>CATEGORY</label>
                      <select value={editingCase.category} onChange={e => setEditingCase({...editingCase, category: e.target.value})} style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none' }}>
                        <option>Theft/Robbery</option>
                        <option>Homicide</option>
                        <option>Cybercrime</option>
                        <option>Assault</option>
                        <option>Fraud</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 6 }}>LOCATION</label>
                      <input type="text" value={editingCase.location} onChange={e => setEditingCase({...editingCase, location: e.target.value})} required style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none' }} />
                    </div>
                  </div>
                  <div className="responsive-grid-2">
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 6 }}>INVESTIGATING OFFICER</label>
                      <input type="text" value={editingCase.investigatingOfficer || ''} onChange={e => setEditingCase({...editingCase, investigatingOfficer: e.target.value})} style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 6 }}>SUSPECTS (Comma separated)</label>
                    <input type="text" value={Array.isArray(editingCase.suspects) ? editingCase.suspects.join(', ') : ''} onChange={e => setEditingCase({...editingCase, suspects: e.target.value.split(',').map(s => s.trim())})} style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 6 }}>INITIAL INCIDENT REPORT</label>
                    <textarea value={editingCase.description} onChange={e => setEditingCase({...editingCase, description: e.target.value})} required style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none', minHeight: 80 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <button type="submit" style={{ padding: '10px 20px', background: '#dc2626', border: 'none', color: '#fff', borderRadius: 3, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Check size={14} /> AUTHORIZE OVERRIDE
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Investigation Review Modal */}
        <AnimatePresence>
          {investigatingItem && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                style={{ width: '100%', maxWidth: 550, background: '#0a0a12', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 4, padding: 24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16, marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#d8b4fe', textTransform: 'uppercase' }}>Investigation Review: {investigatingItem.caseId}</div>
                  <button onClick={() => setInvestigatingItem(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <form onSubmit={handleInvestigationUpdate} style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 6 }}>INVESTIGATION NOTES / FINDINGS</label>
                    <textarea value={investigationData.notes} onChange={e => setInvestigationData({...investigationData, notes: e.target.value})} placeholder="Detailed notes after reviewing forensic report..." required style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none', minHeight: 120 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 6 }}>UPDATE SUSPECTS (Comma separated)</label>
                    <input type="text" value={investigationData.suspects} onChange={e => setInvestigationData({...investigationData, suspects: e.target.value})} placeholder="e.g. John Doe, Mark Smith" style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <button type="submit" style={{ padding: '10px 24px', background: '#d8b4fe', border: 'none', color: '#000', borderRadius: 3, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Check size={14} /> SUBMIT INVESTIGATION UPDATE
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Legal Filing Modal */}
        <AnimatePresence>
          {filingLegal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                style={{ width: '100%', maxWidth: 550, background: '#0a0a12', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 4, padding: 24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16, marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase' }}>Legal Filing: {filingLegal.caseId}</div>
                  <button onClick={() => setFilingLegal(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <form onSubmit={handleLegalFiling} style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 8 }}>OFFICIAL CHARGE SHEET</label>
                    <textarea 
                      value={legalData.chargeSheet} 
                      onChange={e => setLegalData({...legalData, chargeSheet: e.target.value})} 
                      placeholder="Enter specific charges and legal violations..." 
                      required 
                      style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', color: '#fff', borderRadius: 3, outline: 'none', minHeight: 140, fontSize: 15, lineHeight: 1.6 }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 8 }}>LEGAL PRECEDENTS / NOTES</label>
                    <textarea 
                      value={legalData.legalNotes} 
                      onChange={e => setLegalData({...legalData, legalNotes: e.target.value})} 
                      placeholder="Relevant legal codes or investigative summaries..." 
                      required 
                      style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', color: '#fff', borderRadius: 3, outline: 'none', minHeight: 100, fontSize: 15, lineHeight: 1.6 }} 
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <button type="submit" style={{ padding: '12px 28px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: 3, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                       OFFICIALLY FILE IN COURT
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
