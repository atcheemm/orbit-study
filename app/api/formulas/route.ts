import { NextRequest, NextResponse } from 'next/server';
import { extractFormulas } from '@/lib/claude';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { pdfText } = await request.json();

    if (!pdfText || typeof pdfText !== 'string') {
      return NextResponse.json({ error: 'PDF text is required' }, { status: 400 });
    }

    const formulas = await extractFormulas(pdfText);
    return NextResponse.json({ formulas });
  } catch (error) {
    console.error('Formulas API error:', error);
    return NextResponse.json(
      { error: 'Failed to extract formulas' },
      { status: 500 }
    );
  }
}
