import type { Metadata } from 'next';
import { CheckWork } from '@/components/features/CheckWork';
import { CheckSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Check My Work — OrbitStudy',
};

export default function CheckPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-green-600/30 border border-green-600/50 flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Check My Work</h1>
        </div>
        <p className="text-gray-400 text-sm pl-11">
          Paste a problem and your attempt — get detailed feedback highlighting what you got right and what needs fixing.
        </p>
      </div>
      <CheckWork />
    </div>
  );
}
