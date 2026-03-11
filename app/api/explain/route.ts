import { NextRequest, NextResponse } from 'next/server';
import { explainConcept } from '@/lib/claude';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { concept, context } = await request.json();

    if (!concept || typeof concept !== 'string') {
      return NextResponse.json({ error: 'Concept is required' }, { status: 400 });
    }

    const stream = await explainConcept(concept, context || '');

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Explain API error:', error);
    return NextResponse.json(
      { error: 'Failed to explain concept' },
      { status: 500 }
    );
  }
}
