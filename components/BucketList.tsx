import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { BucketItem, UserProfile } from '../types';
import { Plus, Check, Trash2, Award } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const BucketList: React.FC<Props> = ({ profile, onUpdate }) => {
  const [items, setItems] = useState<BucketItem[]>([]);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    if (profile?.uid) {
      setItems(StorageService.getBucketList(profile.uid));
    }
  }, [profile]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const item: BucketItem = {
      id: Date.now().toString(),
      content: newItemText,
      completed: false,
      rewardSeconds: 259200 // 3 days
    };

    StorageService.saveBucketItem(profile.uid, item);
    setItems([...items, item]);
    setNewItemText('');
  };

  const toggleItem = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item || item.completed) return; // Cannot uncheck for MVP simplification regarding time math

    const confirm = window.confirm("Did you really complete this? You will gain 3 days of life.");
    if (!confirm) return;

    const updatedItem = { ...item, completed: true, completedAt: new Date().toISOString() };
    StorageService.updateBucketItem(profile.uid, updatedItem);
    
    // Update local state
    setItems(items.map(i => i.id === id ? updatedItem : i));

    // Update Profile Time
    const updatedProfile = StorageService.updateAccumulatedTime(profile.uid, updatedItem.rewardSeconds);
    if (updatedProfile) onUpdate(updatedProfile);
  };

  return (
    <div className="w-full max-w-xl mt-8">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Award className="text-[#7DF9FF] w-5 h-5" />
        Meaning List
      </h3>

      <div className="space-y-3">
        {items.map(item => (
          <div 
            key={item.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
              item.completed 
                ? 'bg-green-900/10 border-green-500/20 opacity-60' 
                : 'bg-white/5 border-white/10 hover:border-[#7DF9FF]/50'
            }`}
          >
            <span className={`text-sm md:text-base ${item.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
              {item.content}
            </span>
            
            <button
              onClick={() => toggleItem(item.id)}
              disabled={item.completed}
              className={`ml-4 p-2 rounded-full border transition-all ${
                item.completed 
                  ? 'bg-green-500 text-white border-green-500' 
                  : 'border-white/20 text-transparent hover:border-[#7DF9FF] hover:text-[#7DF9FF]'
              }`}
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ))}

        <form onSubmit={addItem} className="relative mt-4">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add a life goal (Reward: +3 Days)"
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-[#7DF9FF]"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#EAEAEA] text-black rounded-lg hover:bg-white"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default BucketList;