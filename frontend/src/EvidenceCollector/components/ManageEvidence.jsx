import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit, Trash2, Package, X, Check, FileText, Eye } from 'lucide-react';
import axios from 'axios';
import { useUI } from '../../common/UIContext';

export default function ManageEvidence() {
  const { showToast, showConfirm } = useUI();
  const [search, setSearch] = useState('');
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingHistory, setViewingHistory] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);


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

  useEffect(() => {
    fetchEvidence();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/api/evidence/${id}`, { status: newStatus });
      setEvidence(evidence.map(e => e._id === id ? { ...e, status: newStatus } : e));
      showToast(`Item status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error updating custody status', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm({
      title: 'Erase Evidence Record',
      message: 'Are you sure you want to securely erase this evidence item from the digital chain of custody?',
      confirmText: 'Erase Item',
      cancelText: 'Abort'
    });
    if (!confirmed) return;
    try {
      await axios.delete(`http://localhost:4000/api/evidence/${id}`);
      setEvidence(evidence.filter(e => e._id !== id));
      showToast('Evidence record successfully erased', 'info');
    } catch (err) {
      console.error(err);
      showToast('System Error: Failed to delete evidence', 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:4000/api/evidence/${editingItem._id}`, editingItem);
      setEvidence(evidence.map(ev => ev._id === editingItem._id ? res.data.evidence : ev));
      showToast('Evidence data updated successfully', 'success');
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to update evidence item: Access Denied', 'error');
    }
  };

  const [transferringItem, setTransferringItem] = useState(null);
  const [transferData, setTransferData] = useState({ to: '', purpose: '' });

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/evidence/${transferringItem._id}/transfer`, transferData);
      setEvidence(evidence.map(ev => ev._id === transferringItem._id ? { ...ev, status: 'SENT_TO_LAB' } : ev));
      showToast('Evidence successfully transferred to Lab', 'success');
      setTransferringItem(null);
      setTransferData({ to: '', purpose: '' });
    } catch (err) {
      console.error(err);
      showToast('Transfer failed: Access Denied', 'error');
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
          <p className="page-eyebrow" style={{ fontSize: 16, fontWeight: 700 }}>// CUSTODY LOCKER</p>
          <h1 className="page-title" style={{ fontSize: 52 }}>
            Manage <span>Evidence</span>
          </h1>
        </div>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ffffff', opacity: 0.6 }} />
          <input type="text" placeholder="Search case or evidence ID..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', height: 48, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '0 16px 0 44px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", fontSize: 16, outline: 'none' }} />
        </div>
      </div>

      <div className="data-card table-wrap" style={{ position: 'relative' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ fontSize: 13 }}>EVIDENCE IDENTIFIER</th>
              <th style={{ fontSize: 13 }}>ITEM SPECIFICATION</th>
              <th style={{ fontSize: 13 }}>SECURITY BARCODE</th>
              <th style={{ fontSize: 13 }}>COLLECTING OFFICER</th>
              <th style={{ fontSize: 13 }}>OPERATIONAL STATUS</th>
              <th style={{ fontSize: 13 }}>ANALYSIS REPORTS</th>
              <th style={{ textAlign: 'right', paddingRight: 22, fontSize: 13 }}>COMMANDS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading && <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#71717a', fontSize: 12 }}>UNLOCKING CUSTODY LOGS...</td></tr>}
              {!loading && filtered.map((e, i) => (
                <motion.tr key={e._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <td>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 16, color: '#f4f4f5', fontWeight: 700 }}>{e.evidenceId}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#3b82f6', marginTop: 4, fontWeight: 600 }}>Case: {e.caseId}</div>
                  </td>
                  <td>
                    <div style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(255,255,255,0.08)', borderRadius: 4, fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#ffffff', marginBottom: 6, textTransform: 'uppercase', fontWeight: 600 }}>{e.type}</div>
                    <div style={{ fontSize: 15, color: '#d4d4d8', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{e.description}</div>
                  </td>
                  <td>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#ffffffff', fontWeight: 600 }}>Bar Code: {e.barcode || 'N/A'}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 16, color: '#e4e4e7', fontWeight: 600 }}>{e.collectedBy}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#71717a', marginTop: 4, fontWeight: 500 }}>{e.collectedDate}</div>
                  </td>
                  <td>
                    <div style={{
                      padding: '8px 16px', borderRadius: 4, fontFamily: "'Share Tech Mono', monospace", fontSize: 13, textTransform: 'uppercase', textAlign: 'center', fontWeight: 800,
                      background: e.status === 'LOGGED' ? 'rgba(59,130,246,0.15)' : e.status === 'SENT_TO_LAB' ? 'rgba(251,191,36,0.15)' : e.status === 'ANALYZED' ? 'rgba(52,211,153,0.15)' : 'rgba(113,113,122,0.15)',
                      color: e.status === 'LOGGED' ? '#60a5fa' : e.status === 'SENT_TO_LAB' ? '#fbbf24' : e.status === 'ANALYZED' ? '#34d399' : '#a1a1aa',
                      border: `1px solid ${e.status === 'LOGGED' ? '#60a5fa60' : e.status === 'SENT_TO_LAB' ? '#fbbf2460' : e.status === 'ANALYZED' ? '#34d39960' : '#71717a60'}`,
                      letterSpacing: '0.05em'
                    }}>
                      {e.status}
                    </div>
                  </td>

                  <td>
                    <div className="custom-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', maxWidth: 150, paddingBottom: 4 }}>
                      {e.labReports?.map((path, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => setViewingReport(`http://localhost:4000/${path}`)}
                          style={{ flexShrink: 0, padding: '6px 10px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 3, color: '#34d399', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Share Tech Mono', monospace", cursor: 'pointer' }}
                        >
                          <FileText size={12} /> {idx + 1}
                        </button>
                      ))}
                      {(!e.labReports || e.labReports.length === 0) && (
                        <span style={{ fontSize: 13, color: '#71717a', fontFamily: "'Share Tech Mono', monospace" }}>PENDING</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', paddingRight: 22 }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>

                      <button onClick={() => setViewingHistory(e)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, padding: '4px 8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'pointer', transition: 'all 0.2s', fontSize: 13, fontFamily: "'Share Tech Mono', monospace" }} title="View Chain of Custody">
                        HISTORY
                      </button>
                      {e.status === 'COLLECTED' && (
                        <button onClick={() => setTransferringItem(e)} style={{ background: 'transparent', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 3, padding: '4px 8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', cursor: 'pointer', transition: 'all 0.2s', fontSize: 13, fontFamily: "'Share Tech Mono', monospace" }} title="Transfer to Lab">
                          <Package size={12} style={{ marginRight: 4 }} /> TRANSFER
                        </button>
                      )}
                      {e.status !== 'ANALYZED' && e.status !== 'ARCHIVED' && (
                        <>
                          <button onClick={() => setEditingItem(e)} style={{ background: 'transparent', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 3, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', cursor: 'pointer', transition: 'all 0.2s' }} title="Edit Evidence">
                            <Edit size={12} />
                          </button>
                          <button onClick={() => handleDelete(e._id)} style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 3, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', cursor: 'pointer', transition: 'all 0.2s' }} title="Delete Evidence">
                            <Trash2 size={12} />
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
                <td colSpan="6" style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#52525b', fontSize: 11, letterSpacing: '0.1em' }}>NO EVIDENCE MATCHING QUERY</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Chain of Custody Modal */}
        <AnimatePresence>
          {viewingHistory && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                style={{ width: '100%', maxWidth: 500, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: 24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>Chain of Custody</div>
                  <button onClick={() => setViewingHistory(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={18} /></button>
                </div>

                <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#71717a', fontFamily: "'Share Tech Mono', monospace" }}>EVIDENCE ID</div>
                      <div style={{ fontSize: 15, color: '#ffffff', fontWeight: 600 }}>{viewingHistory.evidenceId}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: '#71717a', fontFamily: "'Share Tech Mono', monospace" }}>CASE REFERENCE</div>
                      <div style={{ fontSize: 15, color: '#3b82f6', fontWeight: 600 }}>{viewingHistory.caseId}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {viewingHistory.chainOfCustody && viewingHistory.chainOfCustody.length > 0 ? (
                    viewingHistory.chainOfCustody.map((log, i) => (
                      <div key={i} style={{ display: 'flex', gap: 16 }}>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#dc2626', marginTop: 4 }} />
                          {i !== viewingHistory.chainOfCustody.length - 1 && <div style={{ position: 'absolute', top: 14, left: 4.5, width: 1, height: '100%', background: 'rgba(255,255,255,0.1)' }} />}
                        </div>
                        <div>
                          <div style={{ color: '#ffffff', fontSize: 15, fontWeight: 600 }}>{log.to}</div>
                          <div style={{ color: '#ffffff', opacity: 0.6, fontSize: 12, fontFamily: "'Share Tech Mono', monospace", marginTop: 4 }}>
                            FROM: {log.from} ·
                          </div>
                          <div style={{ color: '#ffffff', opacity: 0.8, fontSize: 14, marginTop: 6, lineHeight: 1.5 }}>{log.purpose}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: '#ffffff', opacity: 0.3, padding: '40px 0', fontSize: 12 }}>NO TRANSFER HISTORY RECORDED</div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal Overlay */}
        <AnimatePresence>
          {editingItem && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                style={{ width: '100%', maxWidth: 500, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: 24, paddingBottom: 16 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16, marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase' }}>Update Item Data</div>
                  <button onClick={() => setEditingItem(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <form onSubmit={handleEditSubmit} style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 6 }}>ASSOCIATED CASE ID</label>
                    <input type="text" value={editingItem.caseId} onChange={e => setEditingItem({ ...editingItem, caseId: e.target.value })} required style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none' }} />
                  </div>
                  <div className="responsive-grid-2">
                    <div>
                      <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#ffffff', opacity: 0.6, marginBottom: 6 }}>BARCODE REFERENCE</label>
                      <input type="text" value={editingItem.barcode || ''} onChange={e => setEditingItem({ ...editingItem, barcode: e.target.value })} style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', color: '#fff', borderRadius: 3, outline: 'none', fontSize: 14 }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 6 }}>ITEM DESCRIPTION</label>
                    <textarea value={editingItem.description} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} required style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none', minHeight: 80 }} />
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

        {/* Transfer to Lab Modal */}
        <AnimatePresence>
          {transferringItem && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
                style={{ width: '100%', maxWidth: 450, background: '#0a0a12', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 4, padding: 24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16, marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase' }}>Transfer to Forensic Lab</div>
                  <button onClick={() => setTransferringItem(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <form onSubmit={handleTransfer} style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 6 }}>RECIPIENT ANALYST / UNIT</label>
                    <input type="text" value={transferData.to} onChange={e => setTransferData({ ...transferData, to: e.target.value })} placeholder="e.g. Dr. Aris Thorne - DNA Lab" required style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', marginBottom: 6 }}>TRANSFER PURPOSE</label>
                    <textarea value={transferData.purpose} onChange={e => setTransferData({ ...transferData, purpose: e.target.value })} placeholder="Specify required analysis..." required style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', color: '#fff', borderRadius: 3, outline: 'none', minHeight: 80 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <button type="submit" style={{ padding: '10px 24px', background: '#fbbf24', border: 'none', color: '#000', borderRadius: 3, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Package size={14} /> INITIATE TRANSFER
                    </button>
                  </div>
                </form>
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
