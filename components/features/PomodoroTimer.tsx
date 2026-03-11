'use client';

import { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
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
        {/* Minimal inline progress bar */}
        <div className="relative w-8 h-8">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#E0E0DA" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#2D4A3E"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
        </div>
        <div>
          <div className="text-xs font-mono font-bold text-[#1A1A1A]">
            {formatTime(pomodoro.timeLeft)}
          </div>
          <div className="text-xs text-[#6B6B6B]">
            {pomodoro.isBreak ? 'Break' : 'Focus'}
          </div>
        </div>
        <button
          onClick={() => setPomodoroRunning(!pomodoro.isRunning)}
          className="w-6 h-6 bg-[#2D4A3E] hover:bg-[#1e332a] flex items-center justify-center transition-colors"
        >
          {pomodoro.isRunning ? (
            <Pause className="w-2.5 h-2.5 text-white" />
          ) : (
            <Play className="w-2.5 h-2.5 text-white ml-0.5" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      {/* Mode indicator */}
      <div className="text-xs font-medium text-[#6B6B6B] uppercase tracking-widest">
        {pomodoro.isBreak ? 'Break Time' : 'Focus Mode'}
      </div>

      {/* Timer ring — stroke only, no fill effects */}
      <div className="relative w-48 h-48">
        <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#E0E0DA" strokeWidth="4" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#2D4A3E"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-mono font-bold text-[#1A1A1A]">
            {formatTime(pomodoro.timeLeft)}
          </span>
          <span className="text-xs text-[#6B6B6B] mt-1">
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
          className="border-[#E0E0DA] text-[#6B6B6B] hover:text-[#1A1A1A] hover:border-[#2D4A3E]"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          size="lg"
          onClick={() => setPomodoroRunning(!pomodoro.isRunning)}
          className="w-24 bg-[#2D4A3E] hover:bg-[#1e332a] text-white font-bold"
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
          className="border-[#E0E0DA] text-[#6B6B6B] hover:text-[#1A1A1A] hover:border-[#2D4A3E] text-xs"
        >
          {pomodoro.isBreak ? 'Work' : 'Break'}
        </Button>
      </div>

      {/* Session dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 transition-colors ${
              i < pomodoro.sessionsCompleted % 4
                ? 'bg-[#2D4A3E]'
                : 'bg-[#E0E0DA]'
            }`}
          />
        ))}
        <span className="text-xs text-[#6B6B6B] ml-1">
          {pomodoro.sessionsCompleted} completed
        </span>
      </div>
    </div>
  );
}
