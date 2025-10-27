import { create } from "zustand";
import { CalendarListEntry } from "@/types/settings";

interface CalendarsState {
  calendars: CalendarListEntry[];
  isLoading: boolean;
  error: string | null;
  setCalendars: (calendars: CalendarListEntry[]) => void;
  addCalendar: (calendar: CalendarListEntry) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCalendarsStore = create<CalendarsState>((set) => ({
  calendars: [],
  isLoading: false,
  error: null,
  setCalendars: (calendars) => set({ calendars }),
  addCalendar: (calendar) =>
    set((state) => ({
      calendars: [...state.calendars, calendar],
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
