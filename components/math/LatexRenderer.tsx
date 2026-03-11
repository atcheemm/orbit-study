'use client';

import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { parseLatex } from '@/lib/utils';

interface LatexRendererProps {
  content: string;
  className?: string;
}

export function LatexRenderer({ content, className }: LatexRendererProps) {
  const segments = parseLatex(content);

  return (
    <span className={className}>
      {segments.map((segment, i) => {
        if (segment.type === 'inline-math') {
          return (
            <InlineMath key={i} math={segment.content} />
          );
        }
        if (segment.type === 'block-math') {
          return (
            <span key={i} className="block my-3 overflow-x-auto">
              <BlockMath math={segment.content} />
            </span>
          );
        }
        return <span key={i}>{segment.content}</span>;
      })}
    </span>
  );
}

interface LatexBlockProps {
  math: string;
  className?: string;
}

export function LatexBlock({ math, className }: LatexBlockProps) {
  return (
    <div className={`overflow-x-auto my-2 ${className || ''}`}>
      <BlockMath math={math} />
    </div>
  );
}

export function LatexInline({ math, className }: LatexBlockProps) {
  return <InlineMath math={math} />;
}

/**
 * Renders markdown-like text with LaTeX support
 * Handles **bold**, *italic*, numbered lists, and $...$ / $$...$$ math
 */
export function RichContent({ content, className }: LatexRendererProps) {
  const lines = content.split('\n');

  return (
    <div className={`space-y-1 ${className || ''}`}>
      {lines.map((line, i) => {
        if (line.trim() === '') return <div key={i} className="h-2" />;

        // Bold headers like **Step 1: ...**
        const isBoldHeader = line.trim().startsWith('**') && line.includes(':**');
        if (isBoldHeader) {
          const cleaned = line.replace(/\*\*/g, '');
          return (
            <div key={i} className="font-bold text-purple-300 mt-3">
              <LatexRenderer content={cleaned} />
            </div>
          );
        }

        // Numbered list
        const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
        if (numberedMatch) {
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-cyan-400 font-bold min-w-[1.5rem]">{numberedMatch[1]}.</span>
              <LatexRenderer content={numberedMatch[2]} />
            </div>
          );
        }

        // Bullet points
        if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
          const text = line.trim().slice(2);
          return (
            <div key={i} className="flex gap-2 items-start pl-2">
              <span className="text-purple-400 mt-1">•</span>
              <LatexRenderer content={text} />
            </div>
          );
        }

        // ## Headers
        if (line.startsWith('## ')) {
          return (
            <h2 key={i} className="text-lg font-bold text-cyan-300 mt-4 mb-2">
              <LatexRenderer content={line.slice(3)} />
            </h2>
          );
        }

        // ### Sub-headers
        if (line.startsWith('### ')) {
          return (
            <h3 key={i} className="font-semibold text-purple-300 mt-3 mb-1">
              <LatexRenderer content={line.slice(4)} />
            </h3>
          );
        }

        // Horizontal rule
        if (line.trim() === '---') {
          return <hr key={i} className="border-purple-800/40 my-3" />;
        }

        return (
          <div key={i}>
            <LatexRenderer content={line} />
          </div>
        );
      })}
    </div>
  );
}
