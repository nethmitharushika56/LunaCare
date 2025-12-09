
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ViewState, Product, HealthReportAnalysis } from '../types';
import { Upload, FileText, MapPin, Syringe, ShieldCheck, Activity, Calendar, ChevronRight, AlertCircle, Heart, Plus, Check, X, Trash2, ShoppingBag, Loader2, FileUp, ScanLine, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PRODUCTS } from '../constants';

interface DashboardProps {
  user: UserProfile;
  setView: (view: ViewState) => void;
  cart: Product[];
  addToCart: (product: Product) => void;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setView, cart, addToCart }) => {
  const { t } = useLanguage();
  
  // Task State
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
        const saved = localStorage.getItem('luna_daily_tasks');
        return saved ? JSON.parse(saved) : [
            { id: '1', text: 'Log Symptoms', completed: false },
            { id: '2', text: 'Drink 2L Water', completed: false },
            { id: '3', text: 'Take Vitamin D', completed: false },
        ];
    } catch {
        return [];
    }
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState('');

  // Upload Analysis State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'analyzing' | 'result'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<HealthReportAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist tasks
  useEffect(() => {
    localStorage.setItem('luna_daily_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), text: newTask.trim(), completed: false }]);
    setNewTask('');
    setIsAdding(false);
  };

  const getTimeGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return t('dash.morning');
    if (hours < 18) return t('dash.afternoon');
    return t('dash.evening');
  };

  // --- File Upload Logic ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) startUploadProcess(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) startUploadProcess(file);
  };

  const startUploadProcess = (file: File) => {
      setSelectedFile(file);
      setUploadStep('uploading');
      setUploadProgress(0);

      // Simulate Upload Progress
      const interval = setInterval(() => {
          setUploadProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  startAnalysis();
                  return 100;
              }
              return prev + 10;
          });
      }, 200);
  };

  const startAnalysis = () => {
      setUploadStep('analyzing');
      // Simulate AI Processing time
      setTimeout(() => {
          setAnalysisResult({
              id: Date.now().toString(),
              date: new Date().toLocaleDateString(),
              type: 'Hormone Panel',
              summary: 'Overall hormonal profile indicates you are in the Follicular Phase. Thyroid levels are within normal range.',
              metrics: [
                  { name: 'Estradiol (E2)', value: '45 pg/mL', status: 'Normal' },
                  { name: 'FSH', value: '6.2 mIU/mL', status: 'Normal' },
                  { name: 'Progesterone', value: '0.5 ng/mL', status: 'Normal' },
                  { name: 'Vitamin D', value: '28 ng/mL', status: 'Low' }
              ],
              recommendations: [
                  'Your Vitamin D is slightly low. Consider a 2000 IU supplement.',
                  'Hormone levels align perfectly with Day 12 of your cycle.',
                  'Hydration levels appear adequate.'
              ]
          });
          setUploadStep('result');
      }, 3000);
  };

  const closeUploadModal = () => {
      setShowUploadModal(false);
      setUploadStep('idle');
      setSelectedFile(null);
      setAnalysisResult(null);
      setUploadProgress(0);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in relative">
        {/* Welcome Section */}
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{getTimeGreeting()}, {user.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">{t('dash.summary')}</p>
            </div>
            <div className="hidden md:block">
                 <span className="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Calendar size={14} />
                    Cycle Day {Math.max(1, 12)}
                 </span>
            </div>
        </div>

        {/* Hero: Womb Health Status */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-rose-200/50 dark:shadow-rose-900/20 relative overflow-hidden group">
             <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                         <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg">
                            <Activity className="text-rose-100" size={16} />
                         </div>
                         <span className="font-bold text-rose-100 uppercase text-xs tracking-wider">{t('dash.womb_health')}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">{t('dash.condition')}</h3>
                    <p className="text-rose-100 opacity-90 mb-6 text-sm leading-relaxed max-w-sm">
                        {t('dash.condition_desc')}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => setView('cycle')} className="bg-white text-rose-600 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all">
                            {t('dash.view_cycle')}
                        </button>
                        <button onClick={() => setView('symptom-ai')} className="bg-rose-700/30 backdrop-blur-md text-white border border-rose-400/30 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-700/50 hover:scale-105 active:scale-95 transition-all">
                            {t('dash.ask_ai')}
                        </button>
                    </div>
                </div>
                {/* Visual Graphic placeholder */}
                <div className="hidden md:flex justify-end pr-8">
                    <div className="relative group-hover:scale-105 transition-transform duration-500">
                        <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 backdrop-blur-sm animate-pulse">
                             <Heart size={48} fill="currentColor" className="text-white opacity-90" />
                        </div>
                        <div className="absolute top-0 right-0 w-8 h-8 bg-green-400 rounded-full border-4 border-rose-500"></div>
                    </div>
                </div>
             </div>
             {/* Background Decoration */}
             <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:translate-x-4 transition-transform duration-1000"></div>
             <div className="absolute left-10 -top-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl group-hover:-translate-x-4 transition-transform duration-1000"></div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Medical Report Analysis */}
            <div 
                onClick={() => setShowUploadModal(true)}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden hover:-translate-y-1"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500"></div>
                
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        <FileText size={24} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">{t('dash.report')}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 mb-4 leading-relaxed">
                        Upload lab reports (blood work, ultrasound) for AI-powered health insights.
                    </p>
                    <button className="w-full py-2.5 border border-indigo-100 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                        <Upload size={14} /> {t('dash.upload')}
                    </button>
                </div>
            </div>

            {/* Vaccination Tracker */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 dark:bg-teal-900/20 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500"></div>

                <div className="relative z-10">
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                        <Syringe size={24} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">{t('dash.vaccine')}</h3>
                    <div className="space-y-3 mt-3">
                        <div className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                            <span className="text-slate-600 dark:text-slate-300 text-xs font-semibold">HPV Vaccine</span>
                            <span className="text-teal-700 dark:text-teal-300 font-bold bg-teal-100 dark:bg-teal-900/50 px-2 py-0.5 rounded text-[10px] uppercase">Done</span>
                        </div>
                        <div className="flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                            <span className="text-slate-600 dark:text-slate-300 text-xs font-semibold">Flu Shot</span>
                            <span className="text-amber-700 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded text-[10px] uppercase">Due Now</span>
                        </div>
                    </div>
                </div>
            </div>

             {/* Find Care */}
             <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500"></div>

                <div className="relative z-10">
                    <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
                        <MapPin size={24} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">{t('dash.medical')}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 mb-4 leading-relaxed">
                        Locate trusted gynecologists and fertility clinics near you.
                    </p>
                    <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold text-xs cursor-pointer hover:underline mt-auto">
                        {t('dash.find')} <ChevronRight size={14} />
                    </div>
                </div>
            </div>
        </div>

        {/* Detailed Insights */}
        <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Insights List */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                        <ShieldCheck className="text-violet-500 dark:text-violet-400" size={20} /> 
                        {t('dash.monitor')}
                    </h3>
                    <button className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">{t('dash.view_history')}</button>
                </div>
                
                <div className="space-y-4">
                    <div className="flex gap-4 items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                        <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 p-2.5 rounded-xl flex-shrink-0">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Next Pap Smear Screening</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Based on your age and history, your next screening is recommended in <strong>3 months</strong>.</p>
                        </div>
                        <ChevronRight className="ml-auto text-slate-300 dark:text-slate-600" size={16} />
                    </div>

                     <div className="flex gap-4 items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                        <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 p-2.5 rounded-xl flex-shrink-0">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Review Cycle Irregularity</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Your cycle length varied by 5 days last month. Consider uploading a hormone test report.</p>
                        </div>
                         <ChevronRight className="ml-auto text-slate-300 dark:text-slate-600" size={16} />
                    </div>

                    <div className="flex gap-4 items-start p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                        <div className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 p-2.5 rounded-xl flex-shrink-0">
                            <Activity size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Fertility Window Active</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">You are in your high fertility window. Great time for conception if that is your goal.</p>
                        </div>
                         <ChevronRight className="ml-auto text-slate-300 dark:text-slate-600" size={16} />
                    </div>
                </div>
            </div>

            {/* Right Column - Mini Cal / Stats */}
            <div className="space-y-4">
                 <div className="bg-gradient-to-br from-indigo-500 to-violet-600 dark:from-indigo-600 dark:to-violet-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                    <h4 className="font-bold opacity-90 mb-1 relative z-10">{t('dash.next_period')}</h4>
                    <p className="text-3xl font-bold relative z-10">16 Days</p>
                    <p className="text-xs opacity-75 mt-1 relative z-10">Predicted Start: Sep 24</p>
                    <div className="mt-4 w-full bg-white/20 h-1.5 rounded-full overflow-hidden relative z-10">
                        <div className="bg-white h-full w-[40%]"></div>
                    </div>
                    {/* Deco */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                 </div>

                 <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-slate-800 dark:text-white">{t('dash.daily_tasks')}</h4>
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 transition-colors hover:scale-110 active:scale-95"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    {isAdding && (
                        <div className="flex gap-2 mb-3 animate-fade-in">
                            <input 
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder={t('dash.add_task')}
                                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                                autoFocus
                            />
                            <button onClick={addTask} className="text-rose-500 bg-rose-50 dark:bg-rose-900/30 p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:scale-105 active:scale-95 transition-transform">
                                <Check size={16} />
                            </button>
                            <button onClick={() => setIsAdding(false)} className="text-slate-400 dark:text-slate-500 p-1.5 rounded-lg hover:text-slate-600 dark:hover:text-slate-300 hover:scale-105 active:scale-95 transition-transform">
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <ul className="space-y-2">
                        {tasks.map(task => (
                            <li key={task.id} className="flex items-center justify-between group p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors -mx-2">
                                <button 
                                    onClick={() => toggleTask(task.id)}
                                    className={`flex items-center gap-3 text-sm flex-1 text-left transition-all duration-300 ${
                                        task.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-600 dark:text-slate-300'
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                        task.completed ? 'bg-rose-500 border-rose-500 scale-110' : 'border-slate-200 dark:border-slate-600 group-hover:border-rose-300'
                                    }`}>
                                        {task.completed && <Check size={12} className="text-white animate-scale-bounce" />}
                                    </div>
                                    {task.text}
                                </button>
                                <button 
                                    onClick={() => removeTask(task.id)}
                                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 hover:scale-110 active:scale-95"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </li>
                        ))}
                        {tasks.length === 0 && !isAdding && (
                            <p className="text-center text-slate-400 dark:text-slate-600 text-xs py-2 italic animate-fade-in">All caught up!</p>
                        )}
                    </ul>
                 </div>
            </div>
        </div>

        {/* Wellness Shop Preview */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="text-rose-500" size={20} />
                    Wellness Essentials
                </h3>
                <button 
                    onClick={() => setView('shop')}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400"
                >
                    View Shop →
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PRODUCTS.slice(0, 4).map(product => {
                    const isInCart = cart.some(p => p.id === product.id);
                    return (
                        <div key={product.id} className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 flex flex-col group hover:shadow-md transition-all">
                            <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-lg mb-3 overflow-hidden relative">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-xs mb-1 line-clamp-1">{product.name}</h4>
                            <div className="mt-auto flex justify-between items-center">
                                <span className="text-sm font-bold text-rose-600 dark:text-rose-400">${product.price.toFixed(2)}</span>
                                <button 
                                    onClick={() => addToCart(product)}
                                    disabled={isInCart}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                        isInCart 
                                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                        : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-700'
                                    }`}
                                >
                                    {isInCart ? <Check size={14} /> : <Plus size={14} />}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* Upload & Analysis Modal */}
        {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={closeUploadModal}></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl animate-fade-in p-6 border border-slate-100 dark:border-slate-800">
                    <button onClick={closeUploadModal} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors z-20">
                        <X size={20} />
                    </button>

                    {/* Stage 1: File Upload */}
                    {uploadStep === 'idle' && (
                        <div className="text-center py-4">
                            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500 animate-bounce-slow">
                                <FileUp size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Upload Medical Record</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs mx-auto">
                                Upload blood work, hormone panels, or ultrasound reports for AI analysis.
                            </p>

                            <div 
                                className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all group"
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-1">Click to browse or drag file here</p>
                                <p className="text-xs text-slate-400">PDF, JPG, PNG up to 10MB</p>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileSelect}
                                />
                            </div>
                        </div>
                    )}

                    {/* Stage 2: Uploading Progress */}
                    {uploadStep === 'uploading' && (
                        <div className="text-center py-10">
                            <div className="mb-6 relative w-24 h-24 mx-auto">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-indigo-500 transition-all duration-300" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * uploadProgress) / 100} />
                                </svg>
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg text-indigo-600 dark:text-indigo-400">{uploadProgress}%</span>
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white animate-pulse">Uploading Document...</h3>
                            <p className="text-xs text-slate-500 mt-2">{selectedFile?.name}</p>
                        </div>
                    )}

                    {/* Stage 3: AI Analyzing */}
                    {uploadStep === 'analyzing' && (
                        <div className="text-center py-8">
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8 relative">
                                <div className="absolute top-0 left-0 h-full w-1/3 bg-indigo-500 rounded-full animate-[slideInRight_1s_infinite_linear]"></div>
                            </div>
                            <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600 dark:text-violet-400 relative">
                                <ScanLine size={40} className="animate-pulse" />
                                <div className="absolute inset-0 border-2 border-violet-400 rounded-full animate-ping opacity-20"></div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Luna AI is Analyzing</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Extracting key biomarkers and health indicators...</p>
                        </div>
                    )}

                    {/* Stage 4: Results */}
                    {uploadStep === 'result' && analysisResult && (
                        <div className="animate-fade-in">
                            <div className="flex items-center gap-3 mb-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                                <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" size={24} />
                                <div>
                                    <h3 className="font-bold text-green-800 dark:text-green-200 text-sm">Analysis Complete</h3>
                                    <p className="text-xs text-green-600 dark:text-green-400">Verified by Luna AI • {analysisResult.date}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                    <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-2 uppercase tracking-wide">Summary</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{analysisResult.summary}</p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-3 uppercase tracking-wide">Key Metrics</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {analysisResult.metrics.map((m, i) => (
                                            <div key={i} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col">
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{m.name}</span>
                                                <span className="font-bold text-slate-800 dark:text-white">{m.value}</span>
                                                <span className={`text-[10px] font-bold mt-1 ${
                                                    m.status === 'Normal' ? 'text-green-500' : 
                                                    m.status === 'Low' ? 'text-amber-500' : 'text-red-500'
                                                }`}>
                                                    ● {m.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                                    <h4 className="font-bold text-indigo-800 dark:text-indigo-200 text-sm mb-2 flex items-center gap-2">
                                        <Activity size={14} /> Recommendation
                                    </h4>
                                    <ul className="list-disc list-inside text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                                        {analysisResult.recommendations.map((rec, i) => (
                                            <li key={i}>{rec}</li>
                                        ))}
                                    </ul>
                                </div>

                                <button 
                                    onClick={closeUploadModal}
                                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default Dashboard;
