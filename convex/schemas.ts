import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
   projects: defineTable({
      name: v.string(),
      repository: v.string(),
      owner: v.string(),
   }),
   fileviews: defineTable({
      path: v.string(),
      rawContent: v.string(),
      position: v.object({
         x: v.number(),
         y: v.number(),
      }),
      project: v.id('projects'),
   }),
});