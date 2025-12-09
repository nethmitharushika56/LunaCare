import React, { useState, useRef, useEffect } from 'react';
import { analyzeSymptoms } from '../services/geminiService';
import { ChatMessage, UserProfile } from '../types';
import { Send, Bot, AlertTriangle, ShieldCheck } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; 

interface SymptomCheckerProps {
  user: UserProfile;
}

const SymptomChecker: React.FC<SymptomCheckerProps> = ({ user }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'model',
      text: `Hi ${user.name}, I'm Luna AI, your AI health assistant. I can help analyze your symptoms based on your cycle phase. How are you feeling today?`,
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const userContext = `Age: ${user.age}, Cycle Day: 12 (Follicular Phase), Goal: ${user.goal}`;
    const response = await analyzeSymptoms(input, userContext);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, modelMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-150px)] md:h-[calc(100vh-100px)] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                    <Bot size={24} />
                </div>
                <div>
                    <h3 className="font-bold">Luna AI Assistant</h3>
                    <p className="text-xs text-indigo-100 flex items-center gap-1">
                        <ShieldCheck size={12} /> Private & Secure
                    </p>
                </div>
            </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2 border-b border-amber-100 dark:border-amber-900/30 flex-shrink-0">
            <AlertTriangle size={14} />
            <span>Luna AI is not a doctor. In emergencies, please call 911 or visit a hospital.</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50 scroll-smooth" ref={scrollRef}>
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                        className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user' 
                            ? 'bg-violet-600 text-white rounded-br-none' 
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-none shadow-sm'
                        }`}
                    >
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-bl-none shadow-sm flex gap-2 items-center">
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                </div>
            )}
        </div>

        {/* Input */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your symptoms..."
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white"
                />
                <button 
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white p-3 rounded-xl transition-colors"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    </div>
  );
};

export default SymptomChecker;