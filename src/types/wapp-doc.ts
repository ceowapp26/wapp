import { SnippetInterface } from './snippet';

export interface LocalStorageInterfaceV0ToV1 {
  currentSnippetIndex: number;
  snippets: SnippetInterface[];
}

export { LocalStorageInterfaceV0ToV1 };