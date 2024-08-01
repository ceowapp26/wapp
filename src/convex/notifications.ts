import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendToAllUsers = mutation({
  args: {
    id: v.id("notifications"),
    notification: v.object({
      id: v.string(),
      type: v.optional(v.string()),
      date: v.optional(v.string()),
      sender: v.optional(v.string()),
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      senderAvatar: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { id, notification }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const newNotification = await ctx.db.patch(id, {
      userId,
      hasNotification: true,
      notification: {
        notificationId: notification.id,
        type: notification.type || "popup",
        sender: notification.sender || "",
        title: notification.title || "",
        senderAvatar: notification.senderAvatar ?? "",
        content: notification.content ?? "",
        date: notification.date ?? new Date().toISOString(),
      }
    });

    return newNotification;
  }
});

export const getAllTokens = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const notifications = await ctx.db.query("notifications").collect();
    const tokens = notifications.map((notification) => ({
      token: notification.token,
      id: notification._id,
    }));
    return tokens;
  }
});

export const getAllNotifications = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => (
        q
          .eq("userId", userId)
        ))
      .collect();
    return notifications;
  }
});

export const storeToken = mutation({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, { token }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    return await ctx.db.insert("notifications", {
      userId,
      hasNotification: false,
      notification: undefined,
      token: token || "",
    });
  }
});

export const deleteUnusedRecords = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const notifications = await ctx.db.query("notifications").collect();

    for (const notification of notifications) {
      if (notification && (!notification.notification?.title || !notification.notification?.content || !notification.notification?.sender)) {
        await ctx.db.delete(notification._id);
      }
    }
  }
});
