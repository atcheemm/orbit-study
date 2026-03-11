import type { Metadata } from 'next';
import { StepSolver } from '@/components/features/StepSolver';
import { Footprints } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Step Solver — OrbitStudy',
};

export default function SolvePage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600/30 border border-purple-600/50 flex items-center justify-center">
            <Footprints className="w-4 h-4 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Step-by-Step Solver</h1>
        </div>
        <p className="text-gray-400 text-sm pl-11">
          Enter any aerospace engineering problem and get a detailed, step-by-step solution with LaTeX math rendering.
        </p>
      </div>
      <StepSolver />
    </div>
  );
}
