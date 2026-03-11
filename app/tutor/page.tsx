import type { Metadata } from 'next';
import { TutorChat } from '@/components/features/TutorChat';
import { MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Tutor — OrbitStudy',
};

export default function TutorPage() {
  return (
    <div className="p-6 h-[calc(100vh-3.5rem)] lg:h-screen flex flex-col">
      <div className="max-w-3xl mx-auto w-full mb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-violet-600/30 border border-violet-600/50 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">AI Tutor</h1>
        </div>
        <p className="text-gray-400 text-sm pl-11">
          Socratic-style tutoring that guides you to discover answers yourself.
        </p>
      </div>
      <div className="flex-1 max-w-3xl mx-auto w-full min-h-0">
        <TutorChat />
      </div>
    </div>
  );
}
