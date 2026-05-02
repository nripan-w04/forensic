import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Microscope, Package, Gavel, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useUI } from '../../common/UIContext';

function getRoleIcon(role) {
  const props = { size: 13 };
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
      showToast(`Personnel clearance status: ${status}`, 'success');
      fetchUsers();
    } catch (err) {
      console.error(err);
      showToast('System Error: Clearance override failed', 'error');
    }
  };

  const handleDeleteUser = async (id, name) => {
    const confirmed = await showConfirm({
      title: 'Erase Personnel Record',
      message: `Are you sure you want to permanently erase ${name} from the national database? This action is tracked.`,
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
      <style>{`
        .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        table { width: 100%; border-collapse: collapse; min-width: 700px; }
        thead th {
          font-family: 'Share Tech Mono', monospace; font-size: 11px;
          color: #ffffff; letter-spacing: 0.18em; text-transform: uppercase;
          padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.05);
          background: #0f0f1a; white-space: nowrap; text-align: left;
        }
        tbody td {
          padding: 15px 18px; border-bottom: 1px solid rgba(255,255,255,0.03);
          font-size: 15px; color: #e4e4e7; vertical-align: middle;
        }
        tbody tr:hover td { background: rgba(255,255,255,0.012); }

        .role-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09); border-radius: 3px;
          font-family: 'Share Tech Mono', monospace; font-size: 12px; font-weight: 700;
          color: #ffffff; text-transform: uppercase; letter-spacing: 0.08em; white-space: nowrap;
        }
        .status-badge {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 6px 12px; border-radius: 4px; text-transform: uppercase;
          font-family: 'Share Tech Mono', monospace; font-size: 13px; font-weight: 800;
          letter-spacing: 0.1em; width: 110px;
        }
        .status-badge.pending  { background: rgba(251,191,36,0.08);  border: 1px solid rgba(251,191,36,0.25);  color: #fde047; }
        .status-badge.approved { background: rgba(52,211,153,0.08);  border: 1px solid rgba(52,211,153,0.25);  color: #6ee7b7; }
        .status-badge.rejected { background: rgba(220,38,38,0.08);   border: 1px solid rgba(220,38,38,0.25);   color: #fca5a5; }

        .btn-act {
          display: inline-flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 3px; border: 1px solid;
          cursor: pointer; transition: all 0.18s; background: transparent;
        }
        .btn-act.approve { border-color: rgba(52,211,153,0.3); color: #34d399; }
        .btn-act.approve:hover { background: rgba(52,211,153,0.12); box-shadow: 0 0 12px rgba(52,211,153,0.2); }
        .btn-act.reject  { border-color: rgba(220,38,38,0.3);  color: #dc2626; }
        .btn-act.reject:hover  { background: rgba(220,38,38,0.12);  box-shadow: 0 0 12px rgba(220,38,38,0.2); }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 'clamp(12px, 2vw, 15px)', color: '#dc2626', letterSpacing: '0.25em', marginBottom: 8, fontWeight: 700 }}>
          // OVERSIGHT AUTHORITY · LEVEL-5 CLEARANCE
        </div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(32px, 8vw, 56px)', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
          Personnel Registry
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ background: '#0a0a12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}
      >
        {/* Table header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
        }}>
          <div>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 15, color: '#ffffff', letterSpacing: '0.18em', marginBottom: 4, fontWeight: 700 }}>// MODULE · PERSONNEL REGISTRY</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, color: '#ffffff', letterSpacing: '0.05em' }}>
              CLEARANCE MANAGEMENT
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#ffffff' }}>
              {users.length} RECORDS
            </div>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
          </div>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#3f3f46', fontSize: 11, letterSpacing: '0.12em' }}>
              ESTABLISHING DATABASE LINK...
            </div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'Share Tech Mono', monospace", color: '#ffffff', fontSize: 13, letterSpacing: '0.12em' }}>
              NO RECORDS FOUND
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ paddingLeft: 22 }}>Personnel</th>
                  <th>Department</th>
                  <th>Contact</th>
                  <th>Clearance</th>
                  <th style={{ textAlign: 'right', paddingRight: 22 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {users.map((u, idx) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <td style={{ paddingLeft: 22 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: 4,
                            background: `hsl(${(u.name?.length || 0) * 60},40%,18%)`,
                            border: '1px solid rgba(255,255,255,0.07)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14, color: '#ffffff',
                            flexShrink: 0,
                          }}>
                            {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, fontWeight: 600, color: '#f4f4f5', letterSpacing: '0.03em' }}>{u.name}</div>
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#ffffff', marginTop: 1 }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><div className="role-badge">{getRoleIcon(u.role)}{u.role}</div></td>
                      <td>
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#ffffff', marginTop: 2 }}>{u.address}</div>
                      </td>
                      <td>
                        <div className={`status-badge ${u.status.toLowerCase()}`}>
                          {u.status === 'Pending' && <Clock size={11} />}
                          {u.status === 'Approved' && <CheckCircle size={11} />}
                          {u.status === 'Rejected' && <XCircle size={11} />}
                          {u.status}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: 22 }}>
                        {u.status === 'Pending' && (
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button className="btn-act approve" title="Approve" onClick={() => handleStatusUpdate(u._id, 'Approved')}>
                              <CheckCircle size={13} />
                            </button>
                            <button className="btn-act reject" title="Reject" onClick={() => handleStatusUpdate(u._id, 'Rejected')}>
                              <XCircle size={13} />
                            </button>
                          </div>
                        )}
                        {u.status === 'Approved' && (
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button className="btn-act reject" title="Delete User" onClick={() => handleDeleteUser(u._id, u.name)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
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
