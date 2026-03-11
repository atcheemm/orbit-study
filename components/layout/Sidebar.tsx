'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Rocket,
  Footprints,
  BookOpen,
  FlaskConical,
  MessageCircle,
  Lightbulb,
  CheckSquare,
  Flame,
  X,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { XPBar } from '@/components/ui/XPBar';
import { PomodoroTimer } from '@/components/features/PomodoroTimer';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Rocket },
  { href: '/solve', label: 'Step Solver', icon: Footprints },
  { href: '/practice', label: 'Practice', icon: FlaskConical },
  { href: '/formulas', label: 'Formula Hub', icon: BookOpen },
  { href: '/tutor', label: 'AI Tutor', icon: MessageCircle },
  { href: '/explain', label: 'Explain', icon: Lightbulb },
  { href: '/check', label: 'Check Work', icon: CheckSquare },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { streak } = useStore();

  return (
    <div className="flex flex-col h-full bg-[#3A5253] border-r border-[#3A5253]/60 w-64">
      {/* Logo */}
      <div className="p-5 border-b border-[#27231E]/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#81B29A] to-[#E07A5F] flex items-center justify-center orbit-glow">
            <Rocket className="w-5 h-5 text-[#27231E]" />
          </div>
          <div>
            <h1 className="font-bold text-[#FFF5F5] text-lg leading-none">OrbitStudy</h1>
            <p className="text-xs text-[rgba(255,245,245,0.5)] leading-none mt-0.5">Aerospace AI</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[rgba(255,245,245,0.5)] hover:text-[#FFF5F5] lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-[#81B29A]/20 text-[#FFF5F5] border border-[#81B29A]/40'
                  : 'text-[rgba(255,245,245,0.6)] hover:text-[#FFF5F5] hover:bg-[#27231E]/20'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[#81B29A]/10 rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 relative',
                  isActive ? 'text-[#81B29A]' : 'text-[rgba(255,245,245,0.4)] group-hover:text-[#81B29A]'
                )}
              />
              <span className="text-sm font-medium relative">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#81B29A] relative" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 space-y-4 border-t border-[#27231E]/40">
        {/* Streak */}
        <div className="flex items-center gap-2 px-2">
          <Flame className="w-4 h-4 text-[#E07A5F]" />
          <span className="text-sm text-[rgba(255,245,245,0.8)]">
            <span className="font-bold text-[#E07A5F]">{streak}</span> day streak
          </span>
        </div>

        {/* XP Bar */}
        <div className="px-2">
          <XPBar />
        </div>

        {/* Mini Pomodoro */}
        <div className="px-2 py-3 bg-[#27231E]/40 rounded-lg border border-[#27231E]/50">
          <p className="text-xs text-[rgba(255,245,245,0.4)] uppercase tracking-wide mb-2">Focus Timer</p>
          <PomodoroTimer mini />
        </div>
      </div>
    </div>
  );
}
