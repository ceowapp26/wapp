import { StoreSlice } from './store';
import { Context } from '@/types/chat';

export interface ContextSlice {
  chatContext: Context;
  setChatContext: (chatContext: Context) => void;
}

export const createContextSlice: StoreSlice<ContextSlice> = (set, get) => ({
  chatContext: 'general',
  setChatContext: (chatContext: Context) => {
    set((prev: ContextSlice) => ({
      ...prev,
      chatContext: chatContext,
    }));
  },
});


