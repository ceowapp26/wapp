import { v4 as uuidv4 } from 'uuid';
import {
  FolderInterface,
  FolderCollectionInterface,
  LocalStorageInterfaceV0ToV1,
  LocalStorageInterfaceV1ToV2,
  LocalStorageInterfaceV2ToV3,
} from '@/types/wapp-doc';
import defaultPrompts from '@/constants/prompt';

export const migrateV0 = (persistedState: LocalStorageInterfaceV0ToV1) => {
  persistedState.chats.forEach((chat) => {
    chat.titleSet = false;
  });
};

export const migrateV1 = (persistedState: LocalStorageInterfaceV1ToV2) => {
  let folders: FolderCollectionInterface = {};
  const folderNameToIdMap: Record<string, string> = {};
  persistedState.folders.forEach((folder, index) => {
    const id = uuidv4();
    const newFolder: FolderInterface = {
      folderId: id,
      ...folder,
    };
    folders = { ...folders, [id]: newFolder };
    folderNameToIdMap[folder.folderName] = id;
  });
  
  persistedState.folders = folders;
  persistedState.chats.forEach((chat) => {
    if (chat.folderId) chat.folderId = folderNameToIdMap[chat.folderId];
    chat.chatId = uuidv4();
  });
  
  if (!persistedState.archivedChats) {
    persistedState.archivedChats = [];
  }
};

export const migrateV2 = (persistedState: LocalStorageInterfaceV2ToV3) => {
  if (!persistedState.snippets) {
    persistedState.snippets = [];
  }
};
