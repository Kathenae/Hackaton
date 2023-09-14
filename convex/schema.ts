import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export default defineSchema({
   users: defineTable({
      name: v.string(),
      username: v.string(),
      tokenIdentifier: v.string(),
      avatarUrl: v.optional(v.string()),
      lastSeenTimestamp: v.string(),
   }).index('ByToken', ['tokenIdentifier']),
   projects: defineTable({
      name: v.string(),
      ownerId: v.id("users"),
      repo: v.string(),
      inviteCode: v.optional(v.string()),
   }).index('byInviteCode', ['inviteCode']),
   editornodes: defineTable({
      projectId: v.id('projects'),
      expanded: v.boolean(),
      branch: v.string(),
      path: v.string(),
      content: v.string(),
      sha: v.optional(v.string()),
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
      userId: v.id('users'),
      projectId: v.id('projects'),
      editorId: v.optional(v.id('editornodes')),
      lastseenTimestamp: v.string(),
      cursorPosition: v.optional(v.object({
         x: v.number(),
         y: v.number(),
      }))
   }).index('byProjectId', ['projectId']).index('byUserId', ['userId']).index('byUserIdAndProjectId', ['userId', 'projectId']),
});

export type Project = {
   _id: Id<"projects">;
   _creationTime: number;
   inviteCode?: string | undefined;
   name: string;
   ownerId: Id<"users">;
   repo: string;
}

export type EditorNodeData = {
   _id: Id<"editornodes">;
   _creationTime: number;
   projectId: Id<"projects">;
   expanded: boolean;
   branch: string,
   path: string,
   content: string,
   sha?: string,
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

export type Member = {
   _id: Id<"members">;
   _creationTime: number;
   editorId?: Id<"editornodes"> | undefined;
   cursorPosition?: {
      x: number;
      y: number;
   } | undefined;
   userId: Id<"users">;
   projectId: Id<"projects">;
   lastseenTimestamp: string;
}