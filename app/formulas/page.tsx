import type { Metadata } from 'next';
import { FormulaHub } from '@/components/features/FormulaHub';

export const metadata: Metadata = {
  title: 'Formula Hub — Aerospace Study',
};

export default function FormulasPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: '#0A1628' }}>Formula Hub</h1>
        <p className="text-sm" style={{ color: '#546E7A' }}>
          Searchable aerospace engineering formula reference. Upload your study materials to extract additional formulas.
        </p>
      </div>
      <FormulaHub />
    </div>
  );
}
