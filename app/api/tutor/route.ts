import { NextRequest, NextResponse } from 'next/server';
import { socraticTutor } from '@/lib/claude';
import type { Message } from '@/lib/claude';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { question, conversationHistory } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const history: Message[] = Array.isArray(conversationHistory)
      ? conversationHistory
      : [];

    const stream = await socraticTutor(question, history);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Tutor API error:', error);
    return NextResponse.json(
      { error: 'Failed to get tutor response' },
      { status: 500 }
    );
  }
}
