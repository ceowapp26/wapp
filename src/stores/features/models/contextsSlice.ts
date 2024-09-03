import { StoreSlice } from './store';
import { Context } from '@/types/chat';

export interface ContextSlice {
  inputContext: Context;
  setInputContext: (inputContext: Context) => void;
}

export const createContextSlice: StoreSlice<ContextSlice> = (set, get) => ({
  inputContext: 'general',
  setInputContext: (inputContext: Context) => {
    set((prev: ContextSlice) => ({
      ...prev,
      inputContext: inputContext,
    }));
  },
});


