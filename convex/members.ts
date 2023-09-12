import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { v4 as uuidv4 } from 'uuid';
import * as users from "./users";

export const generateInviteCode = mutation({
   args: { projectId: v.id('projects') },
   handler: async (ctx, { projectId }) => {
      const inviteCode = uuidv4();
      await ctx.db.patch(projectId, { inviteCode })
      return inviteCode
   }
})

export const joinProject = mutation({
   args: { inviteCode: v.string() },
   handler: async (ctx, { inviteCode }) => {

      const user = await users.current(ctx)

      // Check if user is logged
      if (!user) {
         return {
            error: 'You need to be logged in to be able to join the project'
         }
      }

      // Check if project exists
      const project = await ctx.db.query('projects').withIndex('byInviteCode', (q) => q.eq('inviteCode', inviteCode)).first()
      if (!project) {
         return {
            error: 'Unable to join the project, please check your invite url'
         }
      }
      
      const member = await ctx.db
         .query('members')
         .withIndex('byUserIdAndProjectId', (q) => q.eq('userId', user._id).eq('projectId', project._id))
         .unique()  
      
      // Check if user not already member of the project
      if(member){
         return {
            message: 'ALREADY_JOINED',
            data: {
               memberId: member._id,
               projectId: project._id
            }
         }
      }

      // if not add new member
      const memberId = await ctx.db.insert('members', {
         userId: user._id,
         projectId: project._id,
         lastseenTimestamp: new Date().toISOString()
      });

      return {
         message: 'JOINED_SUCCESSFULLY',
         data: {
            memberId,
            projectId: project._id
         }
      };
   }
})

export const updatePresense = mutation({
   args: {projectId: v.id('projects')},
   handler: async (ctx, { projectId }) => {

      const user = await users.current(ctx)
      if (!user) {
         return
      }

      const member = await ctx.db
         .query('members')
         .withIndex('byUserIdAndProjectId', (q) => q.eq('userId', user._id).eq('projectId', projectId))
         .unique()    
   
      if(!member){
         return
      }

      ctx.db.patch(member._id, { lastseenTimestamp: new Date().toISOString() });

   }
})

export const remove = mutation({
   args: {
      id: v.id('members')
   },
   handler: async (ctx, {id}) => {
      // TOOD: Check if user is allowd to remove members
      await ctx.db.delete(id)
      return {
         statusOk: true,
         message: "MEMBER_REMOVED"
      }
   }
})

export const leave = mutation({
   args: { projectId: v.id('projects') },
   handler: async (ctx, { projectId }) => {
      const user = await users.current(ctx)

      if(!user){
         return {
            error: "UNAUTHENTICATED"
         }
      }

      const member = await ctx.db.query('members').withIndex('byUserIdAndProjectId', (q) => q.eq('userId', user._id).eq('projectId', projectId)).first()
      
      if(!member){
         return {
            error: "NOT_A_MEMBER"
         }
      }

      await ctx.db.delete(member._id)
   },
})