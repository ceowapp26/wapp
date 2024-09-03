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

const modelMaxToken: { [key: string]: number } = {
  'gpt-3.5-turbo': 4096,
  'gpt-3.5-turbo-0301': 4096,
  'gpt-3.5-turbo-0613': 4096,
  'gpt-3.5-turbo-16k': 16384,
  'gpt-3.5-turbo-16k-0613': 16384,
  'gpt-3.5-turbo-1106': 16384,
  'gpt-3.5-turbo-0125': 16384,
  'gpt-4o': 128000,
  'gpt-4o-2024-05-13': 128000,
  'gpt-4o-mini': 128000,
  'gpt-4o-mini-2024-07-18': 128000,
  'gpt-4': 8192,
  'gpt-4-32k': 32768,
  'gpt-4-1106-preview': 128000,
  'gpt-4-0125-preview': 128000,
  'gpt-4-turbo': 128000,
  'gpt-4-turbo-2024-04-09': 128000,
  'gemini-1.0-pro': 128000,
  'gemini-1.5-pro': 128000,
  'gemini-1.5-flash': 128000,
};

export const createModel = mutation({
  args: {
    data: v.object({
      model: v.string(),
      base_RPM: v.number(),
      base_RPD: v.number(),
      base_TPM: v.number(),
      base_TPD: v.number(),
      max_RPM: v.optional(v.number()),
      ceiling_RPM: v.optional(v.number()),
      floor_RPM: v.optional(v.number()),
      max_RPD: v.optional(v.number()),
      ceiling_RPD: v.optional(v.number()),
      floor_RPD: v.optional(v.number()),
      max_inputTokens: v.optional(v.number()),
      ceiling_inputTokens: v.optional(v.number()),
      floor_inputTokens: v.optional(v.number()),
      max_outputTokens: v.optional(v.number()),
      ceiling_outputTokens: v.optional(v.number()),
      floor_outputTokens: v.optional(v.number()),
      max_tokens: v.optional(v.number()),
        totalTokenUsed: v.optional(v.object({
        inputTokens: v.optional(v.number()),
        outputTokens: v.optional(v.number()),
      })),
      timeLimitTokenUsed: v.optional(v.object({
        inputTokens: v.optional(v.array(v.number())),
        outputTokens: v.optional(v.array(v.number())),
        totalInputTokens: v.optional(v.number()),
        totalOutputTokens: v.optional(v.number()),
        lastTokenUpdateTime: v.optional(v.number()),
        isTokenExceeded: v.optional(v.boolean()),
        remainingTokens: v.optional(v.number()),
        tokenLimit: v.optional(v.number()),      
      })),
    }),
  },
  handler: async (ctx, { data }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingModel = await ctx.db
      .query("models")
      .withIndex("by_model", (q) => q
        .eq("userId", userId)
        .eq("model", data.model)
      )
      .unique();

    if (existingModel) {
      throw new Error(`Model ${data.model} already exists for this user`);
    }
    const newModel = await ctx.db.insert("models", {
      model: data.model || "",
      base_RPM: data.base_RPM,
      base_RPD: data.base_RPD,
      base_TPM: data.base_TPM,
      base_TPD: data.base_TPD,
      max_RPM: data.max_RPM ?? 0,
      ceiling_RPM: data.ceiling_RPM ?? 0,
      floor_RPM: data.floor_RPM ?? 0,
      max_RPD: data.max_RPD ?? 0,
      ceiling_RPD: data.ceiling_RPD ?? 0,
      floor_RPD: data.floor_RPD ?? 0,
      max_inputTokens: data.max_inputTokens ?? 0,
      ceiling_inputTokens: data.ceiling_inputTokens ?? 0,
      floor_inputTokens: data.floor_inputTokens ?? 0,
      max_outputTokens: data.max_outputTokens ?? 0,
      ceiling_outputTokens: data.ceiling_outputTokens ?? 0,
      floor_outputTokens: data.floor_outputTokens ?? 0,
      max_tokens: data.max_tokens ?? 
      Math.min(
        (modelMaxToken[data.model as keyof typeof modelMaxToken] || 4096),
        Math.max((data.floor_inputTokens ?? 0) + (data.floor_outputTokens ?? 0)) + (data.base_TPM ?? 0) / 2,
      ),
      totalTokenUsed: data.totalTokenUsed ?? { inputTokens: 0, outputTokens: 0 },
      timeLimitTokenUsed: data.timeLimitTokenUsed ?? { 
        inputTokens: [],
        outputTokens: [],
        totalInputTokens: 0,
        totalOutputTokens: 0,
        isTokenExceeded: false,
        remainingTokens: data.base_TPM,
        lastTokenUpdateTime: undefined,
        tokenLimit: data.base_TPM
      },
      userId,
    });
    await ctx.db.patch(newModel, { cloudModelId: newModel });
    return newModel;
  },
});

export const updateModel = mutation({
  args: {
    id: v.id("models"),
    data: v.object({
      model: v.string(),
      cloudModelId: v.optional(v.string()),
      base_RPM: v.optional(v.number()),
      base_RPD: v.optional(v.number()),
      base_TPM: v.optional(v.number()),
      base_TPD: v.optional(v.number()),
      max_RPM: v.optional(v.number()),
      ceiling_RPM: v.optional(v.number()),
      floor_RPM: v.optional(v.number()),
      max_RPD: v.optional(v.number()),
      ceiling_RPD: v.optional(v.number()),
      floor_RPD: v.optional(v.number()), 
      max_inputTokens: v.optional(v.number()),
      ceiling_inputTokens: v.optional(v.number()),
      floor_inputTokens: v.optional(v.number()),
      max_outputTokens: v.optional(v.number()),
      ceiling_outputTokens: v.optional(v.number()),
      floor_outputTokens: v.optional(v.number()),
      max_tokens: v.optional(v.number()),
      totalTokenUsed: v.optional(v.object({
        inputTokens: v.optional(v.number()),
        outputTokens: v.optional(v.number()),
      })),
      timeLimitTokenUsed: v.optional(v.object({
        inputTokens: v.optional(v.array(v.number())),
        outputTokens: v.optional(v.array(v.number())),
        totalInputTokens: v.optional(v.number()),
        totalOutputTokens: v.optional(v.number()),
        lastTokenUpdateTime: v.optional(v.number()),
        isTokenExceeded: v.optional(v.boolean()),
        remainingTokens: v.optional(v.number()),
        tokenLimit: v.optional(v.number()),
      })),
    }),
  },
  handler: async (ctx, { id, data }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const _userId = identity.subject;
    const existingModel = await ctx.db.get(id);
    if (!existingModel) {
      throw new Error("Not found");
    }
    if (existingModel.userId !== _userId) {
      throw new Error("Unauthorized");
    }

    const updatedModel = await ctx.db.patch(id, {
      model: data.model,
      cloudModelId: data.cloudModelId,
      base_RPM: data.base_RPM,
      base_RPD: data.base_RPD,
      base_TPM: data.base_TPM,
      base_TPD: data.base_TPD,
      max_RPM: data.max_RPM,
      ceiling_RPM: data.ceiling_RPM,
      floor_RPM: data.floor_RPM,
      max_RPD: data.max_RPD,
      ceiling_RPD: data.ceiling_RPD,
      floor_RPD: data.floor_RPD,
      max_inputTokens: data.max_inputTokens,
      ceiling_inputTokens: data.ceiling_inputTokens,
      floor_inputTokens: data.floor_inputTokens,
      max_outputTokens: data.max_outputTokens,
      ceiling_outputTokens: data.ceiling_outputTokens,
      floor_outputTokens: data.floor_outputTokens,
      max_tokens: data.max_tokens,
      totalTokenUsed: data.totalTokenUsed,
      timeLimitTokenUsed: data.timeLimitTokenUsed,
    });

    return updatedModel;
  },
});

export const getAllModels = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const models = await ctx.db.query("models").collect();
    const returnedModel = models.map(model => {
      const { _creationTime, _id, userId, ...rest } = model;
      return rest;
    });

    return returnedModel;
  },
});

export const getModelIdByName = query({
  args: {
    model: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const existingModel = await ctx.db
      .query("models")
      .withIndex("by_model", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("model"), args.model))
      .first();

    if (!existingModel) {
      throw new Error(`Model with name ${args.model} not found.`);
    }

    return existingModel._id;
  },
});
