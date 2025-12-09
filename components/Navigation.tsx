
import React from 'react';
import { ViewState } from '../types';
import { Home, Calendar, BrainCircuit, Users, ShoppingBag, BookOpen, Baby, UserCircle, Flower2, Moon, Heart, Sun } from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, toggleTheme, isDarkMode }) => {
  const navItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <Home size={22} /> },
    { id: 'cycle', label: 'Cycle', icon: <Calendar size={22} /> },
    { id: 'pregnancy', label: 'Baby', icon: <Baby size={22} /> },
    { id: 'reproductive-health', label: 'Health Hub', icon: <Flower2 size={22} /> },
    { id: 'symptom-ai', label: 'Luna AI', icon: <BrainCircuit size={22} /> },
    { id: 'community', label: 'Talk', icon: <Users size={22} /> },
    { id: 'shop', label: 'Shop', icon: <ShoppingBag size={22} /> },
    { id: 'learn', label: 'Learn', icon: <BookOpen size={22} /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 h-screen fixed left-0 top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-colors duration-300">
        <div className="p-8 pb-6">
            {/* New Logo Design */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('dashboard')}>
                <div className="relative w-12 h-12 bg-gradient-to-tr from-rose-500 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/50 group-hover:shadow-rose-300 transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3">
                    <Moon size={24} fill="currentColor" className="text-white relative z-10" />
                    <Heart size={12} fill="#fbcfe8" className="absolute top-2.5 right-2.5 text-rose-200 z-20" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight leading-none">
                        Luna<span className="text-rose-500">Care</span>
                    </h1>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase mt-1">Health & Wellness</p>
                </div>
            </div>
        </div>

        <div className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar py-2">
          <p className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 mt-2">Menu</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`relative w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden active:scale-[0.98] ${
                currentView === item.id
                  ? 'bg-rose-50/80 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
              }`}
            >
              {/* Active Indicator Strip */}
              <div 
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-rose-500 rounded-r-full transition-all duration-300 ${
                    currentView === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`} 
              />
              
              <div className={`transition-transform duration-300 ${currentView === item.id ? 'scale-110 text-rose-500 dark:text-rose-400' : 'group-hover:scale-110 group-hover:text-rose-500 dark:group-hover:text-rose-400'}`}>
                {item.icon}
              </div>
              <span className="relative z-10">{item.label}</span>
              
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 dark:from-white/0 dark:via-white/5 dark:to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-20" />
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 space-y-2">
           {/* Theme Toggle */}
           <button 
             onClick={toggleTheme}
             className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all w-full group text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm active:scale-[0.98]"
           >
              <div className="bg-slate-200 dark:bg-slate-800 p-1.5 rounded-full group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
           </button>

           <button 
             onClick={() => setView('profile')}
             className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all w-full group active:scale-[0.98] ${
                currentView === 'profile'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-bold shadow-sm border border-rose-100 dark:border-rose-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 hover:shadow-sm'
              }`}
            >
             <div className="bg-slate-200 dark:bg-slate-800 p-1.5 rounded-full group-hover:bg-rose-100 dark:group-hover:bg-rose-900 transition-colors">
                 <UserCircle size={20} />
             </div>
             <span className="font-medium">My Profile</span>
           </button>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/60 z-50 px-2 py-1 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center overflow-x-auto no-scrollbar py-1">
          {navItems.slice(0, 5).map((item) => {
            const isActive = currentView === item.id;
            return (
                <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`relative flex flex-col items-center justify-center p-2 rounded-2xl min-w-[68px] transition-all duration-300 active:scale-90 ${
                    isActive ? 'text-rose-500 dark:text-rose-400 -translate-y-1' : 'text-slate-400 dark:text-slate-500'
                }`}
                >
                {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-b from-rose-50 to-transparent dark:from-rose-900/20 rounded-2xl -z-10 opacity-50" />
                )}
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                </div>
                <span className={`text-[9px] font-bold mt-1 transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-70'}`}>
                    {item.label}
                </span>
                
                {/* Active Dot */}
                {isActive && (
                    <span className="absolute -bottom-1 w-1 h-1 bg-rose-500 rounded-full animate-fade-in" />
                )}
                </button>
            );
          })}
           {/* Mobile Profile/Menu Trigger */}
          <button
              onClick={() => setView('profile')}
              className={`relative flex flex-col items-center justify-center p-2 rounded-2xl min-w-[68px] transition-all duration-300 active:scale-90 ${
                currentView === 'profile' ? 'text-rose-500 dark:text-rose-400 -translate-y-1' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <UserCircle size={22} />
              <span className="text-[9px] font-bold mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
