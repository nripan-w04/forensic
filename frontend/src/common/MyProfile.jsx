import React, { useState } from 'react';
import axios from 'axios';
import { User as UserIcon, Check, Activity } from 'lucide-react';
import { useUI } from './UIContext';

export default function MyProfile() {
  const { showToast } = useUI();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:4000/api/users/${user._id}`, formData);
      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update profile: System override required', 'error');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">// PERSONNEL RECORD</p>
          <h1 className="page-title">My <span>Profile</span></h1>
        </div>
      </div>

      <div className="data-card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
           <div style={{ width: 80, height: 80, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <UserIcon size={40} color="#71717a" />
           </div>
           <div>
             <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 700, color: '#f4f4f5' }}>{user.name}</div>
             <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#a1a1aa', marginTop: 4 }}>{user.role}</div>
             <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '4px 10px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 3, fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#34d399', textTransform: 'uppercase' }}>
               <Activity size={12} /> STATUS: {user.status}
             </div>
           </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
          <div className="responsive-grid-2">
            <div>
              <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 8 }}>FULL NAME</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 16px', borderRadius: 4, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 8 }}>EMAIL ADDRESS</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 16px', borderRadius: 4, outline: 'none' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 8 }}>PHONE NUMBER</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 16px', borderRadius: 4, outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#71717a', marginBottom: 8 }}>PHYSICAL ADDRESS</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 16px', borderRadius: 4, outline: 'none', minHeight: 80 }} />
          </div>
          <div style={{ marginTop: 16 }}>
            <button type="submit" style={{ padding: '12px 24px', background: '#dc2626', border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Share Tech Mono', monospace", fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>
              <Check size={16} /> Update Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
