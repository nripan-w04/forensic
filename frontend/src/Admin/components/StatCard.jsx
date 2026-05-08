import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ stat, index }) {
  const Icon = stat.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        background: '#0a0a12',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 4, padding: '20px 22px',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: stat.color, borderRadius: '4px 0 0 4px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, color: '#ffffff', letterSpacing: '0.15em', marginBottom: 10, fontWeight: 400 }}>{stat.label.toUpperCase()}</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 44, fontWeight: 300, color: '#ffffff', lineHeight: 1 }}>{stat.value}</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: stat.color, marginTop: 8, letterSpacing: '0.05em' }}>{stat.delta}</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 6, background: `${stat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} color={stat.color} />
        </div>
      </div>
    </motion.div>
  );
}
