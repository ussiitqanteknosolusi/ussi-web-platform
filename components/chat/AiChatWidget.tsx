"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Load session
  useEffect(() => {
    const savedId = localStorage.getItem("ussi_ai_session");
    if (savedId) setSessionId(savedId);
  }, []);

  // Auto-greeting trigger
  useEffect(() => {
    // Only trigger if: 
    // 1. Never greeted in this session 
    // 2. Chat is currently empty
    
    const hasGreeted = sessionStorage.getItem("ussi_ai_greeted");
    if (hasGreeted || messages.length > 0) return;

    // Load welcome message in background
    setMessages([{
      role: "assistant",
      content: "Halo! Selamat datang di USSI ITS. Saya adalah Asisten AI Resmi PT. USSI ItQan Tekno Solusi. Ada yang bisa saya bantu terkait solusi perbankan mikro atau produk kami hari ini?",
    }]);
    sessionStorage.setItem("ussi_ai_greeted", "true");
  }, [messages.length]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          device: navigator.userAgent,
        }),
      });

      const data = await response.json();
      
      if (data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("ussi_ai_session", data.sessionId);
      }

      if (data.error) throw new Error(data.error);

      const aiMsg: Message = { role: "assistant", content: data.content };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Maaf, sedang ada kendala teknis pada sistem AI kami. Silakan coba sesaat lagi atau hubungi kami melalui WhatsApp." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show on public pages (not admin dashboard)
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) return null;

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-end p-4 sm:p-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto mb-0 sm:mb-4 w-full sm:w-[380px] md:w-[420px] h-[calc(100vh-140px)] sm:h-[600px] max-h-[640px] min-h-[350px] flex flex-col rounded-3xl overflow-hidden border border-slate-200 bg-white"
          >
            {/* Header */}
            <div className="bg-[#0d2a1f] p-4 text-white flex justify-between items-center bg-gradient-to-r from-[#0d2a1f] to-[#1a3d2f] shrink-0 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white/40 shadow-sm transition-colors">
                  <AvatarFallback className="bg-[#bc1e22] text-white">
                    <Bot size={22} strokeWidth={2.5} color="white" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white leading-tight">USSI AI Consultant</h3>
                  <p className="text-[10px] text-white/80 flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
                    Online | Konsultasi Cerdas
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-white hover:bg-white/10 rounded-full transition-all active:scale-90"
                    onClick={() => setIsOpen(false)}
                >
                  <Minimize2 size={20} />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-4 bg-slate-50/50 scroll-smooth custom-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col max-w-[92%] w-fit",
                    msg.role === "user" ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm break-words overflow-hidden",
                      msg.role === "user"
                        ? "bg-[#bc1e22] text-white rounded-tr-none"
                        : "bg-white text-slate-700 border border-slate-100 rounded-tl-none prose prose-slate prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-[#bc1e22] prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                    )}
                  >
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <ReactMarkdown
                        components={{
                          a: ({ ...props }) => {
                            const isWhatsApp = props.href?.includes("wa.me");
                            if (isWhatsApp) {
                              return (
                                <a
                                  {...props}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 bg-[#0d2a1f] hover:bg-[#1a3d2f] !text-white font-bold py-3 px-6 rounded-xl my-3 no-underline transition-all active:scale-95 shadow-lg shadow-[#0d2a1f]/10 w-fit group border border-white/10"
                                >
                                  <div className="bg-[#25D366] p-1 rounded-full group-hover:scale-110 transition-transform">
                                    <svg 
                                      viewBox="0 0 24 24" 
                                      className="w-3.5 h-3.5 fill-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                    </svg>
                                  </div>
                                  <span>
                                    {props.children}
                                  </span>
                                </a>
                              );
                            }
                            return (
                              <a 
                                {...props} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 font-semibold hover:underline decoration-2 underline-offset-2"
                              />
                            );
                          },
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </motion.div>
                  <span className="text-[10px] text-slate-400 mt-1.5 px-1 font-medium">
                    {msg.role === "assistant" ? "USSI AI Consultant" : "Anda"}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="flex flex-col items-start max-w-[85%]">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-100 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Ketik pertanyaan Anda..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="rounded-full bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#bc1e22]/30 h-11 text-sm pl-4"
                />
                <Button 
                    size="icon" 
                    className="rounded-full h-11 w-11 shrink-0 shadow-lg shadow-[#bc1e22]/20 bg-[#bc1e22] hover:bg-[#a01a1d] transition-transform active:scale-95" 
                    disabled={isLoading || !input.trim()}
                >
                  <Send size={18} />
                </Button>
              </form>
              <div className="flex items-center justify-center gap-1.5 mt-3 opacity-60">
                <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">
                  Official AI Consultant
                </span>
                <div className="h-1 w-1 bg-slate-300 rounded-full" />
                <span className="text-[9px] font-medium text-slate-500">
                  PT USSI ITS
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button - Only show when chat is closed */}
      {!isOpen && (
        <div className="relative pointer-events-auto">
          <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 border-4 border-white bg-[#0d2a1f] text-white"
          >
              <Bot size={32} color="white" strokeWidth={2} />
              {messages.length === 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-[#bc1e22] rounded-full border-2 border-white animate-pulse" />
              )}
          </motion.button>
          
          {/* Tooltip-like badge if messages hidden */}
          {messages.length > 0 && (
               <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-20 top-3 bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap pointer-events-none hidden md:block"
               >
                  <p className="text-[11px] font-bold text-slate-700">Lanjutkan Chat AI</p>
                  <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-8 border-transparent border-l-white" />
               </motion.div>
          )}
        </div>
      )}
    </div>


  );
}
