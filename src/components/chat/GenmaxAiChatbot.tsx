import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Send, X, Bot, Sparkles, User, RefreshCw, 
  ExternalLink, PhoneCall, CheckCircle2, ChevronDown, Minimize2 
} from 'lucide-react';
import { COMPANY_DETAILS } from '../../data/websiteContent';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface GenmaxAiChatbotProps {
  onOpenAudit: (serviceName?: string) => void;
}

const STARTER_PROMPTS = [
  "Can I get a Free SEO & Website Audit?",
  "What are your Web Development pricing packages?",
  "Where is your Noida headquarters located?",
  "How does your 7-14 day delivery work?",
];

export const GenmaxAiChatbot: React.FC<GenmaxAiChatbotProps> = ({ onOpenAudit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! 👋 I am the **Genmax IT Solution AI Consultant**, powered by Gemini. \n\nHow can I help you grow today? Ask me anything about our **100% White-Hat SEO**, **custom web & software engineering**, **pricing**, or request a **free 25-point audit**.",
      timestamp: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build history for context
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botReply = data.reply || "I'm here to help with all Genmax IT Solution services. Please let me know your project requirements!";

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: "I apologize, but I encountered a momentary connection issue. You can reach our senior engineering desk directly on WhatsApp at **+91 99383 07637** or click below to claim your **Free SEO Audit**.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  // Helper to render markdown bolding and bullet points cleanly
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Bullet point detection
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const cleanLine = isBullet ? line.trim().substring(1).trim() : line;

      // Handle simple bold tokens: **bold**
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const content = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 my-1">
            <span className="text-indigo-600 dark:text-cyan-400 mt-1 shrink-0">•</span>
            <span>{content}</span>
          </div>
        );
      }

      return (
        <p key={idx} className={line.trim() === '' ? 'h-2' : 'my-1'}>
          {content}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* ---------------- CHAT WINDOW ---------------- */}
      {isOpen && (
        <div 
          className="w-[92vw] sm:w-[410px] h-[580px] max-h-[82vh] rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200 mb-3"
          role="dialog"
          aria-label="Genmax AI Consultant Chatbot"
        >
          {/* Header */}
          <div className="p-4 sm:p-4.5 bg-gradient-to-r from-indigo-900 via-slate-900 to-[#0F172A] text-white flex items-center justify-between border-b border-indigo-900/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-md">
                  <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-cyan-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
              </div>
              
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-tight">Genmax AI Consultant</h3>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online • Gemini 3.8 Flash</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Minimize Chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Strip */}
          <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">Headquarters: Sector-45 Noida</span>
            <button
              onClick={() => {
                onOpenAudit('AI Chat Consultation');
              }}
              className="text-indigo-600 dark:text-cyan-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Claim Free Audit</span>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-[13px] bg-slate-50/50 dark:bg-[#0B1020]/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 rounded-bl-xs'
                  }`}
                >
                  {renderFormattedText(msg.text)}

                  <div
                    className={`text-[10px] mt-1.5 flex items-center gap-1 ${
                      msg.role === 'user' ? 'text-indigo-100 justify-end' : 'text-slate-400 dark:text-slate-500 justify-start'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="px-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] text-slate-500 ml-1">Analyzing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          {messages.length <= 3 && (
            <div className="px-3 py-2 bg-white dark:bg-[#0F172A] border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200/80 dark:border-slate-700/60 transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about SEO, web dev, pricing, or Noida office..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 transition-colors"
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:opacity-95 disabled:opacity-40 transition-opacity cursor-pointer shadow-md"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1 pt-2">
              <span>Direct Hotline: {COMPANY_DETAILS.phoneDisplay}</span>
              <a
                href={COMPANY_DETAILS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>WhatsApp Live Desk</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- LAUNCHER BUTTON ---------------- */}
      <div className="flex items-center gap-3">
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xl cursor-pointer hover:border-indigo-500 dark:hover:border-cyan-400 transition-all group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold">Chat with Genmax AI</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400 group-hover:rotate-12 transition-transform" />
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group flex items-center justify-center w-14 h-14 rounded-full text-white shadow-2xl transition-all cursor-pointer ${
            isOpen
              ? 'bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 rotate-90'
              : 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 hover:scale-105 shadow-indigo-500/30'
          }`}
          aria-label={isOpen ? 'Close chat' : 'Open Genmax AI chat'}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-7 h-7" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

    </div>
  );
};
