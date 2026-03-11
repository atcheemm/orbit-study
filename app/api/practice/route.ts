import { NextRequest, NextResponse } from 'next/server';
import { generatePracticeProblems } from '@/lib/claude';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, uploadedContent } = await request.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const problem = await generatePracticeProblems(
      topic,
      difficulty || 3,
      uploadedContent || ''
    );

    return NextResponse.json({ problem });
  } catch (error) {
    console.error('Practice API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate practice problem' },
      { status: 500 }
    );
  }
}
