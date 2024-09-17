import { StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FunctionSlice, createFunctionSlice } from './functionsSlice';
import { SnippetSlice, createSnippetSlice } from './snippetsSlice';
import { LocalStorageInterfaceV0ToV1 } from '@/types/wapp-doc';
import { migrateV0 } from './migrate';

export type StoreState = ChatSlice &
  FunctionSlice &
  SnippetSlice;

export type StoreSlice<T> = (
  set: StoreApi<StoreState>['setState'],
  get: StoreApi<StoreState>['getState']
) => T;

export const createPartializedState = (state: StoreState) => ({
  snippets: state.snippets,
  currentSnippetIndex: state.currentSnippetIndex,
});

export const useDocumentStore = create<StoreState>()(
  persist(
    (set, get) => ({
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
            break;
        }
        return persistedState as StoreState;
      },
    }
  )
);
