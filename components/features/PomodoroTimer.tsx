'use client';

import { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatTime } from '@/lib/utils';

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative', width: '32px', height: '32px' }}>
          <svg style={{ width: '32px', height: '32px', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1F1F1F" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#4ADE80"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-geist-mono, monospace)', fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
            {formatTime(pomodoro.timeLeft)}
          </div>
          <div style={{ fontSize: '11px', color: '#888888' }}>
            {pomodoro.isBreak ? 'Break' : 'Focus'}
          </div>
        </div>
        <button
          onClick={() => setPomodoroRunning(!pomodoro.isRunning)}
          style={{
            width: '26px',
            height: '26px',
            background: '#4ADE80',
            color: '#0A0A0A',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
        >
          {pomodoro.isRunning ? (
            <Pause style={{ width: '11px', height: '11px' }} />
          ) : (
            <Play style={{ width: '11px', height: '11px', marginLeft: '1px' }} />
          )}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', padding: '40px 32px' }}>
      {/* Mode indicator */}
      <div style={{ color: '#888888', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em' }}>
        {pomodoro.isBreak ? 'BREAK TIME' : 'FOCUS MODE'}
      </div>

      {/* Timer ring */}
      <div style={{ position: 'relative', width: '200px', height: '200px' }}>
        <svg style={{ width: '200px', height: '200px', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1F1F1F" strokeWidth="4" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#4ADE80"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-geist-mono, monospace)',
              fontSize: '40px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.04em',
            }}
          >
            {formatTime(pomodoro.timeLeft)}
          </span>
          <span style={{ color: '#888888', fontSize: '12px', marginTop: '4px' }}>
            Session {pomodoro.sessionsCompleted + 1}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={resetPomodoro}
          style={{
            width: '40px',
            height: '40px',
            border: '1px solid #1F1F1F',
            background: 'transparent',
            color: '#888888',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#4ADE80'; (e.currentTarget as HTMLElement).style.color = '#4ADE80'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1F1F1F'; (e.currentTarget as HTMLElement).style.color = '#888888'; }}
        >
          <RotateCcw style={{ width: '16px', height: '16px' }} />
        </button>

        <button
          onClick={() => setPomodoroRunning(!pomodoro.isRunning)}
          style={{
            width: '100px',
            height: '44px',
            background: '#4ADE80',
            color: '#0A0A0A',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '14px',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
        >
          {pomodoro.isRunning ? (
            <><Pause style={{ width: '16px', height: '16px' }} />Pause</>
          ) : (
            <><Play style={{ width: '16px', height: '16px', marginLeft: '2px' }} />Start</>
          )}
        </button>

        <button
          onClick={() => setPomodoroBreak(!pomodoro.isBreak)}
          style={{
            width: '68px',
            height: '40px',
            border: '1px solid #1F1F1F',
            background: 'transparent',
            color: '#888888',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#4ADE80'; (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1F1F1F'; (e.currentTarget as HTMLElement).style.color = '#888888'; }}
        >
          {pomodoro.isBreak ? 'Work' : 'Break'}
        </button>
      </div>

      {/* Session dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              background: i < pomodoro.sessionsCompleted % 4 ? '#4ADE80' : '#1F1F1F',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
        <span style={{ color: '#888888', fontSize: '12px', marginLeft: '4px' }}>
          {pomodoro.sessionsCompleted} completed
        </span>
      </div>
    </div>
  );
}
