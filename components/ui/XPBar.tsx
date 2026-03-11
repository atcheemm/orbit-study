'use client';

import { useStore } from '@/lib/store';
import { getXPForNextLevel } from '@/lib/utils';

interface XPBarProps {
  compact?: boolean;
}

export function XPBar({ compact = false }: XPBarProps) {
  const { xp, level } = useStore();
  const { current, needed, progress } = getXPForNextLevel(xp);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#6B6B6B]">{xp} XP</span>
        <div className="flex-1 h-[4px] bg-[#E0E0DA] overflow-hidden min-w-[60px]">
          <div
            className="h-full bg-[#2D4A3E] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-[#6B6B6B]">Lv.{level}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-[#1A1A1A]">Level {level}</span>
        <span className="text-[#6B6B6B] text-xs">{xp} XP</span>
      </div>
      <div className="h-[4px] bg-[#E0E0DA] overflow-hidden">
        <div
          className="h-full bg-[#2D4A3E] transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-[#6B6B6B]">
        <span>{current} / {needed} XP to next level</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
