'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Loader2, ChevronRight, FileText } from 'lucide-react';
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
    const stepPattern = /(?=\*\*Step \d+)/g;
    const parts = text.split(stepPattern).filter(Boolean);
    if (parts.length <= 1) {
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

        const parsed = parseStepsFromText(fullText);
        const newSteps = parsed.map((content, i) => ({
          id: `step-${i}`,
          content: content.trim(),
          isStreaming: i === parsed.length - 1,
        }));
        setSteps(newSteps);
      }

      setSteps((prev) =>
        prev.map((s) => ({ ...s, isStreaming: false }))
      );

      addXP(5);
    } catch (err) {
      setSteps([
        {
          id: 'error',
          content: 'Failed to get a response. Please check your API key in `.env.local`.',
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
      <div className="bg-[#ECEAE3] border border-[#D0CEC6] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#1C3A2A]">Problem Input</h2>
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="text-xs text-[#6B6B5A] hover:text-[#2D5A3D] flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            {uploadedFiles.length > 0
              ? `${uploadedFiles.length} file(s) loaded`
              : 'Add context files'}
          </button>
        </div>

        {showUploader && (
          <div className="border border-[#D0CEC6] p-4">
            <FileUploader compact />
          </div>
        )}

        <Textarea
          placeholder="Enter your aerospace engineering problem here...&#10;&#10;Example: A gas turbine has a compression ratio of 15:1. The intake air temperature is 300K. Find the temperature after isentropic compression (γ = 1.4)."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="min-h-[120px] bg-[#ECEAE3] border-[#D0CEC6] text-[#1C3A2A] placeholder-[#6B6B5A] resize-none focus:border-[#2D5A3D]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSolve();
          }}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-3 flex-wrap">
            {exampleProblems.slice(0, 2).map((ex, i) => (
              <button
                key={i}
                onClick={() => setProblem(ex)}
                className="text-xs text-[#2D5A3D] hover:text-[#1C3A2A] underline underline-offset-2 transition-colors"
              >
                Example {i + 1}
              </button>
            ))}
          </div>
          <Button
            onClick={handleSolve}
            disabled={!problem.trim() || isLoading}
            className="bg-[#2D5A3D] hover:bg-[#1C3A2A] text-white gap-2 min-w-[120px]"
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
        <p className="text-xs text-[#6B6B5A]">Tip: Press Cmd/Ctrl + Enter to solve</p>
      </div>

      {/* Steps output */}
      <AnimatePresence>
        {steps.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold text-[#6B6B5A] uppercase tracking-widest flex items-center gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-[#2D5A3D]" />
              Solution Steps
            </h2>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="step-card p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 border border-[#D0CEC6] flex items-center justify-center shrink-0 mt-0.5 bg-[#E4E2DA]">
                    <span className="text-xs font-bold text-[#2D5A3D]">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 text-[#1C3A2A] leading-relaxed">
                    <RichContent content={step.content} />
                    {step.isStreaming && (
                      <span className="inline-block w-2 h-4 bg-[#2D5A3D] ml-1 animate-pulse" />
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
