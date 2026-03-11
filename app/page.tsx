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
    color: 'from-purple-600 to-purple-800',
    border: 'border-purple-700/40',
    iconColor: 'text-purple-300',
  },
  {
    href: '/practice',
    label: 'Practice Problems',
    description: 'Generate practice problems with XP rewards',
    icon: FlaskConical,
    color: 'from-cyan-600 to-cyan-800',
    border: 'border-cyan-700/40',
    iconColor: 'text-cyan-300',
  },
  {
    href: '/formulas',
    label: 'Formula Hub',
    description: 'Searchable formula reference with LaTeX rendering',
    icon: BookOpen,
    color: 'from-blue-600 to-blue-800',
    border: 'border-blue-700/40',
    iconColor: 'text-blue-300',
  },
  {
    href: '/tutor',
    label: 'AI Tutor',
    description: 'Socratic tutoring that guides you to the answer',
    icon: MessageCircle,
    color: 'from-violet-600 to-violet-800',
    border: 'border-violet-700/40',
    iconColor: 'text-violet-300',
  },
  {
    href: '/explain',
    label: 'Concept Explainer',
    description: 'Bite-sized explanations optimized for focus',
    icon: Lightbulb,
    color: 'from-yellow-600 to-yellow-800',
    border: 'border-yellow-700/40',
    iconColor: 'text-yellow-300',
  },
  {
    href: '/check',
    label: 'Check My Work',
    description: 'Get detailed feedback on your problem-solving attempts',
    icon: CheckSquare,
    color: 'from-green-600 to-green-800',
    border: 'border-green-700/40',
    iconColor: 'text-green-300',
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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center orbit-glow animate-float">
            <Rocket className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-3">OrbitStudy</h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
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
          { icon: Star, label: 'Level', value: level, color: 'text-purple-400' },
          { icon: Zap, label: 'Total XP', value: `${xp} XP`, color: 'text-yellow-400' },
          { icon: Flame, label: 'Streak', value: `${streak} days`, color: 'text-orange-400' },
          { icon: CheckSquare, label: 'Solved', value: completedProblems, color: 'text-green-400' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl p-4 flex items-center gap-3"
          >
            <div className={`w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* XP Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl p-5"
      >
        <XPBar />
      </motion.div>

      {/* Feature cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
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
                className={`block bg-[#1a1a2e] border ${feature.border} rounded-xl p-5 hover:scale-[1.02] transition-all duration-200 hover:orbit-glow group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shrink-0`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-white mb-1 group-hover:${feature.iconColor} transition-colors`}>
                      {feature.label}
                    </h3>
                    <p className="text-sm text-gray-500 leading-snug">{feature.description}</p>
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
          className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl overflow-hidden"
        >
          <div className="px-5 py-3 border-b border-purple-900/20">
            <h2 className="font-semibold text-white text-sm">Pomodoro Focus Timer</h2>
            <p className="text-xs text-gray-500">25 min work / 5 min break</p>
          </div>
          <PomodoroTimer />
        </motion.div>

        {/* File upload */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl overflow-hidden"
        >
          <div className="px-5 py-3 border-b border-purple-900/20 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white text-sm flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                Study Materials
              </h2>
              <p className="text-xs text-gray-500">Upload PDFs to use as context</p>
            </div>
            {uploadedFiles.length > 0 && (
              <span className="text-xs text-cyan-400 font-medium">
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
