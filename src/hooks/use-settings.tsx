import { create } from "zustand";

type SettingsStore = {
  isOpen: boolean;
  isSelected: string;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (selection: string) => void;
};

export const useSettings = create<SettingsStore>((set) => ({
  isOpen: false,
  isSelected: "",
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onSelect: (selection: string) => set({ isSelected: selection }),
}));
