import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Gavel, Microscope, Package, CheckCircle2,
  ArrowLeft, Eye, EyeOff
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUI } from './UIContext';
import { useAuth } from './AuthContext';

const ROLES = [
  { title: 'Police Officer',     short: 'POLICE',    icon: Shield,     code: 'POL' },
  { title: 'Lab Analyst',        short: 'ANALYST',   icon: Microscope, code: 'LAB' },
  { title: 'Evidence Collector', short: 'EVIDENCE',  icon: Package,    code: 'EVI' },
  { title: 'Court Official',     short: 'COURT',     icon: Gavel,      code: 'CRT' },
];

export default function Register() {
  const { showToast } = useUI();
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', email: '', password: '', role: 'Police Officer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    if (formData.name.trim().length < 3) return 'Name must be at least 3 characters.';
    if (!/^[0-9]{10}$/.test(formData.phone)) return 'Phone number must be exactly 10 digits.';
    if (formData.password.length < 8) return 'Password must be at least 8 characters long.';
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
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/api/register', formData);
      showToast(res.data.message, 'success');
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.error ? `${data.message} | ${data.error}` : (data?.message || 'Registration Error');
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (v) => setFormData(f => ({ ...f, [key]: v }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;500;600;700;900&family=Barlow:wght@300;400;500&display=swap');

        .reg-root {
          min-height: 100vh;
          background: #04040a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Barlow', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 80px 16px 40px;
        }

        /* Scanline overlay */
        .reg-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.012) 2px,
            rgba(255,255,255,0.012) 4px
          );
          pointer-events: none;
          z-index: 0;
        }

        /* Corner bracket decorations */
        .bracket-corner {
          position: absolute;
          width: 18px;
          height: 18px;
        }
        .bracket-corner.tl { top: -1px; left: -1px; border-top: 2px solid #dc2626; border-left: 2px solid #dc2626; }
        .bracket-corner.tr { top: -1px; right: -1px; border-top: 2px solid #dc2626; border-right: 2px solid #dc2626; }
        .bracket-corner.bl { bottom: -1px; left: -1px; border-bottom: 2px solid #dc2626; border-left: 2px solid #dc2626; }
        .bracket-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid #dc2626; border-right: 2px solid #dc2626; }

        .reg-card {
          width: 100%;
          max-width: 520px;
          background: #0a0a10;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px;
          padding: 40px;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 640px) {
          .reg-root { padding: 40px 16px; }
          .reg-card { padding: 24px; }
          .form-grid { grid-template-columns: 1fr !important; }
          .form-grid .span-2 { grid-column: span 1 !important; }
          .role-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .reg-title { font-size: clamp(28px, 8vw, 36px) !important; }
          .reg-sub { font-size: 13px !important; }
        }

        /* Top bar */
        .reg-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .reg-back {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ffffff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }
        .reg-back:hover { color: #e4e4e7; }
        .reg-back svg { transition: transform 0.2s; }
        .reg-back:hover svg { transform: translateX(-3px); }

        .reg-id {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #dc2626;
          letter-spacing: 0.15em;
          opacity: 0.8;
        }

        /* Header */
        .reg-header {
          margin-bottom: 28px;
          position: relative;
        }
        .reg-header::after {
          content: '';
          display: block;
          width: 40px;
          height: 2px;
          background: #dc2626;
          margin-top: 14px;
        }
        .reg-eyebrow {
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          color: #dc2626;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: 6px;
          opacity: 0.8;
        }
        .reg-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 36px;
          font-weight: 900;
          color: #f4f4f5;
          letter-spacing: -0.01em;
          line-height: 1;
          text-transform: uppercase;
          margin: 0;
        }
        .reg-title span { color: #dc2626; }
        .reg-sub {
          font-size: 14px;
          color: #ffffff;
          margin-top: 10px;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        /* Role selector */
        .role-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .role-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 28px;
        }
        .role-btn {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          aspect-ratio: 1;
          border-radius: 3px;
          border: 1px solid rgba(255,255,255,0.06);
          background: #0f0f18;
          cursor: pointer;
          transition: all 0.2s;
          gap: 6px;
          overflow: hidden;
        }
        .role-btn::before {
          content: attr(data-code);
          position: absolute;
          top: 5px;
          left: 6px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.05em;
        }
        .role-btn:hover {
          border-color: rgba(255,255,255,0.15);
          background: #141420;
        }
        .role-btn.active {
          border-color: #dc2626;
          background: rgba(220,38,38,0.08);
        }
        .role-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #dc2626;
        }
        .role-icon { color: #3f3f46; transition: color 0.2s; }
        .role-btn.active .role-icon { color: #ef4444; }
        .role-btn:hover .role-icon { color: #71717a; }
        .role-name {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #ffffff;
          text-transform: uppercase;
          transition: color 0.2s;
          text-align: center;
          padding: 0 4px;
        }
        .role-btn.active .role-name { color: #fca5a5; }
        .role-check {
          position: absolute;
          top: 5px;
          right: 5px;
          color: #dc2626;
        }

        /* Form layout: 2 col grid */
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        .form-grid .span-2 { grid-column: span 2; }

        /* Input fields */
        .field-wrap { display: flex; flex-direction: column; gap: 5px; }
        .field-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .field-wrap.focused .field-label { color: #dc2626; }

        .field-inner {
          position: relative;
        }
        .field-input {
          width: 100%;
          height: 42px;
          background: #0f0f18;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 3px;
          padding: 0 12px;
          font-family: 'Barlow', sans-serif;
          font-size: 14px;
          color: #e4e4e7;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: #ffffff; opacity: 0.3; font-size: 14px; }
        .field-input:focus {
          border-color: rgba(220,38,38,0.5);
          background: #12121c;
          box-shadow: 0 0 0 3px rgba(220,38,38,0.06);
        }
        .field-input.has-right { padding-right: 40px; }
        .field-right {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #ffffff;
          transition: color 0.2s;
          display: flex;
          padding: 0;
        }
        .field-right:hover { color: #e4e4e7; }

        /* Bottom line decoration on focused */
        .field-bar {
          height: 1px;
          background: rgba(220,38,38,0.0);
          transition: background 0.3s;
          margin-top: -1px;
        }
        .field-wrap.focused .field-bar { background: rgba(220,38,38,0.4); }

        /* Submit */
        .reg-submit {
          width: 100%;
          height: 48px;
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 3px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.2s;
          margin-top: 8px;
        }
        .reg-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
          transform: translateX(-100%);
          transition: transform 0.4s;
        }
        .reg-submit:hover::before { transform: translateX(100%); }
        .reg-submit:hover { background: #b91c1c; box-shadow: 0 0 20px rgba(220,38,38,0.3); }
        .reg-submit:active { transform: scale(0.99); }
        .reg-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Footer */
        .reg-footer {
          text-align: center;
          margin-top: 18px;
          font-size: 14px;
          color: #ffffff;
        }
        .reg-footer a {
          color: #ef4444;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.05em;
          margin-left: 4px;
        }
        .reg-footer a:hover { text-decoration: underline; }

        /* Status strip */
        .status-strip {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 28px;
          padding: 8px 12px;
          background: rgba(220,38,38,0.04);
          border: 1px solid rgba(220,38,38,0.12);
          border-radius: 2px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e;
          flex-shrink: 0;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .status-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #ffffff;
          letter-spacing: 0.1em;
        }
        .status-text span { color: #22c55e; }

        /* Noise texture overlay on card */
        .reg-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          border-radius: 4px;
          opacity: 0.5;
        }

        /* Glow bg */
        .reg-glow {
          position: fixed;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      <div className="reg-root">
        <div className="reg-glow" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: 520, padding: '0 16px', position: 'relative', zIndex: 1 }}
        >
          <div className="reg-card">
            <div className="bracket-corner tl" />
            <div className="bracket-corner tr" />
            <div className="bracket-corner bl" />
            <div className="bracket-corner br" />

            {/* Top bar */}
            <div className="reg-topbar">
              <button onClick={() => navigate('/')} className="reg-back">
                <ArrowLeft size={12} />
                <span>RETURN HUB</span>
              </button>
              <span className="reg-id">REG-{Date.now().toString(36).toUpperCase().slice(-6)}</span>
            </div>

            {/* Status strip */}
            <div className="status-strip">
              <div className="status-dot" />
              <span className="status-text">SYSTEM <span>ONLINE</span> — SECURE ENROLLMENT CHANNEL ACTIVE</span>
            </div>

            {/* Header */}
            <div className="reg-header">
              <p className="reg-eyebrow">// PERSONNEL ENROLLMENT</p>
              <h1 className="reg-title">Initialize<br /><span>Account</span></h1>
              <p className="reg-sub">Submit credentials for department portal access.</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: 20, overflow: 'hidden' }}>
                  <div style={{ padding: 12, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 4, color: '#fca5a5', fontFamily: "'Barlow', sans-serif", fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flexShrink: 0, width: 6, height: 6, background: '#ef4444', borderRadius: '50%' }} /> {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              {/* Role selector */}
              <p className="role-label">// Assign department role</p>
              <div className="role-grid">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const active = formData.role === r.title;
                  return (
                    <button
                      key={r.title}
                      type="button"
                      data-code={r.code}
                      className={`role-btn ${active ? 'active' : ''}`}
                      onClick={() => setFormData(f => ({ ...f, role: r.title }))}
                    >
                      <div className="role-icon"><Icon size={20} /></div>
                      <span className="role-name">{r.short}</span>
                      {active && (
                        <motion.div
                          className="role-check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                          <CheckCircle2 size={10} fill="currentColor" stroke="#0a0a10" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Fields */}
              <div className="form-grid">
                <Field
                  label="PERSONNEL NAME"
                  placeholder="Full legal name"
                  value={formData.name}
                  onChange={set('name')}
                  focused={focused === 'name'}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                />
                <Field
                  label="CONTACT NUMBER"
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={set('phone')}
                  focused={focused === 'phone'}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused(null)}
                />
                <div className="span-2">
                  <Field
                    label="OFFICIAL EMAIL"
                    placeholder="officer@forensic.gov"
                    type="email"
                    value={formData.email}
                    onChange={set('email')}
                    focused={focused === 'email'}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
                <div className="span-2">
                  <Field
                    label="ACCESS KEY"
                    placeholder="Min. 8 characters"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={set('password')}
                    focused={focused === 'password'}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    right={
                      <button type="button" className="field-right" onClick={() => setShowPassword(p => !p)}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />
                </div>
                <div className="span-2">
                  <Field
                    label="RESIDENTIAL ADDRESS"
                    placeholder="Full registered address"
                    value={formData.address}
                    onChange={set('address')}
                    focused={focused === 'address'}
                    onFocus={() => setFocused('address')}
                    onBlur={() => setFocused(null)}
                  />
                </div>
              </div>

              <button type="submit" className="reg-submit" disabled={loading}>
                {loading ? 'INITIALIZING...' : 'AUTHORIZE ENROLLMENT'}
              </button>

              <p className="reg-footer">
                Already in database?
                <Link to="/login">Officer Login →</Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}

function Field({ label, placeholder, value, onChange, type = 'text', right, focused, onFocus, onBlur }) {
  return (
    <div className={`field-wrap ${focused ? 'focused' : ''}`}>
      <label className="field-label">{label}</label>
      <div className="field-inner">
        <input
          type={type}
          required
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`field-input ${right ? 'has-right' : ''}`}
        />
        {right}
      </div>
      <div className="field-bar" />
    </div>
  );
}

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   Shield, Gavel, Microscope, Package, CheckCircle2, 
//   ArrowLeft, Eye, EyeOff 
// } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import Navbar from './Navbar';
// import axios from 'axios';

// const Register = () => {
//   const [formData, setFormData] = useState({ 
//     name: '', phone: '', address: '', email: '', password: '', role: 'Police Officer' 
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const roles = [
//     { title: 'Police Officer', icon: <Shield size={24} /> },
//     { title: 'Lab Analyst', icon: <Microscope size={24} /> },
//     { title: 'Evidence Collector', icon: <Package size={24} /> },
//     { title: 'Court Official', icon: <Gavel size={24} /> },
//   ];

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await axios.post('http://localhost:4000/api/register', formData);
//       alert(res.data.message);
//       navigate('/login');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Registration Error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-screen bg-[#07070a] flex flex-col items-center justify-center relative overflow-hidden">
//       <Navbar />
      
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="w-full max-w-[500px] px-6 relative z-10"
//       >
//         <div className="bg-[#111116] border border-white/5 rounded-[32px] p-10 shadow-3xl">
          
//           <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-xs mb-8 group no-underline">
//             <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
//             <span>Return Hub</span>
//           </button>

//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-white mb-2">Initialize Account</h1>
//             <p className="text-zinc-500 text-sm">Submit credentials for portal access.</p>
//           </div>

//           <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
//             <div className="space-y-3">
//               <p className="text-[10px] text-zinc-500 uppercase tracking-widest text-center">Select Department Role:</p>
//               <div className="grid grid-cols-4 gap-3">
//                 {roles.map((r) => {
//                   const isActive = formData.role === r.title;
//                   return (
//                     <button
//                       key={r.title}
//                       type="button"
//                       onClick={() => setFormData({ ...formData, role: r.title })}
//                       className={`relative flex flex-col items-center justify-center aspect-square rounded-2xl border transition-all ${
//                         isActive 
//                         ? 'border-red-600 bg-red-600/10 ring-1 ring-red-600' 
//                         : 'border-white/5 bg-[#1a1a20] hover:border-white/20'
//                       }`}
//                     >
//                       <div className={`${isActive ? 'text-red-500' : 'text-zinc-500'}`}>
//                         {r.icon}
//                       </div>
//                       <span className={`text-[8px] font-bold uppercase mt-2 ${isActive ? 'text-white' : 'text-zinc-500'}`}>
//                         {r.title.split(' ')[0]}
//                       </span>
//                       {isActive && (
//                         <div className="absolute top-1 right-1 text-red-500">
//                           <CheckCircle2 size={12} fill="currentColor" stroke="#111116" />
//                         </div>
//                       )}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             <InputField 
//               label="Personnel Name" 
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={(v) => setFormData({...formData, name: v})}
//             />

//             <InputField 
//               label="Contact Number" 
//               placeholder="10 digit number"
//               value={formData.phone}
//               onChange={(v) => setFormData({...formData, phone: v})}
//             />

//             <InputField 
//               label="Official Email" 
//               placeholder="officer@forensic.gov"
//               type="email"
//               value={formData.email}
//               onChange={(v) => setFormData({...formData, email: v})}
//             />

//             <InputField 
//               label="Secure Password" 
//               placeholder="••••••••"
//               type={showPassword ? "text" : "password"}
//               value={formData.password}
//               onChange={(v) => setFormData({...formData, password: v})}
//               rightSlot={
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-zinc-600 hover:text-white transition-colors">
//                   {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
//                 </button>
//               }
//             />

//             <InputField 
//               label="Residential Address" 
//               placeholder="Enter full address"
//               value={formData.address}
//               onChange={(v) => setFormData({...formData, address: v})}
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full h-14 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl font-bold text-sm tracking-tight hover:shadow-[0_0_25px_rgba(220,38,38,0.3)] transition-all active:scale-95 disabled:opacity-50 mt-2"
//             >
//               {loading ? 'Initializing...' : 'Authorize Access'}
//             </button>

//             <div className="text-center">
//               <span className="text-xs text-zinc-500">Already in database? </span>
//               <Link to="/login" className="text-xs text-red-500 font-bold hover:underline no-underline ml-1">Officer Login</Link>
//             </div>
//           </form>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// const InputField = ({ label, placeholder, value, onChange, type = "text", rightSlot }) => (
//   <div className="flex flex-col gap-1.5 px-1">
//     <label className="text-[11px] font-medium text-zinc-400 ml-1">{label}</label>
//     <div className="relative">
//       <input
//         type={type}
//         required
//         placeholder={placeholder}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full h-11 bg-[#1a1a20] border border-white/5 rounded-xl px-4 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-red-600/50 transition-all font-sans"
//       />
//       {rightSlot && (
//         <div className="absolute right-4 top-1/2 -translate-y-1/2">
//           {rightSlot}
//         </div>
//       )}
//     </div>
//   </div>
// );

// export default Register;