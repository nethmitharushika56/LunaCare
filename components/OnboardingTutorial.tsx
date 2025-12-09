
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowRight, Check, Sparkles, Moon, Heart } from 'lucide-react';

interface OnboardingTutorialProps {
  onComplete: (data: Partial<UserProfile>) => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  // Removed name state usage for input, but keeping variable if needed for logic, 
  // though we won't ask for it anymore.
  const [goal, setGoal] = useState<UserProfile['goal']>('track');
  const [mood, setMood] = useState<string>('');

  const nextStep = () => setStep(s => s + 1);

  const handleFinish = () => {
    // In a real app, we would save the initial mood log here too
    // We only send goal now since name input is removed
    onComplete({ goal });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in border border-slate-100">
        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 w-full">
            <div 
                className="h-full bg-rose-500 transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / 3) * 100}%` }}
            />
        </div>

        <div className="p-8">
            {/* Step 0: Welcome */}
            {step === 0 && (
                <div className="text-center space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-tr from-rose-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-rose-200 animate-bounce-slow relative">
                        <Moon size={48} fill="currentColor" className="text-white relative z-10" />
                        <Heart size={24} fill="#fbcfe8" className="absolute top-5 right-5 text-rose-200 z-20" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to LunaCare</h2>
                        <p className="text-slate-500 leading-relaxed">
                            Your holistic companion for reproductive health, cycle tracking, and wellness. Let's get you set up.
                        </p>
                    </div>
                    <button 
                        onClick={nextStep}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Get Started <ArrowRight size={20} />
                    </button>
                </div>
            )}

            {/* Step 1: Profile */}
            {step === 1 && (
                <div className="space-y-6 animate-slide-in-right">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">About You</h2>
                        <p className="text-slate-500">Personalize your experience to get better insights.</p>
                    </div>
                    
                    <div className="space-y-4">
                        {/* Name input removed as requested */}
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Current Goal</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(['track', 'conceive', 'pregnancy', 'health'] as const).map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGoal(g)}
                                        className={`px-3 py-3 rounded-xl text-sm font-medium border transition-all ${
                                            goal === g 
                                            ? 'border-rose-500 bg-rose-50 text-rose-700 scale-[1.02] shadow-sm' 
                                            : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                                        } capitalize active:scale-95`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={nextStep}
                        className="w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Next Step <ArrowRight size={20} />
                    </button>
                </div>
            )}

            {/* Step 2: First Log */}
            {step === 2 && (
                <div className="space-y-6 text-center animate-slide-in-right">
                     <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto text-violet-600 mb-4 animate-fade-in">
                        <Sparkles size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">How are you today?</h2>
                        <p className="text-slate-500">Logging your mood helps LunaCare provide better insights.</p>
                    </div>

                    <div className="flex justify-center gap-4">
                        {['😊', '😐', '😔', '😫'].map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => setMood(emoji)}
                                className={`w-14 h-14 text-2xl rounded-2xl border-2 transition-all active:scale-90 ${
                                    mood === emoji 
                                    ? 'border-violet-500 bg-violet-50 scale-110 shadow-md' 
                                    : 'border-slate-100 hover:border-violet-200 hover:bg-slate-50'
                                }`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>

                    <div className="pt-4">
                         <button 
                            onClick={handleFinish}
                            disabled={!mood}
                            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-violet-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Complete Setup <Check size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
