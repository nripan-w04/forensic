import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Gavel, Microscope, Package,
  ArrowLeft, Eye, EyeOff, Fingerprint
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUI } from './UIContext';
import { useAuth } from './AuthContext';

const ROLES = [
  { title: 'Police Officer',     short: 'POLICE',    icon: Shield,      code: 'POL' },
  { title: 'Lab Analyst',        short: 'ANALYST',   icon: Microscope,  code: 'LAB' },
  { title: 'Evidence Collector', short: 'EVIDENCE',  icon: Package,     code: 'EVI' },
  { title: 'Court Official',     short: 'COURT',     icon: Gavel,       code: 'CRT' },
  { title: 'Admin',              short: 'ADMIN',     icon: Fingerprint, code: 'ADM' },
];

export default function Login() {
  const { showToast } = useUI();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', role: 'Police Officer' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/api/login', formData);
      login(res.data.user);
      showToast(res.data.message, 'success');
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.error ? `${data.message} | ${data.error}` : (data?.message || 'Access Denied');
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;500;600;700;900&family=Barlow:wght@300;400;500&display=swap');

        .login-root {
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
        .login-root::before {
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

        /* Background grid */
        .login-grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(220,38,38,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,38,38,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        /* Radial vignette */
        .login-vignette {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, #04040a 100%);
          pointer-events: none;
          z-index: 0;
        }

        /* Red glow */
        .login-glow {
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 65%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
        }

        /* Bracket corners */
        .bracket-corner {
          position: absolute;
          width: 20px;
          height: 20px;
        }
        .bracket-corner.tl { top: -1px; left: -1px; border-top: 2px solid #dc2626; border-left: 2px solid #dc2626; }
        .bracket-corner.tr { top: -1px; right: -1px; border-top: 2px solid #dc2626; border-right: 2px solid #dc2626; }
        .bracket-corner.bl { bottom: -1px; left: -1px; border-bottom: 2px solid #dc2626; border-left: 2px solid #dc2626; }
        .bracket-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid #dc2626; border-right: 2px solid #dc2626; }

        .login-card {
          width: 100%;
          max-width: 460px;
          background: #0a0a10;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px;
          padding: 40px;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 640px) {
          .login-root { padding: 40px 16px; }
          .login-card { padding: 24px; }
          .login-title { font-size: clamp(28px, 8vw, 36px) !important; }
          .role-pills { gap: 6px !important; justify-content: center; }
          .role-pill { padding: 8px 12px !important; font-size: 10px !important; flex: 1 1 calc(50% - 6px); justify-content: center; }
        }

        /* Top row */
        .login-toprow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .login-back {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #ffffff;
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.1em;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }
        .login-back:hover { color: #e4e4e7; }
        .login-back:hover svg { transform: translateX(-3px); }
        .login-back svg { transition: transform 0.2s; }

        .login-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: 2px;
          background: rgba(220,38,38,0.04);
        }
        .login-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #dc2626;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px #dc2626; }
          50% { opacity: 0.4; box-shadow: none; }
        }
        .login-badge-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #dc2626;
          letter-spacing: 0.15em;
          opacity: 0.8;
        }

        /* Header */
        .login-header { margin-bottom: 32px; }
        .login-eyebrow {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #dc2626;
          letter-spacing: 0.25em;
          opacity: 0.7;
          margin-bottom: 8px;
        }
        .login-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 42px;
          font-weight: 900;
          color: #f4f4f5;
          letter-spacing: -0.01em;
          line-height: 0.95;
          text-transform: uppercase;
          margin: 0 0 12px;
        }
        .login-title span { color: #dc2626; }
        .login-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
        }
        .login-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, #dc2626, transparent);
        }
        .login-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 42px;
          font-weight: 900;
          color: #ffffff;
          margin: 0;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .login-subtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 14px;
          color: #dc2626;
          letter-spacing: 0.25em;
          margin-top: 8px;
          font-weight: 600;
        }

        /* Role pills */
        .role-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.2em;
          margin-bottom: 12px;
        }
        .role-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 28px;
        }
        .role-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 12px;
          border-radius: 3px;
          border: 1px solid rgba(255,255,255,0.06);
          background: #0f0f18;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          color: #3f3f46;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .role-pill:hover {
          border-color: rgba(255,255,255,0.15);
          color: #71717a;
        }
        .role-pill.active {
          border-color: #dc2626;
          background: rgba(220,38,38,0.08);
          color: #fca5a5;
          box-shadow: inset 0 0 12px rgba(220,38,38,0.04);
        }
        .role-pill-icon { transition: color 0.18s; }
        .role-pill.active .role-pill-icon { color: #ef4444; }

        /* Fields */
        .login-fields { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }

        .field-wrap { display: flex; flex-direction: column; gap: 5px; }
        .field-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #ffffff;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .field-label::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #27272a;
          transition: background 0.2s;
        }
        .field-wrap.focused .field-label { color: #dc2626; }
        .field-wrap.focused .field-label::before { background: #dc2626; }

        .field-inner { position: relative; }
        .field-input {
          width: 100%;
          height: 46px;
          background: #0d0d16;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 3px;
          padding: 0 14px;
          font-family: 'Barlow', sans-serif;
          font-size: 13px;
          color: #e4e4e7;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
          letter-spacing: 0.02em;
        }
        .field-input::placeholder { color: #ffffff; opacity: 0.3; font-size: 14px; }
        .field-input:focus {
          border-color: rgba(220,38,38,0.45);
          background: #0f0f1a;
          box-shadow: 0 0 0 3px rgba(220,38,38,0.05), inset 0 1px 3px rgba(0,0,0,0.5);
        }
        .field-input.has-right { padding-right: 44px; }
        .field-right {
          position: absolute;
          right: 14px;
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
        .field-right:hover { color: #a1a1aa; }

        /* Submit */
        .login-submit-wrap { position: relative; }
        .login-submit {
          width: 100%;
          height: 50px;
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 3px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.2s;
        }
        .login-submit::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transition: left 0.4s;
        }
        .login-submit:hover::before { left: 100%; }
        .login-submit:hover {
          background: #b91c1c;
          box-shadow: 0 0 24px rgba(220,38,38,0.35), 0 2px 8px rgba(0,0,0,0.4);
        }
        .login-submit:active { transform: scale(0.99); }
        .login-submit:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Decorative corners on submit */
        .submit-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          pointer-events: none;
        }
        .submit-corner.tl { top: 2px; left: 2px; border-top: 1px solid rgba(255,255,255,0.3); border-left: 1px solid rgba(255,255,255,0.3); }
        .submit-corner.br { bottom: 2px; right: 2px; border-bottom: 1px solid rgba(255,255,255,0.3); border-right: 1px solid rgba(255,255,255,0.3); }

        /* Footer */
        .login-footer {
          text-align: center;
          margin-top: 18px;
          font-size: 13px;
          color: #ffffff;
        }
        .login-footer a {
          color: #ef4444;
          font-weight: 600;
          text-decoration: none;
          margin-left: 4px;
          letter-spacing: 0.03em;
        }
        .login-footer a:hover { text-decoration: underline; }

        /* Classified watermark */
        .login-watermark {
          position: absolute;
          bottom: 16px;
          right: 20px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: rgba(220,38,38,0.15);
          letter-spacing: 0.2em;
          pointer-events: none;
          user-select: none;
          text-transform: uppercase;
        }
      `}</style>

      <div className="login-root">
        <div className="login-grid-bg" />
        <div className="login-vignette" />
        <div className="login-glow" />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: 460, padding: '0 16px', position: 'relative', zIndex: 1 }}
        >
          <div className="login-card">
            <div className="bracket-corner tl" />
            <div className="bracket-corner tr" />
            <div className="bracket-corner bl" />
            <div className="bracket-corner br" />

            {/* Top row */}
            <div className="login-toprow">
              <button onClick={() => navigate('/')} className="login-back">
                <ArrowLeft size={12} />
                <span>RETURN HUB</span>
              </button>
              <div className="login-badge">
                <div className="login-badge-dot" />
                <span className="login-badge-text">SECURE CHANNEL</span>
              </div>
            </div>

            {/* Header */}
            <div className="login-header">
              <p className="login-eyebrow">// IDENTITY VERIFICATION</p>
              <h1 className="login-title">Access<br /><span>Portal</span></h1>
              <div className="login-divider">
                <div className="login-divider-line" />
                <span className="login-divider-text">CLEARANCE REQUIRED</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Role selector */}
              <p className="role-label">// Department sector</p>
              <div className="role-pills">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const active = formData.role === r.title;
                  return (
                    <button
                      key={r.title}
                      type="button"
                      className={`role-pill ${active ? 'active' : ''}`}
                      onClick={() => setFormData(f => ({ ...f, role: r.title }))}
                    >
                      <span className="role-pill-icon"><Icon size={13} /></span>
                      <div style={{ color: '#ffffff' }}>
  {r.short}
</div>
                    </button>
                  );
                })}
              </div>

              {/* Fields */}
              <div className="login-fields">
                <Field
                  label="CLEARANCE EMAIL"
                  placeholder="officer@forensic.gov"
                  type="email"
                  value={formData.email}
                  onChange={(v) => setFormData(f => ({ ...f, email: v }))}
                  focused={focused === 'email'}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                />
                <Field
                  label="ACCESS KEY"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(v) => setFormData(f => ({ ...f, password: v }))}
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

              {/* Submit */}
              <div className="login-submit-wrap">
                <button type="submit" className="login-submit" disabled={loading}>
                  <div className="submit-corner tl" />
                  <div className="submit-corner br" />
                  {loading ? 'DECRYPTING...' : 'VERIFY AUTHORITY'}
                </button>
              </div>

              <p className="login-footer">
                New to unit?
                <Link to="/register">Request Enrollment →</Link>
              </p>
            </form>

            <span className="login-watermark">CLASSIFIED // FOR AUTHORIZED USE ONLY</span>
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
    </div>
  );
}

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   Shield, Gavel, Microscope, Package, CheckCircle2, 
//   ArrowLeft, Eye, EyeOff, Fingerprint 
// } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import Navbar from './Navbar';
// import axios from 'axios';

// const Login = () => {
//   const [formData, setFormData] = useState({ email: '', password: '', role: 'Police Officer' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const roles = [
//     { title: 'Police Officer', icon: <Shield size={20} /> },
//     { title: 'Lab Analyst', icon: <Microscope size={20} /> },
//     { title: 'Evidence Collector', icon: <Package size={20} /> },
//     { title: 'Court Official', icon: <Gavel size={20} /> },
//     { title: 'Admin', icon: <Fingerprint size={20} /> },
//   ];

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await axios.post('http://localhost:4000/api/login', formData);
//       localStorage.setItem('user', JSON.stringify(res.data.user));
//       alert(res.data.message);
//       window.location.href = '/';
//     } catch (err) {
//       alert(err.response?.data?.message || 'Access Denied');
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
//         className="w-full max-w-[460px] px-6 relative z-10"
//       >
//         <div className="bg-[#111116] border border-white/5 rounded-[32px] p-10 shadow-3xl">
          
//           <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-xs mb-8 group no-underline">
//             <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
//             <span>Return Hub</span>
//           </button>

//           <div className="text-center mb-10">
//             <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Access Portal</h1>
//             <p className="text-zinc-500 text-sm">Verify identity for department clearance.</p>
//           </div>

//           <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
//             <div className="space-y-3">
//               <p className="text-[10px] text-zinc-500 uppercase tracking-widest text-center">Department Sector:</p>
//               <div className="flex flex-wrap gap-2 justify-center">
//                 {roles.map((r) => {
//                   const isActive = formData.role === r.title;
//                   return (
//                     <button
//                       key={r.title}
//                       type="button"
//                       onClick={() => setFormData({ ...formData, role: r.title })}
//                       className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all ${
//                         isActive 
//                         ? 'border-red-600 bg-red-600/10 text-white ring-1 ring-red-600' 
//                         : 'border-white/5 bg-[#1a1a20] text-zinc-500 hover:border-white/20'
//                       }`}
//                     >
//                       {r.icon}
//                       <span>{r.title.split(' ')[0]}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             <InputField 
//               label="Clearance Email" 
//               placeholder="officer@forensic.gov"
//               type="email"
//               value={formData.email}
//               onChange={(v) => setFormData({...formData, email: v})}
//             />

//             <InputField 
//               label="Access Key" 
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

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full h-14 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl font-bold text-sm tracking-tight hover:shadow-[0_0_25px_rgba(220,38,38,0.3)] transition-all active:scale-95 disabled:opacity-50 mt-2"
//             >
//               {loading ? 'Decrypting...' : 'Verify Authority'}
//             </button>

//             <div className="text-center">
//               <span className="text-xs text-zinc-500">New to unit? </span>
//               <Link to="/register" className="text-xs text-red-500 font-bold hover:underline no-underline ml-1">Request Enrollment</Link>
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
//         className="w-full h-11 bg-[#1a1a20] border border-white/5 rounded-xl px-4 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-red-600/50 transition-all shadow-inner font-sans"
//       />
//       {rightSlot && (
//         <div className="absolute right-4 top-1/2 -translate-y-1/2">
//           {rightSlot}
//         </div>
//       )}
//     </div>
//   </div>
// );

// export default Login;