import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
   args: {id: v.id('projects')},
   handler: async (ctx, {id}) => {
      const project = await ctx.db.get(id);
      if(!project){
         return null;
      }

      const editorNodes = await ctx.db.query('editornodes').withIndex('byProjectId', (q) => q.eq('projectId', project._id)).collect()

      return {
         ...project,
         editorNodes,
      }
   }
})

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
      if(user?.nickname){
         await ctx.db.insert("projects", { owner: user.nickname, name, repo });
      }
   },
});

export const createEditorNode = mutation({
   args: { projectId: v.id('projects'), path: v.string(), content: v.string(), position: v.object({ x: v.number(), y: v.number() }) },
   handler: async (ctx, { projectId, path, content, position }) => {
      // TODO: Check if user is allowed to create file views
      // const user = await ctx.auth.getUserIdentity() 
      await ctx.db.insert('editornodes', { projectId, path, content, position, expanded: true });
   }
})

export const updateEditorNode = mutation({
   args: { id: v.id('editornodes'), content: v.string(), position: v.object({ x: v.number(), y: v.number() }) },
   handler: async (ctx, { id, content, position }) => {
      // TODO: Check if user is allowed to update file views
      // const user = await ctx.auth.getUserIdentity() 
      await ctx.db.patch(id, { content, position })
   }
})

export const deleteEditorNode = mutation({
   args: { id: v.id('editornodes') },
   handler: async (ctx, { id }) => {
      // TODO: Check if user is allowed to delete the file view
      // const user = await ctx.auth.getUserIdentity() 
      await ctx.db.delete(id)
   }
})