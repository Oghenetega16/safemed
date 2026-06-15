import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  selectedDate: number;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleCollapsed: () => void;
  setSelectedDate: (date: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  selectedDate: 18,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
