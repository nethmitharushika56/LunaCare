
import React, { useState, useEffect } from 'react';
import { Footprints, Calendar, Stethoscope, Ruler, Timer, X, RotateCcw, Plus, Save, Phone, MapPin, ChevronRight, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Doctor, Appointment, WeightLog } from '../types';

const PregnancyTracker: React.FC = () => {
  // Modal States
  const [activeModal, setActiveModal] = useState<'kick' | 'appointments' | 'weight' | 'timeline' | null>(null);

  // Kick Counter State
  const [kickCount, setKickCount] = useState(0);

  // Appointment State
  const [doctor, setDoctor] = useState<Doctor>(() => {
      const saved = localStorage.getItem('luna_preg_doctor');
      return saved ? JSON.parse(saved) : { name: '', clinic: '', phone: '' };
  });
  const [appointments, setAppointments] = useState<Appointment[]>([
      { id: '1', date: '2024-10-15', time: '10:00', type: 'Ultrasound Check' },
      { id: '2', date: '2024-11-02', time: '14:30', type: 'Routine Checkup' }
  ]);
  const [newAppt, setNewAppt] = useState({ date: '', time: '', type: '' });
  const [isEditingDoctor, setIsEditingDoctor] = useState(!doctor.name);

  // Weight State
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([
      { id: '1', date: '2024-06-01', week: 8, weight: 65 },
      { id: '2', date: '2024-07-01', week: 12, weight: 66.5 },
      { id: '3', date: '2024-08-01', week: 16, weight: 68 },
      { id: '4', date: '2024-09-01', week: 20, weight: 70 },
  ]);
  const [newWeight, setNewWeight] = useState('');

  // Persist Doctor
  useEffect(() => {
      localStorage.setItem('luna_preg_doctor', JSON.stringify(doctor));
  }, [doctor]);

  // Actions
  const handleSaveDoctor = () => {
      setIsEditingDoctor(false);
  };

  const handleAddAppointment = () => {
      if(!newAppt.date || !newAppt.type) return;
      const appt: Appointment = {
          id: Date.now().toString(),
          ...newAppt
      };
      setAppointments([...appointments, appt].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setNewAppt({ date: '', time: '', type: '' });
  };

  const handleAddWeight = () => {
      if(!newWeight) return;
      const currentWeek = 18; // Mock current week
      const log: WeightLog = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          week: currentWeek,
          weight: parseFloat(newWeight)
      };
      setWeightLogs([...weightLogs, log].sort((a,b) => a.week - b.week));
      setNewWeight('');
  };

  const PREGNANCY_TIMELINE = [
      { week: 4, title: "Positive Test", desc: "The journey begins! Baby is size of a poppy seed." },
      { week: 8, title: "First Ultrasound", desc: "Heartbeat is detectable. Baby is size of a raspberry." },
      { week: 12, title: "End of Trimester 1", desc: "Baby is fully formed. Size of a plum." },
      { week: 16, title: "Gender Reveal", desc: "It might be possible to see gender. Size of an avocado." },
      { week: 20, title: "Halfway There!", desc: "Anatomy scan week. Baby is size of a banana." },
      { week: 24, title: "Viability", desc: "Baby has a chance of survival if born. Size of an ear of corn." },
      { week: 28, title: "Third Trimester", desc: "Eyes can open and close. Size of an eggplant." },
      { week: 32, title: "Rapid Growth", desc: "Baby is practicing breathing. Size of a squash." },
      { week: 36, title: "Almost There", desc: "Lungs are nearly fully mature. Size of a papaya." },
      { week: 40, title: "Due Date", desc: "Ready to meet the world! Size of a watermelon." },
  ];

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
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-4xl">
                🫑
            </div>
            <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Your baby is the size of a Bell Pepper</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Baby is developing fingerprints and can hear sounds now!</p>
            </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
             <button 
                onClick={() => setActiveModal('kick')}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
             >
                <Footprints className="text-blue-400" size={32} />
                <span className="font-semibold text-slate-700 dark:text-slate-200">Kick Counter</span>
             </button>
             <button 
                onClick={() => setActiveModal('appointments')}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
             >
                <Stethoscope className="text-rose-400" size={32} />
                <span className="font-semibold text-slate-700 dark:text-slate-200">Appointments</span>
             </button>
             <button 
                onClick={() => setActiveModal('weight')}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
             >
                <Ruler className="text-amber-400" size={32} />
                <span className="font-semibold text-slate-700 dark:text-slate-200">Weight Log</span>
             </button>
             <button 
                onClick={() => setActiveModal('timeline')}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
             >
                <Calendar className="text-violet-400" size={32} />
                <span className="font-semibold text-slate-700 dark:text-slate-200">Timeline</span>
             </button>
        </div>

        {/* Daily Insight */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30">
             <h3 className="text-blue-800 dark:text-blue-200 font-bold mb-2">Today's Tip</h3>
             <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                Back pain is common around week 18 as your center of gravity shifts. Try gentle prenatal yoga stretches or a warm compress.
             </p>
        </div>

        {/* --- MODALS --- */}

        {/* Kick Counter Modal */}
        {activeModal === 'kick' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setActiveModal(null)}></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm p-8 text-center animate-fade-in shadow-2xl border border-slate-100 dark:border-slate-800">
                    <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500">
                        <X size={20} />
                    </button>

                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Kick Counter</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Tap the footprint every time you feel baby move.</p>

                    <button 
                        onClick={() => setKickCount(c => c + 1)}
                        className="w-48 h-48 bg-blue-50 dark:bg-blue-900/20 rounded-full flex flex-col items-center justify-center mx-auto border-4 border-blue-100 dark:border-blue-800 active:scale-95 transition-transform hover:bg-blue-100 dark:hover:bg-blue-900/40"
                    >
                        <Footprints className="text-blue-500 dark:text-blue-400 mb-2" size={48} />
                        <span className="text-5xl font-bold text-blue-600 dark:text-blue-300">{kickCount}</span>
                    </button>

                    <div className="flex justify-center mt-8 gap-4">
                        <button 
                             onClick={() => setKickCount(0)}
                             className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <RotateCcw size={16} /> Reset
                        </button>
                        <button 
                             onClick={() => setActiveModal(null)}
                             className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Appointments Modal */}
        {activeModal === 'appointments' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setActiveModal(null)}></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl animate-fade-in border border-slate-100 dark:border-slate-800">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Stethoscope className="text-rose-500" /> My Care
                        </h3>
                        <button onClick={() => setActiveModal(null)} className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-500">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Doctor Card */}
                        <div className="bg-rose-50 dark:bg-rose-900/20 p-5 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-rose-800 dark:text-rose-300 text-sm uppercase">Primary Doctor</h4>
                                <button onClick={() => setIsEditingDoctor(!isEditingDoctor)} className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline">
                                    {isEditingDoctor ? 'Cancel' : 'Edit'}
                                </button>
                            </div>
                            
                            {isEditingDoctor ? (
                                <div className="space-y-3">
                                    <input 
                                        type="text" placeholder="Doctor Name" 
                                        value={doctor.name} onChange={(e) => setDoctor({...doctor, name: e.target.value})}
                                        className="w-full px-3 py-2 rounded-lg text-sm border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-800 dark:text-white"
                                    />
                                    <input 
                                        type="text" placeholder="Clinic / Hospital" 
                                        value={doctor.clinic} onChange={(e) => setDoctor({...doctor, clinic: e.target.value})}
                                        className="w-full px-3 py-2 rounded-lg text-sm border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-800 dark:text-white"
                                    />
                                    <input 
                                        type="text" placeholder="Phone Number" 
                                        value={doctor.phone} onChange={(e) => setDoctor({...doctor, phone: e.target.value})}
                                        className="w-full px-3 py-2 rounded-lg text-sm border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-800 dark:text-white"
                                    />
                                    <button onClick={handleSaveDoctor} className="w-full bg-rose-500 text-white py-2 rounded-lg text-sm font-bold shadow-sm">Save Details</button>
                                </div>
                            ) : (
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white text-lg">{doctor.name || "No doctor saved"}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
                                        <MapPin size={14} /> {doctor.clinic || "Add clinic details"}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1 mt-1">
                                        <Phone size={14} /> {doctor.phone || "Add phone number"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Appointments List */}
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white mb-4">Upcoming Appointments</h4>
                            <div className="space-y-3">
                                {appointments.length === 0 ? (
                                    <p className="text-center text-sm text-slate-400 italic py-4">No appointments scheduled.</p>
                                ) : (
                                    appointments.map(appt => (
                                        <div key={appt.id} className="flex gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm">
                                            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 flex flex-col items-center justify-center min-w-[60px]">
                                                <span className="text-xs font-bold text-rose-500 uppercase">{new Date(appt.date).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-xl font-bold text-slate-800 dark:text-white">{new Date(appt.date).getDate()}</span>
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-slate-800 dark:text-white">{appt.type}</h5>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{appt.time} • {doctor.clinic || "Clinic"}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add New */}
                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-3">Schedule New</h4>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input type="date" value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white" />
                                    <input type="time" value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white" />
                                </div>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Reason (e.g. Ultrasound)" value={newAppt.type} onChange={e => setNewAppt({...newAppt, type: e.target.value})} className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white" />
                                    <button onClick={handleAddAppointment} disabled={!newAppt.date} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 rounded-lg font-bold disabled:opacity-50">
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Weight Log Modal */}
        {activeModal === 'weight' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setActiveModal(null)}></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl animate-fade-in border border-slate-100 dark:border-slate-800">
                     <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Ruler className="text-amber-500" /> Weight Tracker
                        </h3>
                        <button onClick={() => setActiveModal(null)} className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-500">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Chart */}
                        <div className="h-64 w-full mb-6 bg-white dark:bg-slate-900 rounded-xl p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weightLogs}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="week" label={{ value: 'Week', position: 'insideBottomRight', offset: -5 }} stroke="#94a3b8" />
                                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                    <Line type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={3} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Input */}
                        <div className="flex items-end gap-3 mb-8 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Current Weight (kg)</label>
                                <input 
                                    type="number" 
                                    value={newWeight}
                                    onChange={(e) => setNewWeight(e.target.value)}
                                    placeholder="e.g. 70.5"
                                    className="w-full text-lg font-bold bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-amber-500 focus:outline-none py-1 dark:text-white"
                                />
                            </div>
                            <button 
                                onClick={handleAddWeight}
                                className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200 dark:shadow-amber-900/20"
                            >
                                Log Entry
                            </button>
                        </div>

                        {/* History List */}
                        <h4 className="font-bold text-slate-800 dark:text-white mb-3 text-sm">History</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {weightLogs.slice().reverse().map(log => (
                                <div key={log.id} className="flex justify-between items-center p-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{log.date} (Week {log.week})</span>
                                    <span className="font-bold text-slate-800 dark:text-white">{log.weight} kg</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Timeline Modal */}
        {activeModal === 'timeline' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setActiveModal(null)}></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl animate-fade-in border border-slate-100 dark:border-slate-800">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 sticky top-0 z-10">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Timer className="text-violet-500" /> Pregnancy Journey
                        </h3>
                        <button onClick={() => setActiveModal(null)} className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-500">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 space-y-8">
                            {PREGNANCY_TIMELINE.map((item, index) => {
                                const currentWeek = 18; // Mock
                                const isPast = item.week <= currentWeek;
                                const isCurrent = item.week === 16; // Closest milestone logic for demo

                                return (
                                    <div key={index} className={`relative pl-8 transition-all ${isPast ? 'opacity-100' : 'opacity-50'}`}>
                                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${
                                            isCurrent ? 'bg-violet-500 border-violet-200 scale-125' : 
                                            isPast ? 'bg-slate-900 dark:bg-slate-400 border-white dark:border-slate-900' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                                        }`}></div>
                                        
                                        <div className={`${isCurrent ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-900/30 p-4 rounded-xl border' : ''}`}>
                                            <span className="text-xs font-bold text-slate-400 uppercase mb-1 block">Week {item.week}</span>
                                            <h4 className={`font-bold text-lg ${isCurrent ? 'text-violet-700 dark:text-violet-300' : 'text-slate-800 dark:text-white'}`}>{item.title}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default PregnancyTracker;
