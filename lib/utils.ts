import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse text containing LaTeX and return segments for rendering
 */
export type TextSegment =
  | { type: 'text'; content: string }
  | { type: 'inline-math'; content: string }
  | { type: 'block-math'; content: string };

export function parseLatex(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const blockStart = remaining.indexOf('$$');
    const inlineStart = remaining.indexOf('$');

    if (blockStart === -1 && inlineStart === -1) {
      segments.push({ type: 'text', content: remaining });
      break;
    }

    if (blockStart !== -1 && (inlineStart === -1 || blockStart <= inlineStart)) {
      if (blockStart > 0) {
        segments.push({ type: 'text', content: remaining.slice(0, blockStart) });
      }
      const blockEnd = remaining.indexOf('$$', blockStart + 2);
      if (blockEnd === -1) {
        segments.push({ type: 'text', content: remaining.slice(blockStart) });
        break;
      }
      segments.push({
        type: 'block-math',
        content: remaining.slice(blockStart + 2, blockEnd),
      });
      remaining = remaining.slice(blockEnd + 2);
    } else if (inlineStart !== -1) {
      if (remaining[inlineStart + 1] === '$') {
        if (inlineStart > 0) {
          segments.push({ type: 'text', content: remaining.slice(0, inlineStart) });
        }
        const blockEnd = remaining.indexOf('$$', inlineStart + 2);
        if (blockEnd === -1) {
          segments.push({ type: 'text', content: remaining.slice(inlineStart) });
          break;
        }
        segments.push({
          type: 'block-math',
          content: remaining.slice(inlineStart + 2, blockEnd),
        });
        remaining = remaining.slice(blockEnd + 2);
      } else {
        if (inlineStart > 0) {
          segments.push({ type: 'text', content: remaining.slice(0, inlineStart) });
        }
        const inlineEnd = remaining.indexOf('$', inlineStart + 1);
        if (inlineEnd === -1) {
          segments.push({ type: 'text', content: remaining.slice(inlineStart) });
          break;
        }
        segments.push({
          type: 'inline-math',
          content: remaining.slice(inlineStart + 1, inlineEnd),
        });
        remaining = remaining.slice(inlineEnd + 1);
      }
    } else {
      segments.push({ type: 'text', content: remaining });
      break;
    }
  }

  return segments;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getXPForNextLevel(currentXP: number): { current: number; needed: number; progress: number } {
  const XP_PER_LEVEL = 100;
  const xpInCurrentLevel = currentXP % XP_PER_LEVEL;
  return {
    current: xpInCurrentLevel,
    needed: XP_PER_LEVEL,
    progress: (xpInCurrentLevel / XP_PER_LEVEL) * 100,
  };
}
