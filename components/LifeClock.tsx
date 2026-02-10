import React, { useEffect, useState, useMemo } from 'react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
}

const LifeClock: React.FC<Props> = ({ profile }) => {
  const [timeLeft, setTimeLeft] = useState<{ years: number; days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [totalSecondsLeft, setTotalSecondsLeft] = useState(0);

  // Calculate the projected end date based on birthdate + 78 years + accumulated seconds
  const deathDate = useMemo(() => {
    const start = new Date(profile.birthDate);
    // Add 78 years
    const end = new Date(start);
    end.setFullYear(start.getFullYear() + profile.lifeExpectancyYears);
    // Add accumulated seconds (bonus/penalty)
    end.setSeconds(end.getSeconds() + profile.accumulatedSeconds);
    return end;
  }, [profile]);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const difference = deathDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        setTotalSecondsLeft(0);
        return;
      }

      setTotalSecondsLeft(Math.floor(difference / 1000));

      const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
      const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ years, days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [deathDate]);

  if (!timeLeft) return <div className="h-64 flex items-center justify-center text-gray-500">Synchronizing...</div>;

  const percentageLeft = Math.max(0, Math.min(100, (totalSecondsLeft / (profile.lifeExpectancyYears * 365.25 * 24 * 3600)) * 100));

  return (
    <div className="w-full flex flex-col items-center py-10">
      <div className="relative group cursor-default">
         {/* Glow Effect */}
        <div className="absolute -inset-4 bg-[#7DF9FF]/20 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
        
        <div className="relative text-center space-y-2">
          <div className="text-gray-500 text-sm uppercase tracking-[0.3em] mb-4">Time Remaining</div>
          
          <div className="flex flex-wrap justify-center items-baseline gap-4 md:gap-8 font-mono text-[#EAEAEA]">
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {String(timeLeft.years).padStart(2, '0')}
              </span>
              <span className="text-xs text-gray-500 mt-2">YEARS</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {String(timeLeft.days).padStart(3, '0')}
              </span>
              <span className="text-xs text-gray-500 mt-2">DAYS</span>
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 md:gap-4 mt-4 font-mono text-[#7DF9FF] text-2xl md:text-4xl font-bold opacity-90">
            <span>{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="animate-pulse">:</span>
            <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="animate-pulse">:</span>
            <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Life Progress Bar */}
      <div className="w-full max-w-md mt-12 space-y-2">
        <div className="flex justify-between text-xs text-gray-500 font-mono">
          <span>BIRTH</span>
          <span>{percentageLeft.toFixed(4)}% LEFT</span>
          <span>END</span>
        </div>
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#7DF9FF] shadow-[0_0_10px_#7DF9FF]" 
            style={{ width: `${100 - percentageLeft}%`, transition: 'width 1s linear' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LifeClock;