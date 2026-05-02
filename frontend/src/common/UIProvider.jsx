import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import UIContext from './UIContext';

export const UIProvider = ({ children }) => {
  const [modal, setModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const options = { duration };
    if (type === 'success') {
      toast.success(message, options);
    } else if (type === 'error') {
      toast.error(message, options);
    } else if (type === 'warning') {
      toast(message, { ...options, icon: '⚠️' });
    } else {
      toast(message, options);
    }
  }, []);

  const showConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      setModal({ ...options, resolve });
    });
  }, []);

  const closeModal = (result) => {
    if (modal?.resolve) modal.resolve(result);
    setModal(null);
  };

  return (
    <UIContext.Provider value={{ showToast, showConfirm, mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu }}>
      {children}
      
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          style: { 
            background: '#0a0a10', 
            color: '#fff', 
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: "'Barlow', sans-serif",
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            zIndex: 99999
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#0a0a10' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0a0a10' } }
        }} 
      />

      {/* Confirmation Modal */}
      <AnimatePresence>
        {modal && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 99999 }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => closeModal(false)}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{ position: 'relative', width: '100%', maxWidth: '440px', backgroundColor: '#0a0a10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden', fontFamily: "'Barlow', sans-serif" }}
            >
              {/* Decorative brackets */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '32px', height: '32px', borderTop: '2px solid rgba(239,68,68,0.3)', borderLeft: '2px solid rgba(239,68,68,0.3)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '32px', height: '32px', borderBottom: '2px solid rgba(239,68,68,0.3)', borderRight: '2px solid rgba(239,68,68,0.3)' }} />
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertTriangle color="#ef4444" size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.05em', margin: '0 0 4px 0' }}>
                    {modal.title || 'Confirm Action'}
                  </h3>
                  <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                    {modal.message || 'Are you sure you want to proceed?'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => closeModal(false)}
                  style={{ padding: '8px 20px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', color: '#a1a1aa', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  {modal.cancelText || 'Cancel'}
                </button>
                <button
                  onClick={() => closeModal(true)}
                  style={{ padding: '8px 20px', borderRadius: '4px', backgroundColor: '#dc2626', color: '#fff', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(220,38,38,0.2)', transition: 'all 0.2s' }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                >
                  {modal.confirmText || 'Verify Authority'}
                </button>
              </div>
              
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '9px', fontFamily: "'Share Tech Mono', monospace", color: '#52525b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Encryption: Active</span>
                <Shield size={12} color="#3f3f46" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </UIContext.Provider>
  );
};
