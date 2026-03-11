'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Rocket,
  Footprints,
  FlaskConical,
  BookOpen,
  MessageCircle,
  Lightbulb,
  CheckSquare,
  Flame,
  Zap,
  Star,
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
    color: 'from-[#81B29A] to-[#3A5253]',
    border: 'border-[#81B29A]/40',
    iconColor: 'text-[#81B29A]',
  },
  {
    href: '/practice',
    label: 'Practice Problems',
    description: 'Generate practice problems with XP rewards',
    icon: FlaskConical,
    color: 'from-[#E07A5F] to-[#3A5253]',
    border: 'border-[#E07A5F]/40',
    iconColor: 'text-[#E07A5F]',
  },
  {
    href: '/formulas',
    label: 'Formula Hub',
    description: 'Searchable formula reference with LaTeX rendering',
    icon: BookOpen,
    color: 'from-[#81B29A] to-[#2e2924]',
    border: 'border-[#81B29A]/30',
    iconColor: 'text-[#81B29A]',
  },
  {
    href: '/tutor',
    label: 'AI Tutor',
    description: 'Socratic tutoring that guides you to the answer',
    icon: MessageCircle,
    color: 'from-[#3A5253] to-[#81B29A]',
    border: 'border-[#3A5253]/60',
    iconColor: 'text-[#81B29A]',
  },
  {
    href: '/explain',
    label: 'Concept Explainer',
    description: 'Bite-sized explanations optimized for focus',
    icon: Lightbulb,
    color: 'from-[#E07A5F] to-[#2e2924]',
    border: 'border-[#E07A5F]/30',
    iconColor: 'text-[#E07A5F]',
  },
  {
    href: '/check',
    label: 'Check My Work',
    description: 'Get detailed feedback on your problem-solving attempts',
    icon: CheckSquare,
    color: 'from-[#81B29A] to-[#3A5253]',
    border: 'border-[#81B29A]/40',
    iconColor: 'text-[#81B29A]',
  },
];

export default function Home() {
  const { xp, level, streak, completedProblems, uploadedFiles } = useStore();
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-10"
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#81B29A] to-[#E07A5F] flex items-center justify-center orbit-glow animate-float">
            <Rocket className="w-8 h-8 text-[#27231E]" />
          </div>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-3">OrbitStudy</h1>
        <p className="text-[rgba(255,245,245,0.6)] text-lg max-w-lg mx-auto">
          AI-powered aerospace engineering study tool designed for ADHD brains.
          Stay focused, earn XP, master the stars.
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { icon: Star, label: 'Level', value: level, color: 'text-[#81B29A]' },
          { icon: Zap, label: 'Total XP', value: `${xp} XP`, color: 'text-[#E07A5F]' },
          { icon: Flame, label: 'Streak', value: `${streak} days`, color: 'text-[#E07A5F]' },
          { icon: CheckSquare, label: 'Solved', value: completedProblems, color: 'text-[#81B29A]' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#2e2924] border border-[#3A5253] rounded-xl p-4 flex items-center gap-3"
          >
            <div className={`w-9 h-9 rounded-lg bg-[#3A5253] flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#FFF5F5]">{stat.value}</div>
              <div className="text-xs text-[rgba(255,245,245,0.5)]">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* XP Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-[#2e2924] border border-[#3A5253] rounded-xl p-5"
      >
        <XPBar />
      </motion.div>

      {/* Feature cards */}
      <div>
        <h2 className="text-sm font-semibold text-[rgba(255,245,245,0.5)] uppercase tracking-wide mb-4">
          Study Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Link
                href={feature.href}
                className={`block bg-[#2e2924] border ${feature.border} rounded-xl p-5 hover:scale-[1.02] transition-all duration-200 hover:orbit-glow group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shrink-0`}>
                    <feature.icon className="w-5 h-5 text-[#FFF5F5]" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-[#FFF5F5] mb-1 group-hover:${feature.iconColor} transition-colors`}>
                      {feature.label}
                    </h3>
                    <p className="text-sm text-[rgba(255,245,245,0.5)] leading-snug">{feature.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom row: Pomodoro + File upload */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pomodoro */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#2e2924] border border-[#3A5253] rounded-xl overflow-hidden"
        >
          <div className="px-5 py-3 border-b border-[#3A5253]/50">
            <h2 className="font-semibold text-[#FFF5F5] text-sm">Pomodoro Focus Timer</h2>
            <p className="text-xs text-[rgba(255,245,245,0.5)]">25 min work / 5 min break</p>
          </div>
          <PomodoroTimer />
        </motion.div>

        {/* File upload */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-[#2e2924] border border-[#3A5253] rounded-xl overflow-hidden"
        >
          <div className="px-5 py-3 border-b border-[#3A5253]/50 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[#FFF5F5] text-sm flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-[#81B29A]" />
                Study Materials
              </h2>
              <p className="text-xs text-[rgba(255,245,245,0.5)]">Upload PDFs to use as context</p>
            </div>
            {uploadedFiles.length > 0 && (
              <span className="text-xs text-[#81B29A] font-medium">
                {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} loaded
              </span>
            )}
          </div>
          <div className="p-5">
            <FileUploader />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
