import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const grabUserNotes = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null)
      throw new Error("Unauthenticated call to a mutation");

    const userNotes = await ctx.db
      .query("userNotes")
      .filter((q) => q.eq(q.field("userID"), args.userId))
      .collect();

    return userNotes;
  },
});

export const saveUsernote = mutation({
  args: { userId: v.id("users"), note: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null)
      throw new Error("Unauthenticated call to a mutation");

    await ctx.db.insert("userNotes", {
      userID: args.userId,
      note: args.note,
    });
  },
});

export const deleteUserNote = mutation({
  args: {
    noteId: v.id("userNotes"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null)
      throw new Error("Unauthenticated call to a mutation");

    await ctx.db.delete(args.noteId);
  },
});
