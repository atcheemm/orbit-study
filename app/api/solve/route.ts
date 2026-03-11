import { NextRequest, NextResponse } from 'next/server';
import { stepByStepSolver } from '@/lib/claude';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { problem, context } = await request.json();

    if (!problem || typeof problem !== 'string') {
      return NextResponse.json({ error: 'Problem is required' }, { status: 400 });
    }

    const stream = await stepByStepSolver(problem, context || '');

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Solve API error:', error);
    return NextResponse.json(
      { error: 'Failed to solve problem. Check your API key.' },
      { status: 500 }
    );
  }
}
