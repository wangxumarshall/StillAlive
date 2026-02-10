import React, { useState } from 'react';
import { analyzeDailyLog } from '../services/geminiService';
import { StorageService } from '../services/storageService';
import { DailyLog as DailyLogType, UserProfile } from '../types';
import { Send, Loader2, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const DailyLog: React.FC<Props> = ({ profile, onUpdate }) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<DailyLogType | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setLastResult(null);

    try {
      // 1. Get AI Analysis
      const analysis = await analyzeDailyLog(input);

      // 2. Create Log Object
      const newLog: DailyLogType = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        content: input,
        timeDeltaSeconds: analysis.timeDeltaSeconds,
        reasoning: analysis.reasoning,
        category: analysis.category as any,
      };

      // 3. Save Log
      StorageService.saveLog(profile.uid, newLog);

      // 4. Update User Profile
      const updatedProfile = StorageService.updateAccumulatedTime(profile.uid, newLog.timeDeltaSeconds);
      if (updatedProfile) {
        onUpdate(updatedProfile);
      }

      setLastResult(newLog);
      setInput('');

    } catch (error) {
      console.error("Failed to process log", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl mt-8">
      <h3 className="text-xl font-semibold text-white mb-4">Daily Existence Audit</h3>
      
      {!lastResult ? (
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How did you spend your existence today? (e.g., Read a book for 2 hours, or Doomscrolled on TikTok...)"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#7DF9FF] focus:ring-1 focus:ring-[#7DF9FF] h-32 resize-none transition-all"
          />
          <div className="absolute bottom-4 right-4">
            <button
              onClick={handleAnalyze}
              disabled={!input.trim() || isAnalyzing}
              className={`p-3 rounded-lg flex items-center justify-center transition-all ${
                input.trim() && !isAnalyzing
                  ? 'bg-[#EAEAEA] text-black hover:bg-white hover:scale-105'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-4 rounded-xl border mb-4 flex items-start gap-4 ${
            lastResult.timeDeltaSeconds > 0 ? 'bg-green-500/10 border-green-500/30' : 
            lastResult.timeDeltaSeconds < 0 ? 'bg-red-500/10 border-red-500/30' : 
            'bg-gray-500/10 border-gray-500/30'
          }`}>
            <div className={`p-2 rounded-full ${
              lastResult.timeDeltaSeconds > 0 ? 'bg-green-500/20 text-green-400' : 
              lastResult.timeDeltaSeconds < 0 ? 'bg-red-500/20 text-red-400' : 
              'bg-gray-500/20 text-gray-400'
            }`}>
              {lastResult.timeDeltaSeconds > 0 ? <ArrowUp className="w-6 h-6" /> : 
               lastResult.timeDeltaSeconds < 0 ? <ArrowDown className="w-6 h-6" /> : 
               <Minus className="w-6 h-6" />}
            </div>
            <div>
              <div className="font-mono text-lg font-bold flex items-center gap-2">
                {lastResult.timeDeltaSeconds > 0 ? '+' : ''}
                {lastResult.timeDeltaSeconds} SECONDS
                <span className="text-xs font-normal opacity-70 ml-2">
                  ({(lastResult.timeDeltaSeconds / 60).toFixed(1)} min)
                </span>
              </div>
              <p className="text-sm mt-1 text-gray-300 italic">"{lastResult.reasoning}"</p>
            </div>
          </div>
          <button 
            onClick={() => setLastResult(null)}
            className="text-sm text-gray-500 hover:text-[#7DF9FF] underline decoration-dotted"
          >
            Log another entry
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyLog;