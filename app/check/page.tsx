import type { Metadata } from 'next';
import { CheckWork } from '@/components/features/CheckWork';

export const metadata: Metadata = {
  title: 'Check My Work — Aerospace Study',
};

export default function CheckPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1C3A2A] mb-2">Check My Work</h1>
        <p className="text-[#6B6B5A] text-sm">
          Paste a problem and your attempt — get detailed feedback highlighting what you got right and what needs fixing.
        </p>
      </div>
      <CheckWork />
    </div>
  );
}
