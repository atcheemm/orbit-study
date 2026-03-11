import type { Metadata } from 'next';
import { PracticeGenerator } from '@/components/features/PracticeGenerator';
import { FlaskConical } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Practice Problems — OrbitStudy',
};

export default function PracticePage() {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-600/30 border border-cyan-600/50 flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Practice Problems</h1>
        </div>
        <p className="text-gray-400 text-sm pl-11">
          Generate aerospace engineering practice problems at your difficulty level. Earn XP for each problem you solve!
        </p>
      </div>
      <PracticeGenerator />
    </div>
  );
}
