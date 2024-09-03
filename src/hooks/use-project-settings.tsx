import { create } from "zustand";

type ProjectSettingsStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useProjectSettings = create<ProjectSettingsStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
