import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const retrive = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_userID", (q) => q.eq("clerkUserID", identity.subject))
      .unique();
    if (!user) {
      throw new Error("Unauthenticated call to mutation");
    }
    return user;
  },
});

export const retriveWithID = query({
  args: { userID: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }

    const user = await ctx.db.get(args.userID);
    if (!user) {
      throw new Error("No user found");
    }
    return user;
  },
});

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_userID", (q) => q.eq("clerkUserID", identity.subject))
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      clerkUserID: identity.subject, //Clerk ID
      name: identity.name!,
      email: identity.email!,
      picture: identity.pictureUrl!,
      mood: "Happy",
      partnerID: null,
      dashboardID: null,
    });
  },
});

export const connectTwoUsers = mutation({
  args: { partnerID: v.string() },
  handler: async (ctx, args) => {
    //Make sure user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }

    //Grab individual users
    const user = await ctx.db
      .query("users")
      .withIndex("by_userID", (q) => q.eq("clerkUserID", identity.subject))
      .unique();

    if (!user) {
      throw new Error("No user found");
    }

    const partner = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.partnerID))
      .unique();

    if (!partner) {
      throw new Error("No user found");
    }

    //Create a dashboard
    const dashboardID = await ctx.db.insert("dashboard", {
      users: [user._id, partner._id as Id<"users">],
    });

    //Connect the two users and assign them the dashboardID
    await ctx.db.patch(user._id, {
      partnerID: partner._id,
      dashboardID: dashboardID,
    });
    await ctx.db.patch(partner._id, {
      partnerID: user._id,
      dashboardID: dashboardID,
    });

    return dashboardID;
  },
});

export const changeMood = mutation({
  args: {
    mood: v.union(v.literal("Happy"), v.literal("Angry"), v.literal("Sad")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_userID", (q) => q.eq("clerkUserID", identity.subject))
      .unique();
    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, { mood: args.mood });
  },
});
