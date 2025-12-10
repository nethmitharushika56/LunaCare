
import React, { useState, useEffect } from 'react';
import { ARTICLES, BOOKS, COURSES, TUTORS } from '../constants';
import { PlayCircle, Users, CalendarPlus, BookOpen, Heart, Activity, CheckCircle, Calendar, Loader2, X, Clock, Star, MessageCircle, GraduationCap, Video, Book, FileText, Plus, ImageIcon, Search } from 'lucide-react';
import { UserProfile, Workshop, ViewState } from '../types';
import { api } from '../services/api';
import InteractiveAnatomy from './InteractiveAnatomy';

interface ReproductiveHealthProps {
    user: UserProfile;
    setUser: (user: UserProfile) => void;
    setView: (view: ViewState) => void;
}

const SUPPORT_GROUPS = [
    { id: '1', name: 'PCOS Warriors', members: '12.5k', image: 'https://picsum.photos/100/100?random=101', desc: 'Support, tips, and solidarity for managing Polycystic Ovary Syndrome.' },
    { id: '2', name: 'Endo Sisters', members: '8.2k', image: 'https://picsum.photos/100/100?random=102', desc: 'A safe space for navigating Endometriosis and chronic pain.' },
    { id: '3', name: 'TTC Journey', members: '25k', image: 'https://picsum.photos/100/100?random=103', desc: 'Trying to conceive? Share your highs and lows with people who get it.' },
    { id: '4', name: 'IVF Support', members: '5.1k', image: 'https://picsum.photos/100/100?random=104', desc: 'Navigating the complex ups and downs of IVF treatments.' },
    { id: '5', name: 'Postpartum Care', members: '15k', image: 'https://picsum.photos/100/100?random=105', desc: 'Healing, mental health, and adjusting to life after birth.' },
    { id: '6', name: 'Menopause Haven', members: '9.3k', image: 'https://picsum.photos/100/100?random=106', desc: 'Navigating the change with grace, humor, and support.' },
    { id: '7', name: 'PMDD Awareness', members: '4.5k', image: 'https://picsum.photos/100/100?random=107', desc: 'Support for Premenstrual Dysphoric Disorder.' },
    { id: '8', name: 'Fertility Nutrition', members: '18k', image: 'https://picsum.photos/100/100?random=108', desc: 'Recipes and diet tips to boost reproductive health.' },
];

const ReproductiveHealth: React.FC<ReproductiveHealthProps> = ({ user, setUser, setView }) => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);
  
  const [registering, setRegistering] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Learning Hub State
  const [showLearning, setShowLearning] = useState(false);
  const [learningTab, setLearningTab] = useState<'articles' | 'books' | 'courses' | 'tutors'>('articles');

  // Host Workshop State
  const [showHostModal, setShowHostModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newWorkshop, setNewWorkshop] = useState({
      title: '',
      date: '',
      time: '',
      category: 'Health'
  });

  // Groups State
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [groupSearch, setGroupSearch] = useState('');
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);

  useEffect(() => {
      loadWorkshops();
  }, []);

  const loadWorkshops = async () => {
      try {
          const data = await api.workshops.getAll();
          setWorkshops(data);
      } catch (e) {
          console.error("Failed to load workshops", e);
      } finally {
          setLoadingWorkshops(false);
      }
  };

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

  const handleCreateWorkshop = async () => {
      if (!newWorkshop.title || !newWorkshop.date || !newWorkshop.time) return;
      
      setCreating(true);
      
      // Format date for display (e.g., 2024-10-25 -> Oct 25)
      const dateObj = new Date(newWorkshop.date);
      const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      // Format time (e.g., 14:00 -> 2:00 PM)
      const [hours, minutes] = newWorkshop.time.split(':');
      const timeObj = new Date();
      timeObj.setHours(parseInt(hours), parseInt(minutes));
      const timeStr = timeObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

      // Random image based on category
      const randomId = Math.floor(Math.random() * 50) + 10;
      
      const workshop: Workshop = {
          id: Date.now().toString(),
          title: newWorkshop.title,
          host: user.name, // Current user is host
          date: `${dateStr}, ${timeStr}`,
          attendees: 1,
          image: `https://picsum.photos/400/250?random=${randomId}`,
          category: newWorkshop.category
      };

      try {
          await api.workshops.create(workshop);
          await loadWorkshops(); // Refresh list
          
          // Auto register the host
          const updatedUser = await api.user.registerWorkshop(workshop.id);
          setUser(updatedUser);
          
          setShowHostModal(false);
          setNewWorkshop({ title: '', date: '', time: '', category: 'Health' });
      } catch (e) {
          console.error(e);
          alert("Failed to create workshop.");
      } finally {
          setCreating(false);
      }
  };

  const toggleGroupJoin = (id: string) => {
    if (joinedGroupIds.includes(id)) {
        setJoinedGroupIds(prev => prev.filter(gId => gId !== id));
    } else {
        setJoinedGroupIds(prev => [...prev, id]);
    }
  };

  const filteredGroups = SUPPORT_GROUPS.filter(g => 
    g.name.toLowerCase().includes(groupSearch.toLowerCase()) || 
    g.desc.toLowerCase().includes(groupSearch.toLowerCase())
  );

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
                    <button 
                        onClick={() => setShowLearning(true)}
                        className="bg-white text-rose-600 px-5 py-2 rounded-full font-bold text-sm shadow-md hover:bg-pink-50 transition-colors flex items-center gap-2"
                    >
                        <BookOpen size={16} /> Start Learning
                    </button>
                    <button 
                        onClick={() => setView('symptom-ai')}
                        className="bg-pink-600/50 backdrop-blur-sm text-white px-5 py-2 rounded-full font-bold text-sm border border-pink-400 hover:bg-pink-600/70 transition-colors"
                    >
                        Ask Luna AI
                    </button>
                </div>
            </div>
            <div className="absolute top-1/2 -right-10 -translate-y-1/2 opacity-20 rotate-12">
                <Heart size={300} fill="currentColor" />
            </div>
        </div>

        {/* Interactive Anatomy */}
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Activity className="text-rose-500" size={24} />
                    Interactive Anatomy
                </h3>
                <span className="text-xs font-bold bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full">BETA</span>
            </div>
            <InteractiveAnatomy />
        </div>

        {/* Workshops Section */}
        <div>
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Live Workshops</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Join sessions led by experts</p>
                </div>
                <button 
                    onClick={() => setShowHostModal(true)}
                    className="text-rose-500 font-semibold text-sm flex items-center gap-1 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                    <CalendarPlus size={16} /> Host Workshop
                </button>
            </div>
            
            {loadingWorkshops ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-rose-500" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workshops.map(workshop => {
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
                                            <Users size={12} /> {workshop.attendees + (isRegistered ? 0 : 0)} attending
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
            )}
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
            <button 
                onClick={() => setShowGroupsModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 hover:bg-indigo-700 transition-colors"
            >
                Find a Group
            </button>
        </div>

        {/* Groups Modal */}
        {showGroupsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowGroupsModal(false)}></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-2xl max-h-[85vh] shadow-2xl animate-scale-bounce flex flex-col overflow-hidden border border-slate-100 dark:border-slate-800">
                    
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Find a Support Group</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Join a safe space that resonates with you.</p>
                        </div>
                        <button onClick={() => setShowGroupsModal(false)} className="p-2 bg-white dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={groupSearch}
                                onChange={(e) => setGroupSearch(e.target.value)}
                                placeholder="Search e.g. 'PCOS', 'Fertility', 'Healing'"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Group List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">
                        {filteredGroups.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">
                                <Users size={48} className="mx-auto mb-3 opacity-20" />
                                <p>No groups found matching "{groupSearch}".</p>
                            </div>
                        ) : (
                            filteredGroups.map(group => {
                                const isJoined = joinedGroupIds.includes(group.id);
                                return (
                                    <div key={group.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
                                        <img src={group.image} alt={group.name} className="w-14 h-14 rounded-xl object-cover bg-slate-200" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h4 className="font-bold text-slate-800 dark:text-white truncate pr-2">{group.name}</h4>
                                                {isJoined && (
                                                    <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex-shrink-0">Joined</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-1">{group.desc}</p>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded w-fit">
                                                <Users size={10} /> {group.members} Members
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => toggleGroupJoin(group.id)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                                isJoined 
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700' 
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                                            }`}
                                        >
                                            {isJoined ? 'Leave' : 'Join Group'}
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Host Workshop Modal */}
        {showHostModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowHostModal(false)}></div>
                <div className="relative bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-md shadow-2xl animate-scale-bounce p-8 border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <button 
                        onClick={() => setShowHostModal(false)} 
                        className="absolute top-4 right-4 p-2 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Host a Workshop</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Share your knowledge with the community.</p>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Title</label>
                            <input 
                                type="text" 
                                value={newWorkshop.title}
                                onChange={(e) => setNewWorkshop({...newWorkshop, title: e.target.value})}
                                placeholder="e.g., Yoga for Cramps"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Date</label>
                                <input 
                                    type="date" 
                                    value={newWorkshop.date}
                                    onChange={(e) => setNewWorkshop({...newWorkshop, date: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Time</label>
                                <input 
                                    type="time" 
                                    value={newWorkshop.time}
                                    onChange={(e) => setNewWorkshop({...newWorkshop, time: e.target.value})}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Category</label>
                            <div className="flex gap-2 flex-wrap">
                                {['Health', 'Fitness', 'Education', 'Mental Health'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setNewWorkshop({...newWorkshop, category: cat})}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            newWorkshop.category === cat
                                            ? 'bg-rose-500 text-white shadow-md'
                                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                         <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-sm gap-2">
                             <ImageIcon size={16} /> Cover image will be auto-assigned
                         </div>
                    </div>

                    <button 
                        onClick={handleCreateWorkshop}
                        disabled={creating || !newWorkshop.title || !newWorkshop.date || !newWorkshop.time}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl mt-6 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 dark:shadow-slate-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {creating ? <Loader2 className="animate-spin" size={20} /> : (
                            <>Create Event <Plus size={18} /></>
                        )}
                    </button>
                </div>
            </div>
        )}

        {/* Learning Hub Modal - Full Screen Mobile / Card Desktop */}
        {showLearning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setShowLearning(false)}></div>
                <div className="relative bg-white dark:bg-slate-900 w-full h-full md:h-[85vh] md:max-w-4xl md:rounded-[2rem] shadow-2xl animate-fade-in flex flex-col overflow-hidden border-none md:border border-slate-100 dark:border-slate-800">
                    {/* Modal Header */}
                    <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 flex-shrink-0 pt-safe">
                        <div className="flex items-center gap-3">
                             <div className="bg-rose-100 dark:bg-rose-900/30 p-2.5 rounded-xl text-rose-500">
                                <BookOpen size={24} />
                             </div>
                             <div>
                                 <h3 className="text-xl font-bold text-slate-800 dark:text-white">Learning Hub</h3>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">Curated resources for your health journey</p>
                             </div>
                        </div>
                        <button onClick={() => setShowLearning(false)} className="p-2 bg-white dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                        {/* Sidebar Tabs (Desktop) */}
                        <div className="w-64 bg-slate-50 dark:bg-slate-950/50 border-r border-slate-100 dark:border-slate-800 p-4 hidden md:flex flex-col gap-2">
                             <button 
                                onClick={() => setLearningTab('articles')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${learningTab === 'articles' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                             >
                                 <FileText size={18} /> Articles
                             </button>
                             <button 
                                onClick={() => setLearningTab('books')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${learningTab === 'books' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                             >
                                 <Book size={18} /> Books
                             </button>
                             <button 
                                onClick={() => setLearningTab('courses')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${learningTab === 'courses' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                             >
                                 <GraduationCap size={18} /> Courses
                             </button>
                             <button 
                                onClick={() => setLearningTab('tutors')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${learningTab === 'tutors' ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                             >
                                 <Users size={18} /> Find Tutors
                             </button>
                        </div>

                        {/* Mobile Tabs (Sticky) */}
                        <div className="md:hidden flex border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 overflow-x-auto">
                            {[
                                { id: 'articles', icon: FileText, label: 'Articles' },
                                { id: 'books', icon: Book, label: 'Books' },
                                { id: 'courses', icon: GraduationCap, label: 'Courses' },
                                { id: 'tutors', icon: Users, label: 'Tutors' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setLearningTab(tab.id as any)}
                                    className={`flex-1 py-3 px-2 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition-colors min-w-[70px] ${
                                        learningTab === tab.id 
                                        ? 'border-rose-500 text-rose-500 bg-rose-50/50 dark:bg-rose-900/20' 
                                        : 'border-transparent text-slate-500 dark:text-slate-400'
                                    }`}
                                >
                                    <tab.icon size={18} />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white dark:bg-slate-900 pb-safe">
                             {/* ARTICLES TAB */}
                             {learningTab === 'articles' && (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {ARTICLES.map(article => (
                                         <div key={article.id} className="group border border-slate-100 dark:border-slate-800 rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-slate-800/50">
                                             <div className="h-40 rounded-xl overflow-hidden mb-4 relative">
                                                 <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                 <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded">{article.category}</span>
                                             </div>
                                             <h4 className="font-bold text-slate-800 dark:text-white text-lg leading-tight mb-2">{article.title}</h4>
                                             <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                 <Clock size={12} /> {article.readTime} read
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             )}

                             {/* BOOKS TAB */}
                             {learningTab === 'books' && (
                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                     {BOOKS.map(book => (
                                         <div key={book.id} className="flex flex-col gap-3 group">
                                             <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md relative">
                                                 <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                 <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                                     <Star size={10} fill="black" /> {book.rating}
                                                 </div>
                                             </div>
                                             <div>
                                                 <h4 className="font-bold text-slate-800 dark:text-white text-sm md:text-base leading-tight line-clamp-2">{book.title}</h4>
                                                 <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">by {book.author}</p>
                                             </div>
                                             <button className="mt-auto w-full border border-slate-200 dark:border-slate-700 rounded-lg py-2 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                 View
                                             </button>
                                         </div>
                                     ))}
                                 </div>
                             )}

                             {/* COURSES TAB */}
                             {learningTab === 'courses' && (
                                 <div className="space-y-4">
                                     {COURSES.map(course => (
                                         <div key={course.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                             <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden relative flex-shrink-0">
                                                 <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                 <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                     <PlayCircle size={32} className="text-white" />
                                                 </div>
                                             </div>
                                             <div className="flex-1 flex flex-col justify-between">
                                                 <div>
                                                     <div className="flex justify-between items-start">
                                                         <span className="text-[10px] font-bold bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 px-2 py-1 rounded mb-2 inline-block">COURSE</span>
                                                         <span className="font-bold text-rose-600 dark:text-rose-400">{course.price}</span>
                                                     </div>
                                                     <h4 className="font-bold text-slate-800 dark:text-white text-lg">{course.title}</h4>
                                                     <p className="text-sm text-slate-500 dark:text-slate-400">with {course.instructor}</p>
                                                 </div>
                                                 <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 dark:text-slate-500 font-medium">
                                                     <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                                                     <span className="flex items-center gap-1"><Video size={12} /> {course.modules} Modules</span>
                                                 </div>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             )}

                             {/* TUTORS TAB */}
                             {learningTab === 'tutors' && (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {TUTORS.map(tutor => (
                                         <div key={tutor.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800/50 flex gap-4 items-start">
                                             <img src={tutor.avatar} alt={tutor.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700" />
                                             <div className="flex-1">
                                                 <div className="flex justify-between items-start">
                                                     <h4 className="font-bold text-slate-800 dark:text-white">{tutor.name}</h4>
                                                     <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                                                         <Star size={10} fill="currentColor" /> {tutor.rating}
                                                     </div>
                                                 </div>
                                                 <p className="text-xs text-rose-500 font-medium mb-1">{tutor.specialty}</p>
                                                 <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{tutor.experience} Experience</p>
                                                 
                                                 <button 
                                                     onClick={() => alert(`Contact request sent to ${tutor.name}. They will message you shortly.`)}
                                                     className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                                 >
                                                     <MessageCircle size={12} /> Contact Tutor
                                                 </button>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        )}

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
