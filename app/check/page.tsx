import type { Metadata } from 'next';
import { CheckWork } from '@/components/features/CheckWork';

export const metadata: Metadata = {
  title: 'Check My Work — Aerospace Study',
};

export default function CheckPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: '#0A1628' }}>Check My Work</h1>
        <p className="text-sm" style={{ color: '#546E7A' }}>
          Paste a problem and your attempt — get detailed feedback highlighting what you got right and what needs fixing.
        </p>
      </div>
      <CheckWork />
    </div>
  );
}
