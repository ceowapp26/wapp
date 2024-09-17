import { StoreSlice } from './store';
import { ChatInterface, ArchivedChatInterface, FolderCollectionInterface, ArchivedFolderCollectionInterface, MessageInterface } from '@/types/chat';

export interface ChatSlice {
  messages: MessageInterface[];
  chats?: ChatInterface[];
  archivedChats?: ArchivedChatInterface[];
  archivedFolders: ArchivedFolderCollectionInterface[];
  currentChatIndex: number;
  generating: boolean;
  codeGenerator: boolean;
  error: string;
  folders: FolderCollectionInterface;
  setMessages: (messages: MessageInterface[]) => void;
  setChats: (chats: ChatInterface[]) => void;
  setArchivedChats: (archivedChats: ArchivedChatInterface[]) => void;
  setCurrentChatIndex: (currentChatIndex: number) => void;
  setGenerating: (generating: boolean) => void;
  setCodeGenerator: (codeGenerator: boolean) => void;
  setError: (error: string) => void;
  setFolders: (folders: FolderCollectionInterface) => void;
  setArchivedFolders: (archivedFolders: FolderCollectionInterface) => void;
}

export const createChatSlice: StoreSlice<ChatSlice> = (set, get) => ({
  messages: [],
  currentChatIndex: -1,
  generating: false,
  codeGenerator: false,
  error: '',
  folders: {},
  archivedFolders: {},
  archivedChats: [],
  setMessages: (messages: MessageInterface[]) => {
    set((prev: ChatSlice) => ({
      ...prev,
      messages: messages,
    }));
  },
  setArchivedChats: (archivedChats: ArchivedChatInterface[]) => {
    set((prev: ChatSlice) => ({
      ...prev,
      archivedChats: archivedChats,
    }));
  },
  setChats: (chats: ChatInterface[]) => {
    set((prev: ChatSlice) => ({
      ...prev,
      chats: chats,
    }));
  },
  setCurrentChatIndex: (currentChatIndex: number) => {
    set((prev: ChatSlice) => ({
      ...prev,
      currentChatIndex: currentChatIndex,
    }));
  },
  setGenerating: (generating: boolean) => {
    set((prev: ChatSlice) => ({
      ...prev,
      generating: generating,
    }));
  },
  setCodeGenerator: (codeGenerator: boolean) => {
    set((prev: ChatSlice) => ({
      ...prev,
      codeGenerator: codeGenerator,
    }));
  },
  setError: (error: string) => {
    set((prev: ChatSlice) => ({
      ...prev,
      error: error,
    }));
  },
  setFolders: (folders: FolderCollectionInterface) => {
    set((prev: ChatSlice) => ({
      ...prev,
      folders: folders,
    }));
  },
  setArchivedFolders: (archivedFolders: ArchivedFolderCollectionInterface) => {
    set((prev: ChatSlice) => ({
      ...prev,
      archivedFolders: archivedFolders,
    }));
  },
});


