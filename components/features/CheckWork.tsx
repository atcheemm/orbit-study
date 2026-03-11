'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RichContent } from '@/components/math/LatexRenderer';
import { useStore } from '@/lib/store';

export function CheckWork() {
  const [problem, setProblem] = useState('');
  const [userAttempt, setUserAttempt] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { uploadedFiles, addXP, checkAndUpdateStreak } = useStore();

  const context = uploadedFiles
    .map((f) => f.text.slice(0, 1000))
    .join('\n\n');

  const handleCheck = async () => {
    if (!problem.trim() || !userAttempt.trim() || isLoading) return;

    setFeedback('');
    setIsLoading(true);
    checkAndUpdateStreak();

    try {
      const response = await fetch('/api/check-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: problem.trim(),
          userAttempt: userAttempt.trim(),
          context,
        }),
      });

      if (!response.ok) throw new Error('Failed to check work');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (!reader) throw new Error('No body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setFeedback(fullText);
      }

      addXP(5);
    } catch {
      setFeedback('Failed to check work. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const exampleProblem = {
    problem:
      'A rocket has an initial mass of 10,000 kg and a final mass of 3,000 kg. The specific impulse is 300 s. Calculate the delta-v using the Tsiolkovsky equation.',
    attempt:
      'Using the rocket equation: Δv = Isp × g₀ × ln(m₀/mf)\nΔv = 300 × 9.81 × ln(10000/3000)\nΔv = 2943 × ln(3.33)\nΔv = 2943 × 1.20 = 3532 m/s',
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Input forms */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Problem input */}
        <div className="bg-[#ECEAE3] border border-[#D0CEC6] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#1C3A2A] text-sm flex items-center gap-2">
              <span className="w-5 h-5 bg-[#E4E2DA] border border-[#D0CEC6] flex items-center justify-center text-xs text-[#2D5A3D] font-bold">1</span>
              The Problem
            </h3>
            <button
              onClick={() => {
                setProblem(exampleProblem.problem);
                setUserAttempt(exampleProblem.attempt);
              }}
              className="text-xs text-[#2D5A3D] hover:text-[#1C3A2A] underline underline-offset-2 transition-colors"
            >
              Use example
            </button>
          </div>
          <Textarea
            placeholder="Paste the problem statement here..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="min-h-[160px] bg-[#ECEAE3] border-[#D0CEC6] text-[#1C3A2A] placeholder-[#6B6B5A] resize-none focus:border-[#2D5A3D] text-sm"
          />
        </div>

        {/* User's attempt */}
        <div className="bg-[#ECEAE3] border border-[#D0CEC6] p-5 space-y-3">
          <h3 className="font-semibold text-[#1C3A2A] text-sm flex items-center gap-2">
            <span className="w-5 h-5 bg-[#E4E2DA] border border-[#D0CEC6] flex items-center justify-center text-xs text-[#2D5A3D] font-bold">2</span>
            Your Work
          </h3>
          <Textarea
            placeholder="Show your work step by step...&#10;&#10;Include your approach, calculations, and answer."
            value={userAttempt}
            onChange={(e) => setUserAttempt(e.target.value)}
            className="min-h-[160px] bg-[#ECEAE3] border-[#D0CEC6] text-[#1C3A2A] placeholder-[#6B6B5A] resize-none focus:border-[#2D5A3D] text-sm"
          />
        </div>
      </div>

      <Button
        onClick={handleCheck}
        disabled={!problem.trim() || !userAttempt.trim() || isLoading}
        className="w-full bg-[#2D5A3D] hover:bg-[#1C3A2A] text-white gap-2 py-3"
      >
        {isLoading ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Analyzing your work...</>
        ) : (
          <><CheckSquare className="w-4 h-4" />Check My Work</>
        )}
      </Button>

      {/* Feedback display */}
      <AnimatePresence>
        {(feedback || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#ECEAE3] border border-[#D0CEC6] overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-[#D0CEC6] bg-[#E4E2DA] flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-[#2D5A3D] animate-spin" />
              ) : (
                <CheckSquare className="w-4 h-4 text-[#2D5A3D]" />
              )}
              <h3 className="font-semibold text-[#1C3A2A] text-sm">
                {isLoading ? 'Reviewing your work...' : 'Feedback'}
              </h3>
              {!isLoading && feedback && (
                <span className="ml-auto text-xs text-[#6B6B5A]">+5 XP</span>
              )}
            </div>
            <div className="p-5">
              {isLoading && !feedback && (
                <div className="flex items-center gap-2 text-[#6B6B5A] text-sm">
                  Carefully reviewing each step of your work...
                </div>
              )}
              {feedback && (
                <div className="text-[#1C3A2A] leading-relaxed">
                  <RichContent content={feedback} />
                  {isLoading && (
                    <span className="inline-block w-2 h-4 bg-[#2D5A3D] ml-1 animate-pulse" />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!feedback && !isLoading && (
        <div className="text-center py-8 text-[#6B6B5A]">
          <p className="text-sm">Enter the problem and your work above</p>
          <p className="text-xs mt-1">
            I&apos;ll identify any errors and show you the correct approach
          </p>
        </div>
      )}
    </div>
  );
}
