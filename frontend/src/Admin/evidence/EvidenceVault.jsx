import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Package, Calendar, User, ShieldCheck, FileText } from 'lucide-react';
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
    <div style={{ paddingBottom: 40 }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#ffffff', letterSpacing: '0.25em', marginBottom: 8, fontWeight: 700 }}>
          // CENTRALIZED STORAGE · LEVEL-5 ENCRYPTION
        </div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 52, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
          Evidence <span style={{ color: '#dc2626' }}>Vault</span>
        </h1>
      </motion.div>

      <div style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#dc2626', marginBottom: 6, fontWeight: 700 }}>// VAULT INVENTORY</div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>Evidence Registry</h3>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={20} color="#ffffff" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.6 }} />
            <input
              type="text"
              placeholder="Search by ID, Type, or Case..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.15)', padding: '14px 16px 14px 48px', borderRadius: 6, color: '#ffffff', fontSize: 16, outline: 'none', width: 350, fontFamily: "'Share Tech Mono', monospace" }}
            />
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0', fontFamily: "'Share Tech Mono', monospace", color: '#ffffff', opacity: 0.5 }}>SYNCHRONIZING WITH VAULT...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {filteredEvidence.map((e, idx) => (
                <motion.div
                  key={e._id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, padding: 20 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ padding: '8px 14px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 4, color: '#60a5fa', fontFamily: "'Share Tech Mono', monospace", fontSize: 16, fontWeight: 700 }}>
                      {e.evidenceId}
                    </div>
                    <div style={{ fontSize: 15, color: '#ffffff', opacity: 1, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800 }}>
                      {e.status}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ color: '#ffffff', fontSize: 22, fontWeight: 800, marginBottom: 6, textTransform: 'uppercase' }}>{e.type}</h4>
                    <p style={{ color: '#ffffff', opacity: 0.8, fontSize: 15, lineHeight: 1.6, height: 48, overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.description}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
                    <div>
                      <div style={{ fontSize: 13, color: '#ffffff', opacity: 0.6, marginBottom: 6, fontWeight: 600 }}>CASE LINK</div>
                      <div style={{ color: '#ffffff', fontSize: 16, fontWeight: 700 }}>{e.caseId}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: '#ffffff', opacity: 0.6, marginBottom: 6, fontWeight: 600 }}>COLLECTED BY</div>
                      <div style={{ color: '#ffffff', fontSize: 16, fontWeight: 600 }}>{e.collectedBy}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: '#ffffff', opacity: 0.6, marginBottom: 6, fontWeight: 600 }}>CUSTODY STATUS</div>
                      <div style={{ color: '#34d399', fontSize: 15, fontFamily: "'Share Tech Mono', monospace", fontWeight: 700 }}>{e.transferStatus}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: '#ffffff', opacity: 0.6, marginBottom: 6, fontWeight: 600 }}>BARCODE</div>
                      <div style={{ color: '#ffffff', fontSize: 15, fontFamily: "'Share Tech Mono', monospace", fontWeight: 700 }}>{e.barcode || 'N/A'}</div>
                    </div>
                  </div>

                  {e.labReports && e.labReports.length > 0 && (
                    <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
                      <div style={{ fontSize: 11, color: '#34d399', fontFamily: "'Share Tech Mono', monospace", marginBottom: 12, fontWeight: 700, letterSpacing: '0.1em' }}>// ATTACHED LAB REPORTS</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {e.labReports.map((path, i) => (
                          <a key={i} href={`http://localhost:4000/${path}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 4, color: '#34d399', textDecoration: 'none', fontSize: 11, fontFamily: "'Share Tech Mono', monospace", fontWeight: 700 }}>
                            <FileText size={13} /> {i + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
