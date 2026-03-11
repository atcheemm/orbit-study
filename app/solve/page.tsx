import type { Metadata } from 'next';
import { StepSolver } from '@/components/features/StepSolver';

export const metadata: Metadata = {
  title: 'Step Solver — Aerospace Study',
};

export default function SolvePage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] mb-2">Step-by-Step Solver</h1>
        <p className="text-[#6B6B6B] text-sm">
          Enter any aerospace engineering problem and get a detailed, step-by-step solution with LaTeX math rendering.
        </p>
      </div>
      <StepSolver />
    </div>
  );
}
