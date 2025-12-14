import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Minimize2, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Language } from "../types";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface ChatbotProps {
  lang: Language;
}

// DEV: backend na localhost:4000
// PROD: backend na HTTPS, api.inteli-it.com:4443
const isProd =
  typeof import.meta !== "undefined" &&
  (import.meta as any).env &&
  (import.meta as any).env.PROD;

const API_BASE = isProd
  ? "https://api.inteli-it.com:4443"
  : "http://localhost:4000";

const Chatbot: React.FC<ChatbotProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingLead, setIsSendingLead] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [utmParams, setUtmParams] = useState<Record<string, string> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // wiadomość powitalna
  useEffect(() => {
    const welcomeText =
      lang === "pl"
        ? "Cześć! Jestem wirtualnym asystentem Inteli-IT. W czym mogę Ci pomóc w kwestii automatyzacji?"
        : "Hello! I am the Inteli-IT virtual assistant. How can I help you with automation? (I respond best in Polish)";

    setMessages([{ role: "assistant", text: welcomeText }]);
    setLeadSent(false);
  }, [lang]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source");
    const medium = params.get("utm_medium");
    const campaign = params.get("utm_campaign");
    const term = params.get("utm_term");
    const content = params.get("utm_content");

    const collected: Record<string, string> = {};

    if (source) collected.utm_source = source;
    if (medium) collected.utm_medium = medium;
    if (campaign) collected.utm_campaign = campaign;
    if (term) collected.utm_term = term;
    if (content) collected.utm_content = content;

    if (Object.keys(collected).length > 0) {
      setUtmParams(collected);
    }
  }, []);

  const callChatApi = async (allMessages: Message[]): Promise<string> => {
    const res = await fetch(`${API_BASE}/api/inteli-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: allMessages }),
    });

    if (!res.ok) {
      console.error("Chat API status:", res.status);
      throw new Error("Chat API error");
    }

    const data = await res.json();
    return data.reply as string;
  };

  // event jako any, żeby móc wywołać to też z onKeyDown
  const handleSend = async (e: any) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    const newMessages: Message[] = [
      ...messages,
      { role: "user", text: userText },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const reply = await callChatApi(newMessages);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            lang === "pl"
              ? "Przepraszam, wystąpił błąd połączenia z serwerem. Spróbuj ponownie za chwilę."
              : "Sorry, there was a server error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // automatyczne wysłanie rozmowy jako leada – tylko jeśli użytkownik podał jakieś dane kontaktowe (np. mail)
  const sendLeadIfNeeded = async () => {
    if (isSendingLead || leadSent) return;

    // jeśli użytkownik nic nie napisał, nie ma sensu nic wysyłać
    const hasUserMessage = messages.some((m) => m.role === "user");
    if (!hasUserMessage) return;

    // nie wysyłaj leada, jeśli w żadnej wiadomości użytkownika nie ma nic, co wygląda jak mail (zawiera "@")
    const hasContactHint = messages.some(
      (m) => m.role === "user" && m.text.includes("@")
    );
    if (!hasContactHint) return;

    setIsSendingLead(true);

    try {
      const payload: any = { messages };

      if (utmParams) {
        payload.utm = utmParams;
      }

      const res = await fetch(`${API_BASE}/api/inteli-chat/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Lead API error");
      }

      setLeadSent(true);

      // krótka informacja tylko wtedy, gdy realnie coś wysłaliśmy
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            lang === "pl"
              ? "Przekazałem transkrypt tej rozmowy do zespołu Inteli-IT. Ktoś odezwie się do Ciebie w sprawie dalszych kroków."
              : "I’ve sent this conversation to the Inteli-IT team. Someone will reach out to you regarding next steps.",
        },
      ]);
    } catch (error) {
      console.error("Lead send error:", error);
      // w trybie automatycznym nie pokazujemy błędu użytkownikowi, tylko logujemy
    } finally {
      setIsSendingLead(false);
    }
  };

  const closeChat = () => {
    // przy zamknięciu czatu spróbuj automatycznie wysłać leada
    void sendLeadIfNeeded();
    setIsOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
            role="dialog"
            aria-label={lang === 'pl' ? 'Asystent Chat' : 'Chat Assistant'}
          >
            {/* Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">
                    Inteli-IT Assistant
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-slate-400 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={closeChat}
                  aria-label={lang === 'pl' ? 'Zamknij czat' : 'Close chat'}
                  className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    <span className="text-xs text-slate-500">
                      {lang === "pl" ? "Piszę..." : "Typing..."}
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 backdrop-blur-md space-y-2">
              <form onSubmit={handleSend} className="relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (inputRef.current) {
                      inputRef.current.style.height = "auto";
                      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!isLoading && input.trim()) {
                        handleSend(e);
                      }
                    }
                    // Shift+Enter -> normalna nowa linia
                  }}
                  placeholder={
                    lang === "pl" ? "Wpisz wiadomość..." : "Type a message..."
                  }
                  rows={1}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 resize-none max-h-40"
                  aria-label={lang === "pl" ? "Wpisz wiadomość" : "Type a message"}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label={lang === 'pl' ? 'Wyślij wiadomość' : 'Send message'}
                  className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (isOpen) {
            closeChat();
          } else {
            setIsOpen(true);
          }
        }}
        aria-label={isOpen ? (lang === 'pl' ? 'Zamknij czat' : 'Close chat') : (lang === 'pl' ? 'Otwórz czat' : 'Open chat')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center justify-center text-white z-50 hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] transition-shadow"
      >
        <span className="sr-only">{isOpen ? (lang === 'pl' ? 'Zamknij czat' : 'Close chat') : (lang === 'pl' ? 'Otwórz czat' : 'Open chat')}</span>
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </>
  );
};

export default Chatbot;