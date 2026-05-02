import React, { useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useUI } from '../../common/UIContext';

export default function RegisterCase() {
  const { showToast } = useUI();
  const [formData, setFormData] = useState({
    title: '', date: '', location: '', category: 'Theft/Robbery', description: '',
    firNumber: '', suspects: '', investigatingOfficer: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    if (formData.title.trim().length < 5) return 'Incident Title must be at least 5 characters.';
    if (!formData.date) return 'Incident Date is required.';
    if (formData.location.trim().length < 5) return 'Location must be specific (min 5 characters).';
    if (formData.description.trim().length < 20) return 'Detailed incident report must be at least 20 characters.';
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
      await axios.post('http://localhost:4000/api/cases', {
        ...formData,
        suspects: formData.suspects.split(',').map(s => s.trim()).filter(s => s !== '')
      });
      showToast('Case successfully saved to Forensic System!', 'success');
      setFormData({ 
        title: '', date: '', location: '', category: 'Theft/Robbery', description: '',
        firNumber: '', suspects: '', investigatingOfficer: ''
      });
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
          <p className="page-eyebrow" style={{ fontSize: 16, fontWeight: 700 }}>// RECORDS DEPARTMENT</p>
          <h1 className="page-title" style={{ fontSize: 52 }}>
            Register <span>Case</span>
          </h1>
        </div>
      </div>

      <div className="data-card" style={{ padding: 32, maxWidth: 800 }}>
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: 24, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)', borderRadius: 4, color: '#ffffff', fontFamily: "'Barlow', sans-serif", fontSize: 16, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600 }}>
                <AlertTriangle size={20} color="#dc2626" /> {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
          <div className="responsive-grid-2">
            <div>
              <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#ffffff', opacity: 0.6, marginBottom: 10, fontWeight: 700 }}>INCIDENT TITLE</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Armed Robbery" required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '16px 20px', borderRadius: 6, outline: 'none', fontFamily: "'Barlow', sans-serif", fontSize: 17, fontWeight: 500 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#ffffff', opacity: 0.6, marginBottom: 10, fontWeight: 700 }}>FIR NUMBER</label>
              <input type="text" name="firNumber" value={formData.firNumber} onChange={handleChange} placeholder="e.g. FIR-2024-001" required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '16px 20px', borderRadius: 6, outline: 'none', fontFamily: "'Barlow', sans-serif", fontSize: 17, fontWeight: 500 }} />
            </div>
          </div>

          <div className="responsive-grid-2">
             <div>
                <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#ffffff', opacity: 0.6, marginBottom: 10, fontWeight: 700 }}>CRIME CATEGORY</label>
                <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '16px 20px', borderRadius: 6, outline: 'none', fontSize: 17, fontWeight: 500 }}>
                  <option>Theft/Robbery</option>
                  <option>Homicide</option>
                  <option>Cybercrime</option>
                  <option>Assault</option>
                  <option>Fraud</option>
                  <option>Other</option>
                </select>
             </div>
             <div>
                <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#ffffff', opacity: 0.6, marginBottom: 10, fontWeight: 700 }}>DATE OF INCIDENT</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '16px 20px', borderRadius: 6, outline: 'none', fontSize: 17, fontWeight: 500 }} />
             </div>
          </div>

          <div className="responsive-grid-2">
            <div>
              <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#ffffff', opacity: 0.6, marginBottom: 10, fontWeight: 700 }}>INCIDENT LOCATION</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Physical address..." required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '16px 20px', borderRadius: 6, outline: 'none', fontSize: 17, fontWeight: 500 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#ffffff', opacity: 0.6, marginBottom: 10, fontWeight: 700 }}>INVESTIGATING OFFICER</label>
              <input type="text" name="investigatingOfficer" value={formData.investigatingOfficer} onChange={handleChange} placeholder="Officer Name/Rank" required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '16px 20px', borderRadius: 6, outline: 'none', fontSize: 17, fontWeight: 500 }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#ffffff', opacity: 0.6, marginBottom: 10, fontWeight: 700 }}>SUSPECTS (Comma separated)</label>
            <input type="text" name="suspects" value={formData.suspects} onChange={handleChange} placeholder="e.g. John Doe, Jane Smith" style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '16px 20px', borderRadius: 6, outline: 'none', fontSize: 17, fontWeight: 500 }} />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#ffffff', opacity: 0.6, marginBottom: 10, fontWeight: 700 }}>INITIAL INCIDENT REPORT</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Detailed description of the crime scene and preliminary findings..." style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '16px 20px', borderRadius: 6, outline: 'none', minHeight: 160, resize: 'vertical', fontSize: 17, lineHeight: 1.7, fontWeight: 500 }} />
          </div>

          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
             <button type="submit" style={{ padding: '18px 48px', background: '#dc2626', border: 'none', color: '#fff', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, fontFamily: "'Share Tech Mono', monospace", fontSize: 16, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em', boxShadow: '0 0 20px rgba(220,38,38,0.2)' }}>
                <Check size={20} /> File Official Report
             </button>
          </div>
        </form>
      </div>
    </>
  );
}
