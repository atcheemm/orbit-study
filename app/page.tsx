'use client';

import Image from 'next/image';
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
      <div className="pt-10 pb-4 border-b border-[#D0CEC6] flex flex-col items-center text-center">
        <Image
          src="/logo.png"
          alt="Aerospace Study"
          height={180}
          width={540}
          style={{ height: 180, width: 'auto', mixBlendMode: 'multiply' }}
          priority
        />
        <h1 className="text-4xl font-extrabold tracking-tight text-[#1C3A2A] mb-3 mt-4">Aerospace Study</h1>
        <p className="text-[#6B6B5A] text-base max-w-xl">
          AI-powered aerospace engineering study tool designed for focused learning.
          Solve problems step-by-step, earn XP, and master the fundamentals.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#D0CEC6]">
        {[
          { label: 'Level', value: level },
          { label: 'Total XP', value: `${xp} XP` },
          { label: 'Streak', value: `${streak} days` },
          { label: 'Solved', value: completedProblems },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#ECEAE3] p-5"
          >
            <div className="text-2xl font-bold text-[#1C3A2A]">{stat.value}</div>
            <div className="text-xs text-[#6B6B5A] uppercase tracking-widest mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* XP Bar */}
      <div className="bg-[#ECEAE3] border border-[#D0CEC6] p-5">
        <XPBar />
      </div>

      {/* Feature cards */}
      <div>
        <h2 className="text-xs font-semibold text-[#6B6B5A] uppercase tracking-widest mb-5">
          Study Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#D0CEC6]">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="block bg-[#ECEAE3] p-6 hover:bg-[#E4E2DA] transition-colors duration-150 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 border border-[#D0CEC6] flex items-center justify-center shrink-0 bg-[#E4E2DA] group-hover:border-[#2D5A3D] transition-colors">
                  <feature.icon className="w-4 h-4 text-[#2D5A3D]" />
                </div>
                <div>
                  <h3 className="font-700 text-[#1C3A2A] mb-1 font-semibold group-hover:text-[#2D5A3D] transition-colors">
                    {feature.label}
                  </h3>
                  <p className="text-sm text-[#6B6B5A] leading-snug">{feature.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom row: Pomodoro + File upload */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pomodoro */}
        <div className="bg-[#ECEAE3] border border-[#D0CEC6] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#D0CEC6]">
            <h2 className="font-semibold text-[#1C3A2A] text-sm">Pomodoro Focus Timer</h2>
            <p className="text-xs text-[#6B6B5A]">25 min work / 5 min break</p>
          </div>
          <PomodoroTimer />
        </div>

        {/* File upload */}
        <div className="bg-[#ECEAE3] border border-[#D0CEC6] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#D0CEC6] flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#1C3A2A] text-sm flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-[#2D5A3D]" />
                Study Materials
              </h2>
              <p className="text-xs text-[#6B6B5A]">Upload PDFs to use as context</p>
            </div>
            {uploadedFiles.length > 0 && (
              <span className="text-xs text-[#6B6B5A] font-medium">
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
