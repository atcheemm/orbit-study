'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Layers,
  BookOpen,
  Target,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  LayoutDashboard,
  X,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { XPBar } from '@/components/ui/XPBar';
import { PomodoroTimer } from '@/components/features/PomodoroTimer';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/solve', label: 'Step Solver', icon: Layers },
  { href: '/practice', label: 'Practice', icon: Target },
  { href: '/formulas', label: 'Formula Hub', icon: BookOpen },
  { href: '/tutor', label: 'AI Tutor', icon: MessageSquare },
  { href: '/explain', label: 'Explain', icon: Lightbulb },
  { href: '/check', label: 'Check Work', icon: CheckCircle },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { xp, streak } = useStore();

  return (
    <div className="flex flex-col h-full w-[240px]" style={{ background: '#0A1628', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Brand */}
      <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ borderLeft: '3px solid #1565C0', paddingLeft: '10px' }}>
          <span style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>
            Aerospace Study
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden transition-colors" style={{ color: '#64748B' }}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 transition-colors duration-150 relative',
              )}
              style={{
                padding: '10px 16px',
                backgroundColor: isActive ? 'rgba(21,101,192,0.2)' : 'transparent',
                borderLeft: isActive ? '3px solid #1565C0' : '3px solid transparent',
                color: isActive ? '#FFFFFF' : '#94A3B8',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLElement).style.color = '#E2E8F0';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#94A3B8';
                }
              }}
            >
              <Icon
                className="w-4 h-4 shrink-0"
                style={{ color: isActive ? '#FFFFFF' : '#64748B' }}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {/* XP and streak */}
        <div className="flex items-center justify-between text-xs" style={{ color: '#64748B' }}>
          <span>XP: {xp}</span>
          <span>Streak: {streak} days</span>
        </div>

        {/* XP Bar */}
        <div>
          <XPBar compact />
        </div>

        {/* Mini Pomodoro */}
        <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs uppercase tracking-widest mb-2 font-medium" style={{ color: '#64748B' }}>Focus Timer</p>
          <PomodoroTimer mini />
        </div>
      </div>
    </div>
  );
}
