import { SnippetInterface } from './snippet';
import { LocalStorageInterfaceV0ToV1, LocalStorageInterfaceV1ToV2 } from '@/types/chat';

interface LocalStorageInterfaceV2ToV3
  extends LocalStorageInterfaceV1ToV2 {
  currentSnippetIndex: number,
  snippets: SnippetInterface[],
}

export { LocalStorageInterfaceV0ToV1, LocalStorageInterfaceV1ToV2, LocalStorageInterfaceV2ToV3 };