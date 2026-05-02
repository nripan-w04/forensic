import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ArrowRight, ChevronLeft, ChevronRight,
  Brain, Fingerprint, Eye, Lock, FileText, Activity,
  Users, Clock, CheckCircle, Radio
} from 'lucide-react';

/* ─── Palette ────────────────────────────────────────────────────── */
const C = {
  bg: '#09090b',
  surface: '#111113',
  sur2: '#18181b',
  border: 'rgba(255,255,255,0.06)',
  bord2: 'rgba(255,255,255,0.12)',
  red: '#ef4444',
  redDim: 'rgba(239,68,68,0.12)',
  orange: '#f97316',
  cyan: '#22d3ee',
  purple: '#a78bfa',
  green: '#22c55e',
  amber: '#fbbf24',
  tx1: '#ffffff',
  tx2: '#ffffff',
  tx3: '#ffffff',
};

/* ─── Slide Data ─────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 0,
    badge: 'NEURAL CORE ACTIVE',
    tag: 'AI-Powered Investigation',
    words: ['INTELLIGENT', 'FORENSIC', 'COMMAND'],
    accent: C.red,
    cta: 'Open Case File',
    sub: 'Harness neural pattern recognition to unravel complex cases. Our AI engine cross-references evidence, witness data, and criminal records in real time.',
    bg: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1600&q=80',
    overlay: 'rgba(9,9,11,0.35)',
    tint: 'rgba(239,68,68,0.05)',
  },
  {
    id: 1,
    badge: 'CHAIN VERIFIED',
    tag: 'Blockchain Evidence Chain',
    words: ['IMMUTABLE', 'EVIDENCE', 'LEDGER'],
    accent: C.orange,
    cta: 'View Evidence Vault',
    sub: 'Every piece of evidence is cryptographically sealed and timestamped. Tamper-proof chain-of-custody that holds up in any court of law.',
    bg: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1600&q=80',
    overlay: 'rgba(9,9,11,0.48)',
    tint: 'rgba(249,115,22,0.06)',
  },
  {
    id: 2,
    badge: 'LIVE DATA FEED',
    tag: 'Real-Time Crime Analytics',
    words: ['PREDICTIVE', 'CRIME', 'MAPPING'],
    accent: C.cyan,
    cta: 'Launch Analytics',
    sub: 'Live dashboards powered by ML hotspot prediction. Deploy units precisely where and when incidents are most likely to occur.',
    bg: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80',
    overlay: 'rgba(9,9,11,0.42)',
    tint: 'rgba(34,211,238,0.05)',
  },
  {
    id: 3,
    badge: 'SECURE CHANNEL',
    tag: 'Multi-Agency Collaboration',
    words: ['UNIFIED', 'COMMAND', 'NETWORK'],
    accent: C.purple,
    cta: 'Access Command',
    sub: 'Seamlessly connect federal, state, and local agencies under a single secure platform with role-based access and audit trails.',
    bg: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=80',
    overlay: 'rgba(9,9,11,0.46)',
    tint: 'rgba(167,139,250,0.06)',
  },
];

const FEATURES = [
  { icon: <Brain size={26} />, title: 'AI Case Intelligence', accent: C.red, desc: 'Neural networks auto-correlate suspects, locations, MO patterns, and historical crimes to surface hidden connections.' },
  { icon: <Fingerprint size={26} />, title: 'Biometric Identification', accent: C.orange, desc: 'Integrated fingerprint, facial, and gait recognition with AFIS/CJIS database synchronization in under 3 seconds.' },
  { icon: <Lock size={26} />, title: 'Blockchain Chain of Custody', accent: C.cyan, desc: 'Every evidence interaction is hashed, signed, and permanently recorded. Absolute integrity from crime scene to courtroom.' },
  { icon: <Eye size={26} />, title: 'Predictive Threat Analysis', accent: C.purple, desc: 'ML-driven risk scoring of suspects, locations, and timeframes. Anticipate criminal activity before it occurs.' },
  { icon: <FileText size={26} />, title: 'Unified Case Repository', accent: C.green, desc: 'Central encrypted vault for all case files, evidence media, lab reports, and court documents with granular access controls.' },
  { icon: <Activity size={26} />, title: 'Real-Time Monitoring', accent: C.amber, desc: 'Live feeds from field units, bodycams, and sensors aggregated into a single operational command picture.' },
];

const STATS = [
  { value: '98.7%', label: 'Evidence Integrity Rate', icon: <CheckCircle size={20} /> },
  { value: '3.2s', label: 'Avg. Biometric Match', icon: <Clock size={20} /> },
  { value: '12K+', label: 'Active Investigations', icon: <FileText size={20} /> },
  { value: '340+', label: 'Agencies Connected', icon: <Users size={20} /> },
];

const WORKFLOW = [
  { n: '01', title: 'Intake & Registration', desc: 'Case opened with biometric officer verification. Scene data, evidence, and witness statements logged instantly.' },
  { n: '02', title: 'AI Evidence Processing', desc: 'Neural engine scans all evidence. Pattern matching, timeline construction, and suspect correlation automated.' },
  { n: '03', title: 'Cross-Agency Collaboration', desc: 'Relevant agencies notified. Secure shared workspace activated with full audit trail and role-based permissions.' },
  { n: '04', title: 'Court-Ready Reporting', desc: 'AI-generated case briefs, blockchain-verified evidence packages, and immutable chain-of-custody reports.' },
];

const TERMINAL_LINES = [
  { text: '▶  LOADING CASE #FCM-2024-0847', color: '#a1a1aa' },
  { text: '▶  PARSING EVIDENCE: 14 items', color: '#a1a1aa' },
  { text: '▶  BIOMETRIC SCAN: 3 matches found', color: '#fbbf24' },
  { text: '▶  CROSS-REFERENCING DATABASE…', color: '#a1a1aa' },
  { text: '▶  SUSPECT CORRELATION: 94.3% confidence', color: '#ef4444' },
  { text: '▶  TIMELINE RECONSTRUCTED', color: '#a1a1aa' },
  { text: '▶  GENERATING CASE BRIEF…', color: '#a1a1aa' },
  { text: '✓  ANALYSIS COMPLETE — BRIEF READY', color: '#22c55e' },
];

/* ─── Helpers ────────────────────────────────────────────────────── */
const PulseDot = ({ color = C.red, size = 8 }) => (
  <span style={{ position: 'relative', display: 'inline-flex', width: size, height: size, flexShrink: 0 }}>
    <motion.span
      animate={{ scale: [1, 2.4, 1], opacity: [0.8, 0, 0.8] }}
      transition={{ duration: 1.8, repeat: Infinity }}
      style={{ position: 'absolute', inset: 0, borderRadius: '50%', backgroundColor: color }}
    />
    <span style={{ position: 'relative', width: size, height: size, borderRadius: '50%', backgroundColor: color }} />
  </span>
);

const GridBg = () => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="gp" width="64" height="64" patternUnits="userSpaceOnUse">
          <path d="M 64 0 L 0 0 0 64" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gp)" />
    </svg>
    <div style={{ position: 'absolute', top: 0, left: 0, width: 180, height: 180, borderLeft: '1.5px solid rgba(239,68,68,0.15)', borderTop: '1.5px solid rgba(239,68,68,0.15)' }} />
    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 180, height: 180, borderRight: '1.5px solid rgba(239,68,68,0.15)', borderBottom: '1.5px solid rgba(239,68,68,0.15)' }} />
  </div>
);

const Particles = ({ accent }) => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 6 + 5,
    delay: Math.random() * 4,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: accent,
          }}
        />
      ))}
    </div>
  );
};

const ScanLines = ({ accent }) => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}>
    <motion.div
      animate={{ top: ['0%', '100%', '0%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'absolute', left: 0, right: 0, height: 2,
        background: `linear-gradient(to right, transparent 0%, ${accent}60 30%, ${accent}90 50%, ${accent}60 70%, transparent 100%)`,
        boxShadow: `0 0 20px ${accent}80, 0 0 40px ${accent}40`,
      }}
    />
    <motion.div
      animate={{ top: ['100%', '0%', '100%'] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear', delay: 4 }}
      style={{
        position: 'absolute', left: 0, right: 0, height: 1,
        background: `linear-gradient(to right, transparent 0%, ${accent}30 40%, ${accent}50 50%, ${accent}30 60%, transparent 100%)`,
      }}
    />
    <motion.div
      animate={{ left: ['0%', '100%', '0%'] }}
      transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 2 }}
      style={{
        position: 'absolute', top: 0, bottom: 0, width: 1,
        background: `linear-gradient(to bottom, transparent 0%, ${accent}30 40%, ${accent}50 50%, ${accent}30 60%, transparent 100%)`,
      }}
    />
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)`,
    }} />
  </div>
);

const HUDCorners = ({ accent }) => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}
      style={{
        position: 'absolute', top: 100, left: 24, width: 60, height: 60,
        borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}`
      }} />
    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      style={{
        position: 'absolute', top: 100, right: 24, width: 60, height: 60,
        borderTop: `2px solid ${accent}`, borderRight: `2px solid ${accent}`
      }} />
    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      style={{
        position: 'absolute', bottom: 80, left: 24, width: 60, height: 60,
        borderBottom: `2px solid ${accent}`, borderLeft: `2px solid ${accent}`
      }} />
    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
      style={{
        position: 'absolute', bottom: 80, right: 24, width: 60, height: 60,
        borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}`
      }} />
    {[
      { top: 100, left: 24 }, { top: 100, right: 24 },
      { bottom: 80, left: 24 }, { bottom: 80, right: 24 },
    ].map((pos, i) => (
      <motion.div key={i}
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
        style={{ position: 'absolute', ...pos, width: 6, height: 6, borderRadius: '50%', background: accent }}
      />
    ))}
  </div>
);

const DataTicker = ({ accent }) => {
  const items = ['EVIDENCE SECURED', 'CHAIN VERIFIED', 'AI PROCESSING', 'BIOMETRICS OK', 'ENCRYPTED', 'CASE LOGGED'];
  return (
    <div style={{
      position: 'absolute', bottom: 120, left: 0, right: 0, zIndex: 5,
      overflow: 'hidden', height: 24, pointerEvents: 'none',
    }}>
      <motion.div
        animate={{ x: [0, -1200] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} style={{
            fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.2em',
            color: `${accent}60`, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: accent, display: 'inline-block' }} />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const HeroCarousel = () => {
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState(1);
  const timer = useRef(null);
  const go = (idx, d) => {
    setDir(d);
    setCur((idx + SLIDES.length) % SLIDES.length);
  };
  useEffect(() => {
    timer.current = setInterval(() => {
      setDir(1);
      setCur(p => (p + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer.current);
  }, []);
  const slide = SLIDES[cur];
  const bgVariants = {
    enter: d => ({ scale: 1.12, x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { scale: 1.05, x: 0, opacity: 1, transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: d => ({ scale: 1.0, x: d > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.7 } }),
  };
  const contentVariants = {
    enter: d => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.55, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: d => ({ x: d > 0 ? -40 : 40, opacity: 0, transition: { duration: 0.3 } }),
  };
  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', background: C.bg,
    }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={`bg-${cur}`}
            custom={dir}
            variants={bgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{
              position: 'absolute', inset: '-10%',
              backgroundImage: `url(${slide.bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              willChange: 'transform',
            }}
          />
        </AnimatePresence>
        <AnimatePresence>
          <motion.div
            key={`overlay-${cur}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: 'absolute', inset: 0, background: slide.overlay }}
          />
        </AnimatePresence>
        <AnimatePresence>
          <motion.div
            key={`tint-${cur}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 60%, ${slide.tint}, transparent 70%)` }}
          />
        </AnimatePresence>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(9,9,11,0.8) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(9,9,11,0.4) 0%, transparent 20%, transparent 80%, rgba(9,9,11,0.4) 100%)' }} />
      </div>
      <ScanLines accent={slide.accent} />
      <Particles accent={slide.accent} />
      <HUDCorners accent={slide.accent} />
      <GridBg />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, pointerEvents: 'none' }}>
        {[1, 2, 3].map(i => (
          <motion.div key={i}
            animate={{ scale: [1, 1.5 + i * 0.3, 1], opacity: [0.06, 0, 0.06] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 1.2 }}
            style={{
              position: 'absolute',
              width: 300 + i * 150, height: 300 + i * 150,
              borderRadius: '50%',
              border: `1px solid ${slide.accent}`,
            }}
          />
        ))}
      </div>
      <div style={{
        position: 'absolute', top: 84, left: 32, right: 32, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: 'monospace', fontSize: 10, color: C.tx3,
        textTransform: 'uppercase', letterSpacing: '0.14em',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PulseDot color={slide.accent} />
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>FCMS // NEURAL CORE v4.1</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'rgba(255,255,255,0.3)' }}>
          <span>CASE DB: ONLINE</span>
          <span>//</span>
          <span>AI ENGINE: ACTIVE</span>
          <span>//</span>
          <span>{new Date().toUTCString().slice(0, 25)} UTC</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Radio size={10} style={{ color: slide.accent }} />
          <span style={{ color: slide.accent }}>SECURE CHANNEL</span>
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, width: '100%', padding: '120px 32px 160px', textAlign: 'center' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={cur} custom={dir} variants={contentVariants} initial="enter" animate="center" exit="exit">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ height: 1, width: 48, background: `linear-gradient(to right, transparent, ${slide.accent})` }} />
              <span style={{
                padding: '6px 20px', borderRadius: 999,
                border: `1px solid ${slide.accent}50`,
                background: `${slide.accent}18`,
                backdropFilter: 'blur(8px)',
                color: slide.accent, fontSize: 10, fontWeight: 700,
                fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.3em',
              }}>
                {slide.badge}
              </span>
              <div style={{ height: 1, width: 48, background: `linear-gradient(to left, transparent, ${slide.accent})` }} />
            </motion.div>
            <p style={{
              color: 'rgba(255,255,255,0.45)', fontSize: 11, textTransform: 'uppercase',
              letterSpacing: '0.35em', fontFamily: 'monospace', margin: '0 0 14px'
            }}>
              {slide.tag}
            </p>
            <h1 style={{ margin: '0 0 28px', lineHeight: 0.9, letterSpacing: '-0.04em' }}>
              {slide.words.map((word, i) => (
                <motion.span key={`${cur}-${i}`}
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    display: 'block',
                    fontSize: 'clamp(52px, 9vw, 96px)',
                    fontWeight: 900,
                    color: i === 1 ? slide.accent : '#ffffff',
                    textShadow: i === 1
                      ? `0 0 40px ${slide.accent}80, 0 0 80px ${slide.accent}40`
                      : '0 2px 20px rgba(0,0,0,0.8)',
                  }}>
                  {word}
                </motion.span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              style={{
                color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.7,
                maxWidth: 580, margin: '0 auto 40px',
                textShadow: '0 1px 8px rgba(0,0,0,0.8)',
              }}>
              {slide.sub}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
                style={{
                  padding: '14px 36px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}cc)`,
                  boxShadow: `0 0 40px ${slide.accent}50, 0 4px 20px rgba(0,0,0,0.4)`,
                  color: '#fff', fontWeight: 700, fontSize: 13,
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                {slide.cta} <ArrowRight size={15} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                style={{
                  padding: '14px 36px', borderRadius: 12, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid rgba(255,255,255,0.2)`,
                  color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: 13,
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}>
                View Dashboard
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      <DataTicker accent={slide.accent} />
      <div style={{
        position: 'absolute', bottom: 40, left: 0, right: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
      }}>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          onClick={() => go(cur - 1, -1)}
          style={{
            width: 44, height: 44, borderRadius: '50%', cursor: 'pointer',
            border: `1px solid rgba(255,255,255,0.2)`,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
            color: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <ChevronLeft size={18} />
        </motion.button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {SLIDES.map((s, i) => (
            <motion.button
              key={i}
              onClick={() => go(i, i > cur ? 1 : -1)}
              whileHover={{ scale: 1.2 }}
              style={{
                height: 8, width: i === cur ? 32 : 8,
                borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer',
                background: i === cur ? slide.accent : 'rgba(255,255,255,0.25)',
                boxShadow: i === cur ? `0 0 12px ${slide.accent}80` : 'none',
                transition: 'all 0.35s ease',
              }}
            />
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          onClick={() => go(cur + 1, 1)}
          style={{
            width: 44, height: 44, borderRadius: '50%', cursor: 'pointer',
            border: `1px solid rgba(255,255,255,0.2)`,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
            color: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <ChevronRight size={18} />
        </motion.button>
      </div>
      <div style={{
        position: 'absolute', bottom: 50, right: 32, fontFamily: 'monospace',
        fontSize: 11, color: 'rgba(255,255,255,0.3)', zIndex: 10, letterSpacing: '0.1em'
      }}>
        {String(cur + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
      </div>
    </section>
  );
};

const StatsBar = () => (
  <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
    <div className="responsive-grid-4" style={{
      maxWidth: 1100, margin: '0 auto', padding: '32px', gap: 24,
    }}>
      {STATS.map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: C.redDim, color: C.red,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {s.icon}
          </div>
          <div>
            <p style={{ color: C.tx1, fontSize: 28, fontWeight: 900, margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</p>
            <p style={{ color: C.tx3, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', margin: '4px 0 0' }}>{s.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

const FeaturesSection = () => (
  <section style={{ padding: '96px 32px', background: C.bg, position: 'relative', overflow: 'hidden' }}>
    <GridBg />
    <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
        <p style={{
          color: C.red, fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.4em', fontFamily: 'monospace', margin: '0 0 14px'
        }}>Core Capabilities</p>
        <h2 style={{
          color: C.tx1, fontSize: 'clamp(34px,5vw,54px)', fontWeight: 900,
          letterSpacing: '-0.04em', margin: '0 0 16px', lineHeight: 1.05
        }}>
          AI-POWERED TOOLS<br /><span style={{ color: '#3f3f46' }}>FOR MODERN FORENSICS</span>
        </h2>
        <p style={{ color: C.tx2, fontSize: 14, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
          Every module is purpose-built for law enforcement — from scene to courtroom.
        </p>
      </motion.div>
      <div className="responsive-grid-3" style={{ gap: 20 }}>
        {FEATURES.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            style={{
              padding: '32px 28px', borderRadius: 20,
              border: `1px solid ${C.border}`, background: C.surface,
              position: 'relative', overflow: 'hidden', cursor: 'default',
            }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, marginBottom: 20,
              background: `${f.accent}15`, color: f.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {f.icon}
            </div>
            <h3 style={{
              color: C.tx1, fontSize: 13, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px'
            }}>
              {f.title}
            </h3>
            <p style={{ color: C.tx2, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(to right, ${f.accent}, transparent)`, opacity: 0.5,
            }} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const WorkflowSection = () => (
  <section style={{ padding: '96px 32px', background: C.surface, position: 'relative', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', right: 0, top: 0, width: 400, height: 400,
      borderRadius: '50%', background: 'rgba(239,68,68,0.04)', filter: 'blur(80px)', pointerEvents: 'none'
    }} />
    <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} style={{ marginBottom: 56 }}>
        <p style={{
          color: C.red, fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.4em', fontFamily: 'monospace', margin: '0 0 12px'
        }}>Investigation Workflow</p>
        <h2 style={{
          color: C.tx1, fontSize: 'clamp(34px,5vw,54px)', fontWeight: 900,
          letterSpacing: '-0.04em', margin: 0, lineHeight: 1.05
        }}>
          FROM SCENE TO<br /><span style={{ color: C.red }}>CONVICTION</span>
        </h2>
      </motion.div>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 23, top: 24, bottom: 24, width: 1,
          background: 'linear-gradient(to bottom, rgba(239,68,68,0.5), rgba(239,68,68,0.04))',
        }} />
        {WORKFLOW.map((w, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.15 }}
            style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
              border: '1px solid rgba(239,68,68,0.35)',
              background: 'rgba(239,68,68,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: C.red,
              position: 'relative', zIndex: 2,
            }}>
              {w.n}
            </div>
            <div style={{
              flex: 1, paddingBottom: 40, paddingTop: 10,
              borderBottom: i < WORKFLOW.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <h3 style={{
                color: C.tx1, fontSize: 17, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px'
              }}>
                {w.title}
              </h3>
              <p style={{ color: C.tx2, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{w.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const AISpotlight = () => (
  <section style={{ padding: '96px 32px', background: C.bg, position: 'relative', overflow: 'hidden' }}>
    <GridBg />
    <div className="responsive-grid-2" style={{
      maxWidth: 1100, margin: '0 auto', gap: 80,
      alignItems: 'center', position: 'relative', zIndex: 2,
    }}>
      <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
        <p style={{
          color: C.red, fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.4em', fontFamily: 'monospace', margin: '0 0 12px'
        }}>AI at the Core</p>
        <h2 style={{
          color: C.tx1, fontSize: 'clamp(30px,4vw,50px)', fontWeight: 900,
          letterSpacing: '-0.04em', margin: '0 0 24px', lineHeight: 1.05
        }}>
          THE BRAIN<br />BEHIND EVERY<br /><span style={{ color: C.red }}>BREAKTHROUGH</span>
        </h2>
        <p style={{ color: C.tx2, fontSize: 14, lineHeight: 1.7, margin: '0 0 32px' }}>
          FCMS's neural intelligence layer continuously learns from case outcomes, refining its models with every solved investigation. It reasons, infers, and predicts.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['Cross-case suspect correlation engine', 'Natural language case brief generation',
            'Automated anomaly detection in evidence', 'Predictive recidivism risk scoring'].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: C.redDim, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.red }} />
                </div>
                <span style={{ color: '#d4d4d8', fontSize: 14 }}>{item}</span>
              </motion.div>
            ))}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} style={{ position: 'relative' }}>
        <div style={{
          borderRadius: 20, border: `1px solid ${C.bord2}`,
          background: C.sur2, padding: 28, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
            paddingBottom: 16, borderBottom: `1px solid ${C.border}`
          }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: C.red }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: C.amber }} />
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: C.green }} />
            <span style={{
              marginLeft: 12, color: C.tx3, fontSize: 10, fontFamily: 'monospace',
              textTransform: 'uppercase', letterSpacing: '0.18em'
            }}>FCMS // AI ENGINE TERMINAL</span>
          </div>
          {TERMINAL_LINES.map((line, i) => (
            <motion.p key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.13 }}
              style={{ color: line.color, fontFamily: 'monospace', fontSize: 12, margin: '0 0 8px', lineHeight: 1.5 }}>
              {line.text}
            </motion.p>
          ))}
          <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
            style={{ display: 'inline-block', width: 8, height: 14, background: C.red, marginLeft: 4 }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
            background: 'linear-gradient(to top, rgba(239,68,68,0.06), transparent)', pointerEvents: 'none',
          }} />
        </div>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: -16, right: -16, background: C.red, color: '#fff',
            padding: '8px 14px', borderRadius: 12, fontSize: 10, fontWeight: 700,
            fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.15em'
          }}>
          AI ACTIVE
        </motion.div>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute', bottom: -16, left: -16, background: C.sur2,
            border: '1px solid rgba(34,197,94,0.3)', color: C.green,
            padding: '8px 14px', borderRadius: 12, fontSize: 10, fontWeight: 700,
            fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em'
          }}>
          ✓ BLOCKCHAIN VERIFIED
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const CTASection = () => (
  <section style={{ padding: '96px 32px', background: C.surface, position: 'relative', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,68,68,0.07), transparent 70%)'
    }} />
    <GridBg />
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px',
        borderRadius: 999, border: '1px solid rgba(239,68,68,0.2)',
        background: 'rgba(239,68,68,0.07)', marginBottom: 32,
      }}>
        <PulseDot />
        <span style={{
          color: C.red, fontSize: 10, fontWeight: 700, fontFamily: 'monospace',
          textTransform: 'uppercase', letterSpacing: '0.3em'
        }}>System Ready</span>
      </div>
      <h2 style={{
        color: C.tx1, fontSize: 'clamp(42px,7vw,74px)', fontWeight: 900,
        letterSpacing: '-0.04em', margin: '0 0 20px', lineHeight: 0.92
      }}>
        READY TO<br /><span style={{ color: C.red }}>INVESTIGATE?</span>
      </h2>
      <p style={{ color: C.tx2, fontSize: 15, lineHeight: 1.7, margin: '0 0 40px' }}>
        Join hundreds of agencies already leveraging FCMS's AI-powered forensic ecosystem. Access the full platform in minutes.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          style={{
            padding: '16px 42px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: C.red, color: '#fff', fontWeight: 700, fontSize: 13,
            textTransform: 'uppercase', letterSpacing: '0.15em',
            boxShadow: '0 0 40px rgba(239,68,68,0.3)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
          Request Access <ArrowRight size={15} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          style={{
            padding: '16px 42px', borderRadius: 12, cursor: 'pointer',
            background: 'transparent', border: `1px solid ${C.bord2}`,
            color: C.tx2, fontWeight: 700, fontSize: 13,
            textTransform: 'uppercase', letterSpacing: '0.15em',
          }}>
          Watch Demo
        </motion.button>
      </div>
    </motion.div>
  </section>
);

const Footer = () => (
  <footer
    style={{
      background: C.bg,
      borderTop: `1px solid ${C.border}`,
      padding: '32px',
    }}
  >
    <div
      style={{
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <p style={{ color: C.tx3, fontSize: 12 }}>
        &copy; {new Date().getFullYear()} FCMS Forensics. All rights reserved.
      </p>
    </div>
  </footer>
);

const Home = () => (
  <div style={{ background: C.bg, minHeight: '100vh', paddingTop: '80px' }}>
    <HeroCarousel />
    <StatsBar />
    <FeaturesSection />
    <WorkflowSection />
    <AISpotlight />
    <CTASection />
    <Footer />
  </div>
);

export default Home;