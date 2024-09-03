import { StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ConfigSlice, createConfigSlice } from './configsSlice';
import { ModelSlice, createModelSlice } from './modelsSlice';
import { ContextSlice, createContextSlice } from './contextsSlice';
import {
  LocalStorageInterfaceV0ToV1,
  LocalStorageInterfaceV1ToV2,
} from '@/types/ai';
import {
  migrateV0,
  migrateV1,
} from './migrate';

export type StoreState = ChatSlice &
  ConfigSlice &
  ContextSlice &
  ModelSlice;

export type StoreSlice<T> = (
  set: StoreApi<StoreState>['setState'],
  get: StoreApi<StoreState>['getState']
) => T;

export const createPartializedState = (state: StoreState) => ({
  AIConfig: state.AIConfig,
  configModel: state.configModel,
  defaultModel: state.defaultModel,
  totalTokenUsed: state.totalTokenUsed,
  timeLimitTokenUsed: state.timeLimitTokenUsed,
  countTotalTokens: state.countTotalTokens,
});

export const useModelStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createConfigSlice(set, get),
      ...createModelSlice(set, get),
      ...createContextSlice(set, get),
    }),
    {
      name: 'wapp_ai',
      partialize: (state) => createPartializedState(state),
      version: 2,
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
