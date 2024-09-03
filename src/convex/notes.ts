import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import OpenAI from "openai";
import { internal } from "./_generated/api";
import { hasOrgAccess } from "./documents";
import { Doc, Id } from "./_generated/dataModel";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getNote = query({
  args: {
    noteId: v.id("notes"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const note = await ctx.db.get(args.noteId);

    if (!note) {
      throw new Error("Not found");
    }

    if (note.orgId) {
      const hasAccess = await hasOrgAccess(ctx, note.orgId);

      if (!hasAccess) {
        return null;
      }
    } else {
      if (note.userId !== userId) {
        return null;
      }
    }

    return note;
  },
});

export const getNotes = query({
  args: {
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }   
    const userId = identity.subject;

    if (args.orgId) {
      const hasAccess = await hasOrgAccess(ctx, args.orgId);

      if (!hasAccess) {
        return null;
      }

      const notes = await ctx.db
        .query("notes")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .collect();

      return notes;
    } else {
      const notes = await ctx.db
        .query("notes")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .collect();

      return notes;
    }
  },
});

export async function embed(text: string) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return embedding.data[0].embedding;
}

export const setNoteEmbedding = internalMutation({
  args: {
    noteId: v.id("notes"),
    embedding: v.array(v.number()),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.noteId, {
      embedding: args.embedding,
    });
  },
});

export const createNoteEmbedding = internalAction({
  args: {
    noteId: v.id("notes"),
    text: v.string(),
  },
  async handler(ctx, args) {
    const embedding = await embed(args.text);

    await ctx.runMutation(internal.notes.setNoteEmbedding, {
      noteId: args.noteId,
      embedding,
    });
  },
});

export const createNote = mutation({
  args: {
    text: v.string(),
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    let noteId: Id<"notes">;

    if (args.orgId) {
      const hasAccess = await hasOrgAccess(ctx, args.orgId);

      if (!hasAccess) {
        throw new Error(
          "You do not have permission to create a note in this organization"
        );
      }

      noteId = await ctx.db.insert("notes", {
        text: args.text,
        orgId: args.orgId,
        userId,  // Include userId for organizational notes
      });
    } else {
      noteId = await ctx.db.insert("notes", {
        text: args.text,
        userId: userId,
      });
    }

    await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbedding, {
      noteId,
      text: args.text,
    });
  },
});

export const deleteNote = mutation({
  args: {
    noteId: v.id("notes"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const userId = identity.subject;
    const note = await ctx.db.get(args.noteId);

    if (!note) {
      throw new Error("Not found");
    }

    await assertAccessToNote(ctx, note);

    await ctx.db.delete(args.noteId);
  },
});

async function assertAccessToNote(
  ctx: QueryCtx | MutationCtx,
  note: Doc<"notes">
) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  const userId = identity.subject;

  if (note.orgId) {
    const hasAccess = await hasOrgAccess(ctx, note.orgId);

    if (!hasAccess) {
      throw new Error("You do not have permission to delete this note");
    }
  } else {
    if (note.userId !== userId) {
      throw new Error("You do not have permission to delete this note");
    }
  }
}
