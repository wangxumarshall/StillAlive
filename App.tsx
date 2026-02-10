import React, { useState, useEffect } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import LifeClock from './components/LifeClock';
import DailyLog from './components/DailyLog';
import BucketList from './components/BucketList';
import { StorageService } from './services/storageService';
import { AuthService } from './services/authService';
import { UserProfile, AppView, AuthUser } from './types';
import { Activity, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const init = () => {
      // 1. Check for logged in user
      const currentUser = AuthService.getCurrentUser();
      
      if (!currentUser) {
        setView(AppView.AUTH);
        return;
      }

      setUser(currentUser);

      // 2. If user exists, check for profile
      const existingProfile = StorageService.getProfile(currentUser.uid);
      if (existingProfile) {
        setProfile(existingProfile);
        setView(AppView.DASHBOARD);
      } else {
        setView(AppView.ONBOARDING);
      }
    };

    init();
  }, []);

  const handleAuthSuccess = (authUser: AuthUser) => {
    setUser(authUser);
    const existingProfile = StorageService.getProfile(authUser.uid);
    if (existingProfile) {
      setProfile(existingProfile);
      setView(AppView.DASHBOARD);
    } else {
      setView(AppView.ONBOARDING);
    }
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setView(AppView.DASHBOARD);
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const handleLogout = async () => {
    await AuthService.signOut();
    setUser(null);
    setProfile(null);
    setView(AppView.AUTH);
  };

  if (view === null) return null; // Loading state

  return (
    <div className="relative min-h-screen text-[#EAEAEA] selection:bg-[#7DF9FF] selection:text-black">
      <ParticleBackground />

      {view === AppView.AUTH && (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}

      {view === AppView.ONBOARDING && user && (
        <Onboarding user={user} onComplete={handleOnboardingComplete} />
      )}

      {view === AppView.DASHBOARD && profile && (
        <div className="container mx-auto px-4 py-8 pb-20 flex flex-col items-center max-w-4xl animate-in fade-in duration-700">
          
          {/* Header */}
          <header className="w-full flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-[#7DF9FF]" />
              <span className="font-bold tracking-tight text-xl">Still Alive</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400 font-mono hidden md:block">
                {profile.name}
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Main Clock */}
          <LifeClock profile={profile} />

          {/* Interaction Area */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="flex flex-col items-center">
               <DailyLog profile={profile} onUpdate={handleProfileUpdate} />
            </div>
            <div className="flex flex-col items-center">
              <BucketList profile={profile} onUpdate={handleProfileUpdate} />
            </div>
          </div>
          
          <footer className="mt-20 text-xs text-gray-600 text-center">
            <p>Memento Mori. Memento Vivere.</p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;