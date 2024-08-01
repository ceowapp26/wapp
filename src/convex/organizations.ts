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

export const createOrganization = mutation({
  args: {
    orgName: v.string(),
    orgId: v.string(),
    resources: v.array(v.string()),
    roles: v.optional(v.array(v.string())),
    users: v.optional(v.array(v.string())),
    permissions: v.optional(v.array(v.string())),
    metaData: v.optional(v.object({})),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const organizations = await ctx.db
      .query("organizations")
      .withIndex("by_org", (q) => q.eq("userId", userId))
      .collect();

    const organization = await ctx.db.insert("organizations", {
      orgName: args.orgName,
      orgId: args.orgId,
      resources: args.resources || [],
      roles: args.roles || [],
      users: args.users || [],
      permissions: args.permissions || [],
      metaData: args.metaData || {},
      userId: userId,
    });

    return organization;
  },
});

/*export const updateOrganization = mutation({
  args: {
    id: v.id("organizations"),
    orgData: {
      orgId: v.string(),
      orgName: v.optional(v.string()),
      resources: v.optional(v.array(v.string())),
      roles: v.optional(v.array(v.string())),
      users: v.optional(v.array(v.string())),
      permissions: v.optional(v.array(v.string())),
      metaData: v.optional(v.object({})),
    },
    activeRole: v.optional(v.string()),   
    activeOrgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    if (!args.id) {
      throw new Error("No organization id is provided");
    }
    const existingOrganization = await ctx.db.get(args.id);

    if (!existingOrganization) {
      throw new Error("Not found");
    }
    const updatedOrganization = await ctx.db.patch(args.id, 
      args.orgData,
    );
    return updatedOrganization;
  },
});*/
