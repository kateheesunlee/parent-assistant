import { create } from "zustand";
import { Child } from "@/types/children";

interface ChildrenState {
  children: Child[];
  isLoading: boolean;
  error: string | null;
  setChildren: (children: Child[]) => void;
  addChild: (child: Child) => void;
  updateChild: (id: string, updates: Partial<Child>) => void;
  deleteChild: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChildrenStore = create<ChildrenState>((set) => ({
  children: [],
  isLoading: false,
  error: null,
  setChildren: (children) => set({ children }),
  addChild: (child) =>
    set((state) => ({
      children: [...state.children, child],
    })),
  updateChild: (id, updates) =>
    set((state) => ({
      children: state.children.map((child) =>
        child.id === id ? { ...child, ...updates } : child
      ),
    })),
  deleteChild: (id) =>
    set((state) => ({
      children: state.children.filter((child) => child.id !== id),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
