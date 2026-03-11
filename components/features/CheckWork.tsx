'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
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
        <div style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '20px' }} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color: '#0A1628' }}>
              <span
                className="w-5 h-5 flex items-center justify-center text-xs font-bold"
                style={{ background: '#E3F2FD', border: '1px solid #B0BEC5', color: '#1565C0' }}
              >1</span>
              The Problem
            </h3>
            <button
              onClick={() => {
                setProblem(exampleProblem.problem);
                setUserAttempt(exampleProblem.attempt);
              }}
              className="text-xs underline underline-offset-2 transition-colors"
              style={{ color: '#1565C0' }}
            >
              Use example
            </button>
          </div>
          <Textarea
            placeholder="Paste the problem statement here..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="min-h-[160px] resize-none text-sm"
            style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', color: '#37474F' }}
          />
        </div>

        {/* User's attempt */}
        <div style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '20px' }} className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color: '#0A1628' }}>
            <span
              className="w-5 h-5 flex items-center justify-center text-xs font-bold"
              style={{ background: '#E3F2FD', border: '1px solid #B0BEC5', color: '#1565C0' }}
            >2</span>
            Your Work
          </h3>
          <Textarea
            placeholder="Show your work step by step...&#10;&#10;Include your approach, calculations, and answer."
            value={userAttempt}
            onChange={(e) => setUserAttempt(e.target.value)}
            className="min-h-[160px] resize-none text-sm"
            style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', color: '#37474F' }}
          />
        </div>
      </div>

      <Button
        onClick={handleCheck}
        disabled={!problem.trim() || !userAttempt.trim() || isLoading}
        className="w-full gap-2 py-3"
        style={{ background: '#1565C0', color: '#FFFFFF' }}
      >
        {isLoading ? (
          <><Loader2 className="w-4 h-4 animate-spin" />Analyzing your work...</>
        ) : (
          <><CheckCircle className="w-4 h-4" />Check My Work</>
        )}
      </Button>

      {/* Feedback display */}
      <AnimatePresence>
        {(feedback || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}
          >
            <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #B0BEC5', background: '#F0F4F8' }}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#1565C0' }} />
              ) : (
                <CheckCircle className="w-4 h-4" style={{ color: '#1565C0' }} />
              )}
              <h3 className="font-semibold text-sm" style={{ color: '#0A1628' }}>
                {isLoading ? 'Reviewing your work...' : 'Feedback'}
              </h3>
              {!isLoading && feedback && (
                <span className="ml-auto text-xs font-semibold" style={{ color: '#FF6D00' }}>+5 XP</span>
              )}
            </div>
            <div className="p-5">
              {isLoading && !feedback && (
                <div className="flex items-center gap-2 text-sm" style={{ color: '#546E7A' }}>
                  Carefully reviewing each step of your work...
                </div>
              )}
              {feedback && (
                <div className="leading-relaxed" style={{ color: '#37474F' }}>
                  <RichContent content={feedback} />
                  {isLoading && (
                    <span className="inline-block w-2 h-4 ml-1 animate-pulse" style={{ background: '#1565C0' }} />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!feedback && !isLoading && (
        <div className="text-center py-8" style={{ color: '#546E7A' }}>
          <p className="text-sm">Enter the problem and your work above</p>
          <p className="text-xs mt-1">
            I&apos;ll identify any errors and show you the correct approach
          </p>
        </div>
      )}
    </div>
  );
}
