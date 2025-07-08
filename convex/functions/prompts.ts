import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const addPrompt = mutation({
  args: {
    promptText: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("prompts", {
      promptText: args.promptText,
      createdAt: Date.now(),
    });
  },
}); 