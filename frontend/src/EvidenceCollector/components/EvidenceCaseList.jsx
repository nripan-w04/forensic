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
  const [formData, setFormData] = useState({
    caseId: '', type: 'Weapon', description: '', collectedBy: '', collectedDate: '',
    barcode: '', qrCode: ''
  });
  const [aiScanning, setAiScanning] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const simulateAIScan = () => {
    setAiScanning(true);
    setAiResult(null);
    setTimeout(() => {
      const results = [
        "Weapon Detected: 9mm Handgun (High Confidence)",
        "Weapon Detected: Serrated Knife (Medium Confidence)",
        "Negative: No weapons detected in visual field.",
        "Anomaly Detected: Biological traces on surface."
      ];
      setAiResult(results[Math.floor(Math.random() * results.length)]);
      setAiScanning(false);
    }, 2500);
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
    try {
      await axios.post('http://localhost:4000/api/evidence', { ...formData, aiAnalysis: aiResult });
      showToast('Evidence securely logged to Case ' + formData.caseId, 'success');
      setSelectedCase(null);
      setFormData({ 
        caseId: '', type: 'Weapon', description: '', collectedBy: '', collectedDate: '',
        barcode: '', qrCode: ''
      });
      setAiResult(null);
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
                  </td>
                  <td>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, color: '#d4d4d8', fontWeight: 600 }}>{c.title}</div>
                    <div style={{ fontSize: 14, color: '#71717a', textTransform: 'uppercase', marginTop: 2 }}>{c.category}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 15, color: '#ffffffff' }}>{c.location}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 14, fontFamily: "'Share Tech Mono', monospace", color: '#fbbf24' }}>{c.status}</div>
                  </td>
                  <td>
                    {c.status !== 'CLOSED' && c.status !== 'FILED_IN_COURT' ? (
                      <button 
                        onClick={() => handleOpenAddEvidence(c)}
                        style={{ padding: '6px 12px', background: 'rgba(59,130,246,0.1)', border: '1px solid #3b82f640', color: '#60a5fa', borderRadius: 3, fontSize: 10, fontFamily: "'Share Tech Mono', monospace", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        <Plus size={12} /> ADD EVIDENCE
                      </button>
                    ) : (
                      <div style={{ fontSize: 12, color: '#52525b', fontFamily: "'Share Tech Mono', monospace" }}>LOCKED FOR REVIEW</div>
                    )}
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
                style={{ width: '100%', maxWidth: 500, background: '#0a0a12', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 4, padding: 24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16, marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase' }}>Log Evidence: {selectedCase.caseId}</div>
                  <button onClick={() => setSelectedCase(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                  <div className="responsive-grid-2">
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#ffffff', opacity: 0.6, marginBottom: 6 }}>CASE ID (LOCKED)</label>
                      <input type="text" value={formData.caseId} disabled style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', color: '#71717a', borderRadius: 3, outline: 'none', fontSize: 14 }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#ffffff', opacity: 0.6, marginBottom: 6 }}>EVIDENCE TYPE</label>
                      <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: '#fff', borderRadius: 3, outline: 'none', fontSize: 14 }}>
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
                      <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#ffffff', opacity: 0.6, marginBottom: 6 }}>COLLECTED BY</label>
                      <input type="text" name="collectedBy" value={formData.collectedBy} onChange={handleChange} required placeholder="Agent Name" style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: '#fff', borderRadius: 3, outline: 'none', fontSize: 14 }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#ffffff', opacity: 0.6, marginBottom: 6 }}>COLLECTION DATE</label>
                      <input type="date" name="collectedDate" value={formData.collectedDate} onChange={handleChange} required style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: '#fff', borderRadius: 3, outline: 'none', fontSize: 14 }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#ffffff', opacity: 0.6, marginBottom: 6 }}>BARCODE / TRACKING ID</label>
                    <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} placeholder="e.g. BAR-10029" style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: '#fff', borderRadius: 3, outline: 'none', fontSize: 14 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#ffffff', opacity: 0.6, marginBottom: 6 }}>DESCRIPTION & CONDITION</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Detail the item..." style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: '#fff', borderRadius: 3, outline: 'none', minHeight: 100, fontSize: 14 }} />
                  </div>

                  <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#ffffff', opacity: 0.5, marginBottom: 2 }}>// PRELIMINARY AI SCAN</div>
                          <div style={{ fontSize: 11, color: '#ffffff' }}>Identify weapons/anomalies</div>
                        </div>
                        <button 
                          type="button" 
                          onClick={simulateAIScan}
                          disabled={aiScanning}
                          style={{ padding: '6px 12px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 4, color: '#d8b4fe', cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: 9 }}
                        >
                          {aiScanning ? 'SCANNING...' : 'SCAN'}
                        </button>
                    </div>
                    
                    {aiResult && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 8, background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 4, color: '#d8b4fe', fontSize: 10, fontFamily: "'Share Tech Mono', monospace" }}>
                        [RESULT]: {aiResult}
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
        </AnimatePresence>
      </div>
    </>
  );
}
