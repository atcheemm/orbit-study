import type { Metadata } from 'next';
import { TutorChat } from '@/components/features/TutorChat';

export const metadata: Metadata = {
  title: 'AI Tutor — AeroStudy',
};

export default function TutorPage() {
  return (
    <div style={{ padding: '0', background: '#0A0A0A', height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '32px 24px 0', borderBottom: '1px solid #1F1F1F' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '20px' }}>
          <div style={{ color: '#4ADE80', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px' }}>
            AI TUTOR
          </div>
          <h1 style={{ color: '#FFFFFF', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '6px' }}>
            Socratic AI Tutor
          </h1>
          <p style={{ color: '#888888', fontSize: '14px', lineHeight: 1.6, fontWeight: 300 }}>
            Guided discovery — the tutor asks questions to help you arrive at answers yourself.
          </p>
        </div>
      </div>
      <div style={{ flex: 1, padding: '0 24px 24px', minHeight: 0 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', height: '100%' }}>
          <TutorChat />
        </div>
      </div>
    </div>
  );
}
