'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, ChevronRight, Lightbulb, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RichContent } from '@/components/math/LatexRenderer';
import { FileUploader } from '@/components/features/FileUploader';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

type Step = {
  id: string;
  content: string;
  isStreaming: boolean;
};

export function StepSolver() {
  const [problem, setProblem] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [context, setContext] = useState('');
  const { uploadedFiles, addXP, checkAndUpdateStreak } = useStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [steps]);

  // Use combined text from uploaded files as context
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      const combined = uploadedFiles
        .map((f) => `--- ${f.name} ---\n${f.text}`)
        .join('\n\n')
        .slice(0, 6000);
      setContext(combined);
    }
  }, [uploadedFiles]);

  const parseStepsFromText = (text: string): string[] => {
    // Split on step headers like **Step 1:**, **Step 2:** etc.
    const stepPattern = /(?=\*\*Step \d+)/g;
    const parts = text.split(stepPattern).filter(Boolean);
    if (parts.length <= 1) {
      // No step markers - split by double newlines as fallback
      return text.split('\n\n').filter((p) => p.trim().length > 0);
    }
    return parts;
  };

  const handleSolve = async () => {
    if (!problem.trim() || isLoading) return;

    setSteps([]);
    setIsLoading(true);
    checkAndUpdateStreak();

    const stepId = `step-${Date.now()}`;
    let fullText = '';

    setSteps([{ id: stepId, content: '', isStreaming: true }]);

    try {
      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: problem.trim(), context }),
      });

      if (!response.ok) throw new Error('Failed to solve');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        // Parse into steps dynamically
        const parsed = parseStepsFromText(fullText);
        const newSteps = parsed.map((content, i) => ({
          id: `step-${i}`,
          content: content.trim(),
          isStreaming: i === parsed.length - 1,
        }));
        setSteps(newSteps);
      }

      // Finalize - mark all as done
      setSteps((prev) =>
        prev.map((s) => ({ ...s, isStreaming: false }))
      );

      addXP(5);
    } catch (err) {
      setSteps([
        {
          id: 'error',
          content: '⚠️ Failed to get a response. Please check your API key in `.env.local`.',
          isStreaming: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const exampleProblems = [
    'A rocket engine has a specific impulse of 450 s and propellant mass flow rate of 10 kg/s. Calculate the thrust force.',
    'An airfoil has a chord length of 2m and is flying at 50 m/s. Find the Reynolds number (air viscosity = 1.5×10⁻⁵ m²/s).',
    'A spacecraft is in a circular orbit at 400 km altitude. Find the orbital velocity and period.',
  ];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Input section */}
      <div className="bg-[#1a1a2e] border border-purple-900/30 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            Problem Input
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUploader(!showUploader)}
            className="text-gray-400 hover:text-white text-xs"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            {uploadedFiles.length > 0
              ? `${uploadedFiles.length} file(s) loaded`
              : 'Add context files'}
          </Button>
        </div>

        {showUploader && (
          <div className="border border-gray-700/50 rounded-lg p-4">
            <FileUploader compact />
          </div>
        )}

        <Textarea
          placeholder="Enter your aerospace engineering problem here...&#10;&#10;Example: A gas turbine has a compression ratio of 15:1. The intake air temperature is 300K. Find the temperature after isentropic compression (γ = 1.4)."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="min-h-[120px] bg-[#0d0d1a] border-gray-700 text-white placeholder-gray-600 resize-none focus:border-purple-600"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSolve();
          }}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {exampleProblems.slice(0, 2).map((ex, i) => (
              <button
                key={i}
                onClick={() => setProblem(ex)}
                className="text-xs text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
              >
                Example {i + 1}
              </button>
            ))}
          </div>
          <Button
            onClick={handleSolve}
            disabled={!problem.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-500 text-white gap-2 min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Solving...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Solve
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-600">Tip: Press Cmd/Ctrl + Enter to solve</p>
      </div>

      {/* Steps output */}
      <AnimatePresence>
        {steps.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-purple-400" />
              Solution Steps
            </h2>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'step-card rounded-xl p-5',
                  step.isStreaming && 'animate-pulse-glow'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-600/50 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-300">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 text-gray-200 leading-relaxed">
                    <RichContent content={step.content} />
                    {step.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-purple-400 ml-1 animate-pulse" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
