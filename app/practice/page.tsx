import type { Metadata } from 'next';
import { PracticeGenerator } from '@/components/features/PracticeGenerator';

export const metadata: Metadata = {
  title: 'Practice Problems — AeroStudy',
};

export default function PracticePage() {
  return (
    <div style={{ padding: '48px 24px', background: '#0A0A0A', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px', paddingBottom: '24px', borderBottom: '1px solid #1F1F1F' }}>
          <div style={{ color: '#4ADE80', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '10px' }}>
            PRACTICE
          </div>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '10px' }}>
            Practice Problems
          </h1>
          <p style={{ color: '#888888', fontSize: '16px', lineHeight: 1.6, fontWeight: 300 }}>
            Generate aerospace engineering practice problems at your difficulty level. Earn XP for each problem you solve.
          </p>
        </div>
        <PracticeGenerator />
      </div>
    </div>
  );
}
