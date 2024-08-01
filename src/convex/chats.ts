import {
  MutationCtx,
  QueryCtx,
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { hasOrgAccess } from "./documents";
import OpenAI from "openai";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { match } from "ts-pattern";
import { embed } from "./notes";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

//Goolgle Generative AI config
export const generationConfig = {
  stopSequences: ["red"],
  maxOutputTokens: 3000,
  temperature: 0.9,
  topP: 0.1,
  topK: 16,
};

export const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

interface ChatCompletionMessageParam {
  role: string;
  content: string;
}

const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / 4);
};

const countTokensOpenAi = (
  messages: ChatCompletionMessageParam[],
  model: string,
): number => {
  if (messages.length === 0) return 0;
  let tokenCount = 0;
  messages.forEach(message => {
    tokenCount += estimateTokens(message.role);
    if (typeof message.content === 'string') {
      tokenCount += estimateTokens(message.content);
    } else if (Array.isArray(message.content)) {
      (message.content as any[]).forEach(part => {
        if (typeof part === 'string') {
          tokenCount += estimateTokens(part);
        } else if (typeof part === 'object' && part !== null && 'type' in part && part.type === 'text') {
          tokenCount += estimateTokens(part.text);
        }
      });
    }
    tokenCount += 4; 
  });
  return tokenCount;
};

const countTokensGoogleGemini = async (
  messages: ChatCompletionMessageParam[],
  model: string,
): Promise<number> => {
  if (messages.length === 0) return 0;
  const formattedMessages = messages.map(({ role, content }) => ({
    role: role,
    parts: [{ text: content }],
  }));
  
  const geminiModel = genAI.getGenerativeModel({
    model: model,
  });
  const chat = geminiModel.startChat({
    history: formattedMessages,
  });
  const countResult = await geminiModel.countTokens({
    contents: await chat.getHistory(),
  });
  return countResult.totalTokens;
};

const getCountTokensFunc = async (aiModel: 'openAI' | 'gemini', messages: ChatCompletionMessageParam[], model: string) => {
  if (aiModel === 'gemini') {
    return await countTokensGoogleGemini(messages, model);
  } else {
    return countTokensOpenAi(messages, model);
  }
};

const limitMessageTokens = async (
  aiModel: 'openAI' | 'gemini',
  messages: ChatCompletionMessageParam[],
  limit: number = 4096,
  model: string,
): Promise<ChatCompletionMessageParam[]> => {
  const totalTokenCount = await getCountTokensFunc(aiModel, messages, model);
  if (totalTokenCount <= limit) {
    return messages;
  }
  const limitedMessages: ChatCompletionMessageParam[] = [];
  let tokenCount = 0;
  if (messages[0].role === 'system') {
    limitedMessages.push(messages[0]);
    tokenCount = await getCountTokensFunc(aiModel, [messages[0]], model);
  }
  for (let i = messages.length - 1; i >= 1; i--) {
    const messageTokenCount = await getCountTokensFunc(aiModel, [messages[i]], model);
    if (tokenCount + messageTokenCount > limit) break;
    tokenCount += messageTokenCount;
    limitedMessages.unshift(messages[i]);
  }
  return limitedMessages;
};

export const createChat = mutation({
  args: {
    chat: v.object({
      chatId: v.optional(v.string()),
      cloudChatId: v.optional(v.string()),
      chatTitle: v.optional(v.string()),
      chatIndex: v.optional(v.number()),
      folderId: v.optional(v.string()),
      isInitialChat: v.optional(v.boolean()),
      isArchived: v.optional(v.boolean()),
      titleSet: v.optional(v.boolean()),
      tokenUsed: v.optional(v.object({
        inputTokens: v.optional(v.number()),
        outputTokens: v.optional(v.number()),
      })),      
      userId: v.optional(v.string()),
      metaData: v.optional(v.object({
        orgs: v.optional(v.array(v.object({
          orgId: v.string(),
          roles: v.optional(v.array(v.string())),
          users: v.optional(v.array(v.string())),
          permissions: v.object({
            create: v.optional(v.boolean()),
            get: v.optional(v.boolean()),
            view: v.optional(v.boolean()),
            update: v.optional(v.boolean()),
            delete: v.optional(v.boolean()),
            archive: v.optional(v.boolean()),
            restore: v.optional(v.boolean()),
            aiAccess: v.optional(v.boolean()),
          }),        
        }))),
        documents: v.optional(v.array(v.string())),
      })),   
      messages: v.array(
        v.object({
          role: v.optional(v.string()),
          command: v.optional(v.string()),
          content: v.optional(v.string()),
          context: v.optional(v.string()),
          model: v.optional(v.string()),
        })
      ),
    }),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, { chat, activeOrgId, activeDocumentId}) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    
    const existingChats = await ctx.db
      .query("chats")
      .withIndex("by_chat_index", (q) => q.eq("userId", userId))
      .collect();
    
    const existingChatIds = new Set(existingChats.map(existingChat => existingChat.chatId));
    if (existingChatIds.has(chat.chatId)) {
      return;
    }
    
    const newChatIndex = existingChats.length;
    
    if (activeOrgId) { 
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();
      
      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }
    }
    
    const newChat = await ctx.db.insert("chats", {
      chatId: chat.chatId,
      cloudChatId: chat.cloudChatId || "",
      chatTitle: chat.chatTitle,
      chatIndex: newChatIndex,
      folderId: chat.folderId,
      messages: chat.messages || [],
      titleSet: chat.titleSet,
      tokenUsed: chat.tokenUsed || { inputTokens: 0, outputTokens: 0 },
      userId: userId,
      metaData: chat.metaData || {},
      isArchived: chat.isArchived || false,
      isPublished: false,
      isInitialChat: chat.isInitialChat,
    });
    await ctx.db.patch(newChat, {
      cloudChatId: newChat,
    });
    return newChat;
  },
});

export const updateChat = mutation({
  args: {
    id: v.id("chats"),
    chatIndex: v.optional(v.number()),
    chat: v.object({
      chatId: v.optional(v.string()),
      cloudChatId: v.optional(v.string()),
      chatTitle: v.optional(v.string()),
      chatIndex: v.optional(v.number()),
      folderId: v.optional(v.string()),
      isInitialChat: v.optional(v.boolean()),
      isArchived: v.optional(v.boolean()),
      titleSet: v.optional(v.boolean()),
      tokenUsed: v.optional(v.object({
        inputTokens: v.optional(v.number()),
        outputTokens: v.optional(v.number()),
      })),
      userId: v.optional(v.string()),
      metaData: v.optional(v.object({
        orgs: v.optional(v.array(v.object({
          orgId: v.string(),
          roles: v.optional(v.array(v.string())),
          users: v.optional(v.array(v.string())),
          permissions: v.object({
            create: v.optional(v.boolean()),
            get: v.optional(v.boolean()),
            view: v.optional(v.boolean()),
            update: v.optional(v.boolean()),
            delete: v.optional(v.boolean()),
            archive: v.optional(v.boolean()),
            restore: v.optional(v.boolean()),
            aiAccess: v.optional(v.boolean()),
          }),        
        }))),
        documents: v.optional(v.array(v.string())),
      })),   
      messages: v.array(
        v.object({
          role: v.optional(v.string()),
          command: v.optional(v.string()),
          content: v.optional(v.string()),
          context: v.optional(v.string()),
          model: v.optional(v.string()),
        })
      ),
    }),
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, { id, chatIndex, chat, activeOrgId, activeDocumentId, activeRole }) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Unauthenticated");
      }
      const userId = identity.subject;
      const existingChat = await ctx.db.get(id);
      if (!existingChat) {
        throw new Error("Not found");
      }
      if (existingChat.userId !== userId) {
        throw new Error("Unauthorized");
      }
      
      if (activeOrgId) { 
        const membership = await ctx.db
          .query("memberships")
          .withIndex("by_user_org", (q) => q.eq("userId", userId))
          .first();
        
        if (!membership) {
          throw new Error("User is not a member of any organization");
        }
        if (!membership.orgIds.includes(activeOrgId)) {
          throw new Error("User is not a member of the active organization");
        }
        const activeOrgMetadata = chat.metaData?.orgs?.find(org => org.orgId === activeOrgId);
        if (!activeOrgMetadata) {
          throw new Error("Active organization metadata not found");
        }
        const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
        if (!(roles.length || users.length || (activeRole && roles.includes(activeRole)) || users.includes(userId) || permissions.update)) {
          throw new Error("User does not have permission to update chat");
        }
      }
      const updatedChat = await ctx.db.patch(id, {
        chatId: chat.chatId,
        cloudChatId: chat.cloudChatId,
        chatTitle: chat.chatTitle,
        chatIndex: chat.chatIndex,
        folderId: chat.folderId,
        userId: userId,
        messages: chat.messages || [],
        titleSet: chat.titleSet,
        tokenUsed: chat.tokenUsed,
        metaData: chat.metaData,
        isArchived: chat.isArchived || false,
        isPublished: false,
        isInitialChat: chat.isInitialChat,
      });
      return updatedChat;
    } catch (error) {
      console.error("Error in updateChat mutation:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to update chat: ${error.message}`);
      } else {
        throw new Error("Failed to update chat: Unknown error");
      }
    }
  }
});

export const createFolder = mutation({
  args: {
    folderId: v.optional(v.string()),
    isArchived: v.optional(v.boolean()),
    folderData: v.object({
      folderId: v.optional(v.string()),
      cloudFolderId: v.optional(v.string()),
      folderName: v.optional(v.string()),
      index: v.optional(v.number()),
      order: v.optional(v.number()),
      expanded: v.optional(v.boolean()),
      isArchived: v.optional(v.boolean()),
      color: v.optional(v.string()),
      userId: v.optional(v.string()),
      metaData: v.optional(v.object({
        orgs: v.optional(v.array(v.object({
          orgId: v.string(),
          roles: v.optional(v.array(v.string())),
          users: v.optional(v.array(v.string())),
          permissions: v.object({
            create: v.optional(v.boolean()),
            get: v.optional(v.boolean()),
            view: v.optional(v.boolean()),
            update: v.optional(v.boolean()),
            delete: v.optional(v.boolean()),
            archive: v.optional(v.boolean()),
            restore: v.optional(v.boolean()),
            aiAccess: v.optional(v.boolean()),
          }),        
        }))),
        documents: v.optional(v.array(v.string())),
      })),   
    }),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, { folderId, isArchived, folderData, activeOrgId, activeDocumentId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingFolders = await ctx.db
      .query("chats")
      .withIndex("by_folder_index", (q) => q.eq("userId", userId))
      .collect();
    const existingFolderIds = new Set(existingFolders.map(folder => folder.folderId));
    if (existingFolderIds.has(folderId)) {
      return;
    }

    if (activeOrgId) { 
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();
      
      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }
    }

    const newFolderIndex = existingFolders.length;
    const newFolder = await ctx.db.insert("chats", {
      folderId,
      cloudFolderId: '',
      folderIndex: newFolderIndex,
      folder: folderData,
      isArchived: isArchived || false,
      isPublished: false,
      messages: [],
      userId,
    });
    await ctx.db.patch(newFolder, {
      cloudFolderId: newFolder,
    });
    return newFolder;
  }
});

export const updateFolder = mutation({
  args: {
    id: v.id("chats"),
    folderIndex: v.optional(v.number()),
    folderData: v.object({
      folderId: v.optional(v.string()),
      cloudFolderId: v.optional(v.string()),
      folderName: v.optional(v.string()),
      index: v.optional(v.number()),
      order: v.optional(v.number()),
      expanded: v.optional(v.boolean()),
      isArchived: v.optional(v.boolean()),
      color: v.optional(v.string()),
      userId: v.optional(v.string()),
      metaData: v.optional(v.object({
        orgs: v.optional(v.array(v.object({
          orgId: v.string(),
          roles: v.optional(v.array(v.string())),
          users: v.optional(v.array(v.string())),
          permissions: v.object({
            create: v.optional(v.boolean()),
            get: v.optional(v.boolean()),
            view: v.optional(v.boolean()),
            update: v.optional(v.boolean()),
            delete: v.optional(v.boolean()),
            archive: v.optional(v.boolean()),
            restore: v.optional(v.boolean()),
            aiAccess: v.optional(v.boolean()),
          }),        
        }))),
        documents: v.optional(v.array(v.string())),
      })),   
    }),
    isArchived: v.optional(v.boolean()),
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, { id, folderIndex, folderData, isArchived, activeOrgId, activeDocumentId, activeRole }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingFolder = await ctx.db.get(id);
    if (!existingFolder) {
      throw new Error("Not found");
    }
    if (existingFolder.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (activeOrgId) { 
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();
      
      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }

      const activeOrgMetadata = folderData?.metaData?.orgs?.find(org => org.orgId === activeOrgId);
      if (!activeOrgMetadata) {
        throw new Error("Active organization metadata not found");
      }

      const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
      if (!(roles.length || users.length || (activeRole && roles.includes(activeRole)) || users.includes(userId) || permissions.update)) {
        throw new Error("User does not have permission to update folder");
      }
    }

    const updateFolder = await ctx.db.patch(id, {
      folderIndex: folderIndex,
      folder: folderData,
      isArchived: isArchived || false,
      isPublished: false,
      messages: [],
      userId,
    });

    return updateFolder;
  }
});

export const getInitialChat = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const initialChat = await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => (
        q
          .eq("userId", userId)
        ))
      .filter((q) =>
        q.eq(q.field("isInitialChat"), true)
      )
      .first();
    return initialChat;
  }
});

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const chats = await ctx.db.query("chats");
    return chats;
  }
});

export const archiveChat = mutation({
  args: { 
    id: v.id("chats"),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingChat = await ctx.db.get(args.id);
    if (!existingChat) {
      throw new Error("Not found");
    }
    if (existingChat.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (args.activeOrgId) { 
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();
      
      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }

      const activeOrgMetadata = args.metaData?.orgs?.find(org => org.orgId === args.activeOrgId);
      if (!activeOrgMetadata) {
        throw new Error("Active organization metadata not found");
      }
      const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.aiAccess)) {
        throw new Error("User does not have permission to archive chat");
      }
    }

    await ctx.db.patch(args.id, {
      isArchived: true,
    });
  }
});

export const archiveFolder = mutation({
  args: { 
    id: v.id("chats"),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingFolder = await ctx.db.get(args.id);
    if (!existingFolder) {
      throw new Error("Not found");
    }
    if (existingFolder.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (args.activeOrgId) { 
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();
      
      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }

      const activeOrgMetadata = args.metaData?.orgs?.find(org => org.orgId === args.activeOrgId);
      if (!activeOrgMetadata) {
        throw new Error("Active organization metadata not found");
      }

     const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.aiAccess)) {
        throw new Error("User does not have permission to archive folder");
      }
    }

    await ctx.db.patch(args.id, {
      isArchived: true,
    });
  }
});

export const getActiveFolders = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    interface FolderInterface {
      folderId: string;
      cloudFolderId: string;
      folderName: string;
      isArchived?: boolean;
      expanded: boolean;
      order: number;
      color?: string;
      userId: string;
      metaData?: {
        orgs?: {
          orgId: string;
          roles?: string[];
          users?: string[];
          permissions: {
            create?: boolean;
            get?: boolean;
            view?: boolean;
            update?: boolean;
            delete?: boolean;
            archive?: boolean;
            aiAccess?: boolean;
          };
        }[];
      };
    }

    interface DatabaseItem {
      folder: FolderInterface;
      isArchived: boolean;
    }

    type ActiveFolders = {
      [key: string]: FolderInterface;
    };

    const folders = await ctx.db
      .query("chats")
      .withIndex("by_folder_index", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .filter((q) => q.neq(q.field("folder"), undefined))
      .collect();

    const activeFolders = folders.reduce<ActiveFolders>((acc, item) => {
      const typedItem = item as unknown as DatabaseItem;
      if (typedItem.folder) {
        acc[typedItem.folder.folderId] = {
          folderId: typedItem.folder.folderId,
          cloudFolderId: typedItem.folder.cloudFolderId,
          folderName: typedItem.folder.folderName,
          isArchived: typedItem.folder.isArchived,
          expanded: typedItem.folder.expanded,
          order: typedItem.folder.order,
          color: typedItem.folder.color,
          userId: typedItem.folder.userId,
          metaData: typedItem.folder.metaData,
        };
      }
      return acc;
    }, {});

    return activeFolders;
  },
});

export const getArchivedFolders = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    interface FolderInterface {
      folderId: string;
      cloudFolderId: string;
      folderName: string;
      isArchived?: boolean;
      expanded: boolean;
      order: number;
      color?: string;
      userId: string;
      metaData?: {
        orgs?: {
          orgId: string;
          roles?: string[];
          users?: string[];
          permissions: {
            create?: boolean;
            get?: boolean;
            view?: boolean;
            update?: boolean;
            delete?: boolean;
            archive?: boolean;
            aiAccess?: boolean;
          };
        }[];
      };
    }
    interface Folder {
      folderId: string;
      isArchived: boolean;
      folder: FolderInterface;
    }

    type ArchivedFolders = {
      [key: string]: Folder;
    };

    const folders = await ctx.db
      .query("chats")
      .withIndex("by_folder_index", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .filter((q) => q.neq(q.field("folder"), undefined))
      .collect();

    const archivedFolders = folders.reduce<ArchivedFolders>((acc, item) => {
      const typedFolder = item as unknown as Folder;
      acc[typedFolder.folderId] = {
        folderId: typedFolder.folderId,
        isArchived: typedFolder.isArchived,
        folder: {
          folderId: typedFolder.folderId,
          cloudFolderId:typedFolder.folder.cloudFolderId,
          folderName: typedFolder.folder.folderName,
          isArchived: typedFolder.isArchived,
          expanded: typedFolder.folder.expanded,
          order: typedFolder.folder.order,
          color: typedFolder.folder.color,
          metaData: typedFolder.folder.metaData,
          userId: typedFolder.folder.userId,
        }
      };
      return acc;
    }, {});

    return archivedFolders;
  },
});

export const getActiveChats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_chat_index", (q) => q.eq("userId", userId))
      .filter((q) => 
        q.eq(q.field("isArchived"), false),
      )
      .filter((q) => 
        q.eq(q.field("folder"), undefined),
      )
      .collect();
    const activeChats = chats.map((chat) => ({
      chatId: chat.chatId,
      chatTitle: chat.chatTitle,
      isArchived: chat.isArchived,
      folderId: chat.folderId,
      userId: userId,
      titleSet: chat.titleSet,
      tokenUsed: chat.tokenUsed,
      metaData: chat.metaData,
      messages: chat.messages,
      isInitialChat: chat.isInitialChat
    }));
    return activeChats;
  },
});

export const getAllChats = internalQuery({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const chats = await ctx.db.query("chats").collect();
    return chats;
  },
});

export const getArchivedChats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_chat_index", (q) => q.eq("userId", userId))
      .filter((q) => 
        q.eq(q.field("isArchived"), true),
      )
      .filter((q) => 
        q.eq(q.field("folder"), undefined),
      )
      .collect();
    const archivedChats = chats.map((chat) => ({
      chatId: chat.chatId,
      chatTitle: chat.chatTitle,
      folderId: chat.folderId,
      isArchived: chat.isArchived,
      chat: {
        chatId: chat.chatId,
        chatTitle: chat.chatTitle,
        folderId: chat.folderId || null,
        isInitialChat: chat.isInitialChat,
        isArchived: chat.isArchived,
        titleSet: chat.titleSet,
        tokenUsed: chat.tokenUsed,
        metaData: chat.metaData,
        messages: chat.messages,
        userId: userId,
      },
    }));
    return archivedChats;
  },
});

export const restoreChat = mutation({
  args: { 
    id: v.id("chats"),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingChat = await ctx.db.get(args.id);
    if (!existingChat) {
      throw new Error("Not found");
    }
    if (existingChat.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (args.activeOrgId) { 
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();
      
      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }

      const activeOrgMetadata = args.metaData?.orgs?.find(org => org.orgId === args.activeOrgId);
      if (!activeOrgMetadata) {
        throw new Error("Active organization metadata not found");
      }

      const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.aiAccess)) {
        throw new Error("User does not have permission to restore chat");
      }
    }

    await ctx.db.patch(args.id, {
      isArchived: false,
    });
  }
});

export const restoreFolder = mutation({
  args: { 
    id: v.id("chats"),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingChat = await ctx.db.get(args.id);
    if (!existingChat) {
      throw new Error("Not found");
    }
    if (existingChat.userId !== userId) {
      throw new Error("Unauthorized");
    }
    
    if (args.activeOrgId) { 
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();
      
      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }

      const activeOrgMetadata = args.metaData?.orgs?.find(org => org.orgId === args.activeOrgId);
      if (!activeOrgMetadata) {
        throw new Error("Active organization metadata not found");
      }

      const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.aiAccess)) {
        throw new Error("User does not have permission to restore folder");
      }
    }

    await ctx.db.patch(args.id, {
      isArchived: false,
    });
  }
});

export const removeChat = mutation({
  args: { 
    id: v.id("chats"),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingChat = await ctx.db.get(args.id);
    if (!existingChat) {
      throw new Error("Not found");
    }
    if (existingChat.userId !== userId) {
      throw new Error("Unauthorized");
    }

    if (args.activeOrgId) { 
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();
      
      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }

      const activeOrgMetadata = args.metaData?.orgs?.find(org => org.orgId === args.activeOrgId);
      if (!activeOrgMetadata) {
        throw new Error("Active organization metadata not found");
      }

      const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.aiAccess)) {
        throw new Error("User does not have permission to delete chat");
      }    
    }
    await ctx.db.delete(args.id);
    return { success: true };
  }
});

export const removeFolder = mutation({
  args: { 
    id: v.id("chats"),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingChat = await ctx.db.get(args.id);
    if (!existingChat) {
      throw new Error("Not found");
    }
    if (existingChat.userId !== userId) {
      throw new Error("Unauthorized");
    }
    
    if (args.activeOrgId) { 
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();
      
      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }

      const activeOrgMetadata = args.metaData?.orgs?.find(org => org.orgId === args.activeOrgId);
      if (!activeOrgMetadata) {
        throw new Error("Active organization metadata not found");
      }
      const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.aiAccess)) {
        throw new Error("User does not have permission to delete folder");
      }
    }

    await ctx.db.delete(args.id);
    return { success: true };
  }
});

export const removeAllChats = mutation({
  args: {
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    const userId = identity.subject;

    if (args.activeOrgId) { 
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();
      
      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }

      const activeOrgMetadata = args.metaData?.orgs?.find(org => org.orgId === args.activeOrgId);
      if (!activeOrgMetadata) {
        throw new Error("Active organization metadata not found");
      }

      const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.aiAccess)) {
        throw new Error("User does not have permission to delete chats");
      }
    }

    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const chat of chats) {
      await ctx.db.delete(chat._id);
    }

    return { success: true };
  }
});

export const getChatById = query({
  args: { 
    id: v.id("chats"),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const existingChat = await ctx.db.get(args.id);
    if (!existingChat) {
      throw new Error("Not found");
    }
    const userId = identity.subject;

    if (args.activeOrgId) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();

      if (!membership) {
        throw new Error("User is not a member of any organization");
      }
      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }      

      const hasAccess = await hasOrgAccess(ctx, args.activeOrgId);
      if (!hasAccess) {
        return null;
      }
    }
    return existingChat;
  }
});

export const getFolderByID = mutation({
  args: { 
    id: v.id("chats"),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const existingFolder = await ctx.db.get(args.id);
    if (!existingFolder) {
      throw new Error("Not found");
    }
    const userId = identity.subject;
    if (args.activeOrgId) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();

      if (!membership) {
        throw new Error("User is not a member of any organization");
      }
      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }      

      const hasAccess = await hasOrgAccess(ctx, args.activeOrgId);
      if (!hasAccess) {
        return null;
      }
    }
    return existingFolder;
  }
});

export const getChatByID = mutation({
  args: { 
    id: v.id("chats"),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const existingChat = await ctx.db.get(args.id);
    if (!existingChat) {
      throw new Error("Not found");
    }
    const userId = identity.subject;

    if (args.activeOrgId) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();

      if (!membership) {
        throw new Error("User is not a member of any organization");
      }
      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }      
      const hasAccess = await hasOrgAccess(ctx, args.activeOrgId);
      if (!hasAccess) {
        return null;
      }
    }
    return existingChat;
  }
});

export const getChatByChatId = query({
  args: { 
    chatId: v.string(),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (args.activeOrgId) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();

      if (!membership) {
        throw new Error("User is not a member of any organization");
      }
      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }
      const hasAccess = await hasOrgAccess(ctx, args.activeOrgId);
      if (!hasAccess) {
        return null;
      }
    }
    const existingChat = await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => (
        q
          .eq("userId", userId)
        ))
      .filter((q) =>
        q.eq(q.field("chatId"), args.chatId)
      )
      .first();
    if (!existingChat) {
      throw new Error("Not found");
    }

    return existingChat;
  }
});

export const getChatByFolderId = query({
  args: { 
    folderId: v.string(),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    if (args.activeOrgId) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();

      if (!membership) {
        throw new Error("User is not a member of any organization");
      }
      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }

      const hasAccess = await hasOrgAccess(ctx, args.activeOrgId);
      if (!hasAccess) {
        return null;
      }
    }

    const existingChats = await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => (
        q
          .eq("userId", userId)
        ))
      .filter((q) =>
        q.eq(q.field("folderId"), args.folderId)
      )
      .collect();

    if (!existingChats || existingChats.length === 0) {
      throw new Error("No chats found for this organization or user");
    }

    return existingChats;
  }
});

export const getChatByOrgId = query({
  args: {
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    if (args.activeOrgId) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();

      if (!membership) {
        throw new Error("User is not a member of any organization");
      }
      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }
      const hasAccess = await hasOrgAccess(ctx, args.activeOrgId);
      if (!hasAccess) {
        return null;
      }
    }
    const existingChats = await ctx.db
      .query("chats")
      .filter(chat => 
        args?.activeOrgId 
          ? args.metaData?.orgs?.some(org => org.orgId === args.activeOrgId) ?? false
          : false 
      )
      .collect();

    if (!existingChats || existingChats.length === 0) {
      throw new Error("No chats found for this organization or user");
    }

    return existingChats;
  }
});

export const getChatByDocumentId = query({
  args: { 
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    if (args.activeOrgId) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();

      if (!membership) {
        throw new Error("User is not a member of any organization");
      }
      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }

      const hasAccess = await hasOrgAccess(ctx, args.activeOrgId);
      if (!hasAccess) {
        return null;
      }
    }

    if (!args.activeDocumentId) {
      throw new Error("No active document ID provided");
    }

    const existingChats = await ctx.db
      .query("chats")
      .filter(chat => 
        args?.activeDocumentId 
          ? args.metaData?.documents?.some(document => document === args.activeDocumentId) ?? false
          : false 
      )
      .collect();

    if (existingChats.length === 0) {
      return [];
    }

    return existingChats;
  }
});

export const askQuestionOpenAi = action({
  args: {
    chat: v.object({
      chatId: v.optional(v.string()),
      cloudChatId: v.optional(v.string()),
      chatTitle: v.optional(v.string()),
      chatIndex: v.optional(v.number()),
      folderId: v.optional(v.string()),
      isInitialChat: v.optional(v.boolean()),
      isArchived: v.optional(v.boolean()),
      titleSet: v.optional(v.boolean()),
      tokenUsed: v.optional(v.object({
        inputTokens: v.optional(v.number()),
        outputTokens: v.optional(v.number()),
      })),     
      metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    messages: v.array(
        v.object({
          role: v.optional(v.string()),
          command: v.optional(v.string()),
          content: v.optional(v.string()),
          context: v.optional(v.string()),
          model: v.optional(v.string()),
        })
      ),
    }),
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
    configs: v.object({
      max_tokens: v.optional(v.number()),  
      RPM: v.optional(v.number()),  
      RPD: v.optional(v.number()),  
    }),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    if (args.activeOrgId && args.activeOrgId) { 
      const accessObj = await ctx.runQuery(
        internal.documents.hasAccessToDocumentQuery,
        {
          documentId: args.activeDocumentId,
          orgId: args.activeOrgId,
        }
      );
      if (!accessObj) {
        throw new Error("You do not have access to this document");
      }
      const membership = await ctx.runQuery(internal.memberships.getUserMembership, { userId });
      

      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(args.activeOrgId as string)) {
        throw new Error("User is not a member of the active organization");
      }

      const activeOrgMetadata = args.chat.metaData?.orgs?.find(org => org.orgId === args.activeOrgId);
      if (!activeOrgMetadata) {
        throw new Error("Active organization metadata not found");
      }

      const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.aiAccess)) {
        throw new Error("User does not have permission to access AI");
      }
    }

    const document = await ctx.runQuery(
      internal.documents.getDocument,
      {
        documentId: args.activeDocumentId,
      }
    );

    if (!document) {
      throw new Error("Document not found");
    }

    if (args.configs.RPM) {
      const ratelimit = new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(args.configs.RPM, "1 m"),
        analytics: true,
      });
      const { success, limit, reset, remaining } = await ratelimit.limit(`wapp_ratelimit_${userId}`);
      if (!success) {
        return {
          error: "You have reached your request limit for the minute.",
          nextAllowedTime: new Date(reset).toISOString(),
          limit,
          remaining,
        };
      }
    }

    if (args.configs.RPD) {
      const ratelimit = new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(args.configs.RPD, "1 d"),
        analytics: true,
      });
      const { success, limit, reset, remaining } = await ratelimit.limit(`wapp_ratelimit_daily_${userId}`);
      if (!success) {
        return {
          error: "You have reached your request limit for the day.",
          nextAllowedTime: new Date(reset).toISOString(),
          limit,
          remaining,
        };
      }
    }

    const model = args.chat.messages[args.chat.messages.length - 1].model as string;

    const systemEmbeddingContent: string = `You are an AI assistant with access to the following document content:

    ${document.content}

    Your task is to answer questions based solely on the information provided in this document. If the answer cannot be found in the document, or if the question is not related to the document's content, please respond with "I'm sorry, but I don't have enough information in the provided document to answer that question."`;

    const promptMessages = [
      {
        role: "system",
        content: systemEmbeddingContent,
      },
      {
        role: "user",
        content: args.chat.messages[args.chat.messages.length - 1].content || "",
      },
    ];

    const limitMessages = await limitMessageTokens("openAI", promptMessages, args.configs.max_tokens, model);

    if (limitMessages.length === 0) {
      throw new Error('Prompt exceeds max token!');
      return null;
    }

    const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
      await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemEmbeddingContent,
          },
          {
            role: "user",
            content: args.chat.messages[args.chat.messages.length - 1].content || "",
          },
        ],        
        model: model,
      });

    const response = chatCompletion.choices[0].message.content || "Could not generate a response";
    return { response: response, systemEmbeddingContent: systemEmbeddingContent };
  },
});

export const askQuestionGoogleGemini = action({
  args: {
    chat: v.object({
      chatId: v.optional(v.string()),
      cloudChatId: v.optional(v.string()),
      chatTitle: v.optional(v.string()),
      chatIndex: v.optional(v.number()),
      folderId: v.optional(v.string()),
      isInitialChat: v.optional(v.boolean()),
      isArchived: v.optional(v.boolean()),
      titleSet: v.optional(v.boolean()),
      tokenUsed: v.optional(v.object({
        inputTokens: v.optional(v.number()),
        outputTokens: v.optional(v.number()),
      })),     
     metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    messages: v.array(
        v.object({
          role: v.optional(v.string()),
          command: v.optional(v.string()),
          content: v.optional(v.string()),
          context: v.optional(v.string()),
          model: v.optional(v.string()),
        })
      ),
    }),
    configs: v.object({
      max_tokens: v.optional(v.number()),  
      RPM: v.optional(v.number()),  
      RPD: v.optional(v.number()),  
    }),
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    if (args.activeOrgId && args.activeOrgId) { 
      const accessObj = await ctx.runQuery(
        internal.documents.hasAccessToDocumentQuery,
        {
          documentId: args.activeDocumentId,
          orgId: args.activeOrgId,
        }
      );
      if (!accessObj) {
        throw new Error("You do not have access to this document");
      }
      const membership = await ctx.runQuery(internal.memberships.getUserMembership, { userId });
      
      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(args.activeOrgId as string)) {
        throw new Error("User is not a member of the active organization");
      }

      const activeOrgMetadata = args.chat.metaData?.orgs?.find(org => org.orgId === args.activeOrgId);
      if (!activeOrgMetadata) {
        throw new Error("Active organization metadata not found");
      }

      const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.aiAccess)) {
        throw new Error("User does not have permission to access AI");
      }
    }
    
    const document = await ctx.runQuery(
      internal.documents.getDocument,
      {
        documentId: args.activeDocumentId,
      }
    );

    if (!document) {
      throw new Error("Document not found");
    }

    if (args.configs.RPM) {
      const ratelimit = new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(args.configs.RPM, "1 m"),
        analytics: true,
      });
      const { success, limit, reset, remaining } = await ratelimit.limit(`wapp_ratelimit_${userId}`);
      if (!success) {
        return {
          error: "You have reached your request limit for the minute.",
          nextAllowedTime: new Date(reset).toISOString(),
          limit,
          remaining,
        };
      }
    }

    if (args.configs.RPD) {
      const ratelimit = new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(args.configs.RPD, "1 d"),
        analytics: true,
      });
      const { success, limit, reset, remaining } = await ratelimit.limit(`wapp_ratelimit_daily_${userId}`);
      if (!success) {
        return {
          error: "You have reached your request limit for the day.",
          nextAllowedTime: new Date(reset).toISOString(),
          limit,
          remaining,
        };
      }
    }

    const model = args.chat.messages[args.chat.messages.length - 1].model as string;

    const systemEmbeddingContent: string = `You are an AI assistant with access to the following document content:

    ${document.content}

    Your task is to answer questions based solely on the information provided in this document. If the answer cannot be found in the document, or if the question is not related to the document's content, please respond with "I'm sorry, but I don't have enough information in the provided document to answer that question."`;

    const promptMessages = [
      {
        role: "system",
        content: systemEmbeddingContent,
      },
      {
        role: "user",
        content: args.chat.messages[args.chat.messages.length - 1].content || "",
      },
    ];

    const limitMessages = await limitMessageTokens("gemini", promptMessages, args.configs.max_tokens, model);

    if (limitMessages.length === 0) {
      throw new Error('Prompt exceeds max token!');
      return null;
    }
    
    const buildGoogleGenAIPrompt = (messages: Message[]) => ({
      contents: messages
        .filter(message => message.role === 'user' || message.role === 'assistant')
        .map(message => ({
          role: message.role === 'user' ? 'user' : 'model',
          parts: [{ text: message.content }],
        })),
    });

    const messages = match(args.chat.messages[args.chat.messages.length - 1].context)
      .with("document", () => [
        {
          role: "system",
          content: systemEmbeddingContent,
        },
        {
          role: "user",
          content: args.chat.messages[args.chat.messages.length - 1].content || "",
        },
      ])
      .run() as Message[];

    const geminiStream = await genAI
      .getGenerativeModel({ model: model, generationConfig, safetySettings })
      .generateContentStream(buildGoogleGenAIPrompt(messages));
    let response = '';
    for await (const chunk of geminiStream.stream) {
      const chunkText = chunk.text();
      response += chunkText;
    }
    return { response: response, systemEmbeddingContent: systemEmbeddingContent };
  },
});

export async function hasAccessToChat(
  ctx: MutationCtx | QueryCtx,
  chatId: Id<"chats"> | undefined
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const userId = identity.subject;
  
  if (!chatId) {
    throw new Error("Chat ID is required");
  }
  
  const chat = await ctx.db.get(chatId);
  if (!chat) {
    throw new Error("Not found");
  }
  
  return chat  
}

export const hasAccessToChatQuery = internalQuery({
  args: {
    chatId: v.id("chats"),
  },
  async handler(ctx, args) {
    return await hasAccessToChat(ctx, args.chatId);
  },
});

export const getChat = internalQuery({
  args: { 
    chatId: v.id("chats"),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const chat = await ctx.db.get(args.chatId);

    if (!chat) {
      throw new Error("Not found");
    }

    const userId = identity.subject;

    if (args.activeOrgId) {
      const membership = await ctx.db
        .query("memberships")
        .withIndex("by_user_org", (q) => q.eq("userId", userId))
        .first();

      if (!membership) {
        throw new Error("User is not a member of any organization");
      }
      if (!membership.orgIds.includes(args.activeOrgId)) {
        throw new Error("User is not a member of the active organization");
      }

      const hasAccess = await hasOrgAccess(ctx, args.activeOrgId);
      if (!hasAccess) {
        return null;
      }
    }

    return chat;
  }
});

export const generateChatTitle = action({
  args: {
    chatId: v.id("chats"),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
    configs: v.object({
      max_tokens: v.optional(v.number()),  
      RPM: v.optional(v.number()),  
      RPD: v.optional(v.number()),  
    }),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const model = "gpt-3.5-turbo";

    const chat = await ctx.runQuery(internal.chats.getChat, {
      chatId: args.chatId
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    if (args.activeOrgId) { 
      const membership = await ctx.runQuery(internal.memberships.getUserMembership, { userId });

      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(args.activeOrgId as string)) {
        throw new Error("User is not a member of the active organization");
      }

      const activeOrgMetadata = args.metaData?.orgs?.find(org => org.orgId === args.activeOrgId);
      if (!activeOrgMetadata) {
        throw new Error("Active organization metadata not found");
      }

      const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.aiAccess)) {
        throw new Error("User does not have permission to access AI");
      }
    }

    if (args.configs.RPM) {
      const ratelimit = new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(args.configs.RPM, "1 m"),
        analytics: true,
      });
      const { success, limit, reset, remaining } = await ratelimit.limit(`wapp_ratelimit_${userId}`);
      if (!success) {
        return {
          error: "You have reached your request limit for the minute.",
          nextAllowedTime: new Date(reset).toISOString(),
          limit,
          remaining,
        };
      }
    }

    if (args.configs.RPD) {
      const ratelimit = new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(args.configs.RPD, "1 d"),
        analytics: true,
      });
      const { success, limit, reset, remaining } = await ratelimit.limit(`wapp_ratelimit_daily_${userId}`);
      if (!success) {
        return {
          error: "You have reached your request limit for the day.",
          nextAllowedTime: new Date(reset).toISOString(),
          limit,
          remaining,
        };
      }
    }

    const combinedText: string = chat && chat.messages ? chat.messages.map(message => message.content).join(' ') : "";

    const systemTitleEmbeddingContent: string = `Here is a text file: ${combinedText}`;

    const titlePrompt: string = `Please generate a title for this document. The title should not be more 20 words long.`;

    const promptMessages =  [
      {
        role: "system",
        content: systemTitleEmbeddingContent,
      },
      {
        role: "user",
        content: titlePrompt,
      },
    ];

    const limitMessages = await limitMessageTokens('openAI', promptMessages, args.configs.max_tokens, model);

    if (limitMessages.length === 0) {
      throw new Error('Prompt exceeds max token!');
      return null;
    }

    const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
    await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemTitleEmbeddingContent,
        },
        {
          role: "user",
          content: titlePrompt,
        },
      ],      
      model: model,
    });
    const title =
      chatCompletion.choices[0].message.content ??
      "Could not generate a title for this document.";
    const titleEmbedding = await embed(title);

    return { titlePrompt: titlePrompt, title: title, systemTitleEmbeddingContent: systemTitleEmbeddingContent };
  },
});

export const generateChatDescription = action({
  args: {
    chatId: v.id("chats"),
    metaData: v.optional(v.object({
      orgs: v.optional(v.array(v.object({
        orgId: v.string(),
        roles: v.optional(v.array(v.string())),
        users: v.optional(v.array(v.string())),
        permissions: v.object({
          create: v.optional(v.boolean()),
          get: v.optional(v.boolean()),
          view: v.optional(v.boolean()),
          update: v.optional(v.boolean()),
          delete: v.optional(v.boolean()),
          archive: v.optional(v.boolean()),
          restore: v.optional(v.boolean()),
          aiAccess: v.optional(v.boolean()),
        }),        
      }))),
      documents: v.optional(v.array(v.string())),
    })),   
    activeRole: v.optional(v.string()),
    activeOrgId: v.optional(v.string()),
    activeDocumentId: v.optional(v.id("documents")),
    configs: v.object({
      max_tokens: v.optional(v.number()),  
      RPM: v.optional(v.number()),  
      RPD: v.optional(v.number()),  
    }),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const model = "gpt-3.5-turbo";

    const chat = await ctx.runQuery(internal.chats.getChat, {
      chatId: args.chatId
    });

    if (!chat) {
      throw new Error("Chat not found");
    }

    if (args.activeOrgId) { 
      const membership = await ctx.runQuery(internal.memberships.getUserMembership, { userId });

      if (!membership) {
        throw new Error("User is not a member of any organization");
      }

      if (!membership.orgIds.includes(args.activeOrgId as string)) {
        throw new Error("User is not a member of the active organization");
      }

      const activeOrgMetadata = args.metaData?.orgs?.find(org => org.orgId === args.activeOrgId);
      if (!activeOrgMetadata) {
        throw new Error("Active organization metadata not found");
      }

      const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.aiAccess)) {
        throw new Error("User does not have permission to access AI");
      }
    }

    if (args.configs.RPM) {
      const ratelimit = new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(args.configs.RPM, "1 m"),
        analytics: true,
      });
      const { success, limit, reset, remaining } = await ratelimit.limit(`wapp_ratelimit_${userId}`);
      if (!success) {
        return {
          error: "You have reached your request limit for the minute.",
          nextAllowedTime: new Date(reset).toISOString(),
          limit,
          remaining,
        };
      }
    }

    if (args.configs.RPD) {
      const ratelimit = new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(args.configs.RPD, "1 d"),
        analytics: true,
      });
      const { success, limit, reset, remaining } = await ratelimit.limit(`wapp_ratelimit_daily_${userId}`);
      if (!success) {
        return {
          error: "You have reached your request limit for the day.",
          nextAllowedTime: new Date(reset).toISOString(),
          limit,
          remaining,
        };
      }
    }

    const combinedText: string = chat && chat.messages ? chat.messages.map(message => message.content).join(' ') : "";

    const systemDescriptionEmbeddingContent: string = `Here is a text file: ${combinedText}`;

    const descriptionPrompt: string = `Please generate a brief description for this document. The description cannot exceed 200 characters.`;

    const promptMessages =  [
      {
        role: "system",
        content: systemDescriptionEmbeddingContent,
      },
      {
        role: "user",
        content: descriptionPrompt,
      },
    ];
    const limitMessages = await limitMessageTokens('openAI', promptMessages, args.configs.max_tokens, model);
    if (limitMessages.length === 0) {
      throw new Error('Prompt exceeds max token!');
      return null;
    }
    const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
      await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemDescriptionEmbeddingContent,
          },
          {
            role: "user",
            content: `Please generate a brief description for this document. The description cannot exceed 200 characters.`,
          },
        ],        
        model: model,
      });
    const description =
      chatCompletion.choices[0].message.content ??
      "Could not generate a description for this document.";
    const descriptionEmbedding = await embed(description);
    return { descriptionPrompt, description, systemDescriptionEmbeddingContent };
  },
});
