import { create } from "zustand";

type ProjectDeploymentsStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useProjectDeployments = create<ProjectDeploymentsStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
