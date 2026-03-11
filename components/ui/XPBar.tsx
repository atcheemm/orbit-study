'use client';

import { useStore } from '@/lib/store';
import { getXPForNextLevel } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Zap, Star } from 'lucide-react';

interface XPBarProps {
  compact?: boolean;
}

export function XPBar({ compact = false }: XPBarProps) {
  const { xp, level } = useStore();
  const { current, needed, progress } = getXPForNextLevel(xp);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-yellow-400" />
          <span className="text-xs font-bold text-yellow-400">{xp} XP</span>
        </div>
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden min-w-[60px]">
          <motion.div
            className="h-full xp-bar-fill rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs text-gray-400">Lv.{level}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold text-white">Level {level}</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-yellow-400 font-semibold">{xp} XP</span>
        </div>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full xp-bar-fill rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{current} / {needed} XP to next level</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
