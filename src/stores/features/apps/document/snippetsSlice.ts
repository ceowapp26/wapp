import { StoreSlice } from './store';
import { SnippetInterface } from "@/types/snippet";

export interface SnippetSlice {
  currentSnippetIndex: number;
  snippets: SnippetInterface[];
  setSnippets: (snippets: SnippetInterface[]) => void;
  setCurrentSnippetIndex: (currentSnippetIndex: number) => void;
}

export const createSnippetSlice: StoreSlice<SnippetSlice> = (set, get) => ({
  snippets: [],
  currentSnippetIndex: -1,
  setSnippets: (snippets: SnippetInterface[]) => {
    set((prev: SnippetSlice) => ({
      ...prev,
      snippets: snippets,
    }));
  },
  setCurrentSnippetIndex: (currentSnippetIndex: number) => {
    set((prev: SnippetSlice) => ({
      ...prev,
      currentSnippetIndex: currentSnippetIndex,
    }));
  },
});