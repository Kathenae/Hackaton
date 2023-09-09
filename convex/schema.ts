import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
   projects: defineTable({
      name: v.string(),
      owner: v.string(),
      repo: v.string(),
   }),
   editornodes: defineTable({
      projectId: v.id('projects'),
      expanded: v.boolean(),
      path: v.string(),
      content: v.string(),
      position: v.object({
         x: v.number(),
         y: v.number(),
      }),
   }).index('byProjectId', ['projectId']).index('byPath', ['path']),
});