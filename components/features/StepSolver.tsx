'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Loader2, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RichContent } from '@/components/math/LatexRenderer';
import { FileUploader } from '@/components/features/FileUploader';
import { useStore } from '@/lib/store';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
      {/* Input section */}
      <div
        style={{
          background: '#111111',
          border: '1px solid #1F1F1F',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.02em' }}>Problem Input</h2>
          <button
            onClick={() => setShowUploader(!showUploader)}
            style={{
              color: '#888888',
              fontSize: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#888888'; }}
          >
            <FileText style={{ width: '14px', height: '14px' }} />
            {uploadedFiles.length > 0
              ? `${uploadedFiles.length} file(s) loaded`
              : 'Add context files'}
          </button>
        </div>

        {showUploader && (
          <div style={{ border: '1px solid #1F1F1F', padding: '16px', background: '#0A0A0A' }}>
            <FileUploader compact />
          </div>
        )}

        <Textarea
          placeholder="Enter your aerospace engineering problem here...&#10;&#10;Example: A gas turbine has a compression ratio of 15:1. Intake air temp is 300K. Find temperature after isentropic compression (γ = 1.4)."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="min-h-[120px] resize-none"
          style={{
            background: '#0A0A0A',
            border: '1px solid #1F1F1F',
            color: '#FFFFFF',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSolve();
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {exampleProblems.slice(0, 2).map((ex, i) => (
              <button
                key={i}
                onClick={() => setProblem(ex)}
                style={{
                  color: '#4ADE80',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                Example {i + 1}
              </button>
            ))}
          </div>
          <Button
            onClick={handleSolve}
            disabled={!problem.trim() || isLoading}
            style={{
              background: !problem.trim() || isLoading ? '#1F1F1F' : '#4ADE80',
              color: !problem.trim() || isLoading ? '#888888' : '#0A0A0A',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '-0.02em',
              padding: '10px 20px',
              gap: '8px',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                Solving...
              </>
            ) : (
              <>
                <Send style={{ width: '14px', height: '14px' }} />
                Solve
              </>
            )}
          </Button>
        </div>
        <p style={{ color: '#888888', fontSize: '12px' }}>Tip: Press Cmd/Ctrl + Enter to solve</p>
      </div>

      {/* Steps output */}
      <AnimatePresence>
        {steps.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2
              style={{
                color: '#888888',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ChevronRight style={{ width: '14px', height: '14px', color: '#4ADE80' }} />
              SOLUTION STEPS
            </h2>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="step-card"
                style={{ padding: '20px' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      border: '1px solid #2A2A2A',
                      background: '#1A1A1A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <span style={{ color: '#4ADE80', fontSize: '11px', fontWeight: 700 }}>{index + 1}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, lineHeight: 1.7, color: '#CCCCCC' }}>
                    <RichContent content={step.content} />
                    {step.isStreaming && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: '8px',
                          height: '16px',
                          marginLeft: '4px',
                          background: '#4ADE80',
                          animation: 'pulse 1s ease-in-out infinite',
                        }}
                      />
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
