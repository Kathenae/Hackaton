import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export default defineSchema({
   projects: defineTable({
      name: v.string(),
      owner: v.string(),
      repo: v.string(),
      inviteCode: v.optional(v.string()),
   }).index('byInviteCode', ['inviteCode']),
   editornodes: defineTable({
      projectId: v.id('projects'),
      expanded: v.boolean(),
      path: v.string(),
      content: v.string(),
      position: v.object({
         x: v.number(),
         y: v.number(),
      }),
      textPosition: v.optional(v.object({
         line: v.number(),
         column: v.number(),
         scrollTop: v.number(),
         scrollLeft: v.number(),
      })),
   }).index('byProjectId', ['projectId']).index('byPath', ['path']),
   members: defineTable({
      username: v.string(),
      projectId: v.id('projects'),
      editorId: v.optional(v.id('editorNode')),
      lastseenTimestamp: v.string(),
      cursorPosition: v.optional(v.object({
         x: v.number(),
         y: v.number(),
      }))
   }).index('byProjectId', ['projectId']).index('byUsername', ['username']).index('byUsernameAndProjectId', ['username', 'projectId']),
});

export type Project = {
   _id: Id<"projects">;
   _creationTime: number;
   inviteCode?: string | undefined;
   name: string;
   owner: string;
   repo: string;
}

export type EditorNodeData = {
   _id: Id<"editornodes">;
   _creationTime: number;
   projectId: Id<"projects">;
   expanded: boolean;
   path: string;
   content: string;
   position: {
       x: number;
       y: number;
   };
   textPosition?: {
      line: number;
      column: number;
      scrollTop: number;
      scrollLeft: number;
   }
}