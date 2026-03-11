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
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          What would you like to understand?
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="e.g., Tsiolkovsky rocket equation, Lift equation, Orbital decay..."
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
            className="flex-1 bg-[#0d0d1a] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-purple-600 focus:outline-none"
          />
          <Button
            onClick={() => handleExplain()}
            disabled={!concept.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-500 text-white gap-2 shrink-0"
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
          <p className="text-xs text-gray-500 uppercase tracking-wide">Quick picks:</p>
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
                    ? 'bg-purple-600/30 border-purple-600/60 text-purple-200'
                    : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:border-purple-700/50 hover:text-gray-200'
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
            className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl overflow-hidden"
          >
            {/* Topic header */}
            <div className="px-5 py-4 border-b border-purple-900/20 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-white">
                {currentConcept}
              </h3>
              {!isLoading && (
                <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  +5 XP earned
                </span>
              )}
            </div>

            <div className="p-5">
              {isLoading && !explanation && (
                <div className="flex items-center gap-3 text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span className="text-sm">Preparing your explanation...</span>
                </div>
              )}

              {explanation && (
                <div className="space-y-4">
                  <RichContent content={explanation} />
                  {isLoading && (
                    <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse" />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!explanation && !isLoading && (
        <div className="text-center py-8 text-gray-600">
          <div className="w-16 h-16 rounded-full bg-yellow-900/20 border border-yellow-800/30 flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-yellow-600/50" />
          </div>
          <p className="text-sm">Select a concept above or type your own</p>
          <p className="text-xs mt-1 text-gray-700">Get bite-sized explanations optimized for focus</p>
        </div>
      )}
    </div>
  );
}
