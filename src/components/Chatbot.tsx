import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatAboutCar } from '../services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'model', text: 'Hi! I am the CarWise-AI assistant. Ask me anything about cars, reliability, or specs!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const reply = await chatAboutCar(userMessage, messages);
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 bg-[#141414] text-[#E4E3E0] rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform z-50",
          isOpen && "hidden"
        )}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white border border-[#141414] shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="bg-[#141414] text-[#E4E3E0] p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span className="font-bold uppercase tracking-wider text-sm">CarWise Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#E4E3E0]/30">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("max-w-[85%] rounded-md p-3 text-sm", msg.role === 'user' ? "bg-[#141414] text-[#E4E3E0] self-end ml-auto" : "bg-white border border-[#141414]/20 text-[#141414] mr-auto")}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="bg-white border border-[#141414]/20 text-[#141414] mr-auto max-w-[85%] rounded-md p-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs font-mono uppercase opacity-50">Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="border-t border-[#141414]/20 bg-white p-3 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask about a car..." 
                className="flex-1 bg-[#E4E3E0]/50 px-3 py-2 focus:outline-none focus:bg-[#E4E3E0] transition-colors rounded-none"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={isTyping || !input.trim()}
                className="bg-[#141414] text-[#E4E3E0] px-3 py-2 disabled:opacity-50 hover:bg-[#333] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
