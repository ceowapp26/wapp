import { StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSlice, createChatSlice } from './chatsSlice';
import { RoleSlice, createRoleSlice } from './rolesSlice';
import { ConfigSlice, createConfigSlice } from './configsSlice';
import { PromptSlice, createPromptSlice } from './promptsSlice';
import { ContextSlice, createContextSlice } from './contextsSlice';
import { ModelSlice, createModelSlice } from './modelsSlice';
import {
  LocalStorageInterfaceV0ToV1,
  LocalStorageInterfaceV1ToV2,
} from '@/types/wapp-portal';

import {
  migrateV0,
  migrateV1,
} from './migrate';

export type StoreState = ChatSlice &
  RoleSlice &
  ConfigSlice &
  PromptSlice &
  ModelSlice &
  ContextSlice;

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
  autoTitle: state.autoTitle,
  advancedMode: state.advancedMode,
  defaultSystemMessage: state.defaultSystemMessage,
  hideMenuOptions: state.hideMenuOptions,
  hideSideMenu: state.hideSideMenu,
  enterToSubmit: state.enterToSubmit,
  inlineLatex: state.inlineLatex,
  markdownMode: state.markdownMode,
});

export const usePortalStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createChatSlice(set, get),
      ...createRoleSlice(set, get),
      ...createConfigSlice(set, get),
      ...createPromptSlice(set, get),
      ...createContextSlice(set, get),
      ...createModelSlice(set, get),
    }),
    {
      name: 'wapp_portal',
      partialize: (state) => createPartializedState(state),
      version: 3,
      migrate: (persistedState, version) => {
        switch (version) {
          case 0:
            migrateV0(persistedState as LocalStorageInterfaceV0ToV1);
          case 1:
            migrateV1(persistedState as LocalStorageInterfaceV1ToV2);
            break;
        }
        return persistedState as StoreState;
      },
    }
  )
);
