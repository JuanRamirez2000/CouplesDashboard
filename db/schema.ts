import { pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  user_id: text("user_id").primaryKey(),
  fullName: text("full_name"),
});
