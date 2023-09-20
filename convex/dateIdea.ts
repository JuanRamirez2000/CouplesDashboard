import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getDateIdeas = query({
  args: { dashboardId: v.optional(v.id("dashboard")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null)
      throw new Error("Unauthenticated call to a mutation");
    const ideas = await ctx.db
      .query("dateIdeas")
      .filter((q) => q.eq(q.field("dashboardID"), args.dashboardId))
      .collect();
    if (!ideas) {
      throw new Error("Date ideas not found");
    }
    return ideas;
  },
});

export const saveDateIdea = mutation({
  args: {
    dashboardId: v.id("dashboard"),
    idea: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null)
      throw new Error("Unauthenticated call to a mutation");

    return await ctx.db.insert("dateIdeas", {
      dashboardID: args.dashboardId,
      idea: args.idea,
    });
  },
});

export const deleteDateIdea = mutation({
  args: {
    idea: v.id("dateIdeas"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null)
      throw new Error("Unauthenticated call to a mutation");

    return await ctx.db.delete(args.idea);
  },
});
