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
          <div className="w-8 h-8 rounded-lg bg-[#81B29A]/20 border border-[#81B29A]/50 flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-[#81B29A]" />
          </div>
          <h1 className="text-2xl font-bold text-[#FFF5F5]">Check My Work</h1>
        </div>
        <p className="text-[rgba(255,245,245,0.5)] text-sm pl-11">
          Paste a problem and your attempt — get detailed feedback highlighting what you got right and what needs fixing.
        </p>
      </div>
      <CheckWork />
    </div>
  );
}
