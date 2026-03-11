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
          <div className="w-8 h-8 rounded-lg bg-yellow-600/30 border border-yellow-600/50 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Concept Explainer</h1>
        </div>
        <p className="text-gray-400 text-sm pl-11">
          Get bite-sized, structured explanations of any aerospace concept — optimized for focus and retention.
        </p>
      </div>
      <ConceptExplainer />
    </div>
  );
}
