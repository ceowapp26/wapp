import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  models: defineTable({
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
    userId: v.string(),
  }).index("by_model", ["userId", "model"]),
  memberships: defineTable({
    orgIds: v.array(v.string()),
    userId: v.string(),
  }).index("by_user_org", ["userId"]),
  users: defineTable({
    userId: v.string(),
    orgs: v.optional(v.array(v.string())),
    cloudUserId: v.optional(v.string()),
    userInfo: v.object({
      clerkId: v.optional(v.string()),
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
    modelInfo: v.optional(v.array(v.object({
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
    subscriptionInfo: v.object({
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
    creditInfo: v.object({
      transactionId: v.optional(v.string()),
      transactionType: v.optional(v.string()),
      service: v.optional(v.string()),
      product: v.optional(v.string()),
      currentCredit: v.optional(v.number()),
      spentCredit: v.optional(v.number()),
      remainingCredit: v.optional(v.number()),
      totalSpentCredit: v.optional(v.number()),
      amountPaid: v.optional(v.number()),
      amountDue: v.optional(v.number()),
      paidDate: v.optional(v.string()),
      dueDate: v.optional(v.string()),
      currency: v.optional(v.string()),
      status: v.optional(v.string()),
    }),
  })
    .index("by_user", ["userId"]),
  organizations: defineTable({
    orgName: v.string(),
    orgId: v.string(),
    resources: v.optional(v.array(v.string())),
    roles: v.optional(v.array(v.string())),
    users: v.optional(v.array(v.string())),
    permissions: v.optional(v.array(v.string())),
    metaData: v.optional(v.object({})),
    userId: v.string(),
  }).index("by_org", ["userId"]),
  documents: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    userId: v.string(),
    isArchived: v.boolean(),
    position: v.optional(v.number()),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    embedding: v.optional(v.array(v.float64())),
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
    isPublished: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_position_user", ["userId", "parentDocument", "position"]),
  notes: defineTable({
    text: v.string(),
    orgId: v.optional(v.string()),
    embedding: v.optional(v.array(v.float64())),
    userId: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_org", ["orgId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 1536,
      filterFields: ["userId", "orgId"],
    }),
  chats: defineTable({
    chatId: v.optional(v.string()),
    cloudChatId: v.optional(v.string()),
    cloudFolderId: v.optional(v.string()),
    chatTitle: v.optional(v.string()),
    chatIndex: v.optional(v.number()),
    folderId: v.optional(v.string()),
    folderIndex: v.optional(v.number()),
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
    folder: v.optional(
      v.object({
        folderId: v.optional(v.string()),
        cloudFolderId: v.optional(v.string()),
        userId: v.optional(v.string()),
        folderName: v.optional(v.string()),
        order: v.optional(v.number()),
        expanded: v.optional(v.boolean()),
        isArchived: v.optional(v.boolean()),
        color: v.optional(v.string()),
        index: v.optional(v.number()),
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
      })
    ),
    isPublished: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_chat_index", ["userId", "chatIndex"])
    .index("by_folder_index", ["userId", "folderIndex"]),
  snippets: defineTable({
    snippetId: v.optional(v.string()),
    cloudSnippetId: v.optional(v.string()),
    snippetName: v.optional(v.string()),
    snippetIndex: v.optional(v.number()),
    expanded: v.optional(v.boolean()),
    content: v.optional(v.string()),
    color: v.optional(v.string()),
    order: v.optional(v.number()),
    isArchived: v.optional(v.boolean()),
    userId: v.string(),
    isPublished: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_snippet_index", ["userId", "snippetIndex"]),
  notifications: defineTable({
    notification: v.optional(
      v.object({
        notificationId: v.string(),
        type: v.optional(v.string()),
        date: v.optional(v.string()),
        sender: v.optional(v.string()),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        senderAvatar: v.optional(v.string()),
      })
    ),
    userId: v.string(),
    hasNotification: v.boolean(),
    token: v.string(),
  }).index("by_user", ["userId"]),
  codes: defineTable({
    projectId: v.string(),
    projectName: v.string(),
    version: v.optional(v.string()),
    description: v.optional(v.string()),
    development: v.object({
      language: v.string(),
      framework: v.string(),
      buildTool: v.string(),
      packageManager: v.string(),
    }),
    testing: v.object({
      framework: v.string(),
      e2eFramework: v.string(),
    }),
    database: v.object({
      type: v.string(),
      name: v.string(),
      orm: v.string(),
    }),
    deployment: v.object({
      platform: v.string(),
      cicdTool: v.string(),
      containerization: v.string(),
    }),
    security: v.object({
      authentication: v.string(),
      authorization: v.string(),
      dataEncryption: v.boolean(),
    }),
    performance: v.object({
      caching: v.string(),
      cdn: v.string(),
    }),
    structure: v.optional(v.any()),
    codes: v.optional(v.array(v.object({
      name: v.string(),
      status: v.string(),
    }))),
    userId: v.string(),
    metadata: v.optional(v.any()),
  })
    .index("by_user", ["userId"])
});


