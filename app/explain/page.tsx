import type { Metadata } from 'next';
import { ConceptExplainer } from '@/components/features/ConceptExplainer';
import { Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Concept Explainer — OrbitStudy',
};

export default function ExplainPage() {
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#E07A5F]/20 border border-[#E07A5F]/50 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-[#E07A5F]" />
          </div>
          <h1 className="text-2xl font-bold text-[#FFF5F5]">Concept Explainer</h1>
        </div>
        <p className="text-[rgba(255,245,245,0.5)] text-sm pl-11">
          Get bite-sized, structured explanations of any aerospace concept — optimized for focus and retention.
        </p>
      </div>
      <ConceptExplainer />
    </div>
  );
}
