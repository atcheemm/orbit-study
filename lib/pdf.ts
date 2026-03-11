// PDF processing utilities - server-side only
// Using dynamic import to avoid issues with pdf-parse in edge runtime

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to keep this server-side only
    const pdfParseModule = await import('pdf-parse');
    // Handle both default export and named export patterns
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParse = (pdfParseModule as any).default ?? pdfParseModule;
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export function cleanExtractedText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s{3,}/g, '\n\n')
    // Fix common PDF extraction artifacts
    .replace(/([a-z])\n([a-z])/g, '$1 $2')
    // Remove page numbers (common pattern)
    .replace(/^\d+\s*$/gm, '')
    // Trim each line
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
}

export function chunkText(text: string, maxChunkSize: number = 4000): string[] {
  const paragraphs = text.split('\n\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      currentChunk += '\n\n' + paragraph;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export function truncateForContext(text: string, maxLength: number = 6000): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '\n\n[... content truncated for context ...]';
}
