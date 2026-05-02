import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Gavel, Calendar, FileText, Scale } from 'lucide-react';
import axios from 'axios';

export default function CourtJudgments() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJudgment, setSelectedJudgment] = useState(null);

  const fetchJudgments = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/cases');
      // Judgments are only for CLOSED cases
      setCases(res.data.filter(c => c.status === 'CLOSED'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJudgments();
  }, []);

  const filtered = cases.filter(c => 
    c.caseId.toLowerCase().includes(search.toLowerCase()) || 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: 40 }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p className="page-eyebrow" style={{ fontSize: 16, fontWeight: 700 }}>// LEGAL ARCHIVE</p>
          <h1 className="page-title" style={{ fontSize: 52 }}>
            Final <span>Judgments</span>
          </h1>
        </div>
        <div style={{ position: 'relative', width: 320 }}>
          <Search size={20} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ffffff', opacity: 0.6 }} />
          <input 
            type="text" 
            placeholder="Search legal archive..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            style={{ width: '100%', height: 48, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '0 16px 0 48px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", fontSize: 16, outline: 'none' }} 
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24, marginTop: 32 }}>
        <AnimatePresence>
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', fontFamily: "'Share Tech Mono', monospace", color: '#71717a', fontSize: 14 }}>
               DECRYPTING LEGAL ARCHIVE...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', fontFamily: "'Share Tech Mono', monospace", color: '#52525b', fontSize: 14 }}>
               NO FINAL JUDGMENTS RECORDED IN CURRENT SESSION.
            </div>
          ) : (
            filtered.map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedJudgment(c)}
                style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, padding: 24, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                whileHover={{ border: '1px solid rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.02)' }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: 4, height: '100%', background: '#34d399' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#34d399', fontWeight: 700 }}>{c.caseId}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#71717a' }}>{new Date(c.closedDate || c.updatedAt).toLocaleDateString()}</div>
                </div>

                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: 12 }}>{c.title}</h3>
                
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a1a1aa', fontSize: 13 }}>
                    <Calendar size={14} /> {c.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a1a1aa', fontSize: 13 }}>
                    <Gavel size={14} /> {c.category}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
                   <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#34d399', marginBottom: 6, letterSpacing: '0.1em' }}>VERDICT SUMMARY</div>
                   <p style={{ color: '#ffffff', opacity: 0.8, fontSize: 15, lineHeight: 1.6, height: 48, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                     {c.judgment}
                   </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Judgment Detail Modal */}
      <AnimatePresence>
        {selectedJudgment && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              style={{ width: '100%', maxWidth: 750, background: '#0a0a12', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 4, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 24, marginBottom: 24 }}>
                <div>
                   <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#34d399', fontWeight: 700 }}>CERTIFIED LEGAL JUDGMENT · {selectedJudgment.caseId}</div>
                   <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', marginTop: 8 }}>{selectedJudgment.title}</h2>
                </div>
                <button onClick={() => setSelectedJudgment(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#71717a', cursor: 'pointer', padding: 8, borderRadius: 4 }}>X</button>
              </div>

              <div style={{ display: 'grid', gap: 32 }}>
                <div className="responsive-grid-2">
                   <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#71717a', marginBottom: 8 }}>CASE IDENTIFIER</div>
                      <div style={{ color: '#ffffff', fontSize: 18, fontWeight: 700 }}>{selectedJudgment.caseId}</div>
                   </div>
                   <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#71717a', marginBottom: 8 }}>CLOSURE DATE</div>
                      <div style={{ color: '#ffffff', fontSize: 18, fontWeight: 700 }}>{new Date(selectedJudgment.closedDate || selectedJudgment.updatedAt).toLocaleDateString()}</div>
                   </div>
                </div>

                <div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <Scale size={20} color="#34d399" />
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>Official Verdict</span>
                   </div>
                   <div style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.2)', padding: 24, borderRadius: 4, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 12, right: 12, opacity: 0.1 }}><FileText size={64} color="#34d399" /></div>
                      <p style={{ color: '#ffffff', fontSize: 17, lineHeight: 1.8, whiteSpace: 'pre-wrap', position: 'relative', zIndex: 1 }}>
                        {selectedJudgment.judgment}
                      </p>
                   </div>
                </div>

                <div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <FileText size={20} color="#60a5fa" />
                      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>Charges Filed</span>
                   </div>
                   <div style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', padding: 24, borderRadius: 4 }}>
                      <p style={{ color: '#ffffff', opacity: 0.9, fontSize: 16, lineHeight: 1.7 }}>
                        {selectedJudgment.chargeSheet || "No formal charge sheet recorded in digital repository."}
                      </p>
                   </div>
                </div>

                <div style={{ marginTop: 20, padding: 16, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4, background: '#0a0a12' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#71717a', fontSize: 13, fontFamily: "'Share Tech Mono', monospace" }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }} />
                      DIGITALLY SIGNED & ARCHIVED BY JUDICIAL AUTHORITY
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
