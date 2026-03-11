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
    <div className="flex flex-col h-full bg-[#0d0d1a] border-r border-purple-900/30 w-64">
      {/* Logo */}
      <div className="p-5 border-b border-purple-900/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center orbit-glow">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-none">OrbitStudy</h1>
            <p className="text-xs text-gray-500 leading-none mt-0.5">Aerospace AI</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden">
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
                  ? 'bg-purple-600/20 text-white border border-purple-600/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-purple-600/10 rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 relative',
                  isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-purple-400'
                )}
              />
              <span className="text-sm font-medium relative">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 relative" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 space-y-4 border-t border-purple-900/30">
        {/* Streak */}
        <div className="flex items-center gap-2 px-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-gray-300">
            <span className="font-bold text-orange-400">{streak}</span> day streak
          </span>
        </div>

        {/* XP Bar */}
        <div className="px-2">
          <XPBar />
        </div>

        {/* Mini Pomodoro */}
        <div className="px-2 py-3 bg-gray-800/50 rounded-lg border border-gray-700/40">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Focus Timer</p>
          <PomodoroTimer mini />
        </div>
      </div>
    </div>
  );
}
