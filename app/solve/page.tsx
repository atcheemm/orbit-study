import type { Metadata } from 'next';
import { StepSolver } from '@/components/features/StepSolver';

export const metadata: Metadata = {
  title: 'Step Solver — Aerospace Study',
};

export default function SolvePage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: '#0A1628' }}>Step-by-Step Solver</h1>
        <p className="text-sm" style={{ color: '#546E7A' }}>
          Enter any aerospace engineering problem and get a detailed, step-by-step solution with LaTeX math rendering.
        </p>
      </div>
      <StepSolver />
    </div>
  );
}
