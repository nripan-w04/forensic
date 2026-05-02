import React, { useState } from 'react';
import { X, Edit2, Trash2, Check, User as UserIcon } from 'lucide-react';
import { useUI } from '../../common/UIContext';

export default function UserProfileModal({ user, onClose, onUpdate, onDelete }) {
  const { showConfirm } = useUI();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(user._id, formData);
    setIsEditing(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: '#0a0a12', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8, width: 450, overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(to right, rgba(220,38,38,0.1), transparent)'
        }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#ef4444', letterSpacing: '0.15em' }}>// PERSONNEL PROFILE</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>
              {isEditing ? 'Edit Profile' : 'Profile Overview'}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {!isEditing ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserIcon size={32} color="#71717a" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 700, color: '#f4f4f5' }}>{user.name}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#a1a1aa' }}>{user.email}</div>
                  <div style={{ display: 'inline-block', marginTop: 8, padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 3, fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#a1a1aa', textTransform: 'uppercase' }}>
                    {user.role}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#52525b', marginBottom: 4 }}>PHONE CONTACT</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#e4e4e7' }}>{user.phone}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#52525b', marginBottom: 4 }}>PHYSICAL ADDRESS</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#e4e4e7' }}>{user.address}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#52525b', marginBottom: 4 }}>CLEARANCE STATUS</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: user.status === 'Approved' ? '#34d399' : user.status === 'Rejected' ? '#ef4444' : '#fbbf24', fontWeight: 600, textTransform: 'uppercase' }}>
                    {user.status}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                <button 
                  onClick={() => setIsEditing(true)}
                  style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Share Tech Mono', monospace", fontSize: 12, textTransform: 'uppercase' }}>
                  <Edit2 size={14} /> Edit Profile
                </button>
                <button 
                  onClick={async () => {
                    const confirmed = await showConfirm({
                      title: 'Revoke Personnel Clearance',
                      message: `Are you certain you want to revoke and delete ${user.name}'s profile permanently? This operation is logged and irreversible.`,
                      confirmText: 'Revoke & Delete',
                      cancelText: 'Abort'
                    });
                    if (confirmed) {
                      onDelete(user._id);
                    }
                  }}
                  style={{ flex: 1, padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Share Tech Mono', monospace", fontSize: 12, textTransform: 'uppercase' }}>
                  <Trash2 size={14} /> Delete User
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#71717a', marginBottom: 6 }}>FULL NAME</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: 4, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#71717a', marginBottom: 6 }}>EMAIL ADDRESS</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: 4, outline: 'none' }} />
              </div>
              <div className="responsive-grid-2">
                <div>
                  <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#71717a', marginBottom: 6 }}>PHONE NUMBER</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: 4, outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#71717a', marginBottom: 6 }}>DEPARTMENT ROLE</label>
                  <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: 4, outline: 'none' }}>
                    <option value="Police Officer">Police Officer</option>
                    <option value="Lab Analyst">Lab Analyst</option>
                    <option value="Evidence Collector">Evidence Collector</option>
                    <option value="Court Official">Court Official</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: '#71717a', marginBottom: 6 }}>PHYSICAL ADDRESS</label>
                <textarea name="address" value={formData.address} onChange={handleChange} required style={{ width: '100%', background: '#04040a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: 4, outline: 'none', minHeight: 60 }} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#dc2626', border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Share Tech Mono', monospace", fontSize: 12, textTransform: 'uppercase' }}>
                  <Check size={14} /> Save Changes
                </button>
                <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#a1a1aa', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: "'Share Tech Mono', monospace", fontSize: 12, textTransform: 'uppercase' }}>
                   Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
