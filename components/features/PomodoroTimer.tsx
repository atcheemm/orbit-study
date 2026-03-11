'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PomodoroTimerProps {
  mini?: boolean;
}

export function PomodoroTimer({ mini = false }: PomodoroTimerProps) {
  const {
    pomodoro,
    setPomodoroRunning,
    setPomodoroTime,
    setPomodoroBreak,
    completePomodoroSession,
    resetPomodoro,
  } = useStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (pomodoro.isRunning) {
      intervalRef.current = setInterval(() => {
        const current = useStore.getState().pomodoro;
        if (current.timeLeft <= 1) {
          // Session complete
          if (!current.isBreak) {
            completePomodoroSession();
            setPomodoroBreak(true);
          } else {
            setPomodoroBreak(false);
            setPomodoroRunning(false);
          }
        } else {
          setPomodoroTime(current.timeLeft - 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pomodoro.isRunning]);

  const totalDuration = pomodoro.isBreak
    ? pomodoro.breakDuration
    : pomodoro.workDuration;
  const progress = 1 - pomodoro.timeLeft / totalDuration;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

  if (mini) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#2e2924" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={pomodoro.isBreak ? '#E07A5F' : '#81B29A'}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            {pomodoro.isBreak ? (
              <Coffee className="w-3 h-3 text-[#E07A5F]" />
            ) : (
              <Brain className="w-3 h-3 text-[#81B29A]" />
            )}
          </div>
        </div>
        <div>
          <div className="text-xs font-mono font-bold text-[#FFF5F5]">
            {formatTime(pomodoro.timeLeft)}
          </div>
          <div className="text-xs text-[rgba(255,245,245,0.5)]">
            {pomodoro.isBreak ? 'Break' : 'Focus'}
          </div>
        </div>
        <button
          onClick={() => setPomodoroRunning(!pomodoro.isRunning)}
          className="w-6 h-6 rounded-full bg-[#81B29A] hover:bg-[#81B29A]/80 flex items-center justify-center transition-colors"
        >
          {pomodoro.isRunning ? (
            <Pause className="w-2.5 h-2.5 text-[#27231E]" />
          ) : (
            <Play className="w-2.5 h-2.5 text-[#27231E] ml-0.5" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      {/* Mode indicator */}
      <div className="flex items-center gap-2">
        {pomodoro.isBreak ? (
          <>
            <Coffee className="w-5 h-5 text-[#E07A5F]" />
            <span className="text-[#E07A5F] font-semibold">Break Time</span>
          </>
        ) : (
          <>
            <Brain className="w-5 h-5 text-[#81B29A]" />
            <span className="text-[#81B29A] font-semibold">Focus Mode</span>
          </>
        )}
      </div>

      {/* Timer ring */}
      <div className="relative w-48 h-48">
        <svg className="w-48 h-48 -rotate-90 pomodoro-ring" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#2e2924" strokeWidth="6" />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={pomodoro.isBreak ? '#E07A5F' : '#81B29A'}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-mono font-bold text-[#FFF5F5]">
            {formatTime(pomodoro.timeLeft)}
          </span>
          <span className="text-sm text-[rgba(255,245,245,0.5)] mt-1">
            Session {pomodoro.sessionsCompleted + 1}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={resetPomodoro}
          className="border-[#3A5253] text-[rgba(255,245,245,0.5)] hover:text-[#FFF5F5]"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          size="lg"
          onClick={() => setPomodoroRunning(!pomodoro.isRunning)}
          className="w-24 bg-[#81B29A] hover:bg-[#81B29A]/80 text-[#27231E] font-bold"
        >
          {pomodoro.isRunning ? (
            <><Pause className="w-4 h-4 mr-2" />Pause</>
          ) : (
            <><Play className="w-4 h-4 mr-2 ml-0.5" />Start</>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPomodoroBreak(!pomodoro.isBreak)}
          className="border-[#3A5253] text-[rgba(255,245,245,0.5)] hover:text-[#FFF5F5] text-xs"
        >
          {pomodoro.isBreak ? 'Work' : 'Break'}
        </Button>
      </div>

      {/* Session count */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < pomodoro.sessionsCompleted % 4
                ? 'bg-[#E07A5F]'
                : 'bg-[#3A5253]'
            }`}
          />
        ))}
        <span className="text-xs text-[rgba(255,245,245,0.4)] ml-1">
          {pomodoro.sessionsCompleted} completed
        </span>
      </div>
    </div>
  );
}
