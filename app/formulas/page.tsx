import type { Metadata } from 'next';
import { FormulaHub } from '@/components/features/FormulaHub';

export const metadata: Metadata = {
  title: 'Formula Hub — OrbitStudy',
};

export default function FormulasPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] mb-2">Formula Hub</h1>
        <p className="text-[#6B6B6B] text-sm">
          Searchable aerospace engineering formula reference. Upload your study materials to extract additional formulas.
        </p>
      </div>
      <FormulaHub />
    </div>
  );
}
