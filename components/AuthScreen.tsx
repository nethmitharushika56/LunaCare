
import React, { useState } from 'react';
import { Moon, Heart, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import { api } from '../services/api';
import { UserProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

type AuthView = 'login' | 'signup' | 'forgot';

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const { t } = useLanguage();
  const [view, setView] = useState<AuthView>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const resetForm = () => {
      setError('');
      setSuccessMsg('');
      setEmail('');
      setPassword('');
      setName('');
      setAge('');
  };

  const handleViewChange = (newView: AuthView) => {
      resetForm();
      setView(newView);
  };

  const validateForm = (): boolean => {
    if (!email.trim()) {
        setError("Email address is required.");
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError("Please enter a valid email address.");
        return false;
    }

    if (view === 'forgot') return true;

    if (!password) {
        setError("Password is required.");
        return false;
    }
    
    if (view === 'signup') {
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return false;
        }
        if (!name.trim()) {
            setError("Full name is required.");
            return false;
        }
        if (!age) {
            setError("Age is required.");
            return false;
        }
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
            setError("Please enter a valid age (13-100).");
            return false;
        }
    }

    return true;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSuccessMsg('');

      if (!validateForm()) return;

      setLoading(true);
      try {
          await api.auth.resetPassword(email);
          const subject = "LunaCare Password Reset Request";
          const body = `Hello Support,\n\nI forgot my password for the LunaCare account associated with: ${email}.\n\nPlease send me a reset link.\n\nThank you.`;
          window.location.href = `mailto:support@lunacare.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

          setSuccessMsg("We've opened your email app. Please send the pre-filled email to our support team to reset your password.");
      } catch (err: any) {
          setError(err.message || "Failed to process request. Please check if the email is correct.");
      } finally {
          setLoading(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    
    try {
        let user: UserProfile;
        if (view === 'login') {
            user = await api.auth.login(email, password, rememberMe);
        } else {
            user = await api.auth.signup({ name, email, password, age: parseInt(age) });
        }
        onLoginSuccess(user);
    } catch (err: any) {
        setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto overflow-x-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white rounded-[2rem] shadow-xl w-full overflow-hidden flex flex-col md:flex-row md:min-h-[600px] border border-slate-100 animate-fade-in">
          
          <div className="w-full md:w-1/2 bg-gradient-to-br from-rose-500 to-violet-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden min-h-[300px] md:min-h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
              
              <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                           <Moon size={20} fill="currentColor" className="text-white relative z-10" />
                           <Heart size={10} fill="#fbcfe8" className="absolute top-2 right-2 text-rose-200 z-20" />
                      </div>
                      <span className="font-bold text-2xl tracking-tight">LunaCare</span>
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                      {view === 'login' && t('auth.welcome')}
                      {view === 'signup' && t('auth.start')}
                      {view === 'forgot' && t('auth.recovery')}
                  </h1>
                  <p className="text-rose-100 text-base md:text-lg opacity-90 leading-relaxed max-w-sm">
                      {view === 'login' && t('auth.subtitle.login')}
                      {view === 'signup' && t('auth.subtitle.signup')}
                      {view === 'forgot' && t('auth.subtitle.forgot')}
                  </p>
              </div>

              <div className="relative z-10 mt-8 md:mt-0 hidden md:block">
                  <div className="flex gap-2">
                      <div className="h-1.5 w-8 bg-white rounded-full opacity-100"></div>
                      <div className="h-1.5 w-2 bg-white/40 rounded-full"></div>
                      <div className="h-1.5 w-2 bg-white/40 rounded-full"></div>
                  </div>
              </div>
          </div>

          <div className="w-full md:w-1/2 p-6 md:p-12 bg-white flex flex-col justify-center">
              <div className="max-w-sm mx-auto w-full">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      {view === 'login' && t('auth.signin')}
                      {view === 'signup' && t('auth.signup')}
                      {view === 'forgot' && t('auth.submit.forgot')}
                  </h2>
                  <p className="text-slate-500 mb-6 md:mb-8">
                      {view === 'login' && 'Enter your details to access your account.'}
                      {view === 'signup' && 'It takes less than a minute to join.'}
                      {view === 'forgot' && 'Enter your email to generate a support request.'}
                  </p>
                  
                  {error && (
                      <div className="mb-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
                          <AlertCircle size={16} className="flex-shrink-0" />
                          <span>{error}</span>
                      </div>
                  )}

                  {successMsg && (
                      <div className="mb-4 bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
                          <CheckCircle size={16} className="flex-shrink-0" />
                          <span>{successMsg}</span>
                      </div>
                  )}

                  {view === 'forgot' ? (
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                          <div className="space-y-1">
                              <label className="text-sm font-semibold text-slate-700 ml-1">{t('auth.email')}</label>
                              <div className="relative">
                                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                  <input 
                                      type="email" 
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                                      placeholder="sarah@example.com"
                                  />
                              </div>
                          </div>
                          
                          <button 
                              type="submit" 
                              disabled={loading || !!successMsg}
                              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl mt-6 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                          >
                              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                  <>Open Email Client <Send size={18} /></>
                              )}
                          </button>

                          <button 
                              type="button"
                              onClick={() => handleViewChange('login')}
                              className="w-full text-center text-slate-500 font-medium hover:text-slate-800 mt-4 flex items-center justify-center gap-2 transition-colors"
                          >
                              <ArrowLeft size={16} /> {t('auth.back')}
                          </button>
                      </form>
                  ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                          {view === 'signup' && (
                              <div className="flex gap-4">
                                  <div className="space-y-1 flex-1">
                                      <label className="text-sm font-semibold text-slate-700 ml-1">{t('auth.name')}</label>
                                      <div className="relative">
                                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                          <input 
                                              type="text" 
                                              value={name}
                                              onChange={(e) => setName(e.target.value)}
                                              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                                              placeholder="Sarah Doe"
                                          />
                                      </div>
                                  </div>
                                  <div className="space-y-1 w-24">
                                      <label className="text-sm font-semibold text-slate-700 ml-1">{t('auth.age')}</label>
                                      <div className="relative">
                                          <input 
                                              type="number" 
                                              value={age}
                                              onChange={(e) => setAge(e.target.value)}
                                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-center"
                                              placeholder="25"
                                              min="13"
                                              max="99"
                                          />
                                      </div>
                                  </div>
                              </div>
                          )}

                          <div className="space-y-1">
                              <label className="text-sm font-semibold text-slate-700 ml-1">{t('auth.email')}</label>
                              <div className="relative">
                                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                  <input 
                                      type="email" 
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                                      placeholder="sarah@example.com"
                                  />
                              </div>
                          </div>

                          <div className="space-y-1">
                              <div className="flex justify-between items-center ml-1">
                                  <label className="text-sm font-semibold text-slate-700">{t('auth.password')}</label>
                                  {view === 'login' && (
                                      <button 
                                        type="button" 
                                        onClick={() => handleViewChange('forgot')}
                                        className="text-xs font-bold text-rose-500 hover:text-rose-600"
                                      >
                                          {t('auth.forgot')}
                                      </button>
                                  )}
                              </div>
                              <div className="relative">
                                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                  <input 
                                      type={showPassword ? "text" : "password"} 
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                                      placeholder="••••••••"
                                  />
                                  <button 
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                  >
                                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </button>
                              </div>
                          </div>

                          {view === 'login' && (
                              <div className="flex items-center gap-2 ml-1">
                                  <input 
                                      type="checkbox" 
                                      id="remember" 
                                      checked={rememberMe} 
                                      onChange={(e) => setRememberMe(e.target.checked)}
                                      className="w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500 cursor-pointer accent-rose-500"
                                  />
                                  <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">{t('auth.remember')}</label>
                              </div>
                          )}

                          <button 
                              type="submit" 
                              disabled={loading}
                              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl mt-6 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                          >
                              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                  <>
                                      {view === 'login' ? t('auth.submit.login') : t('auth.submit.signup')} <ArrowRight size={18} />
                                  </>
                              )}
                          </button>
                      </form>
                  )}

                  {view !== 'forgot' && (
                      <div className="mt-8 text-center text-sm text-slate-500">
                          {view === 'login' ? `${t('auth.no_account')} ` : `${t('auth.has_account')} `}
                          <button 
                              onClick={() => handleViewChange(view === 'login' ? 'signup' : 'login')} 
                              className="font-bold text-rose-500 hover:text-rose-600 transition-colors"
                          >
                              {view === 'login' ? t('auth.signup') : t('auth.signin')}
                          </button>
                      </div>
                  )}

                  <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                      <p className="text-xs text-slate-400">By continuing, you agree to LunaCare's <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.</p>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
