import { NextRequest, NextResponse } from 'next/server';
import { checkWork } from '@/lib/claude';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { problem, userAttempt, context } = await request.json();

    if (!problem || !userAttempt) {
      return NextResponse.json(
        { error: 'Problem and user attempt are required' },
        { status: 400 }
      );
    }

    const stream = await checkWork(problem, userAttempt, context || '');

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Check work API error:', error);
    return NextResponse.json(
      { error: 'Failed to check work' },
      { status: 500 }
    );
  }
}
