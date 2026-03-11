import type { Metadata } from 'next';
import { PracticeGenerator } from '@/components/features/PracticeGenerator';

export const metadata: Metadata = {
  title: 'Practice Problems — Aerospace Study',
};

export default function PracticePage() {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1C3A2A] mb-2">Practice Problems</h1>
        <p className="text-[#6B6B5A] text-sm">
          Generate aerospace engineering practice problems at your difficulty level. Earn XP for each problem you solve.
        </p>
      </div>
      <PracticeGenerator />
    </div>
  );
}
