import { UserProfile, DailyLog, BucketItem } from '../types';

// Helper to generate user-specific keys
const getKey = (baseKey: string, uid: string) => `${baseKey}_${uid}`;

const KEYS = {
  PROFILE: 'stillalive_profile',
  LOGS: 'stillalive_logs',
  BUCKET: 'stillalive_bucket',
};

export const StorageService = {
  saveProfile: (uid: string, profile: UserProfile) => {
    localStorage.setItem(getKey(KEYS.PROFILE, uid), JSON.stringify(profile));
    // In a real app: await firestore.collection('users').doc(uid).set(profile);
  },

  getProfile: (uid: string): UserProfile | null => {
    const data = localStorage.getItem(getKey(KEYS.PROFILE, uid));
    return data ? JSON.parse(data) : null;
    // In a real app: await firestore.collection('users').doc(uid).get();
  },

  saveLog: (uid: string, log: DailyLog) => {
    const logs = StorageService.getLogs(uid);
    logs.unshift(log); // Add to top
    localStorage.setItem(getKey(KEYS.LOGS, uid), JSON.stringify(logs));
    // In a real app: await firestore.collection('users').doc(uid).collection('logs').add(log);
  },

  getLogs: (uid: string): DailyLog[] => {
    const data = localStorage.getItem(getKey(KEYS.LOGS, uid));
    return data ? JSON.parse(data) : [];
  },

  saveBucketItem: (uid: string, item: BucketItem) => {
    const list = StorageService.getBucketList(uid);
    list.push(item);
    localStorage.setItem(getKey(KEYS.BUCKET, uid), JSON.stringify(list));
  },

  updateBucketItem: (uid: string, updatedItem: BucketItem) => {
    const list = StorageService.getBucketList(uid);
    const index = list.findIndex(i => i.id === updatedItem.id);
    if (index !== -1) {
      list[index] = updatedItem;
      localStorage.setItem(getKey(KEYS.BUCKET, uid), JSON.stringify(list));
    }
  },

  getBucketList: (uid: string): BucketItem[] => {
    const data = localStorage.getItem(getKey(KEYS.BUCKET, uid));
    return data ? JSON.parse(data) : [];
  },

  // Helper to update the profile's accumulated time
  updateAccumulatedTime: (uid: string, seconds: number) => {
    const profile = StorageService.getProfile(uid);
    if (profile) {
      profile.accumulatedSeconds += seconds;
      StorageService.saveProfile(uid, profile);
      return profile;
    }
    return null;
  }
};