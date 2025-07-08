import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const addTask = mutation({
  args: {
    promptId: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      promptId: args.promptId,
      text: args.text,
      completed: false,
      createdAt: Date.now(),
    });
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
  },
});

export const toggleTaskComplete = mutation({
  args: {
    taskId: v.id("tasks"),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.taskId, {
      completed: args.completed,
    });
  },
});

export const getTasksByPrompt = query({
  args: {
    promptId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("promptId"), args.promptId))
      .collect();
  },
}); 