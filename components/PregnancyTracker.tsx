import React, { useState } from 'react';
import { Footprints, Calendar, Stethoscope, Ruler, Timer, X, RotateCcw } from 'lucide-react';

const PregnancyTracker: React.FC = () => {
  const [showKickCounter, setShowKickCounter] = useState(false);
  const [kickCount, setKickCount] = useState(0);

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-amber-300 to-orange-400 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Trimester 2</span>
                    <h2 className="text-4xl font-bold mt-2">Week 18</h2>
                    <p className="opacity-90 mt-1">Day 4</p>
                </div>
                <div className="bg-white text-orange-500 rounded-full w-24 h-24 flex items-center justify-center font-bold shadow-lg">
                    <div className="text-center">
                         <span className="block text-2xl">200</span>
                         <span className="text-xs uppercase">grams</span>
                    </div>
                </div>
            </div>
            
            <div className="mt-8">
                <p className="text-sm font-medium opacity-80 mb-2">Progress to due date</p>
                <div className="w-full bg-black/10 rounded-full h-3">
                    <div className="bg-white h-3 rounded-full w-[45%]"></div>
                </div>
                <div className="flex justify-between mt-2 text-sm font-medium">
                    <span>Started</span>
                    <span>45%</span>
                    <span>Due Jan 15</span>
                </div>
            </div>
        </div>

        {/* Baby Size Visualization */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl">
                🫑
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-lg">Your baby is the size of a Bell Pepper</h3>
                <p className="text-slate-500 text-sm mt-1">Baby is developing fingerprints and can hear sounds now!</p>
            </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
             <button 
                onClick={() => setShowKickCounter(true)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
             >
                <Footprints className="text-blue-400" size={32} />
                <span className="font-semibold text-slate-700">Kick Counter</span>
             </button>
             <button className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <Stethoscope className="text-rose-400" size={32} />
                <span className="font-semibold text-slate-700">Appointments</span>
             </button>
             <button className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <Ruler className="text-amber-400" size={32} />
                <span className="font-semibold text-slate-700">Weight Log</span>
             </button>
             <button className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                <Calendar className="text-violet-400" size={32} />
                <span className="font-semibold text-slate-700">Timeline</span>
             </button>
        </div>

        {/* Daily Insight */}
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
             <h3 className="text-blue-800 font-bold mb-2">Today's Tip</h3>
             <p className="text-blue-700 text-sm leading-relaxed">
                Back pain is common around week 18 as your center of gravity shifts. Try gentle prenatal yoga stretches or a warm compress.
             </p>
        </div>

        {/* Kick Counter Overlay */}
        {showKickCounter && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowKickCounter(false)}></div>
                <div className="relative bg-white rounded-3xl w-full max-w-sm p-8 text-center animate-fade-in shadow-2xl">
                    <button 
                        onClick={() => setShowKickCounter(false)}
                        className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200"
                    >
                        <X size={20} />
                    </button>

                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Kick Counter</h3>
                    <p className="text-slate-500 text-sm mb-8">Tap the footprint every time you feel baby move.</p>

                    <button 
                        onClick={() => setKickCount(c => c + 1)}
                        className="w-48 h-48 bg-blue-50 rounded-full flex flex-col items-center justify-center mx-auto border-4 border-blue-100 active:scale-95 transition-transform hover:bg-blue-100"
                    >
                        <Footprints className="text-blue-500 mb-2" size={48} />
                        <span className="text-5xl font-bold text-blue-600">{kickCount}</span>
                    </button>

                    <div className="flex justify-center mt-8 gap-4">
                        <button 
                             onClick={() => setKickCount(0)}
                             className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <RotateCcw size={16} /> Reset
                        </button>
                        <button 
                             onClick={() => setShowKickCounter(false)}
                             className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default PregnancyTracker;