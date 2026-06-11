import { create } from "zustand";

interface AppState {
  environmentLabel: string;
}

export const useAppStore = create<AppState>(() => ({
  environmentLabel: "Modulaire herschrijving",
}));
