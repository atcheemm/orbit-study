import type { Metadata } from 'next';
import { FormulaHub } from '@/components/features/FormulaHub';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Formula Hub — OrbitStudy',
};

export default function FormulasPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#81B29A]/20 border border-[#81B29A]/50 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#81B29A]" />
          </div>
          <h1 className="text-2xl font-bold text-[#FFF5F5]">Formula Hub</h1>
        </div>
        <p className="text-[rgba(255,245,245,0.5)] text-sm pl-11">
          Searchable aerospace engineering formula reference. Upload your study materials to extract additional formulas.
        </p>
      </div>
      <FormulaHub />
    </div>
  );
}
