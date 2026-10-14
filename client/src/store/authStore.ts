import { create } from 'zustand';
import type { User, AuthResponseData } from '../types/auth';
import { api, AppApiError } from '../api/client';
import { queryClient } from '../lib/queryClient';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // starts true until initial checkAuth completes
  error: null,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      // Calls backend GET /api/v1/auth/me with HttpOnly cookie
      const data = await api.get<AuthResponseData>('/auth/me');
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      // Unauthenticated or expired session
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: err instanceof AppApiError && err.statusCode !== 401 ? err.message : null,
      });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post('/auth/logout');
    } catch {
      // Silently proceed with client session clearance
    } finally {
      queryClient.clear();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
