import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { v4 as uuidv4 } from 'uuid';


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

      const user = await ctx.auth.getUserIdentity()

      // Check if user is logged in and... nickname??
      if (!user || !user.nickname) {
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
         .withIndex('byUsernameAndProjectId', (q) => q.eq('username', user.nickname ?? '').eq('projectId', project._id))
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
         username: user.nickname,
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

      const user = await ctx.auth.getUserIdentity()
      if (!user || !user.nickname) {
         return
      }

      const member = await ctx.db
         .query('members')
         .withIndex('byUsernameAndProjectId', (q) => q.eq('username', user.nickname ?? '').eq('projectId', projectId))
         .unique()    
   
      if(!member){
         return
      }

      ctx.db.patch(member._id, { lastseenTimestamp: new Date().toISOString() });

   }
})