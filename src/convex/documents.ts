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

export const createDocument = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
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
      chats: v.optional(v.array(v.string())),
    })),   
    activeOrgId: v.optional(v.string()),
    activeChatId: v.optional(v.id("chats")),   
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    let newPosition = 1;

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
    }
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_position_user", (q) =>
        q.eq("userId", userId)
      )
      .collect();

    if (documents && documents.length > 0) {
      newPosition = documents.length + 1;
    }

    const document = await ctx.db.insert("documents", {
      title: args.title,
      description: "Generate description by AI",
      parentDocument: args.parentDocument,
      metaData: args.metaData || {},
      userId,
      isArchived: false,
      isPublished: false,
      position: newPosition,
    });
    return document;
  },
});

export const updateDocument = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
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
      chats: v.optional(v.array(v.string())),
    })),
    activeRole: v.optional(v.string()),   
    activeOrgId: v.optional(v.string()),
    activeChatId: v.optional(v.id("chats")),   
    isPublished: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error("Unauthenticated");
      }
      const userId = identity.subject;
      const { id, activeOrgId, activeChatId, activeRole, ...rest } = args;
      const existingDocument = await ctx.db.get(id);
      if (!existingDocument) {
        throw new Error("Not found");
      }
      if (existingDocument.userId !== userId) {
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
        const activeOrgMetadata = args.metaData?.orgs?.find(org => org.orgId === activeOrgId);
        if (!activeOrgMetadata) {
          throw new Error("Active organization metadata not found");
        }
        const { roles = [], users = [], permissions = {} } = activeOrgMetadata;
        if (!(roles.length || users.length || (activeRole && roles.includes(activeRole)) || users.includes(userId) || permissions.update)) {
          throw new Error("User does not have permission to update document");
        }
      }
      const document = await ctx.db.patch(id, rest);
      return document;
    } catch (error) {
      console.error("Error in updateDocument mutation:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to update document: ${error.message}`);
      } else {
        throw new Error("Failed to update document: Unknown error");
      }
    }
  }
});

export async function hasAccessToDocument(
  ctx: MutationCtx | QueryCtx,
  documentId: Id<"documents"> | undefined,
  orgId: string | undefined,
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const userId = identity.subject;
  
  if (!documentId) {
    throw new Error("Document ID is required");
  }
  
  const document = await ctx.db.get(documentId);
  if (!document) {
    throw new Error("Not found");
  }
  
  if (orgId) {
    const hasAccess = await hasOrgAccess(ctx, orgId);
    if (!hasAccess) {
      return null;
    }
  } else {
    if (document.userId !== userId) {
      return null;
    }
  }
  
  return { document, userId };
}

export const hasAccessToDocumentQuery = internalQuery({
  args: {
    documentId: v.optional(v.id("documents")),
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    return await hasAccessToDocument(ctx, args.documentId, args.orgId);
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const generateDocumentTitle = action({
  args: {
    documentId: v.id("documents"),
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
      chats: v.optional(v.array(v.string())),
    })),
    activeRole: v.optional(v.string()),   
    activeOrgId: v.optional(v.string()),
    activeChatId: v.optional(v.id("chats")),
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
    const model = "gpt-3.5-turbo";

    const userId = identity.subject;

    const document = await ctx.runQuery(internal.documents.getDocument, {
      documentId: args.documentId
    });

    if (!document) {
      throw new Error("Document not found");
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

    const systemTitleEmbeddingContent: string = `Here is a text file: ${document.content}`;

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
    return { titlePrompt, title, systemTitleEmbeddingContent };
  },
});

export const generateDocumentDescription = action({
  args: {
    documentId: v.id("documents"),
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
      chats: v.optional(v.array(v.string())),
    })),
    activeRole: v.optional(v.string()),   
    activeOrgId: v.optional(v.string()),
    activeChatId: v.optional(v.id("chats")),   
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

    const document = await ctx.runQuery(internal.documents.getDocument, {
      documentId: args.documentId
    });

    if (!document) {
      throw new Error("Document not found");
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

    const systemDescriptionEmbeddingContent: string = `Here is a text file: ${document.content}`;

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

export const getDocument = internalQuery({
  args: { documentId: v.optional(v.id("documents")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (!args.documentId) {
      throw new Error("Document ID is required");
    }

    const documentId = args.documentId as Id<"documents">;
    const document = await ctx.db.get(documentId);

    if (!document) {
      throw new Error("Not found");
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }

    const userId = identity.subject;
    return document;
  }
});

export const getDocumentsByOrgId = query({
  args: { orgId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) =>
        q.eq("userId", userId)
      )
      .collect();

    if (!documents || documents.length === 0) {
      return null;
    }

    if (!args.orgId) {
      return documents;
    }

    const filteredDocuments = [];

    for (const document of documents) {
      if (document.isPublished && !document.isArchived) {
        const hasOrg = document.metaData?.orgs?.some(org => org.orgId === args.orgId);
        if (hasOrg) {
          const hasAccess = await hasOrgAccess(ctx, args.orgId);
          if (hasAccess) {
            filteredDocuments.push(document);
          }
        } else if (document.userId === userId) {
          filteredDocuments.push(document);
        }
      }
    }

    return filteredDocuments;
  }
});

export const getDocumentById = query({
  args: { 
    documentId: v.id("documents"), 
    activeOrgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (!args.documentId) {
      return null;
    }

    const userId = identity.subject;

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Not found");
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
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }

    return document;
  }
});

export const getDocumentByID = mutation({
  args: { 
    documentId: v.id("documents"), 
    activeOrgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (!args.documentId) {
      return null;
    }

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("Not found");
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
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }

    return document;
  }
});

export const getDocumentSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    let documents;

    if (args.orgId) {
      const isMember = await hasOrgAccess(ctx, args.orgId);
      if (!isMember) {
        return undefined;
      }
      documents = await ctx.db
        .query("documents")
        .withIndex("by_position_user", (q) =>
          q.eq("userId", userId)
          .eq("parentDocument", args.parentDocument)
        )
        .filter((q) => q.eq(q.field("isArchived"), false))
        .order("asc")
        .collect();
    } else {
      documents = await ctx.db
        .query("documents")
        .withIndex("by_position_user", (q) =>
          q.eq("userId", userId)
            .eq("parentDocument", args.parentDocument)
        )
        .filter((q) => q.eq(q.field("isArchived"), false))
        .order("asc")
        .collect();
    }

    return documents;
  },
});

export const archiveDocument = mutation({
  args: { 
    id: v.id("documents"),
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
      chats: v.optional(v.array(v.string())),
    })),
    activeRole: v.optional(v.string()),   
    activeOrgId: v.optional(v.string()),
    activeChatId: v.optional(v.id("chats")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
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
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.archive)) {
        throw new Error("User does not have permission to archive document");
      }
    }

    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_position_user", (q) =>
          q.eq("userId", userId)
            .eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: true });
        await recursiveArchive(child._id);
      }
    }

    await recursiveArchive(args.id);

    const document = await ctx.db.patch(args.id, { isArchived: true });
    return document;
  }
});

export const getDocumentTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return documents;
  }
});

export const restoreDocument = mutation({
  args: { 
    id: v.id("documents"),
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
      chats: v.optional(v.array(v.string())),
    })),
    activeRole: v.optional(v.string()),   
    activeOrgId: v.optional(v.string()),
    activeChatId: v.optional(v.id("chats")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
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
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.restore)) {
        throw new Error("User does not have permission to restore document");
      }
    }

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_position_user", (q) =>
          q.eq("userId", userId)
            .eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: false });
        await recursiveRestore(child._id);
      }
    }

    const options: Partial<Doc<"documents">> = { isArchived: false };

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    const document = await ctx.db.patch(args.id, options);
    await recursiveRestore(args.id);

    return document;
  }
});

export const removeDocument = mutation({
  args: { 
    id: v.id("documents"),
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
      chats: v.optional(v.array(v.string())),
    })),
    activeRole: v.optional(v.string()),   
    activeOrgId: v.optional(v.string()),
    activeChatId: v.optional(v.id("chats")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
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
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.delete)) {
        throw new Error("User does not have permission to delete document");
      }
    }
    const document = await ctx.db.delete(args.id);
    return document;
  }
});

export const updateParentDocument = mutation({
  args: {
    id: v.id("documents"),
    parentDocument: v.optional(v.id("documents")),
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
      chats: v.optional(v.array(v.string())),
    })),
    activeRole: v.optional(v.string()),   
    activeOrgId: v.optional(v.string()),
    activeChatId: v.optional(v.id("chats")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;
    const { id, parentDocument } = args;
    const existingDocument = await ctx.db.get(id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const parentDoc = parentDocument ? await ctx.db.get(parentDocument) : null;

    if (parentDoc && parentDoc.isArchived) {
      throw new Error("Parent document is archived");
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
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.update)) {
        throw new Error("User does not have permission to update document");
      }
    }
    const document = await ctx.db.patch(id, { parentDocument });
    return document;
  }
});

export const reorderDocuments = mutation({
  args: {
    parentDocument: v.optional(v.id("documents")),
    orderedIds: v.array(v.id("documents")),
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
      chats: v.optional(v.array(v.string())),
    })),
    activeRole: v.optional(v.string()),   
    activeOrgId: v.optional(v.string()),
    activeChatId: v.optional(v.id("chats")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingDocuments = await ctx.db
      .query("documents")
      .withIndex("by_position_user", (q) =>
        q.eq("userId", userId)
          .eq("parentDocument", args.parentDocument)
      )
      .collect();

    if (existingDocuments.length !== args.orderedIds.length) {
      throw new Error("All documents must be included in the ordering");
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
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.update)) {
        throw new Error("User does not have permission to update document");
      }
    }

    const updateOperations = args.orderedIds.map((id, index) =>
      ctx.db.patch(id, { position: index + 1 })
    );

    await Promise.all(updateOperations);

    return true;
  }
});

export const getDocumentSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => 
        q.eq(q.field("isArchived"), false),
      )
      .order("desc")
      .collect();

    return documents;
  }
});

export const hasOrgAccess = async (
  ctx: MutationCtx | QueryCtx,
  orgId: string
) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const userId = identity.subject;
  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_user_org", (q) => q.eq("userId", userId))
    .first();

  if (!membership) {
    throw new Error("User is not a member of any organization");
  }

  if (!membership.orgIds.includes(orgId)) {
    throw new Error("User is not a member of the specified organization");
  }

  return true;
};

export const removeDocumentIcon = mutation({
  args: { 
    id: v.id("documents"),
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
      chats: v.optional(v.array(v.string())),
    })),
    activeRole: v.optional(v.string()),   
    activeOrgId: v.optional(v.string()),
    activeChatId: v.optional(v.id("chats")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized")
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
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.update)) {
        throw new Error("User does not have permission to update document");
      }    
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined
    })

    return document;
  }
});

export const removeDocumentCoverImage = mutation({
  args: { 
    id: v.id("documents"),
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
      chats: v.optional(v.array(v.string())),
    })),
    activeRole: v.optional(v.string()),   
    activeOrgId: v.optional(v.string()),
    activeChatId: v.optional(v.id("chats")),  
   },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("Not found");
    }

    if (existingDocument.userId !== userId) {
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
      if (!(roles.length || users.length || (args.activeRole && roles.includes(args.activeRole)) || users.includes(userId) || permissions.update)) {
        throw new Error("User does not have permission to update document");
      }
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined
    })

    return document;

  }
});
