import React, { useState } from 'react';
import { WORKSHOPS } from '../constants';
import { PlayCircle, Users, CalendarPlus, BookOpen, Heart, Activity, CheckCircle, Calendar, Download, Loader2 } from 'lucide-react';
import { UserProfile, Workshop } from '../types';
import { api } from '../services/api';

interface ReproductiveHealthProps {
    user: UserProfile;
    setUser: (user: UserProfile) => void;
}

const ReproductiveHealth: React.FC<ReproductiveHealthProps> = ({ user, setUser }) => {
  const [registering, setRegistering] = useState<string | null>(null);

  const handleRegister = async (workshop: Workshop) => {
      setRegistering(workshop.id);
      try {
          const updatedUser = await api.user.registerWorkshop(workshop.id);
          setUser(updatedUser);
          // Auto-download ICS after registration
          downloadICS(workshop);
          alert(`Successfully registered for "${workshop.title}"! A calendar invitation has been downloaded.`);
      } catch (e) {
          console.error(e);
          alert("Failed to register. Please try again.");
      } finally {
          setRegistering(null);
      }
  };

  const downloadICS = (workshop: Workshop) => {
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
    <div className="space-y-8 pb-20 animate-fade-in">
        
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
                        <div key={workshop.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                            <div className="h-32 bg-slate-200 relative">
                                <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover" />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                                    {workshop.category}
                                </div>
                                {isRegistered && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
                                        <CheckCircle size={10} /> Registered
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{workshop.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Hosted by {workshop.host} • {workshop.date}</p>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                        <Users size={12} /> {workshop.attendees + (isRegistered ? 1 : 0)} attending
                                    </span>
                                    
                                    <div className="flex gap-2">
                                        {isRegistered && (
                                            <button 
                                                onClick={() => downloadICS(workshop)}
                                                className="p-2 text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                title="Add to Calendar"
                                            >
                                                <Calendar size={18} />
                                            </button>
                                        )}
                                        
                                        <button 
                                            onClick={() => !isRegistered && handleRegister(workshop)}
                                            disabled={!!isRegistered || registering === workshop.id}
                                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                                                isRegistered 
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-default'
                                                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200'
                                            }`}
                                        >
                                            {registering === workshop.id ? <Loader2 size={16} className="animate-spin" /> : null}
                                            {isRegistered ? 'Joined' : 'Join'}
                                        </button>
                                    </div>
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
    </div>
  );
};

export default ReproductiveHealth;