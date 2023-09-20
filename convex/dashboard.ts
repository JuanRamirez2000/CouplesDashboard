import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { dashboardID: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null)
      throw new Error("Unauthenticated call to a mutation");

    const dashboard = await ctx.db
      .query("dashboard")
      .filter((q) => q.eq(q.field("_id"), args.dashboardID))
      .unique();
    return dashboard;
  },
});
