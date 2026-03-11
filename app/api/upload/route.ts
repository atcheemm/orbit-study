import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, cleanExtractedText } from '@/lib/pdf';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'text/plain'];
    const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isText = file.type === 'text/plain' || file.name.endsWith('.txt');

    if (!isPDF && !isText && !allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF and text files are supported' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let text = '';

    if (isPDF) {
      text = await extractTextFromPDF(buffer);
    } else {
      text = buffer.toString('utf-8');
    }

    const cleanedText = cleanExtractedText(text);

    return NextResponse.json({
      name: file.name,
      text: cleanedText,
      type: file.type || 'application/pdf',
      size: file.size,
      preview: cleanedText.slice(0, 500),
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Failed to process file. Make sure it is a valid PDF or text file.' },
      { status: 500 }
    );
  }
}
