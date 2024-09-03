import { v } from "convex/values";
import { internalMutation, internalQuery, mutation } from "./_generated/server";
import { hasOrgAccess } from "./documents";

export const addUserIdsToOrgs = internalMutation({
  args: {
    orgIds: v.array(v.string()),
    userId: v.string(),
  },
  async handler(ctx, args) {
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user_org", (q) => q.eq("userId", args.userId))
      .first();

    if (membership) {
      const updatedOrgIds = [...new Set([...membership.orgIds, ...args.orgIds])];
      await ctx.db.patch(membership._id, { orgIds: updatedOrgIds });
    } else {
      await ctx.db.insert("memberships", {
        userId: args.userId,
        orgIds: args.orgIds,
      });
    }
  },
});

export const removeUserIdFromOrg = internalMutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  async handler(ctx, args) {
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user_org", (q) => q.eq("userId", args.userId))
      .first();

    if (membership) {
      const updatedOrgIds = membership.orgIds.filter(orgId => orgId !== args.orgId);
      if (updatedOrgIds.length === 0) {
        await ctx.db.delete(membership._id);
      } else {
        await ctx.db.patch(membership._id, { orgIds: updatedOrgIds });
      }
    }
  },
});

export const getUserMembership = internalQuery({
  args: {
    userId: v.string(),
  },
  async handler(ctx, args) {
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user_org", (q) => q.eq("userId", args.userId))
      .first();

    if (!membership) {
      return null;
    }
    return {
      orgIds: membership.orgIds,
    };
  },
});

export const hasOrgAccessQuery = internalQuery({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    return await hasOrgAccess(ctx, args.orgId);
  },
});
