import type { Metadata } from 'next';
import { ConceptExplainer } from '@/components/features/ConceptExplainer';

export const metadata: Metadata = {
  title: 'Concept Explainer — Aerospace Study',
};

export default function ExplainPage() {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] mb-2">Concept Explainer</h1>
        <p className="text-[#6B6B6B] text-sm">
          Get bite-sized, structured explanations of any aerospace concept — optimized for focus and retention.
        </p>
      </div>
      <ConceptExplainer />
    </div>
  );
}
