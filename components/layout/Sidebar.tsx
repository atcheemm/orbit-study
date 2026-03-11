'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Footprints,
  BookOpen,
  FlaskConical,
  MessageCircle,
  Lightbulb,
  CheckSquare,
  LayoutDashboard,
  X,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { XPBar } from '@/components/ui/XPBar';
import { PomodoroTimer } from '@/components/features/PomodoroTimer';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
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
  const { xp, streak } = useStore();

  return (
    <div className="flex flex-col h-full bg-[#F4F4F0] border-r border-[#E0E0DA] w-64">
      {/* Brand */}
      <div className="p-5 border-b border-[#E0E0DA] flex items-center justify-between">
        <Image src="/logo.png" alt="OrbitStudy" height={32} width={120} style={{ height: 32, width: 'auto', borderRadius: 0 }} priority />
        {onClose && (
          <button onClick={onClose} className="text-[#6B6B6B] hover:text-[#1A1A1A] lg:hidden transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 transition-colors duration-150 group relative',
                isActive
                  ? 'bg-white text-[#2D4A3E] border-l-2 border-[#2D4A3E]'
                  : 'text-[#1A1A1A] hover:bg-white hover:text-[#2D4A3E] border-l-2 border-transparent'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0',
                  isActive ? 'text-[#2D4A3E]' : 'text-[#6B6B6B] group-hover:text-[#2D4A3E]'
                )}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 space-y-4 border-t border-[#E0E0DA]">
        {/* XP and streak understated */}
        <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
          <span>XP: {xp}</span>
          <span>Streak: {streak} days</span>
        </div>

        {/* XP Bar */}
        <div>
          <XPBar compact />
        </div>

        {/* Mini Pomodoro */}
        <div className="pt-2 border-t border-[#E0E0DA]">
          <p className="text-xs text-[#6B6B6B] uppercase tracking-widest mb-2 font-medium">Focus Timer</p>
          <PomodoroTimer mini />
        </div>
      </div>
    </div>
  );
}
