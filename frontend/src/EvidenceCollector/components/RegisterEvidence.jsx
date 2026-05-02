import React, { useState } from 'react';
import { Check, Package, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useUI } from '../../common/UIContext';

export default function RegisterEvidence() {
  const { showToast } = useUI();
  const [formData, setFormData] = useState({
    caseId: '', type: 'Weapon', description: '', collectedBy: '', collectedDate: '',
    barcode: '', qrCode: ''
  });
  const [error, setError] = useState('');
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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    if (formData.caseId.trim().length < 5) return 'Case ID must be accurate (e.g., C-1234).';
    if (formData.description.trim().length < 15) return 'Description must outline visual evidence condition.';
    if (!formData.collectedBy || !formData.collectedDate) return 'Collector name and Date are mandatory.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      showToast(validationError, 'warning');
      return;
    }
    setError('');
    
    try {
      await axios.post('http://localhost:4000/api/evidence', { ...formData, aiAnalysis: aiResult });
      showToast('Evidence securely logged to Chain of Custody!', 'success');
      setFormData({ 
        caseId: '', type: 'Weapon', description: '', collectedBy: '', collectedDate: '',
        barcode: '', qrCode: ''
      });
      setAiResult(null);
    } catch (err) {
      console.error(err);
      const msg = 'Failed to connect to database system.';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">// LOGISTICS DEPARTMENT</p>
          <h1 className="page-title">
            Log <span>Evidence</span>
          </h1>
        </div>
      </div>

      <div className="data-card" style={{ padding: 32, maxWidth: 800 }}>
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: 24, overflow: 'hidden' }}>
              <div style={{ padding: 12, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 4, color: '#fca5a5', fontFamily: "'Barlow', sans-serif", fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={16} /> {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
          <div className="responsive-grid-2">
            <div>
               <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 8 }}>ASSOCIATED CASE ID</label>
               <input type="text" name="caseId" value={formData.caseId} onChange={handleChange} placeholder="e.g. C-8821" required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 16px', borderRadius: 4, outline: 'none', fontFamily: "'Share Tech Mono', monospace" }} />
            </div>
            <div>
               <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 8 }}>BARCODE REFERENCE</label>
               <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} placeholder="e.g. BAR-100293" style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 16px', borderRadius: 4, outline: 'none', fontFamily: "'Share Tech Mono', monospace" }} />
            </div>
          </div>
          <div className="responsive-grid-3">
             <div>
                <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 8 }}>EVIDENCE TYPE</label>
                <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 16px', borderRadius: 4, outline: 'none' }}>
                  <option>Weapon</option>
                  <option>Biological</option>
                  <option>Digital/Cyber</option>
                  <option>Document</option>
                  <option>Narcotics</option>
                  <option>Other</option>
                </select>
             </div>
             <div>
                <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 8 }}>COLLECTED BY</label>
                <input type="text" name="collectedBy" value={formData.collectedBy} onChange={handleChange} required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 16px', borderRadius: 4, outline: 'none' }} />
             </div>
             <div>
                <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 8 }}>COLLECTION DATE</label>
                <input type="date" name="collectedDate" value={formData.collectedDate} onChange={handleChange} required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#a1a1aa', padding: '12px 16px', borderRadius: 4, outline: 'none' }} />
             </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 8 }}>ITEM DESCRIPTION & CONDITION</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Detail the visual traits, condition, and packaging method..." style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 16px', borderRadius: 4, outline: 'none', minHeight: 120, resize: 'vertical' }} />
          </div>

          <div style={{ padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                   <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#ffffff', opacity: 0.5, marginBottom: 4 }}>// PRELIMINARY AI SCAN</div>
                   <div style={{ fontSize: 13, color: '#ffffff' }}>Identify weapons/anomalies before lab dispatch</div>
                </div>
                <button 
                  type="button" 
                  onClick={simulateAIScan}
                  disabled={aiScanning}
                  style={{ padding: '8px 16px', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 4, color: '#d8b4fe', cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: 10 }}
                >
                  {aiScanning ? 'SCANNING...' : 'INITIATE AI SCAN'}
                </button>
             </div>
             
             {aiResult && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 12, background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 4, color: '#d8b4fe', fontSize: 12, fontFamily: "'Share Tech Mono', monospace" }}>
                 [RESULT]: {aiResult}
               </motion.div>
             )}
          </div>

          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
             <button type="submit" style={{ padding: '12px 32px', background: '#dc2626', border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Share Tech Mono', monospace", fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>
                <Check size={16} /> Seal & Register Item
             </button>
          </div>
        </form>
      </div>
    </>
  );
}
