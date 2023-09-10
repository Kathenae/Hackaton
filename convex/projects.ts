import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Project } from "./schema";
import { v4 as uuidv4 } from 'uuid';

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
      const memberships = await ctx.db.query('members').withIndex('byUsername', q => q.eq('username', user?.nickname ?? '')).collect()
      const joinedProjects = await Promise.all(
         memberships.map(async (membership) => await ctx.db.get(membership.projectId))
      );

      const projects = joinedProjects.reduce((result: Project[], project) => {
         if(project){
            result.push(project)
         }
         return result;
      }, [])

      return projects
   },
})

export const createProject = mutation({
   args: { name: v.string(), repo: v.string(), },
   handler: async (ctx, { name, repo }) => {
      const user = await ctx.auth.getUserIdentity()
      if(user?.nickname){
         const inviteCode = uuidv4();
         const projectId = await ctx.db.insert("projects", { owner: user.nickname, name, repo, inviteCode });
         await ctx.db.insert('members', {username: user.nickname, projectId, lastseenTimestamp: new Date().toISOString()});
         
         return {
            projectId
         }
      }
   },
});

export const deleteProject = mutation({
   args: {id: v.id('projects')},
   handler: async (ctx, {id}) => {
      const members = await ctx.db.query('members').withIndex('byProjectId', (q) => q.eq('projectId', id)).collect()
      const editorNodes = await ctx.db.query('editornodes').withIndex('byProjectId', (q) => q.eq('projectId', id)).collect()

      // Delete related members
      for (let i = 0; i < members.length; i++) {
         const membership = members[i];
         await ctx.db.delete(membership._id);
      }

      // Delete related nodes
      for (let i = 0; i < editorNodes.length; i++) {
         const node = editorNodes[i];
         await ctx.db.delete(node._id);
      }

      // delete project
      await ctx.db.delete(id)
   },
})

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