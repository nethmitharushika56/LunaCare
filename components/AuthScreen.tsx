import React, { useState } from 'react';
import { Moon, Heart, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, AlertCircle, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && (!name || !age))) return;

    setLoading(true);
    setError('');
    
    try {
        let user: UserProfile;
        if (isLogin) {
            user = await api.auth.login(email, password);
        } else {
            user = await api.auth.signup({ name, email, password, age: parseInt(age) });
        }
        onLoginSuccess(user);
    } catch (err: any) {
        setError(err.message || "An error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto overflow-x-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white rounded-[2rem] shadow-xl w-full overflow-hidden flex flex-col md:flex-row md:min-h-[600px] border border-slate-100 animate-fade-in">
          
          {/* Left Side - Visual / Branding */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-rose-500 to-violet-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden min-h-[300px] md:min-h-full">
              {/* Background Decorations */}
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
                      {isLogin ? 'Welcome Back.' : 'Start Journey.'}
                  </h1>
                  <p className="text-rose-100 text-base md:text-lg opacity-90 leading-relaxed max-w-sm">
                      {isLogin 
                          ? 'Your holistic health companion is ready to help you track, plan, and thrive today.' 
                          : 'Join thousands of women taking control of their reproductive health with AI-powered insights.'
                      }
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

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-6 md:p-12 bg-white flex flex-col justify-center">
              <div className="max-w-sm mx-auto w-full">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      {isLogin ? 'Sign In' : 'Create Account'}
                  </h2>
                  <p className="text-slate-500 mb-6 md:mb-8">
                      {isLogin ? 'Enter your details to access your account.' : 'It takes less than a minute to join.'}
                  </p>
                  
                  {error && (
                      <div className="mb-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                          <AlertCircle size={16} />
                          {error}
                      </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                      {!isLogin && (
                          <div className="flex gap-4">
                              <div className="space-y-1 flex-1">
                                  <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                                  <div className="relative">
                                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                      <input 
                                          type="text" 
                                          value={name}
                                          onChange={(e) => setName(e.target.value)}
                                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                                          placeholder="Sarah Doe"
                                          required={!isLogin}
                                      />
                                  </div>
                              </div>
                              <div className="space-y-1 w-24">
                                  <label className="text-sm font-semibold text-slate-700 ml-1">Age</label>
                                  <div className="relative">
                                      <input 
                                          type="number" 
                                          value={age}
                                          onChange={(e) => setAge(e.target.value)}
                                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-center"
                                          placeholder="25"
                                          min="13"
                                          max="99"
                                          required={!isLogin}
                                      />
                                  </div>
                              </div>
                          </div>
                      )}

                      <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                          <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input 
                                  type="email" 
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                                  placeholder="sarah@example.com"
                                  required
                              />
                          </div>
                      </div>

                      <div className="space-y-1">
                          <div className="flex justify-between items-center ml-1">
                              <label className="text-sm font-semibold text-slate-700">Password</label>
                              {isLogin && <button type="button" className="text-xs font-bold text-rose-500 hover:text-rose-600">Forgot?</button>}
                          </div>
                          <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input 
                                  type={showPassword ? "text" : "password"} 
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                                  placeholder="••••••••"
                                  required
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

                      <button 
                          type="submit" 
                          disabled={loading}
                          className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl mt-6 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                          {loading ? <Loader2 className="animate-spin" size={20} /> : (
                              <>
                                  {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
                              </>
                          )}
                      </button>
                  </form>

                  <div className="mt-8 text-center text-sm text-slate-500">
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                      <button 
                          onClick={() => {
                              setIsLogin(!isLogin);
                              setError('');
                          }} 
                          className="font-bold text-rose-500 hover:text-rose-600 transition-colors"
                      >
                          {isLogin ? 'Sign up' : 'Log in'}
                      </button>
                  </div>

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