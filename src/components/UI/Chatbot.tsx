import React, { useEffect, useRef, useState } from 'react';
import { X, MessageCircle, Bot, Send, Loader2, Trash2 } from 'lucide-react';
import { createMemory, reply, STARTER_CHIPS, type ChatMemory, type ChatTurn } from '../../lib/chatEngine';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const WELCOME = "Hey — I'm Aryan's on-site assistant. Ask in plain English about his work, stack, internships, or how to reach him.";

function renderText(text: string, isUser: boolean) {
  return text.split('\n').map((line, i) => {
    const urlRegex = /(https?:\/\/[^\s<]+|(?:github\.com|linkedin\.com|researchgate\.net|mail\.google\.com|vercel\.app)[^\s<]*)/gi;
    const parts = line.split(urlRegex);
    return (
      <div key={i} className="mb-0.5 last:mb-0">
        {parts.map((part, j) => {
          const isUrl = /^(https?:\/\/)|^(github\.com|linkedin\.com|researchgate\.net|mail\.google\.com|vercel\.app)/i.test(part);
          if (isUrl) {
            const href = /^[a-z]+:\/\//i.test(part) ? part : `https://${part}`;
            return (
              <a
                key={`${i}-${j}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${isUser ? 'text-indigo-200 hover:text-white' : 'text-indigo-400 hover:underline'} font-medium break-all`}
              >
                {part.replace(/^https?:\/\//, '')}
              </a>
            );
          }
          const emailParts = part.split(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g);
          return (
            <React.Fragment key={`${i}-${j}`}>
              {emailParts.map((ep, k) =>
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(ep) ? (
                  <a
                    key={`${i}-${j}-${k}`}
                    href={`mailto:${ep}`}
                    className={`${isUser ? 'text-indigo-200 hover:text-white' : 'text-indigo-400 hover:underline'} font-medium`}
                  >
                    {ep}
                  </a>
                ) : (
                  <span key={`${i}-${j}-${k}`}>{ep}</span>
                )
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  });
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: WELCOME, sender: 'bot', timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chips, setChips] = useState<string[]>(STARTER_CHIPS);
  const memoryRef = useRef<ChatMemory>(createMemory());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
  }, [inputValue]);

  const history = (): ChatTurn[] =>
    messages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'bot', text: m.text }));

  const streamBot = (full: string) => {
    const id = `${Date.now()}-bot`;
    setMessages((prev) => [...prev, { id, text: '', sender: 'bot', timestamp: new Date() }]);

    let i = 0;
    const tick = () => {
      i = Math.min(full.length, i + (full.length > 280 ? 6 : 3));
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text: full.slice(0, i) } : m)));
      if (i < full.length) {
        window.setTimeout(tick, 12);
      } else {
        setIsLoading(false);
      }
    };
    window.setTimeout(tick, 80);
  };

  const ask = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || isLoading) return;

    if (/^(clear|reset)$/i.test(trimmed)) {
      memoryRef.current = createMemory();
      setMessages([{ id: '0', text: 'Chat cleared. What should we cover next?', sender: 'bot', timestamp: new Date() }]);
      setChips(STARTER_CHIPS);
      setInputValue('');
      return;
    }

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    window.setTimeout(() => {
      const result = reply(trimmed, [...history(), { role: 'user', text: trimmed }], memoryRef.current);
      memoryRef.current = result.memory;
      setChips(result.suggestions);
      streamBot(result.text);
    }, 180 + Math.random() * 220);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 max-w-[calc(100vw-2rem)]">
      {isOpen ? (
        <div className="bg-[#11151f]/95 backdrop-blur-xl rounded-3xl shadow-2xl w-[92vw] max-w-md sm:w-[380px] h-[74vh] max-h-[640px] flex flex-col border border-white/10 overflow-hidden animate-scale-in">
          <div className="bg-gradient-to-r from-indigo-500/80 via-violet-500/80 to-fuchsia-500/80 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center border border-white/10">
                <Bot size={16} />
              </div>
              <div>
                <span className="font-semibold block text-sm leading-tight">Aryan Assistant</span>
                <span className="text-[10px] opacity-80 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Local model · no API
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  memoryRef.current = createMemory();
                  setMessages([{ id: '0', text: WELCOME, sender: 'bot', timestamp: new Date() }]);
                  setChips(STARTER_CHIPS);
                }}
                className="p-1.5 hover:bg-white/10 rounded-full"
                title="Clear chat"
              >
                <Trash2 size={15} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full" title="Close">
                <X size={15} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-black/20 to-black/45 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[90%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-none'
                      : 'bg-white/[0.05] text-slate-200 border border-white/5 rounded-bl-none'
                  }`}
                >
                  {renderText(message.text, message.sender === 'user')}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.sender === 'user' && (
              <div className="flex justify-start">
                <div className="bg-white/[0.05] px-4 py-3 rounded-2xl rounded-bl-none border border-white/5">
                  <div className="flex items-center gap-2">
                    <Loader2 size={13} className="animate-spin text-indigo-400" />
                    <span className="text-xs text-slate-400">Thinking…</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {chips.length > 0 && (
            <div className="px-3 pt-2 flex flex-wrap gap-1.5 border-t border-white/5 bg-black/20">
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  disabled={isLoading}
                  onClick={() => ask(chip)}
                  className="px-2.5 py-1 text-[11px] rounded-full border border-white/10 text-slate-300 hover:text-white hover:border-indigo-400/40 disabled:opacity-40"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 bg-black/30 shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    ask(inputValue);
                  }
                }}
                placeholder="Ask anything about Aryan…"
                className="flex-1 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white/[0.03] text-white placeholder-slate-500 leading-relaxed"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              <button
                onClick={() => ask(inputValue)}
                disabled={isLoading || !inputValue.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white p-2.5 rounded-xl shrink-0"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white w-14 h-14 rounded-full shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center"
          aria-label="Open chatbot"
        >
          <MessageCircle size={22} />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0b0e14]" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
