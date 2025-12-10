
import React, { useState } from 'react';
import { UserProfile, ViewState } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';
import { Bell, Settings, LogOut, ChevronRight, AlertCircle, Info, Clock, User, FileText } from 'lucide-react';
import HealthReportModal from './HealthReportModal';
import { api } from '../services/api';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
  setView: (view: ViewState) => void;
  setUser: (user: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, setView, setUser }) => {
  const [showReport, setShowReport] = useState(false);
  const [toggling, setToggling] = useState(false);

  const areNotificationsEnabled = user.notificationsEnabled !== false;

  const toggleNotifications = async () => {
      setToggling(true);
      const newState = !areNotificationsEnabled;
      
      // Optimistic update
      const updatedUser = { ...user, notificationsEnabled: newState };
      setUser(updatedUser);

      try {
          await api.user.updateProfile({ notificationsEnabled: newState });
      } catch (e) {
          console.error("Failed to update notification settings", e);
          // Revert if failed
          setUser({ ...user, notificationsEnabled: !newState });
      } finally {
          setToggling(false);
      }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Profile</h2>

        {/* User Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/40 rounded-full flex items-center justify-center text-4xl border-4 border-white dark:border-slate-900 shadow-sm overflow-hidden">
                {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    "👩‍🦰"
                )}
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{user.name}</h3>
                <div className="flex gap-2 mt-2">
                    <span className="text-[10px] bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-2 py-1 rounded-md font-bold uppercase tracking-wider border border-rose-100 dark:border-rose-900">
                        {user.goal}
                    </span>
                    <span className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-md font-bold uppercase tracking-wider border border-slate-100 dark:border-slate-700">
                        Age {user.age}
                    </span>
                </div>
            </div>
            <button 
                onClick={() => setView('settings')}
                className="ml-auto p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Settings"
            >
                <Settings size={20} />
            </button>
        </div>

        {/* Notifications & Alerts Center */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Bell className="text-rose-500" size={20} />
                    Alerts & Notifications
                </h3>
                <button 
                    onClick={toggleNotifications}
                    disabled={toggling}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 ${areNotificationsEnabled ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                    title={areNotificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${areNotificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>
            
            <div className={`space-y-3 transition-opacity duration-200 ${!areNotificationsEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {MOCK_NOTIFICATIONS.map(notification => (
                    <div 
                        key={notification.id} 
                        className={`p-4 rounded-xl border flex gap-3 ${
                            notification.read 
                            ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-75' 
                            : 'bg-white dark:bg-slate-900 border-rose-100 dark:border-rose-900/50 shadow-sm'
                        }`}
                    >
                        <div className={`mt-1 ${
                            notification.type === 'alert' ? 'text-red-500' : 
                            notification.type === 'reminder' ? 'text-amber-500' : 'text-blue-500'
                        }`}>
                            {notification.type === 'alert' && <AlertCircle size={20} />}
                            {notification.type === 'reminder' && <Clock size={20} />}
                            {notification.type === 'info' && <Info size={20} />}
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm ${notification.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'}`}>
                                {notification.message}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{notification.date}</p>
                            
                            {notification.actionLabel && (
                                <button className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline">
                                    {notification.actionLabel} →
                                </button>
                            )}
                        </div>
                        {!notification.read && (
                            <div className="w-2 h-2 bg-rose-500 rounded-full mt-2"></div>
                        )}
                    </div>
                ))}
                {!areNotificationsEnabled && (
                    <p className="text-center text-xs text-slate-400 italic mt-2">Notifications are currently disabled.</p>
                )}
            </div>
        </div>

        {/* Menu Links */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
             
             {/* Help & Support */}
             <button 
                onClick={() => setView('help')}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800"
             >
                 <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                     <Info size={18} />
                     Help & Support
                 </div>
                 <ChevronRight size={16} className="text-slate-400 dark:text-slate-600" />
             </button>
             
             {/* Report Button */}
             <button 
                onClick={() => setShowReport(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-t border-slate-50 dark:border-slate-800 text-rose-600 dark:text-rose-400"
             >
                 <div className="flex items-center gap-3 font-bold">
                     <FileText size={18} />
                     Monthly Health Report
                 </div>
                 <ChevronRight size={16} className="text-rose-300 dark:text-rose-500" />
             </button>
        </div>

        <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-red-500 font-medium p-4 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
        >
            <LogOut size={18} /> Log Out
        </button>

        {showReport && <HealthReportModal user={user} onClose={() => setShowReport(false)} />}
    </div>
  );
};

export default Profile;
