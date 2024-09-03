import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const createSnippet = mutation({
  args: {
    snippet: v.object({
      snippetId: v.optional(v.string()),
      cloudSnippetId: v.optional(v.string()),
      snippetName: v.optional(v.string()),
      expanded: v.optional(v.boolean()),
      content: v.optional(v.string()),
      color: v.optional(v.string()),
      order: v.optional(v.number()),
      isArchived: v.optional(v.boolean()),
      isPublished: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, { snippet }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingSnippets = await ctx.db
      .query("snippets")
      .withIndex("by_snippet_index", (q) => q.eq("userId", userId))
      .collect();
    const existingSnippetIds = new Set(existingSnippets.map(existingSnippet => existingSnippet.snippetId));
    if (existingSnippetIds.has(snippet.snippetId)) {
      return;
    }
    const newSnippetIndex = existingSnippets.length;
    const newSnippet = await ctx.db.insert("snippets", {
      snippetId: snippet.snippetId,
      cloudSnippetId: snippet.cloudSnippetId,
      snippetName: snippet.snippetName,
      expanded: snippet.expanded,
      content: snippet.content,
      color: snippet.color,
      order: snippet.order,
      snippetIndex: newSnippetIndex,
      userId,
      isArchived: false,
      isPublished: false,
    });

    await ctx.db.patch(newSnippet, {
      cloudSnippetId: newSnippet,
    });

    return newSnippet;
  }
});

export const updateSnippet = mutation({
  args: {
    id: v.id("snippets"),
    snippetIndex: v.optional(v.number()),
    snippet: v.object({
      snippetId: v.optional(v.string()),
      cloudSnippetId: v.optional(v.string()),
      snippetName: v.optional(v.string()),
      expanded: v.optional(v.boolean()),
      content: v.optional(v.string()),
      color: v.optional(v.string()),
      order: v.optional(v.number()),
      isArchived: v.optional(v.boolean()),
      isPublished: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, { id, snippetIndex, snippet }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const userId = identity.subject;
    const existingSnippet = await ctx.db.get(id);
    if (!existingSnippet) {
      throw new Error("Not found");
    }
    if (existingSnippet.userId !== userId) {
      throw new Error("Unauthorized");
    }
    const updatedSnippet = await ctx.db.patch(id, {
      snippetId: snippet.snippetId,
      cloudSnippetId: snippet.cloudSnippetId,
      snippetName: snippet.snippetName,
      expanded: snippet.expanded,
      content: snippet.content,
      color: snippet.color,
      order: snippet.order,
      snippetIndex: snippetIndex,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return updatedSnippet;
  }
});

export const getSnippets = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const snippets = await ctx.db
      .query("snippets")
      .withIndex("by_snippet_index", (q) => q.eq("userId", userId))
      .filter((q) => 
        q.eq(q.field("isArchived"), false),
      )      
      .collect();

    const returnedSnippets = snippets.map((snippet) => ({
      snippetId: snippet.snippetId,
      cloudSnippetId: snippet.cloudSnippetId,
      snippetName: snippet.snippetName,
      expanded: snippet.expanded,
      content: snippet.content,
      color: snippet.color,
      order: snippet.order,
      userId,
      isArchived: false,
      isPublished: false,
    }));

    return returnedSnippets;
  },
});

export const removeSnippet = mutation({
  args: { id: v.id("snippets") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingSnippet = await ctx.db.get(id);
    if (!existingSnippet) {
      throw new Error("Not found");
    }
    if (existingSnippet.userId !== userId) {
      throw new Error("Unauthorized");
    }
    await ctx.db.delete(id);
    return { success: true };
  }
});

export const removeAllSnippets = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const snippets = await ctx.db
      .query("snippets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const snippet of snippets) {
      await ctx.db.delete(snippet._id);
    }
    return { success: true };
  }
});
