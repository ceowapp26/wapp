import { create } from "zustand";

type AISettingsStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAISettings = create<AISettingsStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
