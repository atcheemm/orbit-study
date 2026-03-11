'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, MessageSquare, Trash2, Bot, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RichContent } from '@/components/math/LatexRenderer';
import { useStore } from '@/lib/store';
import type { Message } from '@/lib/claude';

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
    "I'm confused about moment of inertia in structural analysis",
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 220px)',
        minHeight: '500px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#111111',
          border: '1px solid #1F1F1F',
          borderBottom: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              background: '#1A1A1A',
              border: '1px solid #2A2A2A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Zap style={{ width: '14px', height: '14px', color: '#4ADE80' }} />
          </div>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px', letterSpacing: '-0.02em' }}>
              Aerospace Study AI Tutor
            </div>
            <div style={{ color: '#4ADE80', fontSize: '11px', fontWeight: 500 }}>Socratic method</div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            style={{
              color: '#888888',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#888888'; }}
          >
            <Trash2 style={{ width: '12px', height: '12px' }} />
            Clear
          </button>
        )}
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#0A0A0A',
          border: '1px solid #1F1F1F',
          borderTop: 'none',
          borderBottom: 'none',
        }}
      >
        {messages.length === 0 && !isStreaming && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              paddingTop: '40px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                border: '1px solid #1F1F1F',
                background: '#111111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageSquare style={{ width: '28px', height: '28px', color: '#4ADE80' }} />
            </div>
            <div>
              <h3 style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.03em', marginBottom: '8px' }}>
                Ask me anything
              </h3>
              <p style={{ color: '#888888', fontSize: '14px', lineHeight: 1.6, maxWidth: '420px' }}>
                I use the Socratic method to help you discover answers yourself.
                {uploadedFiles.length > 0
                  ? ` I have ${uploadedFiles.length} file(s) loaded for context.`
                  : ''}
              </p>
            </div>
            <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ color: '#888888', fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '4px' }}>
                TRY ASKING:
              </p>
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontSize: '14px',
                    background: '#111111',
                    border: '1px solid #1F1F1F',
                    color: '#888888',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#4ADE80';
                    (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#1F1F1F';
                    (e.currentTarget as HTMLElement).style.color = '#888888';
                  }}
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
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.role === 'assistant' && (
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    border: '1px solid #2A2A2A',
                    background: '#1A1A1A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '4px',
                  }}
                >
                  <Zap style={{ width: '13px', height: '13px', color: '#4ADE80' }} />
                </div>
              )}
              <div
                className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}
                style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  lineHeight: 1.7,
                }}
              >
                {msg.role === 'assistant' ? (
                  <RichContent content={msg.content} />
                ) : (
                  msg.content
                )}
              </div>
              {msg.role === 'user' && (
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    border: '1px solid #2A2A2A',
                    background: '#1A1A1A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '4px',
                  }}
                >
                  <User style={{ width: '13px', height: '13px', color: '#888888' }} />
                </div>
              )}
            </motion.div>
          ))}

          {isStreaming && streamingContent && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start' }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  border: '1px solid #2A2A2A',
                  background: '#1A1A1A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '4px',
                }}
              >
                <Zap style={{ width: '13px', height: '13px', color: '#4ADE80' }} />
              </div>
              <div
                className="chat-bubble-ai"
                style={{ maxWidth: '80%', padding: '12px 16px', fontSize: '14px', lineHeight: 1.7 }}
              >
                <RichContent content={streamingContent} />
                <span
                  style={{
                    display: 'inline-block',
                    width: '7px',
                    height: '14px',
                    marginLeft: '3px',
                    background: '#4ADE80',
                    animation: 'pulse 1s ease-in-out infinite',
                  }}
                />
              </div>
            </motion.div>
          )}

          {isStreaming && !streamingContent && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  border: '1px solid #2A2A2A',
                  background: '#1A1A1A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Zap style={{ width: '13px', height: '13px', color: '#4ADE80' }} />
              </div>
              <div className="chat-bubble-ai" style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center', height: '20px' }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: '6px',
                        height: '6px',
                        background: '#4ADE80',
                        animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite`,
                      }}
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
        style={{
          padding: '12px',
          background: '#111111',
          border: '1px solid #1F1F1F',
          borderTop: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
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
            style={{
              background: '#0A0A0A',
              border: '1px solid #1F1F1F',
              color: '#FFFFFF',
            }}
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            style={{
              flexShrink: 0,
              alignSelf: 'flex-end',
              width: '44px',
              height: '44px',
              background: !input.trim() || isStreaming ? '#1F1F1F' : '#4ADE80',
              color: !input.trim() || isStreaming ? '#888888' : '#0A0A0A',
              border: 'none',
              cursor: !input.trim() || isStreaming ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s',
            }}
          >
            {isStreaming ? (
              <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
            ) : (
              <Send style={{ width: '16px', height: '16px' }} />
            )}
          </button>
        </div>
        <p style={{ color: '#888888', fontSize: '11px', marginTop: '6px', paddingLeft: '2px' }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
