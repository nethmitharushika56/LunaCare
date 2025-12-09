import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplet, Thermometer, Smile, Calendar as CalendarIcon, Plus, X, Save } from 'lucide-react';
import { api } from '../services/api';
import { CycleDay } from '../types';

const CycleTracker: React.FC = () => {
  const [logs, setLogs] = useState<CycleDay[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy' | 'spotting' | undefined>(undefined);
  const [mood, setMood] = useState<string>('');
  const [temp, setTemp] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
        const data = await api.cycle.getLogs();
        setLogs(data);
    } catch (e) {
        console.error("Failed to load logs", e);
    } finally {
        setLoading(false);
    }
  };

  const handleSaveLog = async () => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: CycleDay = {
        date: today,
        dayOfCycle: 12, // Mock logic for simplicity
        flow,
        mood,
        symptoms,
        isPeriod: !!flow,
        isOvulation: false,
        isFertile: false
    };

    setLoading(true);
    await api.cycle.logDay(newLog);
    await loadLogs();
    setShowLogModal(false);
    // Reset Form
    setFlow(undefined);
    setMood('');
    setSymptoms([]);
    setTemp('');
  };

  const toggleSymptom = (sym: string) => {
    if (symptoms.includes(sym)) {
        setSymptoms(symptoms.filter(s => s !== sym));
    } else {
        setSymptoms([...symptoms, sym]);
    }
  };

  // Prepare chart data - mix of mock history + real logs
  const chartData = [
    { day: 'Day 1', intensity: 80, mood: 4 },
    { day: 'Day 5', intensity: 40, mood: 5 },
    { day: 'Day 10', intensity: 10, mood: 7 },
    ...logs.map(log => ({
        day: `Day ${log.dayOfCycle}`,
        intensity: log.flow === 'heavy' ? 80 : log.flow === 'medium' ? 50 : log.flow === 'light' ? 20 : 0,
        mood: 6 // Simplified mood mapping
    })).slice(-5) // Take last 5
  ];
  
  // Ensure we have some data
  if (chartData.length < 5) {
      chartData.push(
        { day: 'Day 14', intensity: 0, mood: 9 },
        { day: 'Day 20', intensity: 0, mood: 6 }
      );
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative">
      <div className="bg-gradient-to-r from-rose-400 to-rose-500 dark:from-rose-600 dark:to-rose-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Droplet size={150} />
        </div>
        <h2 className="text-xl font-medium opacity-90">Current Cycle</h2>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-6xl font-bold">Day 12</span>
          <span className="text-xl mb-2 opacity-80">/ 28</span>
        </div>
        <p className="mt-2 text-rose-100 font-medium">Follicular Phase • High Energy</p>
        <div className="mt-6 flex gap-3">
          <button 
            onClick={() => setShowLogModal(true)}
            className="bg-white text-rose-600 px-5 py-2.5 rounded-full text-sm font-bold shadow-md transition-colors flex items-center gap-2 hover:bg-rose-50"
          >
            <Plus size={18} /> Log Today
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <CalendarIcon className="text-rose-500" size={20} />
            Predictions
          </h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Next Period</p>
                    <p className="font-semibold text-rose-700 dark:text-rose-400">In 16 days</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 dark:text-slate-500">Sep 24</p>
                </div>
             </div>
             <div className="flex justify-between items-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Ovulation</p>
                    <p className="font-semibold text-violet-700 dark:text-violet-400">In 2 days</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 dark:text-slate-500">High Chance</p>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-80">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Mood vs Cycle Day</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="mood" stroke="#f43f5e" fillOpacity={1} fill="url(#colorMood)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowLogModal(false)}></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in p-6 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">Log Symptoms</h3>
                      <button onClick={() => setShowLogModal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                          <X size={20} />
                      </button>
                  </div>

                  <div className="space-y-6">
                      {/* Flow */}
                      <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Flow Intensity</label>
                          <div className="grid grid-cols-4 gap-2">
                              {['light', 'medium', 'heavy', 'spotting'].map(f => (
                                  <button
                                    key={f}
                                    onClick={() => setFlow(flow === f ? undefined : f as any)}
                                    className={`py-3 rounded-xl text-xs font-bold capitalize transition-all ${
                                        flow === f 
                                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/40' 
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-700'
                                    }`}
                                  >
                                      {f}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Mood */}
                      <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Mood</label>
                          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                              {['😊 Happy', '😐 Okay', '😔 Sad', '😫 Tired', '😡 Irritable'].map(m => (
                                  <button
                                    key={m}
                                    onClick={() => setMood(m)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                        mood === m 
                                        ? 'bg-violet-500 text-white' 
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                    }`}
                                  >
                                      {m}
                                  </button>
                              ))}
                          </div>
                      </div>

                       {/* Symptoms */}
                       <div>
                          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Physical Symptoms</label>
                          <div className="flex flex-wrap gap-2">
                              {['Cramps', 'Headache', 'Bloating', 'Acne', 'Backache', 'Cravings'].map(s => (
                                  <button
                                    key={s}
                                    onClick={() => toggleSymptom(s)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        symptoms.includes(s) 
                                        ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' 
                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                                    }`}
                                  >
                                      {s}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>

                  <button 
                    onClick={handleSaveLog}
                    disabled={loading}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl mt-8 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Save Entry
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default CycleTracker;