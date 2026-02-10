import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { UserProfile, AuthUser } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  user: AuthUser;
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<Props> = ({ user, onComplete }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate) return;

    const profile: UserProfile = {
      uid: user.uid,
      name,
      birthDate,
      lifeExpectancyYears: 78, // Hardcoded standard for MVP
      accumulatedSeconds: 0
    };

    StorageService.saveProfile(user.uid, profile);
    onComplete(profile);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-in fade-in duration-1000">
      <div className="mb-8 text-center">
        <Sparkles className="w-12 h-12 text-[#7DF9FF] mx-auto mb-4 animate-pulse" />
        <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">Still Alive</h1>
        <p className="text-gray-400 text-lg">Anchor your existence. Measure your meaning.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
        <div className="text-center mb-4">
          <p className="text-sm text-[#7DF9FF]">Welcome, {user.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">What should we call you?</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7DF9FF] transition-colors"
            placeholder="Traveler"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">When did your journey begin?</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7DF9FF] transition-colors [color-scheme:dark]"
            required
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-[#EAEAEA] hover:bg-white text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 group"
          >
            Initialize Life Clock
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <p className="text-xs text-center text-gray-600 mt-4">
          Based on 78-year average expectancy. <br/> Your actions will define your true time.
        </p>
      </form>
    </div>
  );
};

export default Onboarding;