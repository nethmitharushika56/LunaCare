
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplet, Thermometer, Smile, Calendar as CalendarIcon, Plus, X, Save, ChevronLeft, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { CycleDay, UserProfile } from '../types';
import { analyzeCycleInsights } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const CycleTracker: React.FC = () => {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<CycleDay[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // AI State
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Form State
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy' | 'spotting' | undefined>(undefined);
  const [mood, setMood] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
        const [logsData, userData] = await Promise.all([
            api.cycle.getLogs(),
            api.auth.getSession()
        ]);
        setLogs(logsData);
        setUser(userData);
    } catch (e) {
        console.error("Failed to load data", e);
    } finally {
        setLoading(false);
    }
  };

  // --- AI Analysis ---
  const handleAIAnalysis = async () => {
      if (!user) return;
      setAnalyzing(true);
      const insight = await analyzeCycleInsights(logs, user.cycleLength);
      setAiInsight(insight);
      setAnalyzing(false);
  };

  // --- Calendar Logic ---
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const changeMonth = (offset: number) => {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
      setCurrentDate(newDate);
  };

  const handleDateClick = (day: number) => {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setSelectedDate(dateStr);
      
      // Pre-fill form if log exists
      const existingLog = logs.find(l => l.date === dateStr);
      if (existingLog) {
          setFlow(existingLog.flow);
          setMood(existingLog.mood || '');
          setSymptoms(existingLog.symptoms);
      } else {
          setFlow(undefined);
          setMood('');
          setSymptoms([]);
      }
      setShowLogModal(true);
  };

  // --- Prediction Logic ---
  const getDayStatus = (day: number) => {
      if (!user) return {};
      
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const log = logs.find(l => l.date === dateStr);
      
      // 1. Check Actual Logs
      if (log?.isPeriod) return { type: 'period', intensity: log.flow };
      
      // 2. Prediction Logic
      // Find the last actual period start
      const sortedLogs = [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const lastPeriodStartLog = sortedLogs.find(l => l.isPeriod && l.dayOfCycle === 1);
      
      // Fallback to user profile if no logs
      const lastStart = lastPeriodStartLog ? new Date(lastPeriodStartLog.date) : new Date(user.lastPeriodStart);
      
      const checkDate = new Date(dateStr);
      const diffTime = checkDate.getTime() - lastStart.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Normalize to cycle position
      const cyclePos = diffDays % user.cycleLength; // 0 to 27 (if 28 days)
      const adjustedCyclePos = cyclePos < 0 ? cyclePos + user.cycleLength : cyclePos;

      if (diffDays > 0) {
          // Predicted Period
          if (adjustedCyclePos < user.periodLength) {
              return { type: 'predicted-period' };
          }
          // Predicted Ovulation (approx 14 days before next period)
          const ovulationDay = user.cycleLength - 14;
          if (adjustedCyclePos >= ovulationDay - 2 && adjustedCyclePos <= ovulationDay + 2) {
              return { type: 'fertile', isOvulation: adjustedCyclePos === ovulationDay };
          }
      }

      return {};
  };

  const handleSaveLog = async () => {
    const newLog: CycleDay = {
        date: selectedDate,
        dayOfCycle: 1, // Simple logic: In a real app, this would be calculated relative to last period
        flow,
        mood,
        symptoms,
        isPeriod: !!flow,
        isOvulation: false,
        isFertile: false
    };

    setLoading(true);
    await api.cycle.logDay(newLog);
    await loadData(); // Refresh to update calendar
    setShowLogModal(false);
  };

  const toggleSymptom = (sym: string) => {
    if (symptoms.includes(sym)) {
        setSymptoms(symptoms.filter(s => s !== sym));
    } else {
        setSymptoms([...symptoms, sym]);
    }
  };

  // Render Calendar Grid
  const renderCalendar = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const firstDay = getFirstDayOfMonth(year, month);
      const days = [];

      // Empty slots
      for (let i = 0; i < firstDay; i++) {
          days.push(<div key={`empty-${i}`} className="h-10 md:h-14"></div>);
      }

      // Days
      for (let d = 1; d <= daysInMonth; d++) {
          const status = getDayStatus(d);
          const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
          
          let bgClass = "bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800";
          
          if (status.type === 'period') bgClass = "bg-rose-500 text-white shadow-md shadow-rose-200";
          else if (status.type === 'predicted-period') bgClass = "bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 border border-dashed border-rose-300";
          else if (status.type === 'fertile') bgClass = "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300";
          
          if (isToday) bgClass += " ring-2 ring-indigo-500 font-bold";

          days.push(
              <button 
                  key={d} 
                  onClick={() => handleDateClick(d)}
                  className={`h-10 md:h-14 rounded-xl flex flex-col items-center justify-center text-xs md:text-sm transition-all relative ${bgClass}`}
              >
                  {d}
                  {status.intensity === 'heavy' && <div className="w-1.5 h-1.5 bg-rose-800 rounded-full absolute bottom-1"></div>}
                  {status.isOvulation && <div className="w-1.5 h-1.5 bg-violet-600 rounded-full absolute bottom-1"></div>}
              </button>
          );
      }
      return days;
  };

  const chartData = [
    { day: 'Day 1', mood: 4 }, { day: 'Day 5', mood: 5 }, { day: 'Day 10', mood: 7 },
    ...logs.map(log => ({
        day: `Day`,
        mood: 6 
    })).slice(-5) 
  ];
  if (chartData.length < 5) chartData.push({ day: 'Day 14', mood: 9 }, { day: 'Day 20', mood: 6 });

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative">
      
      {/* Calendar Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                  <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
                      <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
                      <ChevronRight size={20} />
                  </button>
              </div>
          </div>

          {/* Weekday Header */}
          <div className="grid grid-cols-7 mb-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">{day}</div>
              ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
              {renderCalendar()}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span> Period
              </div>
              <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-200 dark:bg-rose-900/40 border border-dashed border-rose-300"></span> Predicted
              </div>
              <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-violet-200 dark:bg-violet-900/40"></span> Fertile
              </div>
          </div>
      </div>

      {/* AI Prediction & Insight */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-yellow-300" /> AI Cycle Insights
            </h3>
            {aiInsight ? (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-sm leading-relaxed border border-white/10 animate-fade-in">
                    {aiInsight}
                </div>
            ) : (
                <p className="text-indigo-100 text-sm mb-4 max-w-md">
                    Analyze your historical data to get personalized predictions about irregularity, symptoms, and health alerts.
                </p>
            )}
            
            {!aiInsight && (
                <button 
                    onClick={handleAIAnalysis}
                    disabled={analyzing}
                    className="mt-2 bg-white text-indigo-600 px-5 py-2.5 rounded-full text-sm font-bold shadow-md transition-all hover:bg-indigo-50 flex items-center gap-2 disabled:opacity-70"
                >
                    {analyzing ? (
                         <><div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> Analyzing...</>
                    ) : (
                         "Analyze My Cycle"
                    )}
                </button>
            )}
        </div>
         <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
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
                    <p className="font-semibold text-rose-700 dark:text-rose-400">~ 24 Sep</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 dark:text-slate-500">Likely</p>
                </div>
             </div>
             <div className="flex justify-between items-center p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Ovulation</p>
                    <p className="font-semibold text-violet-700 dark:text-violet-400">~ 10 Sep</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 dark:text-slate-500">High Chance</p>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 h-80">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Mood Trends</h3>
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
                      <div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Log Details</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(selectedDate).toDateString()}</p>
                      </div>
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
