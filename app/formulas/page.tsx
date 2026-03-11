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
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-600/50 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Formula Hub</h1>
        </div>
        <p className="text-gray-400 text-sm pl-11">
          Searchable aerospace engineering formula reference. Upload your study materials to extract additional formulas.
        </p>
      </div>
      <FormulaHub />
    </div>
  );
}
