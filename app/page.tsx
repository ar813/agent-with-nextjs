"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, Menu, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = { id: number; from: "user" | "bot"; text: string };

export default function ChatbotUI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
      text: "Hello! I am your advanced AI assistant. Ready to explore ideas with you.",
    },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const startNewChat = () => {
    setMessages([
      {
        id: Date.now(),
        from: "bot",
        text: "Hello! I am your advanced AI assistant. Ready to explore ideas with you.",
      },
    ]);
    setSidebarOpen(false); // Close mobile sidebar if open
  };

  async function sendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const t = text.trim();
    if (!t) return;

    const userMsg: Message = { id: Date.now(), from: "user", text: t };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setLoading(true);

    try {
      const res = await fetch("https://arsalan-ai-backend.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: t }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Server error");
      }

      const data = await res.json();
      const botText = data.reply ?? "I received an empty response.";

      const botMsg: Message = {
        id: Date.now() + 1,
        from: "bot",
        text: botText,
      };
      setMessages((m) => [...m, botMsg]);
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      const botMsg: Message = {
        id: Date.now() + 1,
        from: "bot",
        text: `Error: ${errorMessage}`,
      };
      setMessages((m) => [...m, botMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar - Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:relative inset-y-0 left-0 z-40 w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 px-2 py-4 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
              <Bot className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Nexus AI
            </span>
          </div>

          <button onClick={startNewChat} className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span className="font-medium">New Chat</span>
          </button>

        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex-none h-16 px-4 md:px-6 flex items-center justify-between border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-400 hover:text-white md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm text-slate-400 hidden sm:inline">Model: OpenRouter/auto</span>
            </div>
          </div>
        </header>

        {/* Chat List */}
        <main
          ref={listRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${m.from === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {/* Bot Avatar (Left) */}
                {m.from === "bot" && (
                  <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <Bot className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
                  </div>
                )}

                <div
                  className={`flex flex-col max-w-[85%] md:max-w-[70%] space-y-1 ${m.from === "user" ? "items-end" : "items-start"
                    }`}
                >
                  <span className="text-xs text-slate-500 ml-1">
                    {m.from === 'user' ? 'You' : 'Assistant'}
                  </span>
                  <div
                    className={`px-5 py-4 rounded-2xl text-sm md:text-base leading-relaxed overflow-hidden shadow-lg ${m.from === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-900/20"
                      : "bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none shadow-black/20"
                      }`}
                  >
                    {/* Markdown Renderer - Wrapped in div to fix className error */}
                    <div className={`prose prose-invert prose-sm max-w-none ${m.from === 'user' ? 'text-white prose-headings:text-white prose-strong:text-white' : ''}`}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          code: ({ node, ...props }) => (
                            <code className="bg-black/30 px-1 py-0.5 rounded text-sm font-mono text-amber-200" {...props} />
                          ),
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          pre: ({ node, ...props }) => (
                            <pre className="p-4 bg-black/40 rounded-lg overflow-x-auto my-3 border border-slate-800" {...props} />
                          ),
                        }}
                      >
                        {m.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>

                {/* User Avatar (Right) */}
                {m.from === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-indigo-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <Bot className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
              </div>
              <div className="bg-slate-900 border border-slate-800 px-5 py-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
              </div>
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="flex-none p-4 md:p-6 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800 z-20">
          <div className="max-w-4xl mx-auto relative">
            <form
              onSubmit={sendMessage}
              className="relative group rounded-xl bg-slate-900 border border-slate-800 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300 shadow-xl"
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="w-full bg-transparent border-none text-slate-100 placeholder:text-slate-500 px-4 py-4 pr-14 focus:ring-0 rounded-xl"
              />
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            <div className="text-center mt-3">
              <p className="text-[10px] text-slate-600 font-medium tracking-widest uppercase flex items-center justify-center gap-2">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Driven by Generative Intelligence
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
