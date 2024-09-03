import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const createProject = mutation({
  args: {
    projectInfo: v.object({
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
      metadata: v.optional(v.any()),
    }),
    codes: v.optional(v.array(v.object({
      name: v.string(),
      status: v.string(),
    })))
  },
  handler: async (ctx, { projectInfo, codes }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const newProject = await ctx.db.insert("codes", {
      ...projectInfo,
      userId,
      codes: codes || [],
    });

    return newProject;
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("codes"),
    project: v.object({
      projectId: v.optional(v.string()),
      projectName: v.optional(v.string()),
      version: v.optional(v.string()),
      description: v.optional(v.string()),
      development: v.optional(v.object({
        language: v.string(),
        framework: v.string(),
        buildTool: v.string(),
        packageManager: v.string(),
      })),
      testing: v.optional(v.object({
        framework: v.string(),
        e2eFramework: v.string(),
      })),
      database: v.optional(v.object({
        type: v.string(),
        name: v.string(),
        orm: v.string(),
      })),
      deployment: v.optional(v.object({
        platform: v.string(),
        cicdTool: v.string(),
        containerization: v.string(),
      })),
      security: v.optional(v.object({
        authentication: v.string(),
        authorization: v.string(),
        dataEncryption: v.boolean(),
      })),
      performance: v.optional(v.object({
        caching: v.string(),
        cdn: v.string(),
      })),
      structure: v.optional(v.any()),
      codes: v.optional(v.array(v.object({
        name: v.string(),
        status: v.string(),
      }))),
      metadata: v.optional(v.any()),
    }),
  },
  handler: async (ctx, { id, project }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const userId = identity.subject;
    const existingProject = await ctx.db.get(id);
    if (!existingProject) {
      throw new Error("Project not found");
    }
    if (existingProject.userId !== userId) {
      throw new Error("Unauthorized access");
    }
    
    const updatedProject = await ctx.db.patch(id, project);

    return updatedProject;
  },
});

export const getProjects = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    
    const projects = await ctx.db
      .query("codes")
      .withIndex("by_user", (q) =>
        q.eq("userId", userId)
      )
      .order("asc")
      .collect();

    return projects;
  },
});

export const removeProject = mutation({
  args: { id: v.id("codes") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const existingProject = await ctx.db.get(id);
    if (!existingProject) {
      throw new Error("Project not found");
    }
    if (existingProject.userId !== userId) {
      throw new Error("Unauthorized access");
    }
    await ctx.db.delete(id);
    return { success: true };
  },
});

export const removeAllProjects = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const projects = await ctx.db
      .query("codes")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    for (const project of projects) {
      await ctx.db.delete(project._id);
    }
    return { success: true };
  },
});

export const getProjectList = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;

    const projects = await ctx.db
      .query("codes")
      .withIndex("by_user", (q) =>
        q.eq("userId", userId)
      )
      .order("asc")
      .collect();

    return projects;
  },
});

export const getProjectById = query({
  args: { 
    projectId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (!args.projectId) {
      return undefined;
    }

    let projectId: Id<"codes"> | null;
    try {
      projectId = ctx.db.normalizeId("codes", args.projectId);
    } catch {
      return undefined;
    }

    if (projectId === null) {
      return null;
    }

    const project = await ctx.db.get(projectId);

    return project || null;
  }
});

export const getProject = mutation({
  args: { 
    projectId: v.id("codes"), 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (!args.projectId) {
      return null;
    }

    const userId = identity.subject;

    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== userId) {
      throw new Error("Unauthorized access");
    }

    return project;
  }
});