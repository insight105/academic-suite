import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthTokens, UserRole } from '@/types';
import { authApi } from '../api/apiClient';
import { useQuizStore } from './quizStore';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user, tokens } = await authApi.login(email, password);
          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login gagal',
            isLoading: false
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } finally {
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          // Reset other stores
          useQuizStore.getState().reset();
        }
      },

      refreshToken: async () => {
        const { tokens } = get();
        if (!tokens?.refreshToken) return;

        try {
          const newTokens = await authApi.refreshToken(tokens.refreshToken);
          set({ tokens: newTokens });
        } catch (error) {
          // If refresh fails, logout
          get().logout();
        }
      },

      clearError: () => set({ error: null }),

      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
