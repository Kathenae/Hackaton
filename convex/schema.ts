import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
   projects: defineTable({
      name: v.string(),
      owner: v.string(),
      repo: v.string(),
   }),
   fileviews: defineTable({
      projectId: v.id('projects'),
      path: v.string(),
      rawContent: v.string(),
      encoding: v.string(),
      position: v.object({
         x: v.number(),
         y: v.number(),
      }),
   })
});