import { v4 as uuidv4 } from 'uuid';
import { LocalStorageInterfaceV0ToV1 } from '@/types/wapp-doc';

export const migrateV0 = (persistedState: LocalStorageInterfaceV0ToV1) => {
  if (!persistedState.snippets) {
    persistedState.snippets = [];
  }
};
