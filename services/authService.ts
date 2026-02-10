import { AuthUser } from '../types';

const STORAGE_KEY_USER = 'stillalive_current_user';

// Simulating a backend auth service
export const AuthService = {
  // Check if a user is currently "logged in" (persisted session)
  getCurrentUser: (): AuthUser | null => {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    return data ? JSON.parse(data) : null;
  },

  // Simulate Sign In
  signIn: async (email: string): Promise<AuthUser> => {
    // In a real app, verify password here.
    // For this demo, we create a deterministic UID based on email.
    const uid = btoa(email.toLowerCase()).substring(0, 12); 
    const user: AuthUser = { uid, email };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  },

  // Simulate Sign Up
  signUp: async (email: string): Promise<AuthUser> => {
    return AuthService.signIn(email);
  },

  // Simulate Social Provider Sign In
  signInWithProvider: async (provider: string): Promise<AuthUser> => {
    // Simulate network delay for OAuth redirect/popup feel
    await new Promise(resolve => setTimeout(resolve, 1200));

    const email = `${provider.toLowerCase()}.nomad@stillalive.app`;
    // Create a UID
    const uid = `social_${provider}_${Date.now().toString(36)}`;
    
    const user: AuthUser = { uid, email };
    
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  },

  signOut: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
};