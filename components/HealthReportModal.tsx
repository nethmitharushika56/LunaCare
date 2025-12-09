import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Calendar, Activity, Baby } from 'lucide-react';
import { UserProfile, CycleDay } from '../types';
import { api } from '../services/api';

interface HealthReportModalProps {
  user: UserProfile;
  onClose: () => void;
}

const HealthReportModal: React.FC<HealthReportModalProps> = ({ user, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<CycleDay[]>([]);
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
        const cycleLogs = await api.cycle.getLogs();
        setLogs(cycleLogs);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const getFilteredLogs = () => {
    return logs.filter(log => log.date.startsWith(reportDate));
  };

  const filteredLogs = getFilteredLogs();

  // Analysis
  const totalSymptoms = filteredLogs.reduce((acc, log) => acc + log.symptoms.length, 0);
  const uniqueSymptoms = Array.from(new Set(filteredLogs.flatMap(l => l.symptoms)));
  const moodCounts = filteredLogs.reduce((acc: Record<string, number>, log) => {
      if(log.mood) acc[log.mood] = (acc[log.mood] || 0) + 1;
      return acc;
  }, {});
  const topMood = Object.entries(moodCounts).sort((a,b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'N/A';
  const periodDays = filteredLogs.filter(l => l.isPeriod).length;
  
  // Mock Pregnancy Data if applicable
  const isPregnancyMode = user.goal === 'pregnancy';
  const mockPregnancyWeek = 18; 

  const handleDownload = () => {
      let content = `LUNACARE HEALTH REPORT\n`;
      content += `----------------------\n`;
      content += `User: ${user.name}\n`;
      content += `Month: ${reportDate}\n`;
      content += `Generated: ${new Date().toLocaleDateString()}\n\n`;

      content += `SUMMARY\n`;
      content += `-------\n`;
      content += `Goal: ${user.goal}\n`;
      if (isPregnancyMode) {
          content += `Status: Week ${mockPregnancyWeek} (Trimester 2)\n`;
          content += `Baby Size: Bell Pepper (~200g)\n`;
      } else {
          content += `Cycle Days Logged: ${filteredLogs.length}\n`;
          content += `Period Duration: ${periodDays} days\n`;
      }
      
      content += `\nSYMPTOMS & WELLNESS\n`;
      content += `-------------------\n`;
      content += `Total Symptoms Reported: ${totalSymptoms}\n`;
      content += `Common Symptoms: ${uniqueSymptoms.join(', ') || 'None'}\n`;
      content += `Dominant Mood: ${topMood}\n\n`;

      content += `LOG DETAILS\n`;
      content += `-----------\n`;
      if (filteredLogs.length === 0) {
          content += `No logs recorded for this period.\n`;
      } else {
          content += filteredLogs.map(l => `${l.date}: ${l.flow ? `Flow(${l.flow})` : ''} ${l.mood ? `Mood(${l.mood})` : ''} - ${l.symptoms.join(', ')}`).join('\n');
      }

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LunaCare_Report_${user.name}_${reportDate}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in flex flex-col border border-slate-100 dark:border-slate-800">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-rose-100 dark:bg-rose-900/40 p-2 rounded-xl text-rose-600 dark:text-rose-400">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Monthly Health Summary</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Export your data for doctor visits</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                    <X size={20} />
                </button>
            </div>

            <div className="p-6 space-y-8">
                {/* Controls */}
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Calendar className="text-slate-500 dark:text-slate-400" size={20} />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Month:</span>
                    <input 
                        type="month" 
                        value={reportDate}
                        onChange={(e) => setReportDate(e.target.value)}
                        className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block p-2.5"
                    />
                </div>

                {loading ? (
                    <div className="text-center py-10 text-slate-400">Loading data...</div>
                ) : (
                    <>
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {isPregnancyMode ? (
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                    <p className="text-xs font-bold text-blue-400 uppercase">Pregnancy Status</p>
                                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1 flex items-center gap-2">
                                        Week {mockPregnancyWeek}
                                        <Baby size={20} />
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                                    <p className="text-xs font-bold text-rose-400 uppercase">Period Duration</p>
                                    <p className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">{periodDays} <span className="text-sm font-medium">days</span></p>
                                </div>
                            )}
                            
                            <div className="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-2xl border border-violet-100 dark:border-violet-900/30">
                                <p className="text-xs font-bold text-violet-400 uppercase">Dominant Mood</p>
                                <p className="text-2xl font-bold text-violet-700 dark:text-violet-300 mt-1">{topMood}</p>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                                <p className="text-xs font-bold text-amber-400 uppercase">Total Symptoms</p>
                                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">{totalSymptoms}</p>
                            </div>
                        </div>

                        {/* Symptoms List */}
                        <div>
                             <h4 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                <Activity size={18} className="text-rose-500" /> Recorded Symptoms
                             </h4>
                             {uniqueSymptoms.length > 0 ? (
                                 <div className="flex flex-wrap gap-2">
                                     {uniqueSymptoms.map(s => (
                                         <span key={s} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm border border-slate-200 dark:border-slate-700">
                                             {s}
                                         </span>
                                     ))}
                                 </div>
                             ) : (
                                 <p className="text-slate-400 text-sm italic">No symptoms recorded for this month.</p>
                             )}
                        </div>

                        {/* AI Insight Placeholder */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 text-white shadow-lg">
                            <h4 className="font-bold mb-2 flex items-center gap-2">
                                <span className="bg-white/20 p-1 rounded">AI</span> Luna Insight
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Based on your logs for {new Date(reportDate).toLocaleString('default', { month: 'long', year: 'numeric' })}, 
                                {isPregnancyMode 
                                    ? ` your pregnancy is progressing well into Week ${mockPregnancyWeek}. Ensure you are tracking fetal movements daily.` 
                                    : ` your cycle appears regular. The dominant mood "${topMood}" correlates with your follicular phase.`
                                } 
                                {totalSymptoms > 5 
                                    ? " You reported a higher than average number of symptoms this month; consider sharing this report with your specialist." 
                                    : " Symptom load was low this month, indicating good management."
                                }
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mt-auto sticky bottom-0 z-10">
                <button 
                    onClick={handleDownload}
                    className="w-full bg-slate-900 dark:bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                    <Download size={20} /> Download Report
                </button>
            </div>
        </div>
    </div>
  );
};

export default HealthReportModal;