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
        <span className="text-xs" style={{ color: '#64748B' }}>{xp} XP</span>
        <div className="flex-1 h-[4px] overflow-hidden min-w-[60px]" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: '#FF6D00' }}
          />
        </div>
        <span className="text-xs" style={{ color: '#64748B' }}>Lv.{level}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold" style={{ color: '#0A1628' }}>Level {level}</span>
        <span className="text-xs" style={{ color: '#546E7A' }}>{xp} XP</span>
      </div>
      <div className="h-[4px] overflow-hidden" style={{ background: '#B0BEC5' }}>
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${progress}%`, background: '#FF6D00' }}
        />
      </div>
      <div className="flex justify-between text-xs" style={{ color: '#546E7A' }}>
        <span>{current} / {needed} XP to next level</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
