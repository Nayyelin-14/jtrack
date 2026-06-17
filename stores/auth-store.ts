"use client";

import { create } from "zustand";
import { authApi, type AuthUser } from "@/lib/auth-api";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: AuthUser | null, token?: string | null) => void;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isInitialized: false,

  setUser: (user, token = null) =>
    set({ user, token, isLoading: false, isInitialized: true }),

  initialize: async () => {
    set({ isLoading: true });
    try {
      const res = await authApi.me();
      set({
        user: res.user ?? null,
        token: res.token ?? null,
        isLoading: false,
        isInitialized: true,
      });
    } catch {
      set({ user: null, token: null, isLoading: false, isInitialized: true });
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
    } finally {
      set({ user: null, token: null, isLoading: false });
    }
  },
}));
