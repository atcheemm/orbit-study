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
        <span className="text-xs text-[#6B6B5A]">{xp} XP</span>
        <div className="flex-1 h-[4px] bg-[#D0CEC6] overflow-hidden min-w-[60px]">
          <div
            className="h-full bg-[#2D5A3D] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-[#6B6B5A]">Lv.{level}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-[#1C3A2A]">Level {level}</span>
        <span className="text-[#6B6B5A] text-xs">{xp} XP</span>
      </div>
      <div className="h-[4px] bg-[#D0CEC6] overflow-hidden">
        <div
          className="h-full bg-[#2D5A3D] transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-[#6B6B5A]">
        <span>{current} / {needed} XP to next level</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
