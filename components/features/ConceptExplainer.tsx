'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Loader2, Sparkles, ChevronRight } from 'lucide-react';
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
      setExplanation('⚠️ Failed to explain. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Input */}
      <div className="bg-[#2e2924] border border-[#3A5253] rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-[#FFF5F5] flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#E07A5F]" />
          What would you like to understand?
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="e.g., Tsiolkovsky rocket equation, Lift equation, Orbital decay..."
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
            className="flex-1 bg-[#27231E] border border-[#3A5253] rounded-lg px-4 py-2.5 text-sm text-[#FFF5F5] placeholder-[rgba(255,245,245,0.3)] focus:border-[#81B29A] focus:outline-none"
          />
          <Button
            onClick={() => handleExplain()}
            disabled={!concept.trim() || isLoading}
            className="bg-[#81B29A] hover:bg-[#81B29A]/80 text-[#27231E] gap-2 shrink-0"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Explaining...</>
            ) : (
              <><Sparkles className="w-4 h-4" />Explain</>
            )}
          </Button>
        </div>

        {/* Quick concept buttons */}
        <div className="space-y-2">
          <p className="text-xs text-[rgba(255,245,245,0.3)] uppercase tracking-wide">Quick picks:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_CONCEPTS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setConcept(c);
                  handleExplain(c);
                }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                  currentConcept === c && !isLoading
                    ? 'bg-[#81B29A]/20 border-[#81B29A]/60 text-[#81B29A]'
                    : 'bg-[#3A5253]/40 border-[#3A5253]/50 text-[rgba(255,245,245,0.5)] hover:border-[#81B29A]/40 hover:text-[rgba(255,245,245,0.8)]'
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2e2924] border border-[#3A5253] rounded-xl overflow-hidden"
          >
            {/* Topic header */}
            <div className="px-5 py-4 border-b border-[#3A5253]/50 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E07A5F]" />
              <h3 className="font-semibold text-[#FFF5F5]">
                {currentConcept}
              </h3>
              {!isLoading && (
                <span className="ml-auto text-xs text-[#81B29A] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#81B29A]" />
                  +5 XP earned
                </span>
              )}
            </div>

            <div className="p-5">
              {isLoading && !explanation && (
                <div className="flex items-center gap-3 text-[rgba(255,245,245,0.5)]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#81B29A]" />
                  <span className="text-sm">Preparing your explanation...</span>
                </div>
              )}

              {explanation && (
                <div className="space-y-4">
                  <RichContent content={explanation} />
                  {isLoading && (
                    <span className="inline-block w-2 h-4 bg-[#81B29A] animate-pulse" />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!explanation && !isLoading && (
        <div className="text-center py-8 text-[rgba(255,245,245,0.3)]">
          <div className="w-16 h-16 rounded-full bg-[#E07A5F]/10 border border-[#E07A5F]/20 flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-[#E07A5F]/40" />
          </div>
          <p className="text-sm">Select a concept above or type your own</p>
          <p className="text-xs mt-1 text-[rgba(255,245,245,0.2)]">Get bite-sized explanations optimized for focus</p>
        </div>
      )}
    </div>
  );
}
