import React, { useEffect, useState } from 'react';
import { Database, Search, FileText, Eye, X, Clock, User, Shield, Activity, MapPin, Calendar, Microscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function EvidenceVault() {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewingEvidence, setViewingEvidence] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:4000/api/evidence');
      setEvidence(res.data);
    } catch (err) {
      console.error("Vault Access Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidence();
  }, []);

  const filteredEvidence = evidence.filter(e =>
    e.evidenceId.toLowerCase().includes(search.toLowerCase()) ||
    e.type.toLowerCase().includes(search.toLowerCase()) ||
    e.caseId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">{'//'} CENTRALIZED STORAGE · LEVEL-5 ENCRYPTION</p>
          <h1 className="page-title">
            Evidence <span>Vault</span>
          </h1>
        </div>
      </div>

      <div className="data-card">
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ef4444', marginBottom: 4 }}>{'//'} VAULT INVENTORY</div>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>Evidence Registry</h3>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#71717a" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search ID, Type, or Case..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px 10px 42px', borderRadius: 4, color: '#ffffff', fontSize: 14, outline: 'none', width: 280, fontFamily: "'Share Tech Mono', monospace" }}
            />
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Share Tech Mono', monospace", color: '#71717a', fontSize: 13 }}>
              SYNCHRONIZING WITH SECURE VAULT...
            </div>
          ) : (
            <div className="responsive-grid-3" style={{ gap: 20 }}>
              {filteredEvidence.map((e, idx) => (
                <motion.div
                  key={e._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    setViewingEvidence(e);
                    setActiveImageIndex(0);
                  }}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, padding: 16, cursor: 'pointer', transition: 'all 0.2s' }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
                    <div style={{ padding: '4px 10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 3, color: '#60a5fa', fontFamily: "'Share Tech Mono', monospace", fontSize: 13, fontWeight: 700 }}>
                      {e.evidenceId}
                    </div>
                    <div className={`badge ${e.status === 'ANALYZED' ? 'badge-approved' : 'badge-pending'}`} style={{ fontSize: 10 }}>
                      {e.status}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ color: '#f4f4f5', fontSize: 18, fontWeight: 700, marginBottom: 4, textTransform: 'uppercase' }}>{e.type}</h4>
                    <p style={{ color: '#a1a1aa', fontSize: 13, lineHeight: 1.5, height: 40, overflow: 'hidden' }}>{e.description}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#71717a', marginBottom: 2 }}>CASE LINK</div>
                      <div style={{ color: '#f4f4f5', fontSize: 13, fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>{e.caseId}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: '#71717a', marginBottom: 2 }}>TRANSFER</div>
                      <div style={{ color: e.transferStatus === 'In Custody' ? '#10b981' : '#f59e0b', fontSize: 13, fontWeight: 600 }}>{e.transferStatus}</div>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: 12, fontSize: 10, color: '#71717a', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Eye size={12} />
                    <span>Click to view full forensic audit</span>
                  </div>
                </motion.div>
              ))}
              {filteredEvidence.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#71717a', fontFamily: "'Share Tech Mono', monospace", fontSize: 12 }}>
                  NO VAULT MATCHES FOUND.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Detailed Evidence Modal */}
        <AnimatePresence>
          {viewingEvidence && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 280, background: 'rgba(4,4,10,0.95)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100000, padding: 20 }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                style={{ width: '95%', maxWidth: 1100, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 40, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: 2 }}>{viewingEvidence.evidenceId}</span>
                      <span style={{ fontSize: 10, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DATABASE AUDIT RECORD</span>
                    </div>
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}>{viewingEvidence.type}</h2>
                  </div>
                  <button 
                    onClick={() => setViewingEvidence(null)} 
                    style={{ background: '#ef4444', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '10px 20px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Share Tech Mono', monospace", fontSize: 12, fontWeight: 700 }}
                  >
                    <X size={16} /> CLOSE
                  </button>
                </div>

                <div className="responsive-grid-2" style={{ gap: 40 }}>
                  {/* Left Column: Information */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {/* Basic Info */}
                    <section>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 12, letterSpacing: '0.1em' }}>{'//'} 1. CUSTODY INFORMATION</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#71717a', marginBottom: 6, textTransform: 'uppercase' }}><Shield size={12} /> Case ID</label>
                          <div style={{ color: '#f4f4f5', fontSize: 15, fontWeight: 700, fontFamily: "'Share Tech Mono', monospace" }}>{viewingEvidence.caseId}</div>
                        </div>
                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#71717a', marginBottom: 6, textTransform: 'uppercase' }}><User size={12} /> Collected By</label>
                          <div style={{ color: '#f4f4f5', fontSize: 15, fontWeight: 700 }}>{viewingEvidence.collectedBy}</div>
                        </div>
                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#71717a', marginBottom: 6, textTransform: 'uppercase' }}><Calendar size={12} /> Date Logged</label>
                          <div style={{ color: '#f4f4f5', fontSize: 14 }}>{viewingEvidence.collectedDate}</div>
                        </div>
                        <div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#71717a', marginBottom: 6, textTransform: 'uppercase' }}><Activity size={12} /> Transfer Status</label>
                          <div style={{ color: viewingEvidence.transferStatus === 'In Custody' ? '#10b981' : '#f59e0b', fontSize: 14, fontWeight: 700 }}>{viewingEvidence.transferStatus}</div>
                        </div>
                      </div>
                    </section>

                    {/* Description */}
                    <section>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 12, letterSpacing: '0.1em' }}>{'//'} 2. ITEM DESCRIPTION</div>
                      <div style={{ padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
                        <p style={{ color: '#d4d4d8', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{viewingEvidence.description}</p>
                      </div>
                    </section>

                    {/* AI Analysis & Findings */}
                    <section>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 12, letterSpacing: '0.1em' }}>{'//'} 3. FORENSIC INTELLIGENCE</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* AI Section */}
                        <div style={{ padding: 20, background: 'rgba(34,211,238,0.03)', border: '1px solid rgba(34,211,238,0.1)', borderRadius: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <Activity size={14} color="#22d3ee" />
                            <span style={{ fontSize: 11, color: '#22d3ee', fontWeight: 700, letterSpacing: '0.05em' }}>AI DIAGNOSTIC REPORT</span>
                          </div>
                          <p style={{ color: '#bae6fd', fontSize: 13, lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                            {viewingEvidence.aiAnalysis || "AI Diagnostics not yet performed for this item."}
                          </p>
                        </div>
                        
                        {/* Analyst Section */}
                        <div style={{ padding: 20, background: 'rgba(168,85,247,0.03)', border: '1px solid rgba(168,85,247,0.1)', borderRadius: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <Microscope size={14} color="#a855f7" />
                            <span style={{ fontSize: 11, color: '#a855f7', fontWeight: 700, letterSpacing: '0.05em' }}>HUMAN ANALYST FINDINGS</span>
                          </div>
                          <p style={{ color: '#e9d5ff', fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
                            {viewingEvidence.findingsSummary || "Detailed forensic report pending completion."}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <div style={{ fontSize: 10, color: '#a855f7' }}>CERTIFIED BY: {viewingEvidence.analystName || "PENDING"}</div>
                             {viewingEvidence.labReports && viewingEvidence.labReports.length > 0 && (
                               <div style={{ display: 'flex', gap: 8 }}>
                                 {viewingEvidence.labReports.map((report, i) => (
                                   <a key={i} href={`http://localhost:4000/${report}`} target="_blank" rel="noreferrer" style={{ fontSize: 9, color: '#fff', background: 'rgba(168,85,247,0.2)', padding: '4px 8px', borderRadius: 2, textDecoration: 'none' }}>VIEW REPORT {i+1}</a>
                                 ))}
                               </div>
                             )}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Visuals & Chain of Custody */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {/* Visual Evidence Slider */}
                    <section>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 12, letterSpacing: '0.1em' }}>{'//'} 4. VISUAL CAPTURES</div>
                      {viewingEvidence.images && viewingEvidence.images.length > 0 ? (
                        <div style={{ position: 'relative', background: '#000', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img 
                            src={`http://localhost:4000/${viewingEvidence.images[activeImageIndex]}`} 
                            alt="Evidence" 
                            style={{ width: '100%', height: 320, objectFit: 'contain', background: '#050505' }} 
                          />
                          {viewingEvidence.images.length > 1 && (
                            <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>
                              {viewingEvidence.images.map((_, i) => (
                                <button 
                                  key={i} 
                                  onClick={() => setActiveImageIndex(i)}
                                  style={{ width: 6, height: 6, borderRadius: '50%', background: i === activeImageIndex ? '#3b82f6' : 'rgba(255,255,255,0.2)', padding: 0 }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: 4, color: '#71717a', fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>
                          NO VISUAL EVIDENCE LOGGED
                        </div>
                      )}
                    </section>

                    {/* Chain of Custody */}
                    <section>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 12, letterSpacing: '0.1em' }}>{'//'} 5. CHAIN OF CUSTODY LOG</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {viewingEvidence.chainOfCustody && viewingEvidence.chainOfCustody.length > 0 ? (
                          viewingEvidence.chainOfCustody.map((log, i) => (
                            <div key={i} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid #3b82f6', borderRadius: '0 4px 4px 0' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 10, color: '#3b82f6', fontWeight: 700 }}>{log.purpose.toUpperCase()}</span>
                                <span style={{ fontSize: 9, color: '#71717a' }}>{new Date(log.date).toLocaleString()}</span>
                              </div>
                              <div style={{ fontSize: 12, color: '#f4f4f5' }}>
                                <span style={{ color: '#71717a' }}>FROM:</span> {log.from} <span style={{ color: '#71717a', margin: '0 8px' }}>→</span> <span style={{ color: '#71717a' }}>TO:</span> {log.to}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: 20, textAlign: 'center', color: '#71717a', fontSize: 11, fontFamily: "'Share Tech Mono', monospace" }}>NO TRANSFER HISTORY AVAILABLE</div>
                        )}
                      </div>
                    </section>
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
