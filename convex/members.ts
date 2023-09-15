import { internalMutation, internalQuery, mutation } from "./_generated/server";
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

export const getMember = internalQuery({
   args: {
      projectId: v.id('projects'),
      userId: v.id('users'),
   },
   handler: async (ctx, { projectId, userId }) => {
      const member = await ctx.db
         .query('members')
         .withIndex('byUserIdAndProjectId', (q) => q.eq('userId', userId).eq('projectId', projectId))
         .first()

      return member;
   }
})

export const addMember = internalMutation({
   args: { projectId: v.id('projects'), userId: v.id('users') },
   handler: async (ctx, { projectId, userId }) => {

      // if not add new member
      const memberId = await ctx.db.insert('members', {
         userId: userId,
         projectId: projectId,
         lastseenTimestamp: new Date().toISOString()
      });

      return memberId;
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