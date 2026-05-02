import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import axios from 'axios';

export default function PoliceEvidenceView() {
  const [search, setSearch] = useState('');
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchEvidence();
  }, []);

  const filtered = evidence.filter(e => 
    e.evidenceId.toLowerCase().includes(search.toLowerCase()) || 
    e.caseId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 5 }}>
        <div>
          <p className="page-eyebrow">// RECORDS DEPARTMENT</p>
          <h1 className="page-title">
            Evidence <span>Registry</span>
          </h1>
        </div>
        <div style={{ position: 'relative', width: 250 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
          <input type="text" placeholder="Search case or evidence ID..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', height: 38, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '0 14px 0 36px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, outline: 'none' }} />
        </div>
      </div>

      <div className="data-card table-wrap" style={{ position: 'relative' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Tag ID / Case</th>
              <th>Type / Description</th>
              <th>Collector</th>
              <th>Custody Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#71717a', fontSize: 12 }}>UNLOCKING CUSTODY LOGS...</td></tr>}
              {!loading && filtered.map((e, i) => (
                <motion.tr key={e._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <td>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#f4f4f5', fontWeight: 600 }}>{e.evidenceId}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#3b82f6', marginTop: 4 }}>Case: {e.caseId}</div>
                  </td>
                  <td>
                    <div style={{ display: 'inline-block', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: 2, fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#a1a1aa', marginBottom: 4, textTransform: 'uppercase' }}>{e.type}</div>
                    <div style={{ fontSize: 12, color: '#d4d4d8', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, color: '#e4e4e7' }}>{e.collectedBy}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#71717a', marginTop: 4 }}>{e.collectedDate}</div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '4px 8px', borderRadius: 3, fontFamily: "'Share Tech Mono', monospace", fontSize: 10, textTransform: 'uppercase',
                        background: e.status === 'Logged' ? 'rgba(59,130,246,0.1)' : e.status === 'In Lab' ? 'rgba(251,191,36,0.1)' : e.status === 'Analyzed' ? 'rgba(52,211,153,0.1)' : 'rgba(113,113,122,0.1)',
                        color: e.status === 'Logged' ? '#60a5fa' : e.status === 'In Lab' ? '#fbbf24' : e.status === 'Analyzed' ? '#34d399' : '#a1a1aa',
                        border: `1px solid ${e.status === 'Logged' ? '#60a5fa40' : e.status === 'In Lab' ? '#fbbf2440' : e.status === 'Analyzed' ? '#34d39940' : '#71717a40'}`
                      }}
                    >
                      {e.status}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {!loading && filtered.length === 0 && (
               <tr>
                 <td colSpan="4" style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#52525b', fontSize: 11, letterSpacing: '0.1em' }}>NO EVIDENCE MATCHING QUERY</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
