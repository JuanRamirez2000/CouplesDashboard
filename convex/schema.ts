import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserID: v.string(),
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    mood: v.union(v.literal("Happy"), v.literal("Angry"), v.literal("Sad")),
    partnerID: v.union(v.id("users"), v.null()),
    dashboardID: v.union(v.id("dashboard"), v.null()),
  }).index("by_userID", ["clerkUserID"]),
  userNotes: defineTable({
    userID: v.id("users"),
    note: v.string(),
  }).index("by_userID", ["userID"]),
  dashboard: defineTable({
    users: v.array(v.id("users")),
  }),
  dateIdeas: defineTable({
    idea: v.string(),
    dashboardID: v.id("dashboard"),
  }).index("by_dashboardID", ["dashboardID"]),
  messages: defineTable({
    senderId: v.id("users"),
    message: v.string(),
    dashboardID: v.id("dashboard"),
    liked: v.boolean(),
  }).index("by_dashboardID", ["dashboardID"]),
});
