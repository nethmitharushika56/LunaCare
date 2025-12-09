import React, { useState } from 'react';
import { UserProfile, ViewState } from '../types';
import { ArrowLeft, Moon, Sun, Trash2, Save, RefreshCw, Smartphone, Key, Mail, User, Calendar } from 'lucide-react';
import { api } from '../services/api';

interface SettingsProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  onLogout: () => void;
  setView: (view: ViewState) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, setUser, toggleTheme, isDarkMode, onLogout, setView }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form States
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [age, setAge] = useState(user.age.toString());
  const [password, setPassword] = useState('');

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdateProfile = async () => {
    if (!name || !email || !age) {
        showMessage('error', 'Please fill in all required fields');
        return;
    }

    setLoading(true);
    try {
        // Update basic profile
        const updatedUser = await api.user.updateProfile({ 
            name, 
            email, 
            age: parseInt(age) 
        });
        
        // Update password if provided
        if (password) {
            if (password.length < 6) {
                throw new Error("Password must be at least 6 characters");
            }
            await api.user.changePassword(password);
            setPassword(''); // Clear after save
        }

        setUser(updatedUser);
        showMessage('success', 'Profile updated successfully');
    } catch (e: any) {
        showMessage('error', e.message || 'Failed to update profile');
    } finally {
        setLoading(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure? This will clear saved tasks and onboarding status on this device. Your account data will remain.")) {
        localStorage.removeItem('luna_daily_tasks');
        localStorage.removeItem('luna_onboarding_complete');
        showMessage('success', 'Local data cleared. Reloading...');
        setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmMsg = "WARNING: This will permanently delete your account and all associated data. This action cannot be undone.";
    if (window.confirm(confirmMsg)) {
        setLoading(true);
        try {
            await api.user.deleteAccount();
            onLogout();
        } catch (e) {
            showMessage('error', 'Failed to delete account');
            setLoading(false);
        }
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
        <div className="flex items-center gap-4">
            <button onClick={() => setView('profile')} className="p-2 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">App Settings</h2>
        </div>

        {message && (
            <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 animate-fade-in ${
                message.type === 'success' 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
                {message.type === 'success' ? <Save size={16} /> : <Trash2 size={16} />}
                {message.text}
            </div>
        )}

        {/* Appearance */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Sun size={20} className="text-amber-500" /> Appearance
            </h3>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">Dark Mode</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">Easier on the eyes at night</p>
                </div>
                <button 
                    onClick={toggleTheme}
                    className={`relative w-14 h-8 rounded-full transition-colors ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-200'}`}
                >
                    <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform flex items-center justify-center ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}>
                        {isDarkMode ? <Moon size={12} className="text-indigo-500" /> : <Sun size={12} className="text-amber-500" />}
                    </div>
                </button>
            </div>
        </div>

        {/* Account Details */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <User size={20} className="text-rose-500" /> Account Details
            </h3>
            
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Age</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="number" 
                                value={age} 
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Change Password</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password to change"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:text-white placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button 
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
             <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Smartphone size={20} className="text-slate-500" /> Data Management
            </h3>
            <div className="space-y-3">
                <button 
                    onClick={handleClearData}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Clear All Saved Data</span>
                    <RefreshCw size={16} className="text-slate-400 group-hover:text-rose-500" />
                </button>
                
                <button 
                    onClick={handleDeleteAccount}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                >
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">Delete Account</span>
                    <Trash2 size={16} className="text-red-400 dark:text-red-500 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>

        {/* About */}
        <div className="text-center pt-4 pb-8">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">LunaCare Version 1.0.2</p>
            <p className="text-[10px] text-slate-300 dark:text-slate-700 mt-1">© 2024 LunaHealth Inc.</p>
        </div>
    </div>
  );
};

export default Settings;
