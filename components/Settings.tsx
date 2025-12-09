
import React, { useState, useRef } from 'react';
import { UserProfile, ViewState } from '../types';
import { ArrowLeft, Moon, Sun, Trash2, Save, RefreshCw, Smartphone, Key, Mail, User, Calendar, Camera, Upload, Globe } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n/translations';

interface SettingsProps {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  onLogout: () => void;
  setView: (view: ViewState) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, setUser, toggleTheme, isDarkMode, onLogout, setView }) => {
  const { language, setLanguage, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form States
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [age, setAge] = useState(user.age.toString());
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>(user.avatar);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          showMessage('error', 'Image size must be less than 2MB');
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name || !email || !age) {
        showMessage('error', 'Please fill in all required fields');
        return;
    }

    setLoading(true);
    try {
        const updatedUser = await api.user.updateProfile({ 
            name, 
            email, 
            age: parseInt(age),
            avatar
        });
        
        if (password) {
            if (password.length < 6) {
                throw new Error("Password must be at least 6 characters");
            }
            await api.user.changePassword(password);
            setPassword(''); 
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
    if (window.confirm("Are you sure? This will clear local app data like daily tasks, onboarding status, and theme preferences.")) {
        setLoading(true);
        setTimeout(() => {
            localStorage.removeItem('luna_daily_tasks');
            localStorage.removeItem('luna_onboarding_complete');
            localStorage.removeItem('luna_theme');
            showMessage('success', 'Local data cleared. Reloading app...');
            setTimeout(() => window.location.reload(), 1500);
        }, 1000);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("CRITICAL WARNING: This will permanently delete your account and all associated data. This action cannot be undone.")) {
        setLoading(true);
        try {
            await api.user.deleteAccount();
            showMessage('success', 'Account deleted. Goodbye.');
            setTimeout(() => {
                onLogout();
            }, 1500);
        } catch (e: any) {
            showMessage('error', e.message || 'Failed to delete account');
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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('settings.title')}</h2>
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

        {/* Language Selection */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
             <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Globe size={20} className="text-blue-500" /> {t('settings.language')}
            </h3>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">Active Language</p>
                    <p className="text-xs text-slate-500">{t('settings.language_desc')}</p>
                </div>
                <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="pt">Português (BR)</option>
                    <option value="zh">简体中文 (Chinese)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="si">සිංහල (Sinhala)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                </select>
            </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Sun size={20} className="text-amber-500" /> {t('settings.appearance')}
            </h3>
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">{t('settings.dark_mode')}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{t('settings.dark_mode_desc')}</p>
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
                <User size={20} className="text-rose-500" /> {t('settings.account')}
            </h3>
            
            <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 bg-rose-50 dark:bg-slate-800 flex items-center justify-center">
                        {avatar ? (
                            <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl">👩‍🦰</span>
                        )}
                    </div>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-slate-900 dark:bg-rose-500 text-white p-2 rounded-full hover:scale-110 transition-transform shadow-md"
                    >
                        <Camera size={14} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                </div>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                >
                    <Upload size={12} /> Change Picture
                </button>
            </div>
            
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('auth.name')}</label>
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
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('auth.age')}</label>
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
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('auth.email')}</label>
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
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Change {t('auth.password')}</label>
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
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
                        {t('settings.save')}
                    </button>
                </div>
            </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
             <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Smartphone size={20} className="text-slate-500" /> {t('settings.data')}
            </h3>
            <div className="space-y-3">
                <button 
                    onClick={handleClearData}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group disabled:opacity-50"
                >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('settings.clear')}</span>
                    <RefreshCw size={16} className="text-slate-400 group-hover:text-rose-500" />
                </button>
                
                <button 
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group disabled:opacity-50"
                >
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">{t('settings.delete')}</span>
                    <Trash2 size={16} className="text-red-400 dark:text-red-500 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>

        <div className="text-center pt-4 pb-8">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">LunaCare Version 1.1.0</p>
            <p className="text-[10px] text-slate-300 dark:text-slate-700 mt-1">© 2024 LunaHealth Inc.</p>
        </div>
    </div>
  );
};

export default Settings;
