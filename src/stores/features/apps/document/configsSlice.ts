import { StoreSlice } from './store';
import { _defaultSystemMessage } from '@/constants/chat';

export interface ConfigSlice {
  defaultSystemMessage: string;
  advancedMode: boolean;
  hideMenuOptions: boolean;
  hideSideMenu: boolean;
  enterToSubmit: boolean;
  inlineLatex: boolean;
  markdownMode: boolean;
  autoTitle: boolean;
  setDefaultSystemMessage: (defaultSystemMessage: string) => void;
  setAdvancedMode: (advancedMode: boolean) => void;
  setHideMenuOptions: (hideMenuOptions: boolean) => void;
  setHideSideMenu: (hideSideMenu: boolean) => void;
  setEnterToSubmit: (enterToSubmit: boolean) => void;
  setInlineLatex: (inlineLatex: boolean) => void;
  setMarkdownMode: (markdownMode: boolean) => void;
  setAutoTitle: (autoTitle: boolean) => void;
}

export const createConfigSlice: StoreSlice<ConfigSlice> = (set, get) => ({
  defaultSystemMessage: _defaultSystemMessage,
  advancedMode: true,
  hideMenuOptions: false,
  hideSideMenu: false,
  enterToSubmit: true,
  inlineLatex: false,
  markdownMode: true,
  autoTitle: false,
  setDefaultSystemMessage: (defaultSystemMessage: string) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      defaultSystemMessage: defaultSystemMessage,
    }));
  },
  setAdvancedMode: (advancedMode: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      advancedMode: advancedMode,
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
  setAutoTitle: (autoTitle: boolean) => {
    set((prev: ConfigSlice) => ({
      ...prev,
      autoTitle: autoTitle,
    }));
  },
});


