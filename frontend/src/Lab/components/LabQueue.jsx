import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit, Check, X, FileText } from 'lucide-react';
import axios from 'axios';
import { useUI } from '../../common/UIContext';
import { useSocket } from '../../common/SocketContext';

export default function LabQueue() {
  const { showToast } = useUI();
  const socket = useSocket();
  const [search, setSearch] = useState('');
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(null);
  const [analysisData, setAnalysisData] = useState({ findings: '', analyst: '' });

  const fetchEvidence = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/evidence');
      // Show everything that isn't 'Archived' so lab analysts can interact with 'In Lab', 'Logged', etc.
      setEvidence((res.data || []).filter(e => e.status !== 'Archived'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();

    if (socket) {
      socket.on('ai_analysis_complete', (data) => {
        setEvidence(prev => prev.map(e => e._id === data.evidenceId || e.evidenceId === data.evidenceId ? { ...e, aiAnalysis: data.analysis } : e));
      });
      socket.on('evidence_transferred', () => fetchEvidence());

      return () => {
        socket.off('ai_analysis_complete');
        socket.off('evidence_transferred');
      };
    }
  }, [socket]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/api/evidence/${id}`, { status: newStatus });
      setEvidence(evidence.map(e => e._id === id ? { ...e, status: newStatus } : e));
      showToast(`Evidence status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('System Error: Failed to update analysis status', 'error');
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('findingsSummary', analysisData.findings);
      formData.append('analystName', analysisData.analyst);

      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          formData.append('reports', file);
        });
      }

      const res = await axios.post(`http://localhost:4000/api/evidence/${analyzing._id}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setEvidence(prev => prev.map(ev => ev._id === analyzing._id ? res.data.evidence : ev));
      showToast('Forensic results transmitted to Police Authority', 'success');
      setAnalyzing(null);
      setAnalysisData({ findings: '', analyst: '' });
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
      showToast('Transmission failure: Authority connection lost', 'error');
    }
  };

  const [aiLoading, setAiLoading] = useState(null);

  const runAiDiagnostic = async (id) => {
    try {
      setAiLoading(id);
      const res = await axios.post(`http://localhost:4000/api/evidence/${id}/ai`);
      setEvidence(evidence.map(e => e._id === id ? { ...e, aiAnalysis: res.data.analysis } : e));
      showToast('AI Diagnostic Complete', 'success');
    } catch (err) {
      console.error(err);
      showToast('AI System Offline', 'error');
    } finally {
      setAiLoading(null);
    }
  };

  const filtered = evidence.filter(e =>
    e.evidenceId.toLowerCase().includes(search.toLowerCase()) ||
    e.caseId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 5 }}>
        <div>
          <p className="page-eyebrow" style={{ fontSize: 16, fontWeight: 700 }}>{'//'} FORENSIC LABORATORY</p>
          <h1 className="page-title" style={{ fontSize: 52 }}>
            Evidence <span>Queue</span>
          </h1>
        </div>
        <div style={{ position: 'relative', width: 320 }}>
          <Search size={20} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ffffff', opacity: 0.6 }} />
          <input type="text" placeholder="Search evidence tag..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', height: 48, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '0 16px 0 48px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", fontSize: 16, outline: 'none' }} />
        </div>
      </div>

      <div className="data-card table-wrap" style={{ position: 'relative' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Tag ID / Case</th>
              <th>Type / Description</th>
              <th>AI Insights</th>
              <th>Lab Report / Analysis</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#71717a', fontSize: 12 }}>LOADING LAB QUEUE...</td></tr>}
              {!loading && filtered.map((e, i) => (
                <motion.tr key={e._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <td>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 16, color: '#f4f4f5', fontWeight: 700 }}>{e.evidenceId}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#3b82f6', marginTop: 4, fontWeight: 600 }}>Case: {e.caseId}</div>
                  </td>
                  <td style={{ maxWidth: 220 }}>
                    <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 4, fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ffffff', marginBottom: 6, textTransform: 'uppercase', fontWeight: 700 }}>{e.type}</div>
                    <div className="custom-scroll" style={{ fontSize: 15, color: '#d4d4d8', maxWidth: '100%', overflowX: 'auto', whiteSpace: 'nowrap', fontWeight: 500, paddingBottom: 4 }}>{e.description}</div>
                  </td>
                  <td style={{ maxWidth: 250 }}>
                    {e.aiAnalysis ? (
                      <div style={{ padding: 10, background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 4, fontSize: 12, color: '#d8b4fe', fontFamily: "'Share Tech Mono', monospace", lineHeight: 1.5 }}>
                        {e.aiAnalysis}
                      </div>
                    ) : (
                      <button
                        onClick={() => runAiDiagnostic(e._id)}
                        disabled={aiLoading === e._id}
                        style={{ padding: '6px 12px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: '#d8b4fe', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontFamily: "'Share Tech Mono', monospace", fontWeight: 600 }}
                      >
                        {aiLoading === e._id ? 'DIAGNOSING...' : 'RUN AI DIAGNOSTIC'}
                      </button>
                    )}
                  </td>
                  <td style={{ maxWidth: 280 }}>
                    <div className="custom-scroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, whiteSpace: 'nowrap' }}>
                      {e.labReports?.map((path, idx) => (
                        <a key={idx} href={`http://localhost:4000/${path}`} target="_blank" rel="noreferrer" style={{ flexShrink: 0, padding: '6px 12px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 4, color: '#34d399', textDecoration: 'none', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Share Tech Mono', monospace" }}>
                          <FileText size={14} /> REPORT_{idx + 1}
                        </a>
                      ))}
                      {(!e.labReports || e.labReports.length === 0) && (
                        <span style={{ fontSize: 12, color: '#52525b', fontFamily: "'Share Tech Mono', monospace" }}>AWAITING OFFICIAL ANALYSIS</span>
                      )}
                    </div>
                  </td>
                  <td>
                    {e.status === 'ANALYZED' ? (
                      <div style={{ padding: '4px 8px', borderRadius: 3, background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', fontSize: 10, fontFamily: "'Share Tech Mono', monospace", textAlign: 'center' }}>
                        RESULTS SENT TO POLICE
                      </div>
                    ) : (
                      <button
                        onClick={() => setAnalyzing(e)}
                        style={{ width: '100%', padding: '6px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 10, fontFamily: "'Share Tech Mono', monospace", fontWeight: 600 }}
                      >
                        FINALIZE & SEND
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#52525b', fontSize: 11, letterSpacing: '0.1em' }}>QUEUE IS EMPTY</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Analysis Finalization Modal */}
        <AnimatePresence>
          {analyzing && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                style={{ width: '100%', maxWidth: 500, background: '#0a0a12', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 4, padding: 24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16, marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>Finalize Forensic Result</div>
                  <button onClick={() => setAnalyzing(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <form onSubmit={handleFinalSubmit} style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#ffffff', opacity: 0.5, marginBottom: 6 }}>LEAD ANALYST NAME</label>
                    <input type="text" value={analysisData.analyst} onChange={e => setAnalysisData({ ...analysisData, analyst: e.target.value })} placeholder="Enter your full name" required style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#ffffff', opacity: 0.5, marginBottom: 6 }}>FINDINGS SUMMARY</label>
                    <textarea value={analysisData.findings} onChange={e => setAnalysisData({ ...analysisData, findings: e.target.value })} placeholder="Detail the results of physical forensic analysis..." required style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none', minHeight: 120 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ffffff', opacity: 0.6, marginBottom: 12 }}>UPLOAD FORENSIC DOCUMENTS (MULTIPLE)</label>
                    <div style={{ border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 6, padding: 20, textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                      <input
                        type="file"
                        multiple
                        id="file-upload"
                        onChange={e => setSelectedFiles(Array.from(e.target.files))}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="file-upload" style={{ cursor: 'pointer', color: '#60a5fa', fontSize: 14, fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>
                        {selectedFiles.length > 0 ? `${selectedFiles.length} FILES SELECTED` : 'SELECT ANALYSIS FILES'}
                      </label>
                      {selectedFiles.length > 0 && (
                        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                          {selectedFiles.map((f, i) => (
                            <div key={i} style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', borderRadius: 2 }}>{f.name}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" style={{ padding: '12px 24px', background: '#34d399', color: '#000', border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                      Transmit to Police Authority
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
