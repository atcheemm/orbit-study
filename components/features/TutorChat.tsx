'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, MessageSquare, Trash2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RichContent } from '@/components/math/LatexRenderer';
import { useStore } from '@/lib/store';
import type { Message } from '@/lib/claude';
import { cn } from '@/lib/utils';

export function TutorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { uploadedFiles, addXP, checkAndUpdateStreak } = useStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const context = uploadedFiles
    .map((f) => `--- ${f.name} ---\n${f.text.slice(0, 1000)}`)
    .join('\n\n');

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput('');
    checkAndUpdateStreak();

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage },
    ];
    setMessages(newMessages);
    setIsStreaming(true);
    setStreamingContent('');

    const questionWithContext = context
      ? `${userMessage}\n\n[Context from my study materials: ${context.slice(0, 1500)}]`
      : userMessage;

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionWithContext,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (!reader) throw new Error('No body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullResponse += decoder.decode(value, { stream: true });
        setStreamingContent(fullResponse);
      }

      setMessages([
        ...newMessages,
        { role: 'assistant', content: fullResponse },
      ]);
      setStreamingContent('');
      addXP(3);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'I had trouble responding. Please check your API key.',
        },
      ]);
      setStreamingContent('');
    } finally {
      setIsStreaming(false);
    }
  };

  const suggestedQuestions = [
    'What is the Tsiolkovsky rocket equation and when do I use it?',
    'Can you help me understand the Mach number in supersonic flow?',
    'How does orbital mechanics relate to real satellite missions?',
    'I\'m confused about moment of inertia in structural analysis',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div
        className="p-4 flex items-center justify-between"
        style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', borderBottom: 'none' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{ border: '1px solid #B0BEC5', background: '#E3F2FD' }}
          >
            <Bot className="w-4 h-4" style={{ color: '#1565C0' }} />
          </div>
          <div>
            <h2 className="font-semibold text-sm" style={{ color: '#0A1628' }}>Aerospace Study AI Tutor</h2>
            <p className="text-xs" style={{ color: '#1565C0' }}>Socratic method</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessages([])}
            className="text-xs gap-1.5"
            style={{ color: '#546E7A' }}
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ background: '#F0F4F8', border: '1px solid #B0BEC5', borderTop: 'none', borderBottom: 'none' }}
      >
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center gap-6 pt-8 text-center">
            <div
              className="w-16 h-16 flex items-center justify-center"
              style={{ border: '1px solid #B0BEC5', background: '#FFFFFF' }}
            >
              <MessageSquare className="w-8 h-8" style={{ color: '#1565C0' }} />
            </div>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: '#0A1628' }}>Ask me anything</h3>
              <p className="text-sm max-w-sm" style={{ color: '#546E7A' }}>
                I use the Socratic method to help you discover answers yourself.
                {uploadedFiles.length > 0
                  ? ` I can see your ${uploadedFiles.length} uploaded file(s) for context.`
                  : ''}
              </p>
            </div>
            <div className="w-full space-y-1.5">
              <p className="text-xs uppercase tracking-widest font-medium" style={{ color: '#546E7A' }}>Try asking:</p>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="w-full text-left p-3 text-sm transition-colors"
                  style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', color: '#546E7A' }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#1565C0')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#B0BEC5')}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'assistant' && (
                <div
                  className="w-7 h-7 flex items-center justify-center shrink-0 mt-1"
                  style={{ border: '1px solid #B0BEC5', background: '#E3F2FD' }}
                >
                  <Bot className="w-3.5 h-3.5" style={{ color: '#1565C0' }} />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] px-4 py-3 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'chat-bubble-user'
                    : 'chat-bubble-ai'
                )}
              >
                {msg.role === 'assistant' ? (
                  <RichContent content={msg.content} />
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === 'user' && (
                <div
                  className="w-7 h-7 flex items-center justify-center shrink-0 mt-1"
                  style={{ border: '1px solid #B0BEC5', background: '#FFFFFF' }}
                >
                  <User className="w-3.5 h-3.5" style={{ color: '#546E7A' }} />
                </div>
              )}
            </motion.div>
          ))}

          {isStreaming && streamingContent && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div
                className="w-7 h-7 flex items-center justify-center shrink-0 mt-1"
                style={{ border: '1px solid #B0BEC5', background: '#E3F2FD' }}
              >
                <Bot className="w-3.5 h-3.5" style={{ color: '#1565C0' }} />
              </div>
              <div className="max-w-[80%] chat-bubble-ai px-4 py-3 text-sm leading-relaxed">
                <RichContent content={streamingContent} />
                <span className="inline-block w-1.5 h-4 ml-1 animate-pulse" style={{ background: '#1565C0' }} />
              </div>
            </motion.div>
          )}

          {isStreaming && !streamingContent && (
            <div className="flex gap-3 justify-start">
              <div
                className="w-7 h-7 flex items-center justify-center"
                style={{ border: '1px solid #B0BEC5', background: '#E3F2FD' }}
              >
                <Bot className="w-3.5 h-3.5" style={{ color: '#1565C0' }} />
              </div>
              <div className="chat-bubble-ai px-4 py-3">
                <div className="flex gap-1.5 items-center h-5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 animate-bounce"
                      style={{ background: '#1565C0', animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        className="p-3"
        style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', borderTop: 'none' }}
      >
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask about any aerospace concept..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="min-h-[44px] max-h-[120px] resize-none text-sm"
            style={{ background: '#FFFFFF', border: '1px solid #B0BEC5', color: '#37474F' }}
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="shrink-0 self-end h-11 w-11 p-0"
            style={{ background: '#1565C0', color: '#FFFFFF' }}
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs mt-1.5 pl-1" style={{ color: '#546E7A' }}>
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
