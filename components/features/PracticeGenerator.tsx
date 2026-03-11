'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Loader2, Eye, EyeOff, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { RichContent } from '@/components/math/LatexRenderer';
import { useStore } from '@/lib/store';

const TOPICS = [
  { id: 'aerodynamics', label: 'Aerodynamics', emoji: '✈️' },
  { id: 'thermodynamics', label: 'Thermodynamics', emoji: '🔥' },
  { id: 'orbital-mechanics', label: 'Orbital Mechanics', emoji: '🪐' },
  { id: 'structures', label: 'Structures', emoji: '🔩' },
  { id: 'propulsion', label: 'Propulsion', emoji: '🚀' },
  { id: 'flight-dynamics', label: 'Flight Dynamics', emoji: '🛩️' },
  { id: 'controls', label: 'Controls', emoji: '🎮' },
  { id: 'fluid-mechanics', label: 'Fluid Mechanics', emoji: '💧' },
];

const DIFFICULTY_LABELS = ['', 'Introductory', 'Basic', 'Intermediate', 'Advanced', 'Expert'];

type ProblemState = {
  raw: string;
  showAnswer: boolean;
  solved: boolean;
};

export function PracticeGenerator() {
  const [selectedTopic, setSelectedTopic] = useState('aerodynamics');
  const [difficulty, setDifficulty] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [problem, setProblem] = useState<ProblemState | null>(null);
  const [xpGained, setXpGained] = useState(0);

  const { uploadedFiles, addXP, checkAndUpdateStreak } = useStore();

  const uploadedContent = uploadedFiles
    .map((f) => f.text)
    .join('\n\n')
    .slice(0, 3000);

  const handleGenerate = async () => {
    setIsLoading(true);
    setProblem(null);
    setXpGained(0);
    checkAndUpdateStreak();

    try {
      const response = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: TOPICS.find((t) => t.id === selectedTopic)?.label || selectedTopic,
          difficulty,
          uploadedContent,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate');
      const data = await response.json();
      setProblem({ raw: data.problem, showAnswer: false, solved: false });
    } catch {
      setProblem({
        raw: '⚠️ Failed to generate problem. Check your API key.',
        showAnswer: false,
        solved: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkSolved = () => {
    if (!problem || problem.solved) return;
    const gained = difficulty * 10;
    addXP(gained);
    setXpGained(gained);
    setProblem({ ...problem, solved: true });
  };

  // Strip the hidden answer markers for display
  const getDisplayContent = (raw: string, showAnswer: boolean) => {
    if (showAnswer) {
      return raw.replace(/\|\|HIDDEN\|\|/g, '');
    }
    return raw.replace(/\|\|HIDDEN\|\|[\s\S]*?\|\|HIDDEN\|\|/g, '[ Answer hidden - reveal when ready ]');
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Configuration */}
      <div className="bg-[#2e2924] border border-[#3A5253] rounded-xl p-5 space-y-5">
        <h2 className="font-semibold text-[#FFF5F5] flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-[#E07A5F]" />
          Configure Practice Problem
        </h2>

        {/* Topic selector */}
        <div className="space-y-2">
          <label className="text-sm text-[rgba(255,245,245,0.5)]">Topic</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`p-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  selectedTopic === topic.id
                    ? 'bg-[#81B29A]/20 border border-[#81B29A]/60 text-[#FFF5F5]'
                    : 'bg-[#3A5253]/40 border border-[#3A5253]/50 text-[rgba(255,245,245,0.5)] hover:border-[#81B29A]/40 hover:text-[rgba(255,245,245,0.8)]'
                }`}
              >
                <span className="mr-1.5">{topic.emoji}</span>
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-[rgba(255,245,245,0.5)]">Difficulty</label>
            <Badge
              variant="outline"
              className={`text-xs border-[#81B29A]/50 ${
                difficulty >= 4
                  ? 'text-[#E07A5F] border-[#E07A5F]/40'
                  : difficulty >= 3
                  ? 'text-[#E07A5F] border-[#E07A5F]/30'
                  : 'text-[#81B29A] border-[#81B29A]/40'
              }`}
            >
              {DIFFICULTY_LABELS[difficulty]}
            </Badge>
          </div>
          <Slider
            value={difficulty}
            onValueChange={(v) => setDifficulty(typeof v === 'number' ? v : Array.isArray(v) ? v[0] : difficulty)}
            min={1}
            max={5}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[rgba(255,245,245,0.3)]">
            {DIFFICULTY_LABELS.slice(1).map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-[#81B29A] hover:bg-[#81B29A]/80 text-[#27231E] gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Generate Problem
            </>
          )}
        </Button>
      </div>

      {/* Problem display */}
      <AnimatePresence>
        {problem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2e2924] border border-[#3A5253] rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#FFF5F5]">
                  {TOPICS.find((t) => t.id === selectedTopic)?.emoji}{' '}
                  {TOPICS.find((t) => t.id === selectedTopic)?.label} —{' '}
                  {DIFFICULTY_LABELS[difficulty]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {problem.solved && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 text-[#E07A5F]"
                    >
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-bold">+{xpGained} XP!</span>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>

            <div className="text-[#FFF5F5] leading-relaxed">
              <RichContent content={getDisplayContent(problem.raw, problem.showAnswer)} />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setProblem({ ...problem, showAnswer: !problem.showAnswer })
                }
                className="border-[#3A5253] text-[rgba(255,245,245,0.5)] hover:text-[#FFF5F5] gap-2"
              >
                {problem.showAnswer ? (
                  <><EyeOff className="w-3.5 h-3.5" />Hide Answer</>
                ) : (
                  <><Eye className="w-3.5 h-3.5" />Reveal Answer</>
                )}
              </Button>

              {!problem.solved ? (
                <Button
                  size="sm"
                  onClick={handleMarkSolved}
                  className="bg-[#E07A5F]/20 border border-[#E07A5F]/50 text-[#E07A5F] hover:bg-[#E07A5F]/30 gap-2"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Mark as Solved (+{difficulty * 10} XP)
                </Button>
              ) : (
                <span className="text-[#81B29A] text-sm font-medium">
                  ✅ Problem solved!
                </span>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerate}
                className="text-[rgba(255,245,245,0.4)] hover:text-[rgba(255,245,245,0.8)] ml-auto"
              >
                Next Problem →
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
