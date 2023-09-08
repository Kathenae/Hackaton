import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listForUser = query({
   handler: async (ctx) => {
      const user = await ctx.auth.getUserIdentity();
      return await ctx.db.query('projects').filter(q => q.eq(q.field('owner'), user?.nickname)).collect();
   },
})

export const createProject = mutation({
   args: { name: v.string(), repo: v.string(), },
   handler: async (ctx, { name, repo }) => {
      const user = await ctx.auth.getUserIdentity()
      await ctx.db.insert("projects", { owner: user?.nickname, name, repo });
   },
});

export const createFileView = mutation({
   args: { project: v.id('projects'), path: v.string(), rawContent: v.string(), position: v.object({ x: v.number(), y: v.number() }) },
   handler: async (ctx, { project, path, rawContent, position }) => {
      // TODO: Check if user is allowed to create file views
      // const user = await ctx.auth.getUserIdentity() 
      await ctx.db.insert('fileviews', { project, path, rawContent, position });
   }
})

export const updateFileView = mutation({
   args: { id: v.id('fileviews'), rawContent: v.string(), position: v.object({ x: v.number(), y: v.number() }) },
   handler: async (ctx, { id, rawContent, position }) => {
      // TODO: Check if user is allowed to update file views
      // const user = await ctx.auth.getUserIdentity() 
      await ctx.db.patch(id, { rawContent, position })
   }
})

export const deleteFileView = mutation({
   args: { id: v.id('fileviews') },
   handler: async (ctx, { id }) => {
      // TODO: Check if user is allowed to delete the file view
      // const user = await ctx.auth.getUserIdentity() 
      await ctx.db.delete(id)
   }
})