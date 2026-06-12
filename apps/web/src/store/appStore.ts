import { create } from "zustand";

type Drawer = "chat" | "pair" | "call" | "settings" | null;

interface AppState {
  drawer: Drawer;
  chatDraft: string;
  chatReturnsToMap: boolean;
  clearChatContext(): void;
  setChatContext(draft: string, returnsToMap?: boolean): void;
  setDrawer(drawer: Drawer): void;
}

export const useAppStore = create<AppState>((set) => ({
  drawer: null,
  chatDraft: "",
  chatReturnsToMap: false,
  clearChatContext: () =>
    set({ chatDraft: "", chatReturnsToMap: false }),
  setChatContext: (chatDraft, chatReturnsToMap = false) =>
    set({ chatDraft, chatReturnsToMap }),
  setDrawer: (drawer) => set({ drawer }),
}));
