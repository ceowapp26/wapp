import { Prompt } from './prompt';
import { Theme } from './theme';
import { ModelOption } from './ai';
import { LocalConfigCollectionInterface, TotalTokenUsed, InputTokenUsed, OutputTokenUsed } from '@/types/ai';

export type Role = 'user' | 'assistant' | 'system';
export const roles: Role[] = ['user', 'assistant', 'system'];
export type Context = 'general' | 'selection' | 'page' | 'q&a';
export const contexts: Context[] = ['general', 'selection', 'page', 'q&a'];

type ChatTotalTokenUsed = {
  inputTokens: number, 
  outputTokens: number,
}

type FilterChatOption = {
  key: string, 
  label: string,
  value: string
}

export interface OrganizationDataInterface {
  orgId?: string;
  roles?: string[];
  users?: string[];
  permissions: {
    create: boolean;
    get: boolean;
    view: boolean;
    update: boolean;
    delete: boolean;
    archive: boolean;
    restore: boolean;
    aiAccess: boolean;
  };
}

export interface ChatMetaDataInterface {
  orgs?: OrganizationDataInterface[];
  documents?: string[];
}

export type FilterChatOptions = FilterChatOption[];

export interface MessageInterface {
  role: Role;
  content: string;
  command: string;
  context: string;
  model: string;
}

export interface ChatMetaDataInterface {
  orgs?: OrganizationDataInterface[];
  documents?: string[];
}

export interface ChatInterface {
  chatId: string;
  cloudChatId?: string;
  userId: string;
  chatTitle: string;
  chatIndex?: number;
  isArchived?: boolean;
  folderId?: string;
  messages: MessageInterface[];
  titleSet?: boolean;
  tokenUsed?: ChatTotalTokenUsed;
  metaData?: ChatMetaDataInterface;
  isInitialChat?: boolean;
}

export interface ArchivedChatInterface {
  chatId?: string;
  folderId?: string;
  userId: string;
  chatTitle?: string;
  isArchived?: boolean;
  chat: ChatInterface;
}

export interface ArchivedFolderCollectionInterface {
  [folderId: string]: ArchivedFolderInterface[];
}

export interface ArchivedFolderInterface {
  folderId: string;
  userId: string;
  isArchived?: boolean;
  folder: FolderInterface;
}

export interface ChatHistoryInterface {
  chatId: string;
  userId: string;
  chatTitle: string;
  chatIndex: number;
  isArchived?: boolean;
}

export interface FolderCollectionInterface {
  [folderId: string]: FolderInterface;
}

export interface FolderInterface {
  folderId: string;
  cloudFolderId?: string;
  folderName: string;
  isArchived?: boolean;
  expanded?: boolean;
  order?: number;
  color?: string;
  metaData: ChatMetaDataInterface;
}

export interface LocalStorageInterfaceV0ToV1 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  theme: Theme;
}

export interface LocalStorageInterfaceV1ToV2 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
}

export interface LocalStorageInterfaceV2ToV3 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
  autoTitle: boolean;
}
export interface LocalStorageInterfaceV3ToV4 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
  autoTitle: boolean;
  prompts: Prompt[];
}

export interface LocalStorageInterfaceV4ToV5 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
  autoTitle: boolean;
  prompts: Prompt[];
}

export interface LocalStorageInterfaceV5ToV6 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiKey: string;
  apiFree: boolean;
  apiFreeEndpoint: string;
  apiEndpoint?: string;
  theme: Theme;
  autoTitle: boolean;
  prompts: Prompt[];
}

export interface LocalStorageInterfaceV6ToV7 {
  chats: ChatInterface[];
  currentChatIndex: number;
  apiFree?: boolean;
  apiKey: string;
  apiEndpoint: string;
  theme: Theme;
  autoTitle: boolean;
  prompts: Prompt[];
  defaultAIConfig: LocalConfigCollectionInterface;
  defaultSystemMessage: string;
  hideMenuOptions: boolean;
  firstVisit: boolean;
  hideSideMenu: boolean;
}

export interface LocalStorageInterfaceV7oV8
  extends LocalStorageInterfaceV6ToV7 {
  foldersName: string[];
  foldersExpanded: boolean[];
  folders: FolderCollection;
}

interface Keyword {
  keyword: string;
  summary: string;
  textSpan: string;
  subKeywords?: Keyword[];
}

