import { create } from "zustand";
import { Settings } from "@/types/settings";

interface SettingsState {
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;
  setSettings: (settings: Settings | null) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  isLoading: false,
  error: null,
  setSettings: (settings) => set({ settings }),
  updateSettings: (updates) =>
    set((state) => ({
      settings: state.settings ? { ...state.settings, ...updates } : null,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
