export interface AuthUser {
  uid: string;
  email: string;
}

export interface UserProfile {
  uid: string; // Link profile to auth user
  birthDate: string; // ISO string
  lifeExpectancyYears: number; // Default 78
  accumulatedSeconds: number; // Bonus or penalty seconds earned
  name: string;
}

export interface DailyLog {
  id: string;
  timestamp: string;
  content: string;
  timeDeltaSeconds: number;
  reasoning: string;
  category: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface BucketItem {
  id: string;
  content: string;
  completed: boolean;
  completedAt?: string;
  rewardSeconds: number; // Usually +3 days (259200s)
}

export enum AppView {
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
}

// Gemini Response Schema
export interface LifeAnalysisResult {
  timeDeltaSeconds: number;
  reasoning: string;
  category: string;
}