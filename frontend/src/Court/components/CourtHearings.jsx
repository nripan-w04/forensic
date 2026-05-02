import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useUI } from '../../common/UIContext';

export default function CourtHearings() {
  const { showToast } = useUI();
  const [search, setSearch] = useState('');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [newHearingDate, setNewHearingDate] = useState('');
  const [judgment, setJudgment] = useState('');

  const fetchCases = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/cases');
      // Court strictly shows cases already filed by the Police
      setCases(res.data.filter(c => c.status === 'FILED_IN_COURT'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);


  const handleVerdictChange = async (id, judgment) => {
    try {
      await axios.put(`http://localhost:4000/api/cases/${id}/verdict`, { judgment });
      setCases(cases.filter(c => c._id !== id));
      showToast(`Verdict recorded: Case status updated to CLOSED`, 'success');
      setSelectedCase(null);
    } catch (err) {
      console.error(err);
      showToast('Error recording verdict', 'error');
    }
  };

  const handleAddHearing = async (id) => {
    if (!newHearingDate) return;
    try {
      const res = await axios.put(`http://localhost:4000/api/cases/${id}/hearing`, { date: newHearingDate });
      setCases(cases.map(c => c._id === id ? res.data.case : c));
      showToast('Hearing date scheduled', 'success');
      setNewHearingDate('');
    } catch (err) {
      console.error(err);
      showToast('Failed to schedule hearing', 'error');
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
          <p className="page-eyebrow">{'//'} LEGAL AFFAIRS</p>
          <h1 className="page-title">
            Active <span>Hearings</span>
          </h1>
        </div>
        <div style={{ position: 'relative', width: 320 }}>
          <Search size={20} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#ffffff', opacity: 0.6 }} />
          <input type="text" placeholder="Search court docket..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', height: 48, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '0 16px 0 48px', color: '#fff', fontFamily: "'Share Tech Mono', monospace", fontSize: 16, outline: 'none' }} />
        </div>
      </div>

      <div className="data-card table-wrap" style={{ position: 'relative', overflow: selectedCase ? 'hidden' : 'visible' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Docket / Case ID</th>
              <th>Incident Details</th>
              <th>Legal Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#71717a', fontSize: 12 }}>RETRIEVING COURT RECORDS...</td></tr>}
              {!loading && filtered.map((c, i) => (
                <motion.tr key={c._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <td>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 16, color: '#f4f4f5', fontWeight: 700 }}>{c.caseId}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#3b82f6', marginTop: 4, fontWeight: 600 }}>Date: {c.date}</div>
                  </td>
                  <td>
                    <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 4, fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#ffffff', marginBottom: 6, textTransform: 'uppercase', fontWeight: 700 }}>{c.category}</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, color: '#d4d4d8', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{c.title}</div>
                  </td>
                  <td>
                    <div style={{
                      padding: '8px 16px', borderRadius: 4, fontFamily: "'Share Tech Mono', monospace", fontSize: 13, textTransform: 'uppercase', textAlign: 'center', fontWeight: 800,
                      background: 'rgba(52,211,153,0.15)',
                      color: '#34d399',
                      border: '1px solid #34d39960',
                      letterSpacing: '0.05em'
                    }}>
                      {c.status}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {c.status === 'FILED_IN_COURT' && (
                        <button 
                           onClick={() => setSelectedCase(c)}
                           style={{ padding: '8px 16px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b98160', color: '#34d399', borderRadius: 4, fontSize: 13, fontFamily: "'Share Tech Mono', monospace", cursor: 'pointer', fontWeight: 800 }}
                        >
                           OPEN DOCKET
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {!loading && filtered.length === 0 && (
               <tr>
                 <td colSpan="4" style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#52525b', fontSize: 11, letterSpacing: '0.1em' }}>NO UPCOMING HEARINGS MATCH QUERY</td>
               </tr>
            )}
          </tbody>
        </table>

        <AnimatePresence>
          {selectedCase && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(4,4,10,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ width: '100%', maxWidth: 600, background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16, marginBottom: 24 }}>
                  <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: '#f4f4f5' }}>DOCKET: {selectedCase.caseId}</h2>
                  <button onClick={() => setSelectedCase(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}>CLOSE</button>
                </div>

                <div style={{ display: 'grid', gap: 24 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: '#ffffff', opacity: 0.6, marginBottom: 8, fontFamily: "'Share Tech Mono', monospace" }}>HEARING HISTORY</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                        {selectedCase.hearingDates?.map((d, idx) => (
                          <div key={idx} style={{ padding: '6px 12px', background: 'rgba(251,191,36,0.1)', border: '1px solid #fbbf2440', color: '#fbbf24', fontSize: 13, borderRadius: 2, fontWeight: 600 }}>
                            {new Date(d).toLocaleDateString()}
                          </div>
                        ))}
                        {(!selectedCase.hearingDates || selectedCase.hearingDates.length === 0) && <div style={{ color: '#52525b', fontSize: 14 }}>No hearings scheduled.</div>}
                      </div>
                     <div style={{ display: 'flex', gap: 8 }}>
                       <input type="date" value={newHearingDate} onChange={e => setNewHearingDate(e.target.value)} style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px', borderRadius: 3, flex: 1 }} />
                       <button onClick={() => handleAddHearing(selectedCase._id)} style={{ padding: '8px 16px', background: '#fbbf24', border: 'none', color: '#000', borderRadius: 3, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>ADD HEARING</button>
                     </div>
                   </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: '#ffffff', opacity: 0.6, marginBottom: 8, fontFamily: "'Share Tech Mono', monospace" }}>RECORD FINAL JUDGMENT</label>
                      <textarea 
                         value={judgment} 
                         onChange={e => setJudgment(e.target.value)}
                         placeholder="Enter the final verdict and legal decision..."
                         style={{ width: '100%', background: '#111116', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px', borderRadius: 3, minHeight: 120, outline: 'none', fontSize: 15, lineHeight: 1.6 }}
                      />
                      <button 
                         onClick={() => handleVerdictChange(selectedCase._id, judgment)}
                         style={{ marginTop: 16, width: '100%', padding: '16px', background: '#dc2626', border: 'none', color: '#fff', borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.05em' }}
                      >
                         AUTHORIZE CASE CLOSURE & VERDICT
                      </button>
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
