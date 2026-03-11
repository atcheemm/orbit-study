import type { Metadata } from 'next';
import { TutorChat } from '@/components/features/TutorChat';

export const metadata: Metadata = {
  title: 'AI Tutor — Aerospace Study',
};

export default function TutorPage() {
  return (
    <div className="p-8 h-[calc(100vh-3.5rem)] lg:h-screen flex flex-col">
      <div className="max-w-3xl mx-auto w-full mb-4">
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color: '#0A1628' }}>AI Tutor</h1>
        <p className="text-sm" style={{ color: '#546E7A' }}>
          Socratic-style tutoring that guides you to discover answers yourself.
        </p>
      </div>
      <div className="flex-1 max-w-3xl mx-auto w-full min-h-0">
        <TutorChat />
      </div>
    </div>
  );
}
