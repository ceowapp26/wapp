import { v } from "convex/values";
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

interface OrganizationInterface {
  orgName?: string;
  orgId?: string;
}

export const searchAction = action({
  args: {
    search: v.string(),
    orgs: v.optional(v.object({
      orgName: v.optional(v.string()),
      orgId: v.optional(v.string()),
    })),
  },
  handler: async (ctx: any, args: { search: string; orgs?: OrganizationInterface }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    if (args.orgs) {
      const hasAccess = await ctx.runQuery(
        internal.memberships.hasOrgAccessQuery,
        {
          orgs: args.orgs,
        }
      );

      if (!hasAccess) {
        return null;
      }
    }

    const documentId = "";

    const documentResults = await ctx.db
      .query("documents")
      .withIndex("by_position_org", (q: any) =>
        q.eq("userId", userId).eq("orgs", args.orgs).eq("parentDocument", documentId)
      )
      .collect();

    const chatResults = await ctx.db
      .query("chats")
      .withIndex("by_org", (q: any) =>
        q.eq("userId", userId).eq("orgs", args.orgs).eq(q.field("isArchived"), false)
      )
      .filter((q: any) => q.eq(q.field("folder"), undefined))
      .collect();

    const chatFolderResults = await ctx.db
      .query("chats")
      .withIndex("by_org", (q: any) =>
        q.eq("userId", userId).eq("orgs", args.orgs).eq(q.field("isArchived"), false)
      )
      .filter((q: any) => q.neq(q.field("folder"), undefined))
      .collect();

    const records: (
      | { type: "chats"; score: number; record: Doc<"chats"> }
      | { type: "documents"; score: number; record: Doc<"documents"> }
    )[] = [];

    await Promise.all(
      chatResults.map(async (result: any) => {
        const chat = await ctx.runQuery(api.chats.getChatById, {
          id: result._id,
        });
        if (chat) {
          records.push({
            record: chat,
            score: result._score,
            type: "chats",
          });
        }
      })
    );

    await Promise.all(
      chatFolderResults.map(async (result: any) => {
        const chat = await ctx.runQuery(api.chats.getChatByFolderId, {
          folderId: result.folderId,
        });
        if (chat) {
          records.push({
            record: chat,
            score: result._score,
            type: "chats", 
          });
        }
      })
    );

    await Promise.all(
      documentResults.map(async (result: any) => {
        const document = await ctx.runQuery(internal.documents.getDocument, {
          documentId: result._id,
        });
        if (document) {
          records.push({
            record: document,
            type: "documents",
            score: result._score,
          });
        }
      })
    );

    records.sort((a, b) => b.score - a.score);

    return records;
  },
});
