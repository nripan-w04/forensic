import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Eye, X, Check, Package } from 'lucide-react';
import axios from 'axios';
import { useUI } from '../../common/UIContext';
import { useAuth } from '../../common/AuthContext';

export default function EvidenceCaseList() {
  const { showToast } = useUI();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [viewingCase, setViewingCase] = useState(null);
  const [formData, setFormData] = useState({
    caseId: '', type: 'Weapon', description: '', collectedBy: '', collectedDate: '',
    barcode: '', qrCode: ''
  });
  const [aiScanning, setAiScanning] = useState(false);
  const [aiResults, setAiResults] = useState({ strength: '', priority: '', evidence: '' });
  const [analysisType, setAnalysisType] = useState('evidence');

  const runAIAnalysis = async () => {
    if (!formData.description) {
      showToast('Please provide a description for Neural Analysis.', 'warning');
      return;
    }
    setAiScanning(true);
    try {
      const res = await axios.post('http://localhost:4000/api/analyze', {
        text: formData.description,
        type: analysisType
      });
      setAiResults(prev => ({ ...prev, [analysisType]: res.data.prediction }));
    } catch (err) {
      console.error(err);
      showToast("Neural Link Failure: Could not reach diagnostic server.", "error");
    } finally {
      setAiScanning(false);
    }
  };

  const fetchCases = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/cases');
      // Evidence collectors can add evidence to cases that are NOT closed
      setCases(res.data.filter(c => c.status !== 'CLOSED'));
    } catch (err) {
      console.error(err);
      showToast('Error fetching cases', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleOpenAddEvidence = (c) => {
    setSelectedCase(c);
    setFormData({
      ...formData,
      caseId: c.caseId,
      collectedBy: user?.name || '',
      collectedDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const collectionDate = new Date(formData.collectedDate);
    const caseDate = new Date(selectedCase.date);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (collectionDate > today) {
      showToast('Collection Date cannot be in the future.', 'warning');
      return;
    }
    if (collectionDate.getFullYear() > 9999) {
      showToast('Invalid Year detected.', 'warning');
      return;
    }
    if (collectionDate < caseDate) {
      showToast(`Collection Date cannot be earlier than Case Registration Date (${selectedCase.date}).`, 'warning');
      return;
    }
    try {
      const payload = {
        ...formData,
        aiStrength: aiResults.strength,
        aiPriority: aiResults.priority,
        aiRecommendations: aiResults.evidence
      };

      await axios.post('http://localhost:4000/api/evidence', payload);
      showToast('Evidence securely logged to Case ' + formData.caseId, 'success');
      setSelectedCase(null);
      setFormData({ 
        caseId: '', type: 'Weapon', description: '', collectedBy: '', collectedDate: '',
        barcode: '', qrCode: ''
      });
      setAiResults({ strength: '', priority: '', evidence: '' });
    } catch (err) {
      console.error(err);
      showToast('Failed to log evidence', 'error');
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
          <p className="page-eyebrow">// INVESTIGATIVE AID</p>
          <h1 className="page-title">
            Link <span>Evidence</span>
          </h1>
        </div>
        <div style={{ position: 'relative', width: 250 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
          <input type="text" placeholder="Search active cases..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', height: 38, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '0 14px 0 36px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, outline: 'none' }} />
        </div>
      </div>

      <div className="data-card table-wrap" style={{ position: 'relative' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Case ID / FIR</th>
              <th>Incident / Category</th>
              <th>Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#71717a', fontSize: 12 }}>SCANNING CASE DATABASE...</td></tr>}
              {!loading && filtered.map((c, i) => (
                <motion.tr key={c._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <td>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#f4f4f5', fontWeight: 600 }}>{c.caseId}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#3b82f6', marginTop: 4 }}>FIR: {c.firNumber || 'N/A'}</div>
                    <button 
                      onClick={() => setViewingCase(c)}
                      style={{ marginTop: 8, padding: '4px 8px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', borderRadius: 3, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: "'Share Tech Mono', monospace" }}
                    >
                      <Eye size={12} /> VIEW CASE DETAILS
                    </button>
                  </td>
                  <td>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, color: '#d4d4d8', fontWeight: 600 }}><span style={{ color: '#71717a', fontSize: 12 }}>DESC:</span> {c.title}</div>
                    <div style={{ fontSize: 14, color: '#71717a', textTransform: 'uppercase', marginTop: 2 }}><span style={{ fontSize: 12 }}>TYPE:</span> {c.category}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 15, color: '#ffffffff' }}>{c.location}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 14, fontFamily: "'Share Tech Mono', monospace", color: '#fbbf24' }}>{c.status}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {c.status !== 'CLOSED' && c.status !== 'FILED_IN_COURT' ? (
                        <button 
                          onClick={() => handleOpenAddEvidence(c)}
                          style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid #3b82f640', color: '#60a5fa', borderRadius: 3, fontSize: 10, fontFamily: "'Share Tech Mono', monospace", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                          <Plus size={12} /> ADD EVIDENCE
                        </button>
                      ) : (
                        <div style={{ fontSize: 11, color: '#52525b', fontFamily: "'Share Tech Mono', monospace" }}>LOCKED FOR REVIEW</div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        <AnimatePresence>
          {selectedCase && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                style={{ width: '100%', maxWidth: 550, background: '#0a0a12', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 4, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
              >
                <div style={{ position: 'sticky', top: 0, background: '#0a0a12', zIndex: 10, padding: '24px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase' }}>Log Evidence: {selectedCase.caseId}</div>
                  <button onClick={() => setSelectedCase(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20, padding: '0 24px 24px' }}>
                  <div className="responsive-grid-2">
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 16, color: '#ffffff', opacity: 0.6, marginBottom: 8 }}>CASE ID (LOCKED)</label>
                      <input type="text" value={formData.caseId} disabled style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '14px', color: '#71717a', borderRadius: 3, outline: 'none', fontSize: 18 }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 16, color: '#ffffff', opacity: 0.6, marginBottom: 8 }}>EVIDENCE TYPE</label>
                      <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', color: '#fff', borderRadius: 3, outline: 'none', fontSize: 18 }}>
                        <option>Weapon</option>
                        <option>Biological</option>
                        <option>Digital/Cyber</option>
                        <option>Document</option>
                        <option>Narcotics</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="responsive-grid-2">
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ffffff', opacity: 0.6, marginBottom: 8 }}>COLLECTED BY</label>
                      <input type="text" name="collectedBy" value={formData.collectedBy} onChange={handleChange} required placeholder="Agent Name" style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', color: '#fff', borderRadius: 3, outline: 'none', fontSize: 16 }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ffffff', opacity: 0.6, marginBottom: 8 }}>COLLECTION DATE</label>
                      <input type="date" name="collectedDate" value={formData.collectedDate} onChange={handleChange} required max={new Date().toISOString().split('T')[0]} style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', color: '#fff', borderRadius: 3, outline: 'none', fontSize: 16 }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ffffff', opacity: 0.6, marginBottom: 8 }}>BARCODE / TRACKING ID</label>
                    <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} placeholder="e.g. BAR-10029" style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', color: '#fff', borderRadius: 3, outline: 'none', fontSize: 16 }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ffffff', opacity: 0.6, marginBottom: 6 }}>DESCRIPTION & CONDITION</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Detail the item..." style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: '#fff', borderRadius: 3, outline: 'none', minHeight: 120, fontSize: 16 }} />
                  </div>

                  <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div>
                          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 2 }}>// NEURAL DIAGNOSTIC ENGINE</div>
                          <div style={{ fontSize: 13, color: '#ffffff' }}>Select analysis heuristic</div>
                        </div>
                        <button 
                          type="button" 
                          onClick={runAIAnalysis}
                          disabled={aiScanning}
                          style={{ padding: '8px 16px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 4, color: '#d8b4fe', cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: 11 }}
                        >
                          {aiScanning ? 'SCANNING...' : 'SCAN'}
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                      {['strength', 'priority', 'evidence'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setAnalysisType(t)}
                          style={{
                            padding: '6px',
                            background: analysisType === t ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${analysisType === t ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: 4,
                            color: analysisType === t ? '#d8b4fe' : '#71717a',
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: 11,
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    
                    {aiResults[analysisType] && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 14, background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 4, color: '#d8b4fe', fontSize: 14, fontFamily: "'Share Tech Mono', monospace", lineHeight: 1.6 }}>
                        <div style={{ fontSize: 10, opacity: 0.5, marginBottom: 8 }}>[HEURISTIC RESULT]: {analysisType.toUpperCase()}</div>
                        {aiResults[analysisType]}
                      </motion.div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <button type="submit" style={{ padding: '10px 24px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: 3, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Check size={14} /> REGISTER TO CASE
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}

          {viewingCase && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                style={{ width: '100%', maxWidth: 700, background: '#0a0a12', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 4, maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: 32 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 20, marginBottom: 24 }}>
                  <div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#3b82f6', fontWeight: 700 }}>CASE DOSSIER: {viewingCase.caseId}</div>
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase', marginTop: 4 }}>{viewingCase.title}</h2>
                  </div>
                  <button onClick={() => setViewingCase(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#71717a', cursor: 'pointer', padding: 8, borderRadius: 4 }}><X size={20} /></button>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#71717a', marginBottom: 16, letterSpacing: '0.1em', fontWeight: 700 }}>// OPERATIONAL PROGRESS</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 12, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.05)', zIndex: 1 }} />
                    {[
                      { step: 'OPEN', label: 'Registered' },
                      { step: 'COLLECTED', label: 'Evidence' },
                      { step: 'SENT_TO_LAB', label: 'In Lab' },
                      { step: 'REPORT_READY', label: 'Analyzed' },
                      { step: 'CLOSED', label: 'Closed' }
                    ].map((s, idx) => {
                      const stages = ['OPEN', 'COLLECTED', 'SENT_TO_LAB', 'REPORT_READY', 'UNDER_INVESTIGATION', 'FILED_IN_COURT', 'CLOSED'];
                      const currentIdx = stages.indexOf(viewingCase.status);
                      const isComplete = stages.indexOf(s.step) <= currentIdx;
                      return (
                        <div key={s.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 2, width: '20%' }}>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: isComplete ? '#3b82f6' : '#111116', border: `2px solid ${isComplete ? '#3b82f6' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isComplete && <Check size={10} color="#fff" />}
                          </div>
                          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: isComplete ? '#f4f4f5' : '#52525b', textAlign: 'center' }}>{s.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="responsive-grid-2" style={{ gap: 24, marginBottom: 24 }}>
                  <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>FIR NUMBER</div>
                    <div style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{viewingCase.firNumber || 'UNASSIGNED'}</div>
                  </div>
                  <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>INCIDENT CATEGORY</div>
                    <div style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{viewingCase.category}</div>
                  </div>
                  <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>REGISTRATION DATE</div>
                    <div style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{viewingCase.date}</div>
                  </div>
                  <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                    <div style={{ fontSize: 10, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>LOCATION</div>
                    <div style={{ fontSize: 16, color: '#fff', fontWeight: 600 }}>{viewingCase.location}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 10, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>INCIDENT DESCRIPTION</div>
                  <div style={{ padding: 20, background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: 4, color: '#d4d4d8', fontSize: 15, lineHeight: 1.6 }}>
                    {viewingCase.description}
                  </div>
                </div>

                <div className="responsive-grid-2" style={{ gap: 24 }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>INVESTIGATING OFFICER</div>
                    <div style={{ fontSize: 15, color: '#60a5fa', fontWeight: 600 }}>{viewingCase.investigatingOfficer || 'PENDING ASSIGNMENT'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>SUSPECTS</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {viewingCase.suspects && viewingCase.suspects.length > 0 ? (
                        viewingCase.suspects.map((s, idx) => (
                          <span key={idx} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, fontSize: 12, color: '#fff' }}>{s}</span>
                        ))
                      ) : (
                        <span style={{ fontSize: 12, color: '#52525b' }}>NO SUSPECTS IDENTIFIED</span>
                      )}
                    </div>
                  </div>
                </div>

                {viewingCase.caseImage && (
                  <div style={{ marginTop: 24 }}>
                    <div style={{ fontSize: 10, color: '#71717a', fontFamily: "'Share Tech Mono', monospace", marginBottom: 8 }}>CRIME SCENE VISUAL</div>
                    <img 
                      src={`http://localhost:4000/${viewingCase.caseImage}`} 
                      alt="Crime Scene" 
                      style={{ width: '100%', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }} 
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
