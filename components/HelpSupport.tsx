import React, { useState } from 'react';
import { ViewState } from '../types';
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageCircle, Mail, FileQuestion, Send } from 'lucide-react';

interface HelpSupportProps {
  setView: (view: ViewState) => void;
}

const FAQS = [
    {
        question: "How do I log my period?",
        answer: "Go to the 'Cycle' tab and click on the 'Log Today' button. You can select your flow intensity, symptoms, and mood for the day."
    },
    {
        question: "Is my data private?",
        answer: "Yes, LunaCare takes privacy seriously. Your data is stored locally on your device for this version, and any cloud features are encrypted. We do not sell your personal health data."
    },
    {
        question: "How does the AI prediction work?",
        answer: "Luna AI analyzes your historical cycle logs and symptoms to predict future cycle phases. The more you log, the more accurate it becomes."
    },
    {
        question: "Can I export my health data?",
        answer: "Absolutely. Go to your Profile and click on 'Monthly Health Report' to generate and download a PDF or text summary of your health logs."
    }
];

const HelpSupport: React.FC<HelpSupportProps> = ({ setView }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sent, setSent] = useState(false);

  const filteredFaqs = FAQS.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      setSent(true);
      setTimeout(() => {
          setSent(false);
          setContactMessage('');
      }, 3000);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
        <div className="flex items-center gap-4">
            <button onClick={() => setView('profile')} className="p-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Help & Support</h2>
        </div>

        {/* Search Bar */}
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Search for help..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
            />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-rose-100 dark:border-rose-900/30">
                <div className="bg-white dark:bg-rose-900/50 p-3 rounded-full text-rose-500 dark:text-rose-300">
                    <MessageCircle size={24} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Live Chat</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Available 9am - 5pm</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-indigo-100 dark:border-indigo-900/30">
                <div className="bg-white dark:bg-indigo-900/50 p-3 rounded-full text-indigo-500 dark:text-indigo-300">
                    <Mail size={24} />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Email Us</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Response in 24h</p>
            </div>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <FileQuestion size={18} className="text-slate-500" /> Frequently Asked Questions
                </h3>
            </div>
            <div>
                {filteredFaqs.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">No results found for "{searchQuery}"</div>
                ) : (
                    filteredFaqs.map((faq, index) => (
                        <div key={index} className="border-b border-slate-50 dark:border-slate-800 last:border-0">
                            <button 
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <span className="font-medium text-slate-700 dark:text-slate-200 text-sm pr-4">{faq.question}</span>
                                {openFaq === index ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                            </button>
                            {openFaq === index && (
                                <div className="px-4 pb-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/30">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
             <h3 className="font-bold text-slate-800 dark:text-white mb-4">Send us a message</h3>
             {sent ? (
                 <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-xl text-center font-medium animate-fade-in">
                     Message sent! We'll be in touch shortly.
                 </div>
             ) : (
                 <form onSubmit={handleSendMessage} className="space-y-4">
                     <textarea 
                        className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white text-sm resize-none"
                        placeholder="Describe your issue or suggestion..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        required
                     />
                     <button 
                        type="submit"
                        disabled={!contactMessage.trim()}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                        <Send size={16} /> Send Message
                     </button>
                 </form>
             )}
        </div>
    </div>
  );
};

export default HelpSupport;