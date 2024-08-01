import { StoreSlice } from './store';
import { LocalModelConfigCollectionInterface, TotalTokenUsed, TimeLimitTokenUsed } from '@/types/ai';
import { _defaultSystemMessage } from '@/constants/chat';
import { _defaultAIConfig, generateDefaultTimeLimitTokenUsed } from '@/constants/ai';

export interface ConfigSlice {
  openAI: boolean;
  openConfig: boolean;
  autoTitle: boolean;
  hideMenuOptions: boolean;
  advancedMode: boolean;
  AIConfig: LocalModelConfigCollectionInterface;
  defaultSystemMessage: string;
  hideSideMenu: boolean;
  enterToSubmit: boolean;
  inlineLatex: boolean;
  markdownMode: boolean;
  countTotalTokens: boolean;
  totalTokenUsed: TotalTokenUsed;
  timeLimitTokenUsed: TimeLimitTokenUsed;
  newCoverPosition: number;
  tokenShortage: boolean;
  autoAdjustToken: boolean;
  setOpenAI: (openAI: boolean) => void;
  setOpenConfig: (openConfig: boolean) => void;
  setAutoTitle: (autoTitle: boolean) => void;
  setAdvancedMode: (advancedMode: boolean) => void;
  setAIConfig: (AIConfig: LocalModelConfigCollectionInterface) => void;
  setDefaultSystemMessage: (defaultSystemMessage: string) => void;
  setHideMenuOptions: (hideMenuOptions: boolean) => void;
  setHideSideMenu: (hideSideMenu: boolean) => void;
  setEnterToSubmit: (enterToSubmit: boolean) => void;
  setInlineLatex: (inlineLatex: boolean) => void;
  setMarkdownMode: (markdownMode: boolean) => void;
  setCountTotalTokens: (countTotalTokens: boolean) => void;
  setTotalTokenUsed: (totalTokenUsed: TotalTokenUsed) => void;
  setTokenShortage: (tokenShortage: boolean) => void;
  setAutoAdjustToken: (autoAdjustToken: boolean) => void;
}

export const createConfigSlice: StoreSlice<ConfigSlice> = (set, get) => ({
  openAI: false,
  openConfig: false,
  hideMenuOptions: false,
  hideSideMenu: false,
  autoTitle: false,
  enterToSubmit: true,
  advancedMode: true,
  AIConfig: _defaultAIConfig,
  defaultSystemMessage: _defaultSystemMessage,
  inlineLatex: false,
  markdownMode: true,
  countTotalTokens: true,
  autoAdjustToken: false,
  totalTokenUsed: {},
  timeLimitTokenUsed: generateDefaultTimeLimitTokenUsed(_defaultAIConfig),
  setOpenAI: (openAI: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      openAI: openAI,
    }));
  },
  setOpenConfig: (openConfig: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      openConfig: openConfig,
    }));
  },
  setAutoTitle: (autoTitle: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      autoTitle: autoTitle,
    }));
  },
  setAdvancedMode: (advancedMode: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      advancedMode: advancedMode,
    }));
  },
  setAIConfig: (AIConfig: LocalModelConfigCollectionInterface) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      AIConfig: AIConfig,
    }));
  },
  setDefaultSystemMessage: (defaultSystemMessage: string) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      defaultSystemMessage: defaultSystemMessage,
    }));
  },
  setHideMenuOptions: (hideMenuOptions: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      hideMenuOptions: hideMenuOptions,
    }));
  },
  setHideSideMenu: (hideSideMenu: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      hideSideMenu: hideSideMenu,
    }));
  },
  setEnterToSubmit: (enterToSubmit: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      enterToSubmit: enterToSubmit,
    }));
  },
  setInlineLatex: (inlineLatex: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      inlineLatex: inlineLatex,
    }));
  },
  setMarkdownMode: (markdownMode: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      markdownMode: markdownMode,
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
  setTokenShortage: (tokenShortage: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      tokenShortage: tokenShortage,
    }));
  },
  setAutoAdjustToken: (autoAdjustToken: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      autoAdjustToken: autoAdjustToken,
    }));
  },
});


