'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Loader2, AlertCircle } from 'lucide-react';
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
      setFeedback('⚠️ Failed to check work. Please check your API key.');
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
        <div className="bg-[#2e2924] border border-[#3A5253] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#FFF5F5] text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#81B29A]/20 flex items-center justify-center text-xs text-[#81B29A] font-bold">1</span>
              The Problem
            </h3>
            <button
              onClick={() => {
                setProblem(exampleProblem.problem);
                setUserAttempt(exampleProblem.attempt);
              }}
              className="text-xs text-[#81B29A] hover:text-[#FFF5F5] underline underline-offset-2"
            >
              Use example
            </button>
          </div>
          <Textarea
            placeholder="Paste the problem statement here..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="min-h-[160px] bg-[#27231E] border-[#3A5253] text-[#FFF5F5] placeholder-[rgba(255,245,245,0.3)] resize-none focus:border-[#81B29A] text-sm"
          />
        </div>

        {/* User's attempt */}
        <div className="bg-[#2e2924] border border-[#3A5253] rounded-xl p-5 space-y-3">
          <h3 className="font-semibold text-[#FFF5F5] text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#E07A5F]/20 flex items-center justify-center text-xs text-[#E07A5F] font-bold">2</span>
            Your Work
          </h3>
          <Textarea
            placeholder="Show your work step by step...&#10;&#10;Include your approach, calculations, and answer."
            value={userAttempt}
            onChange={(e) => setUserAttempt(e.target.value)}
            className="min-h-[160px] bg-[#27231E] border-[#3A5253] text-[#FFF5F5] placeholder-[rgba(255,245,245,0.3)] resize-none focus:border-[#E07A5F] text-sm"
          />
        </div>
      </div>

      <Button
        onClick={handleCheck}
        disabled={!problem.trim() || !userAttempt.trim() || isLoading}
        className="w-full bg-[#81B29A] hover:bg-[#81B29A]/80 text-[#27231E] gap-2 py-3"
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2e2924] border border-[#3A5253] rounded-xl overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-[#3A5253]/50 flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-[#81B29A] animate-spin" />
              ) : (
                <CheckSquare className="w-4 h-4 text-[#81B29A]" />
              )}
              <h3 className="font-semibold text-[#FFF5F5] text-sm">
                {isLoading ? 'Reviewing your work...' : 'Feedback'}
              </h3>
              {!isLoading && feedback && (
                <span className="ml-auto text-xs text-[#E07A5F]">+5 XP</span>
              )}
            </div>
            <div className="p-5">
              {isLoading && !feedback && (
                <div className="flex items-center gap-2 text-[rgba(255,245,245,0.5)] text-sm">
                  <AlertCircle className="w-4 h-4 text-[#81B29A]" />
                  Carefully reviewing each step of your work...
                </div>
              )}
              {feedback && (
                <div className="text-[#FFF5F5] leading-relaxed">
                  <RichContent content={feedback} />
                  {isLoading && (
                    <span className="inline-block w-2 h-4 bg-[#81B29A] ml-1 animate-pulse" />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!feedback && !isLoading && (
        <div className="text-center py-8 text-[rgba(255,245,245,0.3)]">
          <CheckSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Enter the problem and your work above</p>
          <p className="text-xs mt-1 text-[rgba(255,245,245,0.2)]">
            I&apos;ll identify any errors and show you the correct approach
          </p>
        </div>
      )}
    </div>
  );
}
