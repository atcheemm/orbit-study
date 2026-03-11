import type { Metadata } from 'next';
import { PracticeGenerator } from '@/components/features/PracticeGenerator';

export const metadata: Metadata = {
  title: 'Practice Problems — Aerospace Study',
};

export default function PracticePage() {
  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: '#0A1628' }}>Practice Problems</h1>
        <p className="text-sm" style={{ color: '#546E7A' }}>
          Generate aerospace engineering practice problems at your difficulty level. Earn XP for each problem you solve.
        </p>
      </div>
      <PracticeGenerator />
    </div>
  );
}
