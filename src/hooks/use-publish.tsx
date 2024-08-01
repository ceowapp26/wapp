import { create } from "zustand";

type PublishStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const usePublish = create<PublishStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));


