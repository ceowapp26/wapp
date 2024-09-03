import { StoreSlice } from './store';
import { ModelOption } from '@/types/ai';
import { _defaultModel } from '@/constants/ai';

export interface ModelSlice {
  chatModel: ModelOption;
  setChatModel: (chatModel: ModelOption) => void;
}

export const createModelSlice: StoreSlice<ModelSlice> = (set, get) => ({
  chatModel: _defaultModel,
  setChatModel: (chatModel: ModelOption) => {
    set((prev: ModelSlice) => ({
      ...prev,
      chatModel: chatModel,
    }));
  },
});


