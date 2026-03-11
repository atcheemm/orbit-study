'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { RichContent } from '@/components/math/LatexRenderer';
import { useStore } from '@/lib/store';

const TOPICS = [
  { id: 'aerodynamics', label: 'Aerodynamics' },
  { id: 'thermodynamics', label: 'Thermodynamics' },
  { id: 'orbital-mechanics', label: 'Orbital Mechanics' },
  { id: 'structures', label: 'Structures' },
  { id: 'propulsion', label: 'Propulsion' },
  { id: 'flight-dynamics', label: 'Flight Dynamics' },
  { id: 'controls', label: 'Controls' },
  { id: 'fluid-mechanics', label: 'Fluid Mechanics' },
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
        raw: 'Failed to generate problem. Check your API key.',
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

  const getDisplayContent = (raw: string, showAnswer: boolean) => {
    if (showAnswer) {
      return raw.replace(/\|\|HIDDEN\|\|/g, '');
    }
    return raw.replace(/\|\|HIDDEN\|\|[\s\S]*?\|\|HIDDEN\|\|/g, '[ Answer hidden — reveal when ready ]');
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Configuration */}
      <div className="bg-[#ECEAE3] border border-[#D0CEC6] p-5 space-y-5">
        <h2 className="font-semibold text-[#1C3A2A]">Configure Practice Problem</h2>

        {/* Topic selector */}
        <div className="space-y-2">
          <label className="text-xs text-[#6B6B5A] uppercase tracking-widest font-medium">Topic</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`p-2.5 text-sm font-medium transition-colors text-left border ${
                  selectedTopic === topic.id
                    ? 'bg-[#E4E2DA] border-[#2D5A3D] text-[#2D5A3D]'
                    : 'bg-[#ECEAE3] border-[#D0CEC6] text-[#6B6B5A] hover:border-[#2D5A3D] hover:text-[#1C3A2A]'
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#6B6B5A] uppercase tracking-widest font-medium">Difficulty</label>
            <Badge
              variant="outline"
              className={`text-xs border-[#D0CEC6] text-[#1C3A2A]`}
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
          <div className="flex justify-between text-xs text-[#6B6B5A]">
            {DIFFICULTY_LABELS.slice(1).map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-[#2D5A3D] hover:bg-[#1C3A2A] text-white gap-2"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#ECEAE3] border border-[#D0CEC6] p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-[#1C3A2A]">
                {TOPICS.find((t) => t.id === selectedTopic)?.label} —{' '}
                <span className="text-[#6B6B5A] font-normal">{DIFFICULTY_LABELS[difficulty]}</span>
              </div>
              {problem.solved && (
                <span className="text-xs text-[#6B6B5A]">+{xpGained} XP earned</span>
              )}
            </div>

            <div className="text-[#1C3A2A] leading-relaxed">
              <RichContent content={getDisplayContent(problem.raw, problem.showAnswer)} />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-[#D0CEC6]">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setProblem({ ...problem, showAnswer: !problem.showAnswer })
                }
                className="border-[#D0CEC6] text-[#6B6B5A] hover:text-[#1C3A2A] hover:border-[#2D5A3D] gap-2"
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
                  className="bg-[#2D5A3D] hover:bg-[#1C3A2A] text-white gap-2"
                >
                  Mark as Solved (+{difficulty * 10} XP)
                </Button>
              ) : (
                <span className="text-[#2D5A3D] text-sm font-medium">
                  Problem solved
                </span>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                className="border-[#D0CEC6] text-[#6B6B5A] hover:text-[#1C3A2A] ml-auto"
              >
                Next Problem
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
