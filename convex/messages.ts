import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getChatMessages = query({
  args: {
    dashboardId: v.optional(v.id("dashboard")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null)
      throw new Error("Unauthenticated call to a mutation");

    const myMessages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("dashboardID"), args.dashboardId))
      .order("asc")
      .collect();

    return myMessages;
  },
});

export const saveNewMessage = mutation({
  args: {
    senderId: v.optional(v.id("users")),
    dashboardId: v.optional(v.id("dashboard")),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null)
      throw new Error("Unauthenticated call to a mutation");
    await ctx.db.insert("messages", {
      senderId: args.senderId!,
      message: args.message,
      dashboardID: args.dashboardId!,
      liked: false,
    });
  },
});

export const likeMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null)
      throw new Error("Unauthenticated call to a mutation");

    await ctx.db.patch(args.messageId, {
      liked: true,
    });
  },
});
