import { StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSlice, createChatSlice } from './chatsSlice';
import { RoleSlice, createRoleSlice } from './rolesSlice';
import { AuthSlice, createAuthSlice } from './authsSlice';
import { ConfigSlice, createConfigSlice } from './configsSlice';
import { PromptSlice, createPromptSlice } from './promptsSlice';
import { ContextSlice, createContextSlice } from './contextsSlice';
import { ModelSlice, createModelSlice } from './modelsSlice';
import { FunctionSlice, createFunctionSlice } from './functionsSlice';
import { SnippetSlice, createSnippetSlice } from './snippetsSlice';

import {
  LocalStorageInterfaceV0ToV1,
  LocalStorageInterfaceV1ToV2,
  LocalStorageInterfaceV2ToV3,
  LocalStorageInterfaceV3ToV4,
  LocalStorageInterfaceV4ToV5,
  LocalStorageInterfaceV5ToV6,
  LocalStorageInterfaceV6ToV7,
  LocalStorageInterfaceV7oV8,
} from '@/types/chat';
import {
  migrateV0,
  migrateV1,
  migrateV2,
  migrateV3,
  migrateV4,
  migrateV5,
  migrateV6,
} from './migrate';

export type StoreState = ChatSlice &
  RoleSlice &
  AuthSlice &
  ConfigSlice &
  PromptSlice &
  FunctionSlice &
  ContextSlice &
  ModelSlice &
  SnippetSlice;

export type StoreSlice<T> = (
  set: StoreApi<StoreState>['setState'],
  get: StoreApi<StoreState>['getState']
) => T;

export const createPartializedState = (state: StoreState) => ({
  chats: state.chats,
  archivedChats: state.archivedChats,
  currentChatIndex: state.currentChatIndex,
  apiKey: state.apiKey,
  apiEndpoint: state.apiEndpoint,
  autoTitle: state.autoTitle,
  advancedMode: state.advancedMode,
  prompts: state.prompts,
  AIConfig: state.AIConfig,
  configModel: state.configModel,
  defaultSystemMessage: state.defaultSystemMessage,
  hideMenuOptions: state.hideMenuOptions,
  firstVisit: state.firstVisit,
  hideSideMenu: state.hideSideMenu,
  folders: state.folders,
  archivedFolders: state.archivedFolders,
  enterToSubmit: state.enterToSubmit,
  inlineLatex: state.inlineLatex,
  markdownMode: state.markdownMode,
  autoAdjustToken: state.autoAdjustToken,
  totalTokenUsed: state.totalTokenUsed,
  timeLimitTokenUsed: state.timeLimitTokenUsed,
  countTotalTokens: state.countTotalTokens,
  snippets: state.snippets,
  currentSnippetIndex: state.currentSnippetIndex,
});

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createChatSlice(set, get),
      ...createRoleSlice(set, get),
      ...createAuthSlice(set, get),
      ...createConfigSlice(set, get),
      ...createPromptSlice(set, get),
      ...createContextSlice(set, get),
      ...createModelSlice(set, get),
      ...createFunctionSlice(set, get),
      ...createSnippetSlice(set, get),
    }),
    {
      name: 'wapp',
      partialize: (state) => createPartializedState(state),
      version: 7,
      migrate: (persistedState, version) => {
        switch (version) {
          case 0:
            migrateV0(persistedState as LocalStorageInterfaceV0ToV1);
          case 1:
            migrateV1(persistedState as LocalStorageInterfaceV1ToV2);
          case 2:
            migrateV2(persistedState as LocalStorageInterfaceV2ToV3);
          case 3:
            migrateV3(persistedState as LocalStorageInterfaceV3ToV4);
          case 4:
            migrateV4(persistedState as LocalStorageInterfaceV4ToV5);
          case 5:
            migrateV5(persistedState as LocalStorageInterfaceV5ToV6);
          case 6:
            migrateV6(persistedState as LocalStorageInterfaceV6ToV7);
            break;
        }
        return persistedState as StoreState;
      },
    }
  )
);
