import { create } from "zustand";

type Drawer = "chat" | "pair" | "call" | "settings" | null;

interface AppState {
  drawer: Drawer;
  setDrawer(drawer: Drawer): void;
}

export const useAppStore = create<AppState>((set) => ({
  drawer: null,
  setDrawer: (drawer) => set({ drawer }),
}));
