'use client';

import Link from 'next/link';
import {
  Layers,
  Target,
  BookOpen,
  MessageSquare,
  Lightbulb,
  CheckCircle,
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
    description: 'Break any problem into numbered steps with LaTeX math rendering.',
    icon: Layers,
  },
  {
    href: '/practice',
    label: 'Practice Problems',
    description: 'Generate practice problems at your difficulty level and earn XP.',
    icon: Target,
  },
  {
    href: '/formulas',
    label: 'Formula Hub',
    description: 'Searchable formula reference with LaTeX rendering.',
    icon: BookOpen,
  },
  {
    href: '/tutor',
    label: 'AI Tutor',
    description: 'Socratic tutoring that guides you to discover answers.',
    icon: MessageSquare,
  },
  {
    href: '/explain',
    label: 'Concept Explainer',
    description: 'Bite-sized explanations optimized for focus and retention.',
    icon: Lightbulb,
  },
  {
    href: '/check',
    label: 'Check My Work',
    description: 'Detailed feedback on your problem-solving attempts.',
    icon: CheckCircle,
  },
];

export default function Home() {
  const { xp, level, streak, completedProblems, uploadedFiles } = useStore();
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      {/* Page header */}
      <div className="pt-6 pb-6" style={{ borderBottom: '1px solid #B0BEC5' }}>
        <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ color: '#0A1628' }}>
          Aerospace Study
        </h1>
        <p style={{ color: '#546E7A', fontSize: '16px' }}>
          AI-powered tools for aerospace engineering
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: '#B0BEC5' }}>
        {[
          { label: 'Level', value: level },
          { label: 'Total XP', value: `${xp} XP` },
          { label: 'Streak', value: `${streak} days` },
          { label: 'Solved', value: completedProblems },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{ background: '#FFFFFF', padding: '20px' }}
          >
            <div className="text-2xl font-bold" style={{ color: '#0A1628' }}>{stat.value}</div>
            <div className="text-xs uppercase tracking-widest mt-1 font-medium" style={{ color: '#546E7A' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* XP Bar */}
      <div style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <XPBar />
      </div>

      {/* Feature cards */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#546E7A' }}>
          Study Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="block group transition-colors duration-150"
              style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#E3F2FD';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#FFFFFF';
              }}
            >
              <div className="flex items-start gap-4 p-6">
                <div
                  className="w-9 h-9 flex items-center justify-center shrink-0"
                  style={{ background: '#E3F2FD', border: '1px solid #B0BEC5' }}
                >
                  <feature.icon className="w-4 h-4" style={{ color: '#1565C0' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#0A1628' }}>
                    {feature.label}
                  </h3>
                  <p className="text-sm leading-snug" style={{ color: '#546E7A' }}>{feature.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom row: Pomodoro + File upload */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pomodoro */}
        <div style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div className="px-5 py-3" style={{ borderBottom: '1px solid #B0BEC5' }}>
            <h2 className="font-semibold text-sm" style={{ color: '#0A1628' }}>Pomodoro Focus Timer</h2>
            <p className="text-xs" style={{ color: '#546E7A' }}>25 min work / 5 min break</p>
          </div>
          <PomodoroTimer />
        </div>

        {/* File upload */}
        <div style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #B0BEC5' }}>
            <div>
              <h2 className="font-semibold text-sm flex items-center gap-2" style={{ color: '#0A1628' }}>
                <Upload className="w-3.5 h-3.5" style={{ color: '#1565C0' }} />
                Study Materials
              </h2>
              <p className="text-xs" style={{ color: '#546E7A' }}>Upload PDFs to use as context</p>
            </div>
            {uploadedFiles.length > 0 && (
              <span className="text-xs font-medium" style={{ color: '#546E7A' }}>
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
