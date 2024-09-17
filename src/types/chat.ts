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

export interface FileInterface {
  name: string;
  content: string;
  type: string;
  size?: number;
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
  embeddedContent?: FileInterface[];
  command?: string;
  context?: string;
  model?: string;
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
  autoTitle: boolean;
  prompts: Prompt[];
  defaultSystemMessage: string;
  hideMenuOptions: boolean;
  hideSideMenu: boolean;
  enterToSubmit: boolean;
  inlineLatex: boolean;
  markdownMode: boolean,
}

export interface LocalStorageInterfaceV1ToV2
  extends LocalStorageInterfaceV0ToV1 {
  archivedChats: ArchivedChatInterface[],
  folders: FolderCollectionInterface,
  archivedFolders: ArchivedFolderCollectionInterface,
}

interface Keyword {
  keyword: string;
  summary: string;
  textSpan: string;
  subKeywords?: Keyword[];
}

