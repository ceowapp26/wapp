import { StoreSlice } from './store';
import { Role } from '@/types/chat';

export interface RoleSlice {
  chatRole: Role;
  setChatRole: (chatRole: Role) => void;
}

export const createRoleSlice: StoreSlice<RoleSlice> = (set, get) => ({
  chatRole: 'user',
  setChatRole: (chatRole: Role) => {
    set((prev: RoleSlice) => ({
      ...prev,
      chatRole: chatRole,
    }));
  },
});


