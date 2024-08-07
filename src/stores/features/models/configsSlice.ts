import { StoreSlice } from './store';
import { LocalModelConfigCollectionInterface, TotalTokenUsed, TimeLimitTokenUsed } from '@/types/ai';
import { _defaultAIConfig, generateDefaultTimeLimitTokenUsed } from '@/constants/ai';

export interface ConfigSlice {
  AIConfig: LocalModelConfigCollectionInterface;
  countTotalTokens: boolean;
  totalTokenUsed: TotalTokenUsed;
  timeLimitTokenUsed: TimeLimitTokenUsed;
  autoAdjustToken: boolean;
  tokenShortage: boolean;
  setAutoTitle: (autoTitle: boolean) => void;
  setAIConfig: (AIConfig: LocalModelConfigCollectionInterface) => void;
  setCountTotalTokens: (countTotalTokens: boolean) => void;
  setTotalTokenUsed: (totalTokenUsed: TotalTokenUsed) => void;
  setAutoAdjustToken: (autoAdjustToken: boolean) => void;
  setTokenShortage: (tokenShortage: boolean) => void;
}

export const createConfigSlice: StoreSlice<ConfigSlice> = (set, get) => ({
  AIConfig: _defaultAIConfig,
  countTotalTokens: true,
  totalTokenUsed: {},
  timeLimitTokenUsed: generateDefaultTimeLimitTokenUsed(_defaultAIConfig),
  autoAdjustToken: false,
  tokenShortage: false,
  setAIConfig: (AIConfig: LocalModelConfigCollectionInterface) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      AIConfig: AIConfig,
    }));
  },
  setCountTotalTokens: (countTotalTokens: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      countTotalTokens: countTotalTokens,
    }));
  },
  setTotalTokenUsed: (totalTokenUsed: TotalTokenUsed) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      totalTokenUsed: totalTokenUsed,
    }));
  },
  setTimeLimitTokenUsed: (timeLimitTokenUsed: TimeLimitTokenUsed) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      timeLimitTokenUsed: timeLimitTokenUsed,
    }));
  },
  setAutoAdjustToken: (autoAdjustToken: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      autoAdjustToken: autoAdjustToken,
    }));
  },
  setTokenShortage: (tokenShortage: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      tokenShortage: tokenShortage,
    }));
  },
});


