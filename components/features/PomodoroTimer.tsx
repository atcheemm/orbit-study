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
        {/* Minimal inline progress ring */}
        <div className="relative w-8 h-8">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#FF6D00"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
        </div>
        <div>
          <div className="text-xs font-mono font-bold" style={{ color: '#E2E8F0' }}>
            {formatTime(pomodoro.timeLeft)}
          </div>
          <div className="text-xs" style={{ color: '#64748B' }}>
            {pomodoro.isBreak ? 'Break' : 'Focus'}
          </div>
        </div>
        <button
          onClick={() => setPomodoroRunning(!pomodoro.isRunning)}
          className="w-6 h-6 flex items-center justify-center transition-colors"
          style={{ background: '#1565C0' }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#0D47A1')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#1565C0')}
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
      <div className="text-xs font-medium uppercase tracking-widest" style={{ color: '#546E7A' }}>
        {pomodoro.isBreak ? 'Break Time' : 'Focus Mode'}
      </div>

      {/* Timer ring */}
      <div className="relative w-48 h-48">
        <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#B0BEC5" strokeWidth="4" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#FF6D00"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-mono font-bold" style={{ color: '#0A1628' }}>
            {formatTime(pomodoro.timeLeft)}
          </span>
          <span className="text-xs mt-1" style={{ color: '#546E7A' }}>
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
          style={{ borderColor: '#B0BEC5', color: '#546E7A' }}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          size="lg"
          onClick={() => setPomodoroRunning(!pomodoro.isRunning)}
          className="w-24 font-bold"
          style={{ background: '#1565C0', color: '#FFFFFF' }}
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
          className="text-xs"
          style={{ borderColor: '#B0BEC5', color: '#546E7A' }}
        >
          {pomodoro.isBreak ? 'Work' : 'Break'}
        </Button>
      </div>

      {/* Session dots */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 transition-colors"
            style={{
              background: i < pomodoro.sessionsCompleted % 4 ? '#FF6D00' : '#B0BEC5',
            }}
          />
        ))}
        <span className="text-xs ml-1" style={{ color: '#546E7A' }}>
          {pomodoro.sessionsCompleted} completed
        </span>
      </div>
    </div>
  );
}
