import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, FileText } from 'lucide-react';
import axios from 'axios';

export default function EvidenceVault() {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/evidence');
        setEvidence(res.data);
      } catch (err) {
        console.error("Vault Access Error:", err);
      } finally {
        setLoading(false);
      }
    };
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
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, padding: 16 }}
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
                      <div style={{ fontSize: 10, color: '#71717a', marginBottom: 2 }}>COLLECTOR</div>
                      <div style={{ color: '#f4f4f5', fontSize: 13, fontWeight: 600 }}>{e.collectedBy}</div>
                    </div>
                  </div>

                  {e.labReports && e.labReports.length > 0 && (
                    <div style={{ marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {e.labReports.map((path, i) => (
                          <a key={i} href={`http://localhost:4000/${path}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.1)', borderRadius: 3, color: '#34d399', textDecoration: 'none', fontSize: 10, fontFamily: "'Share Tech Mono', monospace" }}>
                            <FileText size={12} /> REPORT {i + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
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
      </div>
    </>
  );
}
