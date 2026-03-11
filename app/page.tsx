'use client';

import Link from 'next/link';
import {
  Footprints,
  FlaskConical,
  BookOpen,
  MessageCircle,
  Lightbulb,
  CheckSquare,
  Upload,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { XPBar } from '@/components/ui/XPBar';
import { PomodoroTimer } from '@/components/features/PomodoroTimer';
import { FileUploader } from '@/components/features/FileUploader';
import { useState } from 'react';

const features = [
  {
    href: '/solve',
    label: 'Step Solver',
    description: 'Break any problem into numbered steps with LaTeX math',
    icon: Footprints,
  },
  {
    href: '/practice',
    label: 'Practice Problems',
    description: 'Generate practice problems with XP rewards',
    icon: FlaskConical,
  },
  {
    href: '/formulas',
    label: 'Formula Hub',
    description: 'Searchable formula reference with LaTeX rendering',
    icon: BookOpen,
  },
  {
    href: '/tutor',
    label: 'AI Tutor',
    description: 'Socratic tutoring that guides you to the answer',
    icon: MessageCircle,
  },
  {
    href: '/explain',
    label: 'Concept Explainer',
    description: 'Bite-sized explanations optimized for focus',
    icon: Lightbulb,
  },
  {
    href: '/check',
    label: 'Check My Work',
    description: 'Get detailed feedback on your problem-solving attempts',
    icon: CheckSquare,
  },
];

export default function Home() {
  const { xp, level, streak, completedProblems, uploadedFiles } = useStore();
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Hero */}
      <div className="pt-10 pb-4 border-b border-[#E0E0DA]">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1A1A1A] mb-3">OrbitStudy</h1>
        <p className="text-[#6B6B6B] text-base max-w-xl">
          AI-powered aerospace engineering study tool designed for focused learning.
          Solve problems step-by-step, earn XP, and master the fundamentals.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#E0E0DA]">
        {[
          { label: 'Level', value: level },
          { label: 'Total XP', value: `${xp} XP` },
          { label: 'Streak', value: `${streak} days` },
          { label: 'Solved', value: completedProblems },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-5"
          >
            <div className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</div>
            <div className="text-xs text-[#6B6B6B] uppercase tracking-widest mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* XP Bar */}
      <div className="bg-white border border-[#E0E0DA] p-5">
        <XPBar />
      </div>

      {/* Feature cards */}
      <div>
        <h2 className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-5">
          Study Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E0E0DA]">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="block bg-white p-6 hover:bg-[#F4F4F0] transition-colors duration-150 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 border border-[#E0E0DA] flex items-center justify-center shrink-0 bg-[#F4F4F0] group-hover:border-[#2D4A3E] transition-colors">
                  <feature.icon className="w-4 h-4 text-[#2D4A3E]" />
                </div>
                <div>
                  <h3 className="font-700 text-[#1A1A1A] mb-1 font-semibold group-hover:text-[#2D4A3E] transition-colors">
                    {feature.label}
                  </h3>
                  <p className="text-sm text-[#6B6B6B] leading-snug">{feature.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom row: Pomodoro + File upload */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pomodoro */}
        <div className="bg-white border border-[#E0E0DA] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E0E0DA]">
            <h2 className="font-semibold text-[#1A1A1A] text-sm">Pomodoro Focus Timer</h2>
            <p className="text-xs text-[#6B6B6B]">25 min work / 5 min break</p>
          </div>
          <PomodoroTimer />
        </div>

        {/* File upload */}
        <div className="bg-white border border-[#E0E0DA] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#E0E0DA] flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#1A1A1A] text-sm flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-[#2D4A3E]" />
                Study Materials
              </h2>
              <p className="text-xs text-[#6B6B6B]">Upload PDFs to use as context</p>
            </div>
            {uploadedFiles.length > 0 && (
              <span className="text-xs text-[#6B6B6B] font-medium">
                {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} loaded
              </span>
            )}
          </div>
          <div className="p-5">
            <FileUploader />
          </div>
        </div>
      </div>
    </div>
  );
}
