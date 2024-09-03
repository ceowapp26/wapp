import { StoreSlice } from './store';
import { ModelOption } from '@/types/ai';
import { _defaultModel, _defaultAIAPIEndpoint } from '@/constants/ai';

export interface ModelSlice {
  inputModel: ModelOption;
  setInputModel: (inputModel: ModelOption) => void;
  configModel: ModelOption;
  setConfigModel: (configModel: ModelOption) => void;
  apiEndpoint: string;
  setApiEndpoint: (apiEndpoint: string) => void;
}

export const createModelSlice: StoreSlice<ModelSlice> = (set, get) => ({
  inputModel: _defaultModel,
  configModel: _defaultModel,
  apiEndpoint: _defaultAIAPIEndpoint,
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
  setApiEndpoint: (apiEndpoint: string) => {
    set((prev: ModelSlice) => ({
      ...prev,
      apiEndpoint: apiEndpoint,
    }));
  },
});






