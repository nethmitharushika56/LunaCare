import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import CycleTracker from './components/CycleTracker';
import SymptomChecker from './components/SymptomChecker';
import Community from './components/Community';
import Marketplace from './components/Marketplace';
import PregnancyTracker from './components/PregnancyTracker';
import LearnHub from './components/LearnHub';
import ReproductiveHealth from './components/ReproductiveHealth';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import HelpSupport from './components/HelpSupport';
import OnboardingTutorial from './components/OnboardingTutorial';
import AuthScreen from './components/AuthScreen';
import { ViewState, UserProfile, Product } from './types';
import { api } from './services/api';
import { Bell } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // Cart State
  const [cart, setCart] = useState<Product[]>([]);

  // Theme Logic
  useEffect(() => {
    const savedTheme = localStorage.getItem('luna_theme');
    const isDark = savedTheme === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('luna_theme', newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initial Session Check
  useEffect(() => {
    const initSession = async () => {
        try {
            const currentUser = await api.auth.getSession();
            if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
                if (localStorage.getItem('luna_onboarding_complete') !== 'true') {
                    setShowOnboarding(true);
                }
            }
        } catch (error) {
            console.error("Session check failed", error);
        } finally {
            setCheckingAuth(false);
        }
    };
    initSession();
  }, []);

  const handleLoginSuccess = (userProfile: UserProfile) => {
    setUser(userProfile);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    if (localStorage.getItem('luna_onboarding_complete') !== 'true') {
        setShowOnboarding(true);
    }
  };

  const handleLogout = async () => {
    await api.auth.logout();
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('dashboard');
    setCart([]);
  };

  const handleOnboardingComplete = async (data: Partial<UserProfile>) => {
    if (user) {
        try {
            const updatedUser = await api.user.updateProfile(data);
            setUser(updatedUser);
            localStorage.setItem('luna_onboarding_complete', 'true');
            setShowOnboarding(false);
        } catch (e) {
            console.error("Failed to save profile", e);
        }
    }
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const renderContent = () => {
    if (!user) return null;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} setView={setCurrentView} />;
      case 'cycle':
        return <CycleTracker />;
      case 'symptom-ai':
        return <SymptomChecker user={user} />;
      case 'pregnancy':
        return <PregnancyTracker />;
      case 'reproductive-health':
        return <ReproductiveHealth user={user} setUser={setUser} />;
      case 'community':
        return <Community user={user} />;
      case 'shop':
        return <Marketplace cart={cart} addToCart={addToCart} />;
      case 'learn':
        return <LearnHub />;
      case 'profile':
        return <Profile user={user} onLogout={handleLogout} setView={setCurrentView} />;
      case 'settings':
        return (
          <Settings 
            user={user} 
            setUser={setUser} 
            toggleTheme={toggleTheme} 
            isDarkMode={darkMode} 
            onLogout={handleLogout}
            setView={setCurrentView}
          />
        );
      case 'help':
        return <HelpSupport setView={setCurrentView} />;
      default:
        return <Dashboard user={user} setView={setCurrentView} />;
    }
  };

  if (checkingAuth) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">Connecting to Luna Database...</p>
        </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300">
      {showOnboarding && <OnboardingTutorial onComplete={handleOnboardingComplete} />}
      
      <Navigation currentView={currentView} setView={setCurrentView} toggleTheme={toggleTheme} isDarkMode={darkMode} />
      
      <main className="md:ml-72 min-h-screen p-4 md:p-8 max-w-6xl mx-auto transition-all duration-300">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md py-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white capitalize tracking-tight">
                    {currentView === 'symptom-ai' ? 'Luna AI' : currentView.replace('-', ' ')}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm hidden md:block font-medium">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex gap-3 items-center">
                <button 
                    onClick={() => setCurrentView('profile')}
                    className="hidden md:flex items-center gap-2 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-full text-xs font-bold transition-all group"
                >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    New Alerts
                </button>

                <button 
                    onClick={() => setCurrentView('profile')}
                    className="p-2.5 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 transition-all shadow-sm hover:shadow-md relative"
                >
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-pink-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
                </button>
            </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

export default App;