"use client";

import { useState, useEffect, useRef } from "react";
import { useCart, CartItem } from "./CartContext";

type Message = {
  role: "user" | "assistant";
  content: string;
  cartItem?: CartItem;
};

type AIShopkeeperProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AIShopkeeper({ isOpen, onOpenChange }: AIShopkeeperProps) {
  const { addItem, isInCart } = useCart();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<CartItem | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !started) {
      setStarted(true);
      sendGreeting();
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendGreeting = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: "Assalam o Alaikum" }] }),
      });
      const data = await res.json();
      if (data.reply) setMessages([{ role: "assistant", content: data.reply }]);
    } catch {
      setMessages([{ role: "assistant", content: "Assalam-o-Alaikum Janab! Main Ustaad Ji hoon — kya dhundh rahe hain aap?" }]);
    }
    setLoading(false);
  };

  // Extract phone details from AI response to show cart button
  const extractCartItem = (reply: string, inventory: CartItem[]): CartItem | null => {
    for (const phone of inventory) {
      if (reply.toLowerCase().includes(phone.model.toLowerCase()) &&
          reply.toLowerCase().includes(phone.storage.toLowerCase())) {
        return phone;
      }
    }
    return null;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Check if user is saying yes/interested
    const positiveIntent = /\b(yes|haan|ha|theek|okay|ok|lena|chahiye|add|cart|le lo|pasand|wahi|yahi|same|perfect|done|confirm)\b/i.test(input.trim());

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      if (data.reply) {
        const assistantMsg: Message = { role: "assistant", content: data.reply };

        // If user expressed positive intent and pending item exists, attach it
        if (positiveIntent && pendingCartItem) {
          assistantMsg.cartItem = pendingCartItem;
        }

        setMessages((prev) => [...prev, assistantMsg]);

        // Try to extract mentioned phone for future cart offer
        if (data.inventory) {
          const found = extractCartItem(data.reply, data.inventory);
          if (found) setPendingCartItem(found);
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Maaf kijiye, abhi technical masla aa gaya." }]);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => onOpenChange(false)} />
      <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-[#0a0a0a] border-white/20 shadow-[0_0_60px_rgba(59,130,246,0.25)] h-[85vh] rounded-t-3xl border-t border-l border-r lg:bottom-0 lg:right-0 lg:top-0 lg:left-auto lg:h-full lg:w-[420px] lg:rounded-none lg:rounded-l-3xl lg:border-l lg:border-t-0 lg:border-r-0">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/40 bg-amber-300/10 text-lg">🧔</div>
            <div>
              <p className="text-sm font-bold text-white">Ustaad Ji</p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs text-white/50">25 Saal Ka Tajurba • PhonesAI</p>
              </div>
            </div>
          </div>
          <button onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/50 transition hover:border-white/30 hover:text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}>
                {msg.role === "assistant" && (
                  <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-sm">🧔</div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-blue-500/20 text-white border border-blue-400/20"
                    : "rounded-tl-sm bg-white/5 text-white/85 border border-white/10"
                }`}>
                  {msg.content.split("\n").map((line, j) => (
                    <span key={j}>{line}{j < msg.content.split("\n").length - 1 && <br />}</span>
                  ))}
                </div>
              </div>

              {/* Add to Cart button after assistant message */}
              {msg.role === "assistant" && msg.cartItem && (
                <div className="ml-9 mt-2 flex items-center gap-2">
                  {isInCart(msg.cartItem.id) ? (
                    <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2">
                      <span className="text-xs font-semibold text-green-300">✓ Added to Cart</span>
                      <a href="/checkout?cart=true" className="text-xs text-blue-300 hover:underline">Checkout →</a>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        addItem(msg.cartItem!);
                        window.dispatchEvent(new CustomEvent("cartUpdated"));
                      }}
                      className="flex items-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/15 px-4 py-2 text-xs font-semibold text-blue-200 transition hover:bg-blue-500/25"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                      </svg>
                      Add {msg.cartItem.model} to Cart
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-sm">🧔</div>
              <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-white/10 px-4 py-4">
          <div className="flex gap-2">
            <input ref={inputRef} value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Apna sawaal likhein..."
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-blue-400/40" />
            <button onClick={sendMessage} disabled={loading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white transition hover:bg-blue-400 disabled:opacity-40">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-white/20">Powered by AI • PhonesAI • Wah Cantt</p>
        </div>
      </div>
    </>
  );
}