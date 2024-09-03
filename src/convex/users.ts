import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const storeUser = mutation({
  args: {
    data: v.object({
      userId: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      username: v.optional(v.string()),
      fullname: v.optional(v.string()),
      pictureUrl: v.optional(v.string()),
      role: v.optional(v.string()),
      password: v.optional(v.string()),
      planType: v.optional(v.string()),
      planId: v.optional(v.string()),
      hasChanged: v.optional(v.boolean()),
      hasPlanChanged: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, { data }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const existingUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("userId"), data.userId))
      .first();

    if (existingUser) {
      if (data.hasChanged || data.hasPlanChanged) {
        await ctx.db.patch(existingUser._id, {
          userInfo: {
            ...existingUser.userInfo,
          username: data.username ?? existingUser.userInfo.username,
          fullname: data.fullname ?? existingUser.userInfo.fullname,
          email: data.email ?? existingUser.userInfo.email,
          phone: data.phone ?? existingUser.userInfo.phone,
          role: data.role ?? existingUser.userInfo.role,
          picture: data.pictureUrl ?? existingUser.userInfo.picture,
          updatedAt: new Date().toISOString(),
          },
          subscriptionInfo: {
            planType: existingUser.subscriptionInfo.planType ?? data.planType,
            planId: existingUser.subscriptionInfo.planId ?? data.planId,
            ...existingUser.subscriptionInfo,
          },
        });
      }
      return existingUser._id;
    } else {
      const newUser = await ctx.db.insert("users", {
        userId,
        cloudUserId: "",
        userInfo: {
          clerkId: data.userId ?? "",
          username: data.username ?? identity.name ?? "",
          fullname: data.fullname ?? "",
          email: data.email ?? identity.email ?? "",
          phone: data.phone ?? "",
          password: data.password ?? "",
          role: data.role ?? "user",
          picture: identity.pictureUrl ?? data.pictureUrl ?? "",
          emailVerified: identity.emailVerified ?? false,
          phoneNumberVerified: identity.phoneNumberVerified ?? false,
          updatedAt: new Date().toISOString(),
        },
        modelInfo: [],
        subscriptionInfo: {
          planType: data.planType ?? "FREE",
          planId: data.planId ?? process.env.FREE_PLAN_ID,
        },
        creditInfo: {
          currentCredit: 0,
          spentCredit: 0,
          remainingCredit: 0,
          totalSpentCredit: 0,
        },
      });
      await ctx.db.patch(newUser, { cloudUserId: newUser });
      return newUser;
    }
  },
});

export const updateUserInfo = mutation({
  args: {
    id: v.id("users"),
    data: v.object({
      userId: v.optional(v.string()),
      cloudUserId: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      username: v.optional(v.string()),
      fullname: v.optional(v.string()),
      pictureUrl: v.optional(v.string()),
      role: v.optional(v.string()),
      password: v.optional(v.string()),
      picture: v.optional(v.string()),
      emailVerified: v.optional(v.boolean()),
      phoneNumberVerified: v.optional(v.boolean()),
      updatedAt: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    await ctx.db.patch(args.id, {
      userInfo: args.data,
    });
  },
});

export const updateUserSubscription = mutation({
  args: {
    id: v.id("users"),
    data: v.object({
      transactionId: v.optional(v.string()),
      transactionType: v.optional(v.string()),
      service: v.optional(v.string()),
      product: v.optional(v.string()),
      planType: v.optional(v.string()),
      planId: v.optional(v.string()),
      quantity: v.optional(v.number()),
      amountPaid: v.optional(v.number()),
      amountDue: v.optional(v.number()),
      currency: v.optional(v.string()),
      paidDate: v.optional(v.string()),
      dueDate: v.optional(v.string()),
      status: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    await ctx.db.patch(args.id, {
      subscriptionInfo: args.data,
    });
  },
});

export const updateUserCredit = mutation({
  args: {
    id: v.id("users"),
    data: v.object({
      transactionId: v.optional(v.string()),
      transactionType: v.optional(v.string()),
      service: v.optional(v.string()),
      product: v.optional(v.string()),
      amountPaid: v.optional(v.number()),
      amountDue: v.optional(v.number()),
      quantity: v.optional(v.number()),
      currency: v.optional(v.string()),
      paidDate: v.optional(v.string()),
      dueDate: v.optional(v.string()),
      currentCredit: v.optional(v.number()),
      spentCredit: v.optional(v.number()),
      remainingCredit: v.optional(v.number()),
      totalSpentCredit: v.optional(v.number()),
      status: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    await ctx.db.patch(args.id, {
      creditInfo: args.data,
    });
  },
});

export const updateMultipleModelsInfo = mutation({
  args: {
    id: v.id("users"),
    data: v.optional(v.array(v.object({
      cloudModelId: v.id("models"),
      model: v.string(),
      RPM: v.optional(v.number()),
      RPD: v.optional(v.number()),
      TPM: v.optional(v.number()),
      TPD: v.optional(v.number()),
      inputTokens: v.optional(v.number()),
      outputTokens: v.optional(v.number()),
      purchasedAmount: v.optional(v.number()),
    }))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    await ctx.db.patch(args.id, {
      modelInfo: args.data,
    });
  },
});

export const updateSingleModelInfo = mutation({
  args: {
    id: v.id("users"),
    data: v.object({
      cloudModelId: v.id("models"),
      model: v.string(),
      RPM: v.optional(v.number()),
      RPD: v.optional(v.number()),
      TPM: v.optional(v.number()),
      TPD: v.optional(v.number()),
      inputTokens: v.optional(v.number()),
      outputTokens: v.optional(v.number()),
      purchasedAmount: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const userId = identity.subject;
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!currentUser) {
      throw new Error("User not found");
    }
    const models = currentUser.modelInfo || [];
    const modelIndex = models.findIndex(model => model.cloudModelId === args.data.cloudModelId);
    if (modelIndex === -1) {
      throw new Error("Model not found for user");
    }
    models[modelIndex] = {
      ...models[modelIndex],
      ...args.data,
    };
    await ctx.db.patch(args.id, {
      modelInfo: models,
    });
    return models[modelIndex];
  },
});

export const getUserInfo = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const user = await ctx.db.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
});

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated")
    }
    const userId = identity.subject;
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!currentUser) {
      throw new Error("User not found");
    }
    return currentUser;
  }
});

export const getActiveUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated")
    }
    const userId = identity.subject;
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!currentUser) {
      throw new Error("User not found");
    }
    return currentUser;
  }
});

export const getAllUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const getUsersBuyPlan = query({
  args: {
    planId: v.string(),
  },
  handler: async (ctx, { planId }) => {
    const users = await ctx.db
    .query("users")
    .filter((q) => q.neq(q.field("subscriptionInfo"), undefined))
    .collect();
    const planPaidUsers = users.filter((user) => user.subscriptionInfo?.planId === planId);
    return planPaidUsers;
  },
});

export const getUsersBuyCredit = query({
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("creditInfo"), undefined))
      .collect();
    const creditPaidUsers = users.filter((user) => user.creditInfo?.currentCredit && user.creditInfo?.currentCredit > 0)
    return creditPaidUsers;
  },
});

/*export const getUserPurchasedModelType = query({
  args: {
    modelId: v.id("models"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    type PAID = "input_tokens" | "output_tokens" | "all_tokens";

    const userId = identity.subject;
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!currentUser) {
      throw new Error("User not found");
    }

    const models = currentUser.models;
    if (!models) {
      throw new Error("Models not found for user");
    }

    const currentModel = models.find(model => model.cloudModelId === args.modelId);
    if (!currentModel) {
      throw new Error("Model not found");
    }

    let paidType: PAID | false = false;

    if (currentModel.max_inputTokens && currentModel.max_inputTokens > 0) {
      paidType = "input_tokens";
    } else if (currentModel.max_outputTokens && currentModel.max_outputTokens > 0) {
      paidType = "output_tokens";
    } else if (currentModel.max_inputTokens && currentModel.max_outputTokens && currentModel.max_inputTokens > 0 && currentModel.max_outputTokens > 0) {
      paidType = "all_tokens";
    }
    return paidType;
  },
});*/

export const getUserByUserId = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("userId"), userId))
      .first();
  },
});