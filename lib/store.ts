'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UploadedFile = {
  id: string;
  name: string;
  text: string;
  type: string;
  uploadedAt: number;
};

export type FormulaEntry = {
  id: string;
  topic: string;
  name: string;
  latex: string;
  variables: string;
  sourceFile?: string;
};

export type FormulaHub = {
  topic: string;
  formulas: FormulaEntry[];
};

export type PomodoroState = {
  isRunning: boolean;
  isBreak: boolean;
  timeLeft: number; // seconds
  workDuration: number; // seconds (default 25*60)
  breakDuration: number; // seconds (default 5*60)
  sessionsCompleted: number;
};

export type StudyStore = {
  // Files
  uploadedFiles: UploadedFile[];
  addFile: (file: UploadedFile) => void;
  removeFile: (id: string) => void;

  // XP & Gamification
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string | null;
  completedProblems: number;
  addXP: (amount: number) => void;
  checkAndUpdateStreak: () => void;

  // Formula Hub
  formulaHub: FormulaHub[];
  addFormulas: (topic: string, formulas: FormulaEntry[]) => void;
  clearFormulas: () => void;

  // Pomodoro
  pomodoro: PomodoroState;
  setPomodoroRunning: (running: boolean) => void;
  setPomodoroBreak: (isBreak: boolean) => void;
  setPomodoroTime: (timeLeft: number) => void;
  completePomodoroSession: () => void;
  resetPomodoro: () => void;
};

const XP_PER_LEVEL = 100;

function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

const defaultPomodoro: PomodoroState = {
  isRunning: false,
  isBreak: false,
  timeLeft: 25 * 60,
  workDuration: 25 * 60,
  breakDuration: 5 * 60,
  sessionsCompleted: 0,
};

export const useStore = create<StudyStore>()(
  persist(
    (set, get) => ({
      uploadedFiles: [],
      addFile: (file) =>
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, file],
        })),
      removeFile: (id) =>
        set((state) => ({
          uploadedFiles: state.uploadedFiles.filter((f) => f.id !== id),
        })),

      xp: 0,
      level: 1,
      streak: 0,
      lastStudyDate: null,
      completedProblems: 0,
      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = calculateLevel(newXP);
          return {
            xp: newXP,
            level: newLevel,
            completedProblems: state.completedProblems + (amount >= 10 ? 1 : 0),
          };
        }),
      checkAndUpdateStreak: () =>
        set((state) => {
          const today = new Date().toDateString();
          const last = state.lastStudyDate;

          if (last === today) return state; // already updated today

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();

          const newStreak = last === yesterdayStr ? state.streak + 1 : 1;

          return {
            streak: newStreak,
            lastStudyDate: today,
          };
        }),

      formulaHub: [],
      addFormulas: (topic, formulas) =>
        set((state) => {
          const existing = state.formulaHub.find((h) => h.topic === topic);
          if (existing) {
            return {
              formulaHub: state.formulaHub.map((h) =>
                h.topic === topic
                  ? { ...h, formulas: [...h.formulas, ...formulas] }
                  : h
              ),
            };
          }
          return {
            formulaHub: [...state.formulaHub, { topic, formulas }],
          };
        }),
      clearFormulas: () => set({ formulaHub: [] }),

      pomodoro: defaultPomodoro,
      setPomodoroRunning: (running) =>
        set((state) => ({
          pomodoro: { ...state.pomodoro, isRunning: running },
        })),
      setPomodoroBreak: (isBreak) =>
        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            isBreak,
            timeLeft: isBreak ? state.pomodoro.breakDuration : state.pomodoro.workDuration,
            isRunning: true,
          },
        })),
      setPomodoroTime: (timeLeft) =>
        set((state) => ({
          pomodoro: { ...state.pomodoro, timeLeft },
        })),
      completePomodoroSession: () =>
        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            sessionsCompleted: state.pomodoro.sessionsCompleted + 1,
          },
          xp: state.xp + 15,
        })),
      resetPomodoro: () =>
        set((state) => ({
          pomodoro: {
            ...defaultPomodoro,
            sessionsCompleted: state.pomodoro.sessionsCompleted,
          },
        })),
    }),
    {
      name: 'orbitstudy-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        lastStudyDate: state.lastStudyDate,
        completedProblems: state.completedProblems,
        formulaHub: state.formulaHub,
        uploadedFiles: state.uploadedFiles,
        pomodoro: {
          ...state.pomodoro,
          isRunning: false, // don't persist running state
        },
      }),
    }
  )
);
