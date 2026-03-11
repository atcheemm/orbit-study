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
      <div style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '20px' }} className="space-y-4">
        <h2 className="font-semibold" style={{ color: '#0A1628' }}>What would you like to understand?</h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="e.g., Tsiolkovsky rocket equation, Lift equation, Orbital decay..."
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
            className="flex-1 px-4 py-2.5 text-sm focus:outline-none"
            style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', color: '#37474F' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#1565C0')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#B0BEC5')}
          />
          <Button
            onClick={() => handleExplain()}
            disabled={!concept.trim() || isLoading}
            className="gap-2 shrink-0"
            style={{ background: '#1565C0', color: '#FFFFFF' }}
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
          <p className="text-xs uppercase tracking-widest font-medium" style={{ color: '#546E7A' }}>Quick picks:</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_CONCEPTS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setConcept(c);
                  handleExplain(c);
                }}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  border: currentConcept === c && !isLoading ? '1px solid #1565C0' : '1px solid #B0BEC5',
                  background: currentConcept === c && !isLoading ? '#E3F2FD' : '#FFFFFF',
                  color: currentConcept === c && !isLoading ? '#1565C0' : '#546E7A',
                }}
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
            style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden' }}
          >
            {/* Topic header */}
            <div
              className="px-5 py-4 flex items-center gap-2"
              style={{ borderBottom: '1px solid #B0BEC5', background: '#F0F4F8' }}
            >
              <h3 className="font-semibold" style={{ color: '#0A1628' }}>
                {currentConcept}
              </h3>
              {!isLoading && (
                <span className="ml-auto text-xs" style={{ color: '#FF6D00', fontWeight: 600 }}>
                  +5 XP earned
                </span>
              )}
            </div>

            <div className="p-5">
              {isLoading && !explanation && (
                <div className="flex items-center gap-3" style={{ color: '#546E7A' }}>
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#1565C0' }} />
                  <span className="text-sm">Preparing your explanation...</span>
                </div>
              )}

              {explanation && (
                <div className="space-y-4">
                  <RichContent content={explanation} />
                  {isLoading && (
                    <span className="inline-block w-2 h-4 animate-pulse" style={{ background: '#1565C0' }} />
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!explanation && !isLoading && (
        <div className="text-center py-8" style={{ color: '#546E7A' }}>
          <p className="text-sm">Select a concept above or type your own</p>
          <p className="text-xs mt-1" style={{ color: '#546E7A' }}>Get bite-sized explanations optimized for focus</p>
        </div>
      )}
    </div>
  );
}
