'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RichContent } from '@/components/math/LatexRenderer';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const QUICK_CONCEPTS = [
  'Bernoulli\'s Principle',
  'Mach Number',
  'Orbital Resonance',
  'Center of Pressure',
  'Specific Impulse',
  'Reynolds Number',
  'Lift-to-Drag Ratio',
  'Transfer Orbit',
  'Stress Concentration',
  'PID Controller',
];

export function ConceptExplainer() {
  const [concept, setConcept] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConcept, setCurrentConcept] = useState('');
  const { uploadedFiles, addXP, checkAndUpdateStreak } = useStore();

  const context = uploadedFiles
    .map((f) => f.text.slice(0, 1500))
    .join('\n\n');

  const handleExplain = async (conceptToExplain?: string) => {
    const target = conceptToExplain || concept.trim();
    if (!target || isLoading) return;

    setIsLoading(true);
    setExplanation('');
    setCurrentConcept(target);
    checkAndUpdateStreak();

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept: target, context }),
      });

      if (!response.ok) throw new Error('Failed to explain');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (!reader) throw new Error('No body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setExplanation(fullText);
      }

      addXP(5);
    } catch {
      setExplanation('Failed to explain. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Input */}
      <div className="bg-white border border-[#E0E0DA] p-5 space-y-4">
        <h2 className="font-semibold text-[#1A1A1A]">What would you like to understand?</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="e.g., Tsiolkovsky rocket equation, Lift equation, Orbital decay..."
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
            className="flex-1 bg-white border border-[#E0E0DA] px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-[#6B6B6B] focus:border-[#2D4A3E] focus:outline-none"
          />
          <Button
            onClick={() => handleExplain()}
            disabled={!concept.trim() || isLoading}
            className="bg-[#2D4A3E] hover:bg-[#1e332a] text-white gap-2 shrink-0"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Explaining...</>
            ) : (
              <>Explain</>
            )}
          </Button>
        </div>

        {/* Quick concept buttons */}
        <div className="space-y-2">
          <p className="text-xs text-[#6B6B6B] uppercase tracking-widest font-medium">Quick picks:</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_CONCEPTS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setConcept(c);
                  handleExplain(c);
                }}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium transition-colors border',
                  currentConcept === c && !isLoading
                    ? 'bg-[#F4F4F0] border-[#2D4A3E] text-[#2D4A3E]'
                    : 'bg-white border-[#E0E0DA] text-[#6B6B6B] hover:border-[#2D4A3E] hover:text-[#1A1A1A]'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation output */}
      <AnimatePresence>
        {(explanation || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#E0E0DA] overflow-hidden"
          >
            {/* Topic header */}
            <div className="px-5 py-4 border-b border-[#E0E0DA] bg-[#F4F4F0] flex items-center gap-2">
              <h3 className="font-semibold text-[#1A1A1A]">
                {currentConcept}
              </h3>
              {!isLoading && (
                <span className="ml-auto text-xs text-[#6B6B6B]">
                  +5 XP earned
                </span>
              )}
            </div>

            <div className="p-5">
              {isLoading && !explanation && (
                <div className="flex items-center gap-3 text-[#6B6B6B]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#2D4A3E]" />
                  <span className="text-sm">Preparing your explanation...</span>
                </div>
              )}

              {explanation && (
                <div className="space-y-4">
                  <RichContent content={explanation} />
                  {isLoading && (
                    <span className="inline-block w-2 h-4 bg-[#2D4A3E] animate-pulse" />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!explanation && !isLoading && (
        <div className="text-center py-8 text-[#6B6B6B]">
          <p className="text-sm">Select a concept above or type your own</p>
          <p className="text-xs mt-1 text-[#6B6B6B]">Get bite-sized explanations optimized for focus</p>
        </div>
      )}
    </div>
  );
}
