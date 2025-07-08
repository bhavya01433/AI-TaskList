// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  prompts: defineTable({
    promptText: v.string(),
    createdAt: v.number(),
  }),
  tasks: defineTable({
    promptId: v.string(),
    text: v.string(),
    completed: v.boolean(),
    createdAt: v.number(),
  }),
});
