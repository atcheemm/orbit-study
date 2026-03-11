'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/solve', label: 'Step Solver' },
  { href: '/practice', label: 'Practice' },
  { href: '/formulas', label: 'Formula Hub' },
  { href: '/tutor', label: 'AI Tutor' },
];

export function Navbar() {
  const pathname = usePathname();
  const { xp, level, streak } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        style={{
          background: 'rgba(10, 10, 10, 0.95)',
          borderBottom: '1px solid #1F1F1F',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: '60px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                background: '#4ADE80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap style={{ width: '14px', height: '14px', color: '#0A0A0A' }} />
            </div>
            <span
              style={{
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '16px',
                letterSpacing: '-0.04em',
              }}
            >
              AeroStudy
            </span>
          </Link>

          {/* Center nav — desktop */}
          <nav
            className="hidden md:flex"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '4px',
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: isActive ? '#FFFFFF' : '#888888',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    padding: '6px 14px',
                    transition: 'color 0.15s',
                    borderBottom: isActive ? '1px solid #4ADE80' : '1px solid transparent',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#888888';
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginLeft: 'auto',
            }}
          >
            <span
              className="hidden md:flex"
              style={{
                color: '#888888',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <span style={{ color: '#4ADE80' }}>Lv.{level}</span>
              <span>·</span>
              <span>{xp} XP</span>
              <span>·</span>
              <span>{streak}d streak</span>
            </span>

            <Link
              href="/solve"
              style={{
                background: '#4ADE80',
                color: '#0A0A0A',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '-0.02em',
                display: 'block',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '0.85';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '1';
              }}
            >
              Start Studying
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                color: '#888888',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {mobileOpen ? (
                <X style={{ width: '20px', height: '20px' }} />
              ) : (
                <Menu style={{ width: '20px', height: '20px' }} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            background: '#0A0A0A',
            borderBottom: '1px solid #1F1F1F',
            zIndex: 99,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                color: pathname === link.href ? '#FFFFFF' : '#888888',
                fontSize: '15px',
                fontWeight: 500,
                padding: '16px 24px',
                textDecoration: 'none',
                borderBottom: '1px solid #1F1F1F',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #1F1F1F' }}>
            <span style={{ color: '#888888', fontSize: '13px' }}>
              Level {level} · {xp} XP · {streak} day streak
            </span>
          </div>
        </div>
      )}
    </>
  );
}
