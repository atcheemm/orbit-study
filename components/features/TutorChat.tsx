'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, MessageCircle, Trash2, Bot, User } from 'lucide-react';
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
      <div className="bg-white border border-[#E0E0DA] border-b-0 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 border border-[#E0E0DA] bg-[#F4F4F0] flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#2D4A3E]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#1A1A1A] text-sm">Aerospace Study AI Tutor</h2>
            <p className="text-xs text-[#5C7A6B]">Socratic method</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessages([])}
            className="text-[#6B6B6B] hover:text-[#1A1A1A] text-xs gap-1.5"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white border border-[#E0E0DA] border-t-0 border-b-0">
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center gap-6 pt-8 text-center">
            <div className="w-16 h-16 border border-[#E0E0DA] bg-[#F4F4F0] flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-[#2D4A3E]" />
            </div>
            <div>
              <h3 className="text-[#1A1A1A] font-semibold mb-1">Ask me anything</h3>
              <p className="text-[#6B6B6B] text-sm max-w-sm">
                I use the Socratic method to help you discover answers yourself.
                {uploadedFiles.length > 0
                  ? ` I can see your ${uploadedFiles.length} uploaded file(s) for context.`
                  : ''}
              </p>
            </div>
            <div className="w-full space-y-1.5">
              <p className="text-xs text-[#6B6B6B] uppercase tracking-widest font-medium">Try asking:</p>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="w-full text-left p-3 bg-white border border-[#E0E0DA] hover:border-[#2D4A3E] text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
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
                <div className="w-7 h-7 border border-[#E0E0DA] bg-[#F4F4F0] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-[#2D4A3E]" />
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
                <div className="w-7 h-7 border border-[#E0E0DA] bg-[#F4F4F0] flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-[#6B6B6B]" />
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
              <div className="w-7 h-7 border border-[#E0E0DA] bg-[#F4F4F0] flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-[#2D4A3E]" />
              </div>
              <div className="max-w-[80%] chat-bubble-ai px-4 py-3 text-sm leading-relaxed">
                <RichContent content={streamingContent} />
                <span className="inline-block w-1.5 h-4 bg-[#2D4A3E] ml-1 animate-pulse" />
              </div>
            </motion.div>
          )}

          {isStreaming && !streamingContent && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 border border-[#E0E0DA] bg-[#F4F4F0] flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-[#2D4A3E]" />
              </div>
              <div className="chat-bubble-ai px-4 py-3">
                <div className="flex gap-1.5 items-center h-5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-[#2D4A3E] animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
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
      <div className="bg-white border border-[#E0E0DA] border-t-0 p-3">
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
            className="min-h-[44px] max-h-[120px] bg-white border-[#E0E0DA] text-[#1A1A1A] placeholder-[#6B6B6B] resize-none focus:border-[#2D4A3E] text-sm"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="bg-[#2D4A3E] hover:bg-[#1e332a] text-white shrink-0 self-end h-11 w-11 p-0"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-[#6B6B6B] mt-1.5 pl-1">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
