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
      // Fetch case to validate date
      const caseRes = await axios.get(`http://localhost:4000/api/cases`);
      const targetCase = caseRes.data.find(c => c.caseId === formData.caseId);
      
      if (!targetCase) {
        showToast('Invalid Case ID: Reference case not found.', 'error');
        return;
      }

      const collectionDate = new Date(formData.collectedDate);
      const caseDate = new Date(targetCase.date);
      const today = new Date();
      today.setHours(0,0,0,0);

      if (collectionDate > today) {
        showToast('Collection Date cannot be in the future.', 'warning');
        return;
      }
      if (collectionDate.getFullYear() > 9999) {
        showToast('Invalid Year detected.', 'warning');
        return;
      }
      if (collectionDate < caseDate) {
        showToast(`Collection Date cannot be earlier than Case Registration Date (${targetCase.date}).`, 'warning');
        return;
      }

      const payload = {
        ...formData
      };
 
      await axios.post('http://localhost:4000/api/evidence', payload);
      showToast('Evidence securely logged to Chain of Custody!', 'success');
      setFormData({ 
        caseId: '', type: 'Weapon', description: '', collectedBy: '', collectedDate: '',
        barcode: '', qrCode: ''
      });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Failed to connect to database system.';
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

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 40 }}>
          {/* Section 1: Reference Data */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 4, height: 20, background: '#3b82f6' }}></div>
              <h3 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#f4f4f5', letterSpacing: '0.1em' }}>I. REFERENCE DATA</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
              <div>
                 <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 10 }}>ASSOCIATED CASE ID</label>
                 <input type="text" name="caseId" value={formData.caseId} onChange={handleChange} placeholder="e.g. C-8821" required style={{ width: '100%', background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px 16px', borderRadius: 4, outline: 'none', fontFamily: "'Share Tech Mono', monospace", fontSize: 13 }} />
              </div>
              <div>
                 <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 10 }}>SECURITY BARCODE</label>
                 <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} placeholder="e.g. BAR-100293" style={{ width: '100%', background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px 16px', borderRadius: 4, outline: 'none', fontFamily: "'Share Tech Mono', monospace", fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 10 }}>EVIDENCE CATEGORY</label>
                <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px 16px', borderRadius: 4, outline: 'none', fontSize: 13, height: 48 }}>
                  <option>Weapon</option>
                  <option>Biological</option>
                  <option>Digital/Cyber</option>
                  <option>Document</option>
                  <option>Narcotics</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Collection Metadata */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 4, height: 20, background: '#3b82f6' }}></div>
              <h3 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#f4f4f5', letterSpacing: '0.1em' }}>II. COLLECTION METADATA</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                 <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 10 }}>COLLECTING OFFICER</label>
                 <input type="text" name="collectedBy" value={formData.collectedBy} onChange={handleChange} required placeholder="Officer Name / ID" style={{ width: '100%', background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px 16px', borderRadius: 4, outline: 'none', fontSize: 13 }} />
              </div>
              <div>
                 <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 10 }}>COLLECTION DATE</label>
                 <input type="date" name="collectedDate" value={formData.collectedDate} onChange={handleChange} required style={{ width: '100%', background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', color: '#a1a1aa', padding: '14px 16px', borderRadius: 4, outline: 'none', fontSize: 13, height: 48 }} />
              </div>
            </div>
          </div>

          {/* Section 3: Content Specification */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 4, height: 20, background: '#3b82f6' }}></div>
              <h3 style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 14, color: '#f4f4f5', letterSpacing: '0.1em' }}>III. CONTENT SPECIFICATION</h3>
            </div>
            <div style={{ display: 'grid', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 10 }}>ITEM DESCRIPTION & CONDITION</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Detail the visual traits, condition, and packaging method..." style={{ width: '100%', background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '16px', borderRadius: 4, outline: 'none', minHeight: 120, resize: 'vertical', fontSize: 14, lineHeight: 1.6 }} />
              </div>


            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
             <button type="submit" style={{ padding: '16px 48px', background: '#dc2626', border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, fontFamily: "'Share Tech Mono', monospace", fontSize: 14, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(220,38,38,0.2)' }}>
                <Check size={18} /> SEAL & REGISTER ITEM
             </button>
          </div>
        </form>
      </div>
    </>
  );
}
