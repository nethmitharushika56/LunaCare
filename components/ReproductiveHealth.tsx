
import React, { useState } from 'react';
import { WORKSHOPS } from '../constants';
import { PlayCircle, Users, CalendarPlus, BookOpen, Heart, Activity, CheckCircle, Calendar, Download, Loader2, X, Clock } from 'lucide-react';
import { UserProfile, Workshop } from '../types';
import { api } from '../services/api';

interface ReproductiveHealthProps {
    user: UserProfile;
    setUser: (user: UserProfile) => void;
}

const ReproductiveHealth: React.FC<ReproductiveHealthProps> = ({ user, setUser }) => {
  const [registering, setRegistering] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const openRegistrationModal = (workshop: Workshop) => {
      setSelectedWorkshop(workshop);
      setIsSuccess(false);
  };

  const closeRegistrationModal = () => {
      setSelectedWorkshop(null);
      setIsSuccess(false);
  };

  const handleConfirmRegistration = async () => {
      if (!selectedWorkshop) return;
      
      setRegistering(true);
      try {
          const updatedUser = await api.user.registerWorkshop(selectedWorkshop.id);
          setUser(updatedUser);
          setIsSuccess(true);
      } catch (e) {
          console.error(e);
          alert("Failed to register. Please try again.");
          setRegistering(false);
      } finally {
          // Keep registering true if success to prevent double clicks before transition
          if (!isSuccess) setRegistering(false); 
      }
  };

  const downloadICS = () => {
      if (!selectedWorkshop) return;
      const workshop = selectedWorkshop;
      
      // Mock date parsing logic: assume "Oct 15, 2:00 PM" format in current year
      const currentYear = new Date().getFullYear();
      const dateParts = workshop.date.split(', '); // ["Oct 15", "2:00 PM"]
      const dateString = `${dateParts[0]} ${currentYear} ${dateParts[1]}`;
      const startDate = new Date(dateString);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Assume 1 hour duration

      const formatDate = (date: Date) => {
          return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
      };

      const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          `SUMMARY:${workshop.title}`,
          `DESCRIPTION:Hosted by ${workshop.host}`,
          `DTSTART:${formatDate(startDate)}`,
          `DTEND:${formatDate(endDate)}`,
          'LOCATION:LunaCare Live Workshop',
          'END:VEVENT',
          'END:VCALENDAR'
      ].join('\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${workshop.title.replace(/\s+/g, '_')}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in relative">
        
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-lg">
                <h2 className="text-3xl font-bold mb-2">Reproductive Health Hub</h2>
                <p className="text-pink-100 mb-6">Explore your body, join workshops, and connect with a community that understands you.</p>
                <div className="flex gap-3">
                    <button className="bg-white text-rose-600 px-5 py-2 rounded-full font-bold text-sm shadow-md hover:bg-pink-50 transition-colors">
                        Start Learning
                    </button>
                    <button className="bg-pink-600/50 backdrop-blur-sm text-white px-5 py-2 rounded-full font-bold text-sm border border-pink-400 hover:bg-pink-600/70 transition-colors">
                        Ask Luna AI
                    </button>
                </div>
            </div>
            <div className="absolute top-1/2 -right-10 -translate-y-1/2 opacity-20 rotate-12">
                <Heart size={300} fill="currentColor" />
            </div>
        </div>

        {/* 3D Model / Interactive Placeholder */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Activity className="text-rose-500" size={20} />
                    Interactive Anatomy
                </h3>
                <span className="text-xs font-bold bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 px-2 py-1 rounded">BETA</span>
            </div>
            <div className="aspect-[2/1] bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 gap-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
                <Activity size={48} className="group-hover:scale-110 transition-transform text-slate-300 dark:text-slate-600" />
                <p className="font-medium">Explore the Reproductive System</p>
                <p className="text-xs">Click to load 3D visualizer</p>
            </div>
        </div>

        {/* Workshops Section */}
        <div>
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Live Workshops</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Join sessions led by experts</p>
                </div>
                <button 
                    onClick={() => alert("Organize feature coming soon! You will be able to host your own sessions.")}
                    className="text-rose-500 font-semibold text-sm flex items-center gap-1 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                    <CalendarPlus size={16} /> Host Workshop
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WORKSHOPS.map(workshop => {
                    const isRegistered = user.registeredWorkshopIds?.includes(workshop.id);
                    
                    return (
                        <div key={workshop.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                            <div className="h-32 bg-slate-200 relative">
                                <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                                    {workshop.category}
                                </div>
                                {isRegistered && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm animate-fade-in">
                                        <CheckCircle size={10} /> Registered
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-1 leading-tight">{workshop.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Hosted by {workshop.host} • {workshop.date}</p>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                        <Users size={12} /> {workshop.attendees + (isRegistered ? 1 : 0)} attending
                                    </span>
                                    
                                    <button 
                                        onClick={() => !isRegistered && openRegistrationModal(workshop)}
                                        disabled={!!isRegistered}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                                            isRegistered 
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-default opacity-80'
                                            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-lg shadow-slate-200 dark:shadow-slate-800/50'
                                        }`}
                                    >
                                        {isRegistered ? 'Spot Reserved' : 'Join'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Community Highlight */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 border border-indigo-100 dark:border-indigo-900/30">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-md text-indigo-500 dark:text-indigo-400">
                <Users size={32} />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200">Community Support Groups</h3>
                <p className="text-indigo-700 dark:text-indigo-400 text-sm mt-1">
                    Connect with others navigating similar journeys. Find groups for PCOS, Endometriosis, Fertility, and more.
                </p>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-700 transition-colors">
                Find a Group
            </button>
        </div>

        {/* Registration Modal */}
        {selectedWorkshop && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={closeRegistrationModal}></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md shadow-2xl animate-scale-bounce p-8 border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <button 
                        onClick={closeRegistrationModal} 
                        className="absolute top-4 right-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {!isSuccess ? (
                        <div className="animate-fade-in">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Confirm Registration</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Secure your spot for this live session.</p>
                            
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl mb-8 space-y-4 border border-slate-100 dark:border-slate-700">
                                <h4 className="font-bold text-slate-800 dark:text-white text-xl leading-snug">{selectedWorkshop.title}</h4>
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-500">
                                            <Users size={14} />
                                        </div>
                                        <span>Hosted by <span className="font-semibold">{selectedWorkshop.host}</span></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                         <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
                                            <Calendar size={14} />
                                        </div>
                                        <span>{selectedWorkshop.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                         <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
                                            <Clock size={14} />
                                        </div>
                                        <span>Duration: 60 Minutes</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleConfirmRegistration}
                                disabled={registering}
                                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 dark:shadow-slate-900/50 active:scale-[0.98]"
                            >
                                {registering ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>Confirm & Join <CheckCircle size={18} /></>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-2 animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow shadow-lg shadow-green-200 dark:shadow-green-900/20">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">You're In!</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                                You've successfully registered for <strong>{selectedWorkshop.title}</strong>.
                            </p>
                            
                            <div className="space-y-3">
                                <button 
                                    onClick={downloadICS}
                                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 active:scale-[0.98]"
                                >
                                    <CalendarPlus size={20} /> Add to Device Calendar
                                </button>
                                <button 
                                    onClick={closeRegistrationModal}
                                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Close
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

export default ReproductiveHealth;
