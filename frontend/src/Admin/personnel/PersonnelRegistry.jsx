import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Microscope, Package, Gavel, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useUI } from '../../common/UIContext';

function getRoleIcon(role) {
  const props = { size: 14 };
  switch (role) {
    case 'Police Officer': return <Shield {...props} />;
    case 'Lab Analyst': return <Microscope {...props} />;
    case 'Evidence Collector': return <Package {...props} />;
    case 'Court Official': return <Gavel {...props} />;
    default: return <Shield {...props} />;
  }
}

export default function PersonnelRegistry() {
  const { showToast, showConfirm } = useUI();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:4000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      showToast('Error: Failed to synchronize personnel records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:4000/api/users/${id}/status`, { status });
      
      const toastMessage = status === 'Approved' 
        ? 'Personnel registration approved successfully' 
        : 'Registration application rejected by administrator';
      
      showToast(toastMessage, 'success');
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast('System Error: Clearance override failed', 'error');
    }
  };

  const handleDeleteUser = async (id, name) => {
    const confirmed = await showConfirm({
      title: 'Erase Personnel Record',
      message: `Are you sure you want to permanently erase ${name} from the database?`,
      confirmText: 'Erase Record',
      cancelText: 'Abort'
    });

    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:4000/api/users/${id}`);
      showToast('Personnel record purged from system', 'info');
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast('Unauthorized: Error purging personnel record', 'error');
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">{'//'} OVERSIGHT AUTHORITY · PERSONNEL REGISTRY</p>
          <h1 className="page-title">
            Clearance <span>Management</span>
          </h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="data-card"
      >
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: '#ef4444', letterSpacing: '0.15em', marginBottom: 4 }}>{'//'} ACTIVE RECORDS</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: '#f4f4f5', textTransform: 'uppercase' }}>
              Database Synchronization
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: '#71717a' }}>{users.length} IDENTIFIED</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          </div>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#71717a', fontSize: 13 }}>
              ESTABLISHING ENCRYPTED LINK...
            </div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#71717a', fontSize: 13 }}>
              NO PERSONNEL RECORDS FOUND.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Department</th>
                  <th>Clearance</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {users.map((u, idx) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 4,
                            background: `hsl(${(u.name?.length || 0) * 45}, 40%, 15%)`,
                            border: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: '#ffffff'
                          }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#f4f4f5' }}>{u.name}</div>
                            <div style={{ fontSize: 12, color: '#71717a', fontFamily: "'Share Tech Mono', monospace" }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3, fontSize: 12 }}>
                          {getRoleIcon(u.role)}
                          <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{u.role}</span>
                        </div>
                      </td>
                      <td>
                        <div className={`badge ${u.status === 'Approved' ? 'badge-approved' : u.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                          {u.status === 'Pending' && <Clock size={12} />}
                          {u.status === 'Approved' && <CheckCircle size={12} />}
                          {u.status === 'Rejected' && <XCircle size={12} />}
                          {u.status}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          {u.status === 'Pending' && (
                            <>
                              <button className="action-btn approve" onClick={() => handleStatusUpdate(u._id, 'Approved')} title="Approve">
                                <CheckCircle size={16} />
                              </button>
                              <button className="action-btn reject" onClick={() => handleStatusUpdate(u._id, 'Rejected')} title="Reject">
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          <button className="action-btn" onClick={() => handleDeleteUser(u._id, u.name)} title="Purge Record">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </>
  );
}
