'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { PomodoroTimer } from '@/components/features/PomodoroTimer';
import { XPBar } from '@/components/ui/XPBar';
import {
  Layers,
  Target,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Flame,
  Trophy,
  Zap,
  ArrowRight,
  Code2,
  Sigma,
  FlaskConical,
  Plane,
  Rocket,
  Globe,
} from 'lucide-react';

/* ─── Reusable section wrapper ─── */
function Section({
  children,
  style,
  id,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  id?: string;
}) {
  return (
    <section
      id={id}
      style={{
        width: '100%',
        padding: '120px 24px',
        ...style,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>{children}</div>
    </section>
  );
}

/* ─── Hero ─── */
function HeroSection() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: '#0A0A0A',
        textAlign: 'center',
        padding: '0 24px',
      }}
    >
      {/* Background glow */}
      <div
        className="hero-glow"
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '500px',
          background:
            'radial-gradient(ellipse at center, rgba(74,222,128,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: '900px', width: '100%' }}>
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #1F1F1F',
            padding: '6px 14px',
            marginBottom: '32px',
          }}
        >
          <div style={{ width: '6px', height: '6px', background: '#4ADE80' }} />
          <span style={{ color: '#888888', fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em' }}>
            AI-POWERED AEROSPACE STUDY PLATFORM
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: 'clamp(52px, 8vw, 96px)',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            lineHeight: '0.95',
            color: '#FFFFFF',
            marginBottom: '28px',
          }}
        >
          Master
          <br />
          <span style={{ color: '#4ADE80' }}>Aerospace</span>
          <br />
          Engineering.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#888888',
            fontWeight: 300,
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 48px',
          }}
        >
          Step-by-step problem solving, Socratic AI tutoring, searchable formula reference, and
          gamified practice — built for engineers who want to{' '}
          <em style={{ color: '#FFFFFF', fontStyle: 'normal', fontWeight: 500 }}>actually understand</em> the material.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link
            href="/solve"
            style={{
              background: '#4ADE80',
              color: '#0A0A0A',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '-0.02em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            Start Studying <ArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>
          <a
            href="#step-solver"
            style={{
              background: 'transparent',
              color: '#FFFFFF',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '-0.02em',
              border: '1px solid #2A2A2A',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#4ADE80'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A'; }}
          >
            See How It Works
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, transparent, #888888)',
          }}
        />
      </motion.div>
    </section>
  );
}

/* ─── Stats marquee bar ─── */
function StatsBar() {
  const items = [
    '6 Study Modes',
    'LaTeX Math Rendering',
    'Socratic AI Tutor',
    'XP & Leveling System',
    'Streak Tracking',
    'Pomodoro Focus Timer',
    'Formula Hub',
    'Streaming Responses',
    'PDF Context Upload',
  ];
  const doubled = [...items, ...items];

  return (
    <div
      style={{
        borderTop: '1px solid #1F1F1F',
        borderBottom: '1px solid #1F1F1F',
        background: '#0A0A0A',
        overflow: 'hidden',
        padding: '16px 0',
      }}
    >
      <div className="marquee-track" style={{ display: 'flex', gap: '0', whiteSpace: 'nowrap' }}>
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              color: '#888888',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.04em',
              padding: '0 48px',
              borderRight: '1px solid #1F1F1F',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ color: '#4ADE80', fontSize: '8px' }}>■</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Feature section: Step Solver ─── */
function StepSolverSection() {
  return (
    <Section id="step-solver" style={{ borderBottom: '1px solid #1F1F1F' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '80px',
          alignItems: 'center',
        }}
      >
        {/* Left: copy */}
        <div>
          <div style={{ color: '#4ADE80', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px' }}>
            STEP SOLVER
          </div>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: '#FFFFFF',
              marginBottom: '20px',
            }}
          >
            Every problem,
            <br />
            broken down.
          </h2>
          <p style={{ color: '#888888', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px', fontWeight: 300 }}>
            Paste any aerospace engineering problem and get a clear, numbered solution with full LaTeX
            math rendering. See every step — not just the answer.
          </p>
          <Link
            href="/solve"
            style={{
              color: '#4ADE80',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '-0.01em',
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = '#4ADE80'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'; }}
          >
            Try the Solver <ChevronRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>

        {/* Right: mockup */}
        <div>
          <div style={{ border: '1px solid #1F1F1F', background: '#111111' }}>
            {/* Input */}
            <div style={{ padding: '16px', borderBottom: '1px solid #1F1F1F' }}>
              <div style={{ color: '#888888', fontSize: '11px', letterSpacing: '0.08em', marginBottom: '10px' }}>PROBLEM INPUT</div>
              <div
                style={{
                  background: '#0A0A0A',
                  border: '1px solid #1F1F1F',
                  padding: '12px',
                  color: '#888888',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  minHeight: '72px',
                }}
              >
                A rocket has I<sub>sp</sub> = 450 s and ṁ = 10 kg/s. Calculate thrust force.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <div
                  style={{
                    background: '#4ADE80',
                    color: '#0A0A0A',
                    padding: '6px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Solve <ArrowRight style={{ width: '13px', height: '13px' }} />
                </div>
              </div>
            </div>

            {/* Steps */}
            {[
              { n: 1, text: 'Identify variables: Isp = 450 s, ṁ = 10 kg/s, g₀ = 9.81 m/s²' },
              { n: 2, text: 'Apply thrust equation: F = Isp · ṁ · g₀' },
              { n: 3, text: 'Substitute: F = 450 × 10 × 9.81 = 44,145 N ≈ 44.1 kN' },
            ].map((step) => (
              <div
                key={step.n}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #1F1F1F',
                  borderLeft: '3px solid #4ADE80',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  background: step.n === 3 ? '#0D1A12' : '#111111',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    background: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: '#4ADE80', fontSize: '11px', fontWeight: 700 }}>{step.n}</span>
                </div>
                <span style={{ color: step.n === 3 ? '#FFFFFF' : '#CCCCCC', fontSize: '13px', lineHeight: 1.5 }}>
                  {step.text}
                  {step.n === 3 && (
                    <span
                      style={{
                        marginLeft: '8px',
                        background: '#4ADE80',
                        color: '#0A0A0A',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                      }}
                    >
                      FINAL
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── Feature section: Practice ─── */
function PracticeSection() {
  return (
    <Section style={{ borderBottom: '1px solid #1F1F1F', background: '#050505' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '80px',
          alignItems: 'center',
        }}
      >
        {/* Left: mockup */}
        <div>
          <div style={{ border: '1px solid #1F1F1F', background: '#111111' }}>
            {/* Problem header */}
            <div style={{ padding: '16px', borderBottom: '1px solid #1F1F1F', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ background: '#1F1F1F', color: '#888888', fontSize: '11px', fontWeight: 600, padding: '4px 10px', letterSpacing: '0.06em' }}>
                  MEDIUM
                </span>
                <span style={{ background: '#0D1A12', border: '1px solid #1F2E1A', color: '#4ADE80', fontSize: '11px', fontWeight: 600, padding: '4px 10px', letterSpacing: '0.06em' }}>
                  ORBITAL MECHANICS
                </span>
              </div>
              <span style={{ color: '#888888', fontSize: '12px' }}>+25 XP</span>
            </div>
            {/* Problem text */}
            <div style={{ padding: '20px' }}>
              <p style={{ color: '#CCCCCC', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
                A satellite orbits Earth in a circular orbit at altitude h = 400 km. Given R_E = 6371 km
                and μ = 3.986×10⁵ km³/s², find the orbital velocity and period.
              </p>
              {/* Answer input mockup */}
              <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: '10px 14px', color: '#888888', fontSize: '13px', marginBottom: '12px' }}>
                v = _____ km/s, T = _____ min
              </div>
              {/* Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ border: '1px solid #1F1F1F', color: '#888888', padding: '8px 14px', fontSize: '13px', fontWeight: 500, flex: 1, textAlign: 'center' }}>
                  Show Hint
                </div>
                <div style={{ background: '#4ADE80', color: '#0A0A0A', padding: '8px 20px', fontSize: '13px', fontWeight: 700, flex: 1, textAlign: 'center' }}>
                  Submit
                </div>
              </div>
            </div>
            {/* XP bar */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid #1F1F1F', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: '#888888', fontSize: '12px' }}>Level 4</span>
              <div style={{ flex: 1, height: '3px', background: '#1F1F1F' }}>
                <div style={{ width: '62%', height: '100%', background: '#4ADE80' }} />
              </div>
              <span style={{ color: '#4ADE80', fontSize: '12px', fontWeight: 600 }}>62%</span>
            </div>
          </div>
        </div>

        {/* Right: copy */}
        <div>
          <div style={{ color: '#4ADE80', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px' }}>
            PRACTICE PROBLEMS
          </div>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: '#FFFFFF',
              marginBottom: '20px',
            }}
          >
            Earn XP.
            <br />
            Level up.
            <br />
            <span style={{ color: '#4ADE80' }}>Actually learn.</span>
          </h2>
          <p style={{ color: '#888888', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px', fontWeight: 300 }}>
            Generate practice problems at your exact difficulty level. Get Socratic hints, earn XP per
            correct answer, and track your mastery over time.
          </p>
          <Link
            href="/practice"
            style={{
              color: '#4ADE80',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '-0.01em',
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = '#4ADE80'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'; }}
          >
            Start Practicing <ChevronRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>
      </div>
    </Section>
  );
}

/* ─── Formula Hub full-width section ─── */
function FormulaHubSection() {
  const formulas = [
    { topic: 'Propulsion', name: 'Rocket Thrust', formula: 'F = Isp · ṁ · g₀', color: '#4ADE80' },
    { topic: 'Propulsion', name: 'Tsiolkovsky', formula: 'Δv = Isp·g₀·ln(m₀/mf)', color: '#4ADE80' },
    { topic: 'Orbital Mechanics', name: 'Orbital Velocity', formula: 'v = √(μ/r)', color: '#60A5FA' },
    { topic: 'Orbital Mechanics', name: 'Hohmann Transfer', formula: 'Δv = √(μ/r₁)(√(2r₂/(r₁+r₂)) − 1)', color: '#60A5FA' },
    { topic: 'Aerodynamics', name: 'Lift Equation', formula: 'L = ½·ρ·v²·S·C_L', color: '#F59E0B' },
    { topic: 'Aerodynamics', name: 'Drag Equation', formula: 'D = ½·ρ·v²·S·C_D', color: '#F59E0B' },
    { topic: 'Gas Dynamics', name: 'Isentropic Flow', formula: 'T₂/T₁ = (1 + (γ-1)/2·M₁²)⁻¹', color: '#A78BFA' },
    { topic: 'Structures', name: 'Euler Buckling', formula: 'P_cr = π²·E·I / (K·L)²', color: '#FB923C' },
    { topic: 'Thermodynamics', name: 'Brayton Cycle', formula: 'η = 1 − T₁/T₂ = 1 − r_p^((1-γ)/γ)', color: '#34D399' },
  ];

  return (
    <Section id="formula-hub" style={{ borderBottom: '1px solid #1F1F1F' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ color: '#4ADE80', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px' }}>
          FORMULA HUB
        </div>
        <h2
          style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: '#FFFFFF',
            marginBottom: '16px',
          }}
        >
          Every formula. Instantly searchable.
        </h2>
        <p style={{ color: '#888888', fontSize: '17px', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto', fontWeight: 300 }}>
          A searchable reference of aerospace engineering formulas — rendered in LaTeX and organized by topic.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1px',
          background: '#1F1F1F',
          border: '1px solid #1F1F1F',
        }}
      >
        {formulas.map((f, i) => (
          <div
            key={i}
            className="card-hover"
            style={{
              background: '#111111',
              padding: '24px',
              position: 'relative',
              cursor: 'default',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: f.color,
                  opacity: 0.8,
                }}
              >
                {f.topic.toUpperCase()}
              </span>
            </div>
            <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px', marginBottom: '10px', letterSpacing: '-0.01em' }}>
              {f.name}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-geist-mono), monospace',
                fontSize: '13px',
                color: f.color,
                background: '#0A0A0A',
                border: `1px solid ${f.color}22`,
                padding: '10px 12px',
                wordBreak: 'break-all',
              }}
            >
              {f.formula}
            </div>
          </div>
        ))}
        {/* CTA card */}
        <Link
          href="/formulas"
          style={{
            background: '#0A0A0A',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            gap: '8px',
            border: '1px solid transparent',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#4ADE80'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
        >
          <div style={{ color: '#4ADE80', fontSize: '28px', fontWeight: 800 }}>+</div>
          <span style={{ color: '#888888', fontSize: '13px', fontWeight: 500 }}>Open Formula Hub</span>
        </Link>
      </div>
    </Section>
  );
}

/* ─── AI Tutor section ─── */
function TutorSection() {
  return (
    <Section style={{ borderBottom: '1px solid #1F1F1F', background: '#050505' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '80px',
          alignItems: 'center',
        }}
      >
        {/* Left: copy */}
        <div>
          <div style={{ color: '#4ADE80', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px' }}>
            AI TUTOR
          </div>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: '#FFFFFF',
              marginBottom: '20px',
            }}
          >
            It doesn't
            <br />
            give answers.
            <br />
            <span style={{ color: '#4ADE80' }}>It teaches.</span>
          </h2>
          <p style={{ color: '#888888', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px', fontWeight: 300 }}>
            The Socratic AI Tutor guides you with questions, not answers. It understands your uploaded
            study materials and adapts to your level in real time.
          </p>
          <Link
            href="/tutor"
            style={{
              color: '#4ADE80',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              letterSpacing: '-0.01em',
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = '#4ADE80'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'; }}
          >
            Open AI Tutor <ChevronRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>

        {/* Right: chat mockup */}
        <div style={{ border: '1px solid #1F1F1F', background: '#111111' }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #1F1F1F', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', background: '#4ADE80' }} />
            <span style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 600 }}>Aerospace Study AI Tutor</span>
            <span style={{ color: '#888888', fontSize: '11px', marginLeft: 'auto' }}>Socratic method</span>
          </div>
          {/* Messages */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '240px' }}>
            {/* User message */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div
                style={{
                  background: '#4ADE80',
                  color: '#0A0A0A',
                  padding: '10px 14px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  maxWidth: '75%',
                  fontWeight: 500,
                }}
              >
                What is the Tsiolkovsky rocket equation?
              </div>
            </div>
            {/* AI response */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '24px', height: '24px', background: '#1A1A1A', border: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap style={{ width: '12px', height: '12px', color: '#4ADE80' }} />
              </div>
              <div
                style={{
                  background: '#0A0A0A',
                  border: '1px solid #1F1F1F',
                  padding: '10px 14px',
                  fontSize: '13px',
                  color: '#CCCCCC',
                  lineHeight: 1.6,
                  maxWidth: '85%',
                }}
              >
                Before I explain — what do you think the equation might relate to? Think about what
                limits how fast a rocket can go...
              </div>
            </div>
            {/* User follow-up */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div
                style={{
                  background: '#4ADE80',
                  color: '#0A0A0A',
                  padding: '10px 14px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  maxWidth: '75%',
                  fontWeight: 500,
                }}
              >
                The mass of propellant it carries?
              </div>
            </div>
            {/* AI typing indicator */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '24px', height: '24px', background: '#1A1A1A', border: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap style={{ width: '12px', height: '12px', color: '#4ADE80' }} />
              </div>
              <div style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', padding: '10px 14px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: '6px', height: '6px', background: '#4ADE80', opacity: 0.5 }} />
                ))}
              </div>
            </div>
          </div>
          {/* Input bar */}
          <div style={{ padding: '12px', borderTop: '1px solid #1F1F1F', display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, background: '#0A0A0A', border: '1px solid #1F1F1F', padding: '10px 14px', color: '#888888', fontSize: '13px' }}>
              Ask about any aerospace concept...
            </div>
            <div style={{ background: '#4ADE80', color: '#0A0A0A', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── XP & Gamification ─── */
function GamificationSection() {
  const { xp, level, streak, completedProblems } = useStore();

  return (
    <Section style={{ borderBottom: '1px solid #1F1F1F' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ color: '#4ADE80', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px' }}>
          GAMIFICATION
        </div>
        <h2
          style={{
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: '#FFFFFF',
            marginBottom: '16px',
          }}
        >
          Study like a game. Progress like a pro.
        </h2>
        <p style={{ color: '#888888', fontSize: '17px', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto', fontWeight: 300 }}>
          Earn XP for every problem solved, maintain daily streaks, and level up as you master each topic.
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1px',
          background: '#1F1F1F',
          border: '1px solid #1F1F1F',
          marginBottom: '40px',
        }}
      >
        {[
          { icon: Trophy, label: 'Current Level', value: `Level ${level}`, color: '#F59E0B' },
          { icon: Zap, label: 'Total XP Earned', value: `${xp} XP`, color: '#4ADE80' },
          { icon: Flame, label: 'Day Streak', value: `${streak} days`, color: '#F97316' },
          { icon: Target, label: 'Problems Solved', value: `${completedProblems}`, color: '#60A5FA' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{ background: '#111111', padding: '32px 24px' }}
            >
              <Icon style={{ width: '20px', height: '20px', color: stat.color, marginBottom: '16px' }} />
              <div style={{ color: '#FFFFFF', fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '8px' }}>
                {stat.value}
              </div>
              <div style={{ color: '#888888', fontSize: '13px', fontWeight: 500 }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* XP Bar */}
      <div style={{ border: '1px solid #1F1F1F', background: '#111111', padding: '24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ color: '#888888', fontSize: '11px', letterSpacing: '0.08em', marginBottom: '16px' }}>
            PROGRESS TO NEXT LEVEL
          </div>
          <XPBar />
        </div>
      </div>
    </Section>
  );
}

/* ─── Pomodoro section ─── */
function PomodoroSection() {
  return (
    <Section style={{ borderBottom: '1px solid #1F1F1F', background: '#050505' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '80px',
          alignItems: 'center',
        }}
      >
        {/* Left: copy */}
        <div>
          <div style={{ color: '#4ADE80', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '16px' }}>
            FOCUS TIMER
          </div>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: '#FFFFFF',
              marginBottom: '20px',
            }}
          >
            Deep work.
            <br />
            Built in.
          </h2>
          <p style={{ color: '#888888', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px', fontWeight: 300 }}>
            A Pomodoro timer is baked right into the platform. Stay in flow state for 25-minute focused
            sessions and earn bonus XP when you complete them.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['25 min focused work sessions', '5 min break intervals', '+15 XP per completed session', 'Session completion tracking'].map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', background: '#4ADE80', flexShrink: 0 }} />
                <span style={{ color: '#888888', fontSize: '14px' }}>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: actual Pomodoro timer */}
        <div style={{ border: '1px solid #1F1F1F', background: '#111111' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #1F1F1F' }}>
            <span style={{ color: '#888888', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em' }}>POMODORO FOCUS TIMER</span>
          </div>
          <PomodoroTimer />
        </div>
      </div>
    </Section>
  );
}

/* ─── CTA section ─── */
function CTASection() {
  return (
    <Section style={{ textAlign: 'center' }}>
      <div
        style={{
          position: 'relative',
          padding: '80px 40px',
          border: '1px solid #1F1F1F',
          background: '#111111',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(ellipse at center, rgba(74,222,128,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative' }}>
          <h2
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 800,
              letterSpacing: '-0.05em',
              lineHeight: 1.0,
              color: '#FFFFFF',
              marginBottom: '20px',
            }}
          >
            Ready to actually
            <br />
            <span style={{ color: '#4ADE80' }}>understand aerospace?</span>
          </h2>
          <p style={{ color: '#888888', fontSize: '18px', lineHeight: 1.6, marginBottom: '40px', fontWeight: 300 }}>
            Stop memorizing. Start understanding.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/solve"
              style={{
                background: '#4ADE80',
                color: '#0A0A0A',
                padding: '16px 36px',
                fontSize: '16px',
                fontWeight: 800,
                textDecoration: 'none',
                letterSpacing: '-0.02em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              Open Step Solver <ArrowRight style={{ width: '18px', height: '18px' }} />
            </Link>
            <Link
              href="/tutor"
              style={{
                background: 'transparent',
                color: '#FFFFFF',
                padding: '16px 36px',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
                letterSpacing: '-0.02em',
                border: '1px solid #2A2A2A',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#4ADE80'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#2A2A2A'; }}
            >
              Talk to AI Tutor
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #1F1F1F',
        background: '#0A0A0A',
        padding: '48px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '40px',
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '20px', height: '20px', background: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap style={{ width: '12px', height: '12px', color: '#0A0A0A' }} />
            </div>
            <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '15px', letterSpacing: '-0.04em' }}>AeroStudy</span>
          </div>
          <p style={{ color: '#888888', fontSize: '13px', lineHeight: 1.6, maxWidth: '260px' }}>
            AI-powered study tools for aerospace engineering students.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '16px' }}>TOOLS</div>
            {[
              { href: '/solve', label: 'Step Solver' },
              { href: '/practice', label: 'Practice' },
              { href: '/formulas', label: 'Formula Hub' },
              { href: '/tutor', label: 'AI Tutor' },
              { href: '/explain', label: 'Concept Explainer' },
              { href: '/check', label: 'Check My Work' },
            ].map((link) => (
              <div key={link.href} style={{ marginBottom: '10px' }}>
                <Link
                  href={link.href}
                  style={{ color: '#888888', fontSize: '14px', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#888888'; }}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '40px auto 0',
          paddingTop: '24px',
          borderTop: '1px solid #1F1F1F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <span style={{ color: '#888888', fontSize: '13px' }}>
          © {new Date().getFullYear()} AeroStudy. Built for engineers.
        </span>
        <span style={{ color: '#888888', fontSize: '13px' }}>
          Powered by Claude AI
        </span>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function Home() {
  return (
    <div style={{ background: '#0A0A0A' }}>
      <HeroSection />
      <StatsBar />
      <StepSolverSection />
      <PracticeSection />
      <FormulaHubSection />
      <TutorSection />
      <GamificationSection />
      <PomodoroSection />
      <CTASection />
      <Footer />
    </div>
  );
}
