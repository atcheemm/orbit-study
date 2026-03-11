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
          content: '⚠️ I had trouble responding. Please check your API key.',
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
      <div className="bg-[#2e2924] border border-[#3A5253] rounded-t-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#81B29A] to-[#E07A5F] flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#27231E]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#FFF5F5] text-sm">OrbitStudy AI Tutor</h2>
            <p className="text-xs text-[#81B29A] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#81B29A] inline-block" />
              Socratic method
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessages([])}
            className="text-[rgba(255,245,245,0.4)] hover:text-[#E07A5F] text-xs gap-1.5"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#27231E] border-x border-[#3A5253]">
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center gap-6 pt-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#81B29A]/20 border border-[#81B29A]/30 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-[#81B29A]" />
            </div>
            <div>
              <h3 className="text-[#FFF5F5] font-semibold mb-1">Ask me anything!</h3>
              <p className="text-[rgba(255,245,245,0.5)] text-sm max-w-sm">
                I use the Socratic method to help you discover answers yourself.
                {uploadedFiles.length > 0
                  ? ` I can see your ${uploadedFiles.length} uploaded file(s) for context.`
                  : ''}
              </p>
            </div>
            <div className="w-full space-y-2">
              <p className="text-xs text-[rgba(255,245,245,0.3)] uppercase tracking-wide">Try asking:</p>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="w-full text-left p-3 bg-[#2e2924] border border-[#3A5253] hover:border-[#81B29A]/50 rounded-lg text-sm text-[rgba(255,245,245,0.5)] hover:text-[#FFF5F5] transition-all"
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#81B29A] to-[#E07A5F] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-[#27231E]" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'chat-bubble-user text-[#FFF5F5] rounded-tr-sm'
                    : 'chat-bubble-ai text-[#FFF5F5] rounded-tl-sm'
                )}
              >
                {msg.role === 'assistant' ? (
                  <RichContent content={msg.content} />
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#3A5253] flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-[rgba(255,245,245,0.6)]" />
                </div>
              )}
            </motion.div>
          ))}

          {isStreaming && streamingContent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#81B29A] to-[#E07A5F] flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-[#27231E]" />
              </div>
              <div className="max-w-[80%] chat-bubble-ai rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-[#FFF5F5]">
                <RichContent content={streamingContent} />
                <span className="inline-block w-1.5 h-4 bg-[#81B29A] ml-1 animate-pulse" />
              </div>
            </motion.div>
          )}

          {isStreaming && !streamingContent && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#81B29A] to-[#E07A5F] flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-[#27231E]" />
              </div>
              <div className="chat-bubble-ai rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center h-5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#81B29A] animate-bounce"
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
      <div className="bg-[#2e2924] border border-[#3A5253] rounded-b-xl p-3">
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
            className="min-h-[44px] max-h-[120px] bg-[#27231E] border-[#3A5253] text-[#FFF5F5] placeholder-[rgba(255,245,245,0.3)] resize-none focus:border-[#81B29A] text-sm"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="bg-[#81B29A] hover:bg-[#81B29A]/80 text-[#27231E] shrink-0 self-end h-11 w-11 p-0"
          >
            {isStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-[rgba(255,245,245,0.3)] mt-1.5 pl-1">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
