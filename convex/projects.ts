import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Project } from "./schema";
import { v4 as uuidv4 } from 'uuid';
import * as users from "./users";

export const getForUser = query({
   args: {id: v.id('projects')},
   handler: async (ctx, {id}) => {

      const user = await users.current(ctx);

      if (!user) {
         return null;
      }

      const project = await ctx.db.get(id);
      if(!project){
         return null;
      }

      const projectOwner = await ctx.db.get(project.ownerId);
      const editorNodes = await ctx.db.query('editornodes').withIndex('byProjectId', (q) => q.eq('projectId', project._id)).collect()
      const membersWithUser = await Promise.all(
         (await ctx.db.query('members').withIndex('byProjectId', (q) => q.eq('projectId', project._id)).collect()).map(
            async (member) => {
               const user = await ctx.db.get(member.userId);

               delete user?.subject

               return {
                  ...member,
                  user,
               }
            })
      )

      // Check if user is project member
      if (!membersWithUser.find(m => m.userId == user._id)) {
         return null;
      }

      return {
         ...project,
         editorNodes,
         owner: projectOwner,
         members: membersWithUser,
      }
   }
})

export const listForUser = query({
   handler: async (ctx) => {
      
      const user = await users.current(ctx)

      if(!user){
         return
      }

      const memberships = await ctx.db.query('members').withIndex('byUserId', q => q.eq('userId', user._id)).collect()
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
      const user = await users.current(ctx)

      if(!user){
         return
      }

      if(user){
         const inviteCode = uuidv4();
         const projectId = await ctx.db.insert("projects", { ownerId: user._id, name, repo, inviteCode });
         await ctx.db.insert('members', {userId: user._id, projectId, lastseenTimestamp: new Date().toISOString()});
         
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
   args: { 
      projectId: v.id('projects'), 
      branch: v.string(),
      path: v.string(),
      content: v.string(),
      sha: v.optional(v.string()),
      position: v.object({ x: v.number(), y: v.number() }) 
   },
   handler: async (ctx, data) => {
      // TODO: Check if user is allowed to create file views
      // const user = await ctx.auth.getUserIdentity() 
      await ctx.db.insert('editornodes', { ...data, expanded: true });
   }
})

export const updateEditorNode = mutation({
   args: { 
      id: v.id('editornodes'), 
      content: v.optional(v.string()), 
      sha: v.optional(v.string()), 
      position: v.optional(v.object({ x: v.number(), y: v.number() })), 
      expanded: v.optional(v.boolean()),
      textPosition: v.optional(v.object({ 
         line: v.number(), 
         column: v.number(), 
         scrollTop: v.number(),
         scrollLeft: v.number(), 
      })) 
   },
   handler: async (ctx, { id, content, sha, position, textPosition, expanded }) => {
      // TODO: Check if user is allowed to update file views
      // const user = await ctx.auth.getUserIdentity()

      if (content) {
         await ctx.db.patch(id, { content })
      }

      if(sha) {
         await ctx.db.patch(id, { sha })
      }

      if (position) {
         await ctx.db.patch(id, { position })
      }

      if(expanded !== undefined){
         await ctx.db.patch(id, { expanded })
      }

      if (textPosition) {
         await ctx.db.patch(id, { textPosition })
      }
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

export const getWithCode = internalQuery({
   args: {inviteCode: v.string()},
   handler: async (ctx, { inviteCode }) => {

      const project = await ctx.db.query('projects').withIndex('byInviteCode', q => q.eq('inviteCode', inviteCode)).first()

      if(!project){
         return null;
      }

      const projectOwner = await ctx.db.get(project.ownerId);
      const editorNodes = await ctx.db.query('editornodes').withIndex('byProjectId', (q) => q.eq('projectId', project._id)).collect()
      const membersWithUser = await Promise.all(
         (await ctx.db.query('members').withIndex('byProjectId', (q) => q.eq('projectId', project._id)).collect()).map(
            async (member) => {
               const user = await ctx.db.get(member.userId);

               return {
                  ...member,
                  user,
               }
            })
      )

      return {
         ...project,
         editorNodes,
         owner: projectOwner,
         members: membersWithUser,
      }
   }
})

export const projectIdForCode = query({
   args: {
      inviteCode: v.optional(v.string()),
   },
   handler: async (ctx, {inviteCode}) => {
       const project = await ctx.db.query('projects').withIndex('byInviteCode', q => q.eq('inviteCode', inviteCode)).first()
       return project?._id
   },
})
