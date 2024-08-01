"use node";
import { WebhookEvent } from "@clerk/nextjs/server";
import { v } from "convex/values";
import { Webhook } from "svix";
import { internalAction } from "./_generated/server";
import { createClerkClient } from '@clerk/backend';
import { currentUser } from '@clerk/nextjs/server';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;
const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const fulfill = internalAction({
  args: { headers: v.any(), payload: v.string() },
  handler: async (ctx, args) => {
    const wh = new Webhook(webhookSecret);
    const payload = wh.verify(args.payload, args.headers);
    return payload as WebhookEvent;
  },
});

export const getUserOrganizations = internalAction({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    try {
      const response = await clerk.users.getOrganizationMembershipList({
        userId: args.userId
      });
      const formattedOrganizations = response.data.map((membership) => ({
        id: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
        imageUrl: membership.organization.imageUrl,
        hasImage: membership.organization.hasImage,
        createdBy: membership.organization.createdBy,
        createdAt: membership.organization.createdAt,
        updatedAt: membership.organization.updatedAt,
        publicMetadata: membership.organization.publicMetadata,
        privateMetadata: membership.organization.privateMetadata,
        maxAllowedMemberships: membership.organization.maxAllowedMemberships,
        adminDeleteEnabled: membership.organization.adminDeleteEnabled,
        members_count: undefined, 
        role: membership.role
      }));

      return { 
        data: formattedOrganizations,
        totalCount: response.totalCount 
      };
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  },
});