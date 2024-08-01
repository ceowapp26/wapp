import { StoreSlice } from './store';
import { Role } from '@/types/chat';

export interface RoleSlice {
  inputRole: Role;
  setInputRole: (inputRole: Role) => void;
}

export const createRoleSlice: StoreSlice<RoleSlice> = (set, get) => ({
  inputRole: 'user',
  setInputRole: (inputRole: Role) => {
    set((prev: RoleSlice) => ({
      ...prev,
      inputRole: inputRole,
    }));
  },
});


