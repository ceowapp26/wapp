import { StoreSlice } from './store';
import { ModelOption } from '@/types/ai';
import { defaultModel } from '@/constants/ai';

export interface ModelSlice {
  inputModel: ModelOption;
  setInputModel: (inputModel: ModelOption) => void;
  configModel: ModelOption;
  setConfigModel: (configModel: ModelOption) => void;
}

export const createModelSlice: StoreSlice<ModelSlice> = (set, get) => ({
  inputModel: defaultModel,
  configModel: defaultModel,
  setInputModel: (inputModel: ModelOption) => {
    set((prev: ModelSlice) => ({
      ...prev,
      inputModel: inputModel,
    }));
  },
  setConfigModel: (configModel: ModelOption) => {
    set((prev: ModelSlice) => ({
      ...prev,
      configModel: configModel,
    }));
  },
});


