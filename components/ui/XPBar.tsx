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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#888888', fontSize: '12px' }}>{xp} XP</span>
        <div style={{ flex: 1, height: '3px', background: '#1F1F1F', overflow: 'hidden', minWidth: '60px' }}>
          <div
            style={{ width: `${progress}%`, height: '100%', background: '#4ADE80', transition: 'width 0.5s ease' }}
          />
        </div>
        <span style={{ color: '#4ADE80', fontSize: '12px', fontWeight: 700 }}>Lv.{level}</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.02em' }}>Level {level}</span>
        <span style={{ color: '#888888', fontSize: '13px' }}>{xp} XP</span>
      </div>
      <div style={{ height: '4px', background: '#1F1F1F', overflow: 'hidden' }}>
        <div
          style={{ width: `${progress}%`, height: '100%', background: '#4ADE80', transition: 'width 0.7s ease' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888888' }}>
        <span>{current} / {needed} XP to next level</span>
        <span style={{ color: '#4ADE80', fontWeight: 600 }}>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
