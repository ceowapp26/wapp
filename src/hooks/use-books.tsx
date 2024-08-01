import { create } from "zustand";

type BookssStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useBooks = create<BooksStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
