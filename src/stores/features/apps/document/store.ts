import { StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSlice, createChatSlice } from './chatsSlice';
import { RoleSlice, createRoleSlice } from './rolesSlice';
import { ConfigSlice, createConfigSlice } from './configsSlice';
import { PromptSlice, createPromptSlice } from './promptsSlice';
import { ContextSlice, createContextSlice } from './contextsSlice';
import { FunctionSlice, createFunctionSlice } from './functionsSlice';
import { SnippetSlice, createSnippetSlice } from './snippetsSlice';
import { ModelSlice, createModelSlice } from './modelsSlice';
import {
  LocalStorageInterfaceV0ToV1,
  LocalStorageInterfaceV1ToV2,
  LocalStorageInterfaceV2ToV3,
} from '@/types/wapp-doc';

import {
  migrateV0,
  migrateV1,
  migrateV2,
} from './migrate';

export type StoreState = ChatSlice &
  RoleSlice &
  ConfigSlice &
  PromptSlice &
  FunctionSlice &
  ModelSlice &
  ContextSlice &
  SnippetSlice;

export type StoreSlice<T> = (
  set: StoreApi<StoreState>['setState'],
  get: StoreApi<StoreState>['getState']
) => T;

export const createPartializedState = (state: StoreState) => ({
  chats: state.chats,
  archivedChats: state.archivedChats,
  currentChatIndex: state.currentChatIndex,
  folders: state.folders,
  archivedFolders: state.archivedFolders,
  prompts: state.prompts,
  snippets: state.snippets,
  currentSnippetIndex: state.currentSnippetIndex,
  autoTitle: state.autoTitle,
  advancedMode: state.advancedMode,
  defaultSystemMessage: state.defaultSystemMessage,
  hideMenuOptions: state.hideMenuOptions,
  hideSideMenu: state.hideSideMenu,
  enterToSubmit: state.enterToSubmit,
  inlineLatex: state.inlineLatex,
  markdownMode: state.markdownMode,
});

export const useDocumentStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createChatSlice(set, get),
      ...createRoleSlice(set, get),
      ...createConfigSlice(set, get),
      ...createPromptSlice(set, get),
      ...createContextSlice(set, get),
      ...createModelSlice(set, get),
      ...createFunctionSlice(set, get),
      ...createSnippetSlice(set, get),
    }),
    {
      name: 'wapp_doc',
      partialize: (state) => createPartializedState(state),
      version: 3,
      migrate: (persistedState, version) => {
        switch (version) {
          case 0:
            migrateV0(persistedState as LocalStorageInterfaceV0ToV1);
          case 1:
            migrateV1(persistedState as LocalStorageInterfaceV1ToV2);
          case 2:
            migrateV2(persistedState as LocalStorageInterfaceV2ToV3);
            break;
        }
        return persistedState as StoreState;
      },
    }
  )
);
