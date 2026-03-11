'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { RichContent } from '@/components/math/LatexRenderer';
import { useStore } from '@/lib/store';

const TOPICS = [
  { id: 'aerodynamics', label: 'Aerodynamics' },
  { id: 'thermodynamics', label: 'Thermodynamics' },
  { id: 'orbital-mechanics', label: 'Orbital Mechanics' },
  { id: 'structures', label: 'Structures' },
  { id: 'propulsion', label: 'Propulsion' },
  { id: 'flight-dynamics', label: 'Flight Dynamics' },
  { id: 'controls', label: 'Controls' },
  { id: 'fluid-mechanics', label: 'Fluid Mechanics' },
];

const DIFFICULTY_LABELS = ['', 'Introductory', 'Basic', 'Intermediate', 'Advanced', 'Expert'];

type ProblemState = {
  raw: string;
  showAnswer: boolean;
  solved: boolean;
};

export function PracticeGenerator() {
  const [selectedTopic, setSelectedTopic] = useState('aerodynamics');
  const [difficulty, setDifficulty] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [problem, setProblem] = useState<ProblemState | null>(null);
  const [xpGained, setXpGained] = useState(0);

  const { uploadedFiles, addXP, checkAndUpdateStreak } = useStore();

  const uploadedContent = uploadedFiles
    .map((f) => f.text)
    .join('\n\n')
    .slice(0, 3000);

  const handleGenerate = async () => {
    setIsLoading(true);
    setProblem(null);
    setXpGained(0);
    checkAndUpdateStreak();

    try {
      const response = await fetch('/api/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: TOPICS.find((t) => t.id === selectedTopic)?.label || selectedTopic,
          difficulty,
          uploadedContent,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate');
      const data = await response.json();
      setProblem({ raw: data.problem, showAnswer: false, solved: false });
    } catch {
      setProblem({
        raw: 'Failed to generate problem. Check your API key.',
        showAnswer: false,
        solved: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkSolved = () => {
    if (!problem || problem.solved) return;
    const gained = difficulty * 10;
    addXP(gained);
    setXpGained(gained);
    setProblem({ ...problem, solved: true });
  };

  const getDisplayContent = (raw: string, showAnswer: boolean) => {
    if (showAnswer) {
      return raw.replace(/\|\|HIDDEN\|\|/g, '');
    }
    return raw.replace(/\|\|HIDDEN\|\|[\s\S]*?\|\|HIDDEN\|\|/g, '[ Answer hidden — reveal when ready ]');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '860px' }}>
      {/* Configuration */}
      <div style={{ background: '#111111', border: '1px solid #1F1F1F', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.02em' }}>Configure Practice Problem</h2>

        {/* Topic selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ color: '#888888', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em' }}>TOPIC</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '6px' }}>
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                style={{
                  padding: '10px 12px',
                  fontSize: '13px',
                  fontWeight: 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  border: selectedTopic === topic.id ? '1px solid #4ADE80' : '1px solid #1F1F1F',
                  background: selectedTopic === topic.id ? '#0D1A12' : '#0A0A0A',
                  color: selectedTopic === topic.id ? '#4ADE80' : '#888888',
                }}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ color: '#888888', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em' }}>DIFFICULTY</label>
            <span style={{ color: '#4ADE80', fontSize: '12px', fontWeight: 700, border: '1px solid #1A2E1A', background: '#0D1A12', padding: '3px 10px' }}>
              {DIFFICULTY_LABELS[difficulty]}
            </span>
          </div>
          <Slider
            value={difficulty}
            onValueChange={(v) => setDifficulty(typeof v === 'number' ? v : Array.isArray(v) ? v[0] : difficulty)}
            min={1}
            max={5}
            step={1}
            className="w-full"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {DIFFICULTY_LABELS.slice(1).map((label) => (
              <span key={label} style={{ color: '#888888', fontSize: '11px' }}>{label}</span>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            background: isLoading ? '#1F1F1F' : '#4ADE80',
            color: isLoading ? '#888888' : '#0A0A0A',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '-0.02em',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => { if (!isLoading) (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
        >
          {isLoading ? (
            <>
              <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              Generate Problem
            </>
          )}
        </button>
      </div>

      {/* Problem display */}
      <AnimatePresence>
        {problem && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: '#111111', border: '1px solid #1F1F1F', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ background: '#0A0A0A', border: '1px solid #1F1F1F', color: '#888888', fontSize: '11px', fontWeight: 600, padding: '3px 10px', letterSpacing: '0.06em' }}>
                  {TOPICS.find((t) => t.id === selectedTopic)?.label?.toUpperCase()}
                </span>
                <span style={{ background: '#0D1A12', border: '1px solid #1A2E1A', color: '#4ADE80', fontSize: '11px', fontWeight: 600, padding: '3px 10px', letterSpacing: '0.06em' }}>
                  {DIFFICULTY_LABELS[difficulty].toUpperCase()}
                </span>
              </div>
              {problem.solved && (
                <span style={{ color: '#4ADE80', fontSize: '13px', fontWeight: 700 }}>+{xpGained} XP earned</span>
              )}
            </div>

            <div style={{ color: '#CCCCCC', lineHeight: 1.7, fontSize: '15px' }}>
              <RichContent content={getDisplayContent(problem.raw, problem.showAnswer)} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '16px', borderTop: '1px solid #1F1F1F', flexWrap: 'wrap' }}>
              <button
                onClick={() => setProblem({ ...problem, showAnswer: !problem.showAnswer })}
                style={{
                  border: '1px solid #1F1F1F',
                  background: 'transparent',
                  color: '#888888',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#4ADE80'; (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1F1F1F'; (e.currentTarget as HTMLElement).style.color = '#888888'; }}
              >
                {problem.showAnswer ? (
                  <><EyeOff style={{ width: '14px', height: '14px' }} />Hide Answer</>
                ) : (
                  <><Eye style={{ width: '14px', height: '14px' }} />Reveal Answer</>
                )}
              </button>

              {!problem.solved ? (
                <button
                  onClick={handleMarkSolved}
                  style={{
                    background: '#4ADE80',
                    color: '#0A0A0A',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    letterSpacing: '-0.01em',
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                >
                  Mark as Solved (+{difficulty * 10} XP)
                </button>
              ) : (
                <span style={{ color: '#4ADE80', fontSize: '13px', fontWeight: 700 }}>
                  ✓ Problem solved
                </span>
              )}

              <button
                onClick={handleGenerate}
                style={{
                  border: '1px solid #1F1F1F',
                  background: 'transparent',
                  color: '#888888',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginLeft: 'auto',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#4ADE80'; (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1F1F1F'; (e.currentTarget as HTMLElement).style.color = '#888888'; }}
              >
                Next Problem
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
