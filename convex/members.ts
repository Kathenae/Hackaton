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

      if (!user || !user.nickname) {
         return
      }

      const project = await ctx.db.query('projects').withIndex('byInviteCode', (q) => q.eq('inviteCode', inviteCode)).first()
      if (!project) {
         return
      }

      const memberId = await ctx.db.insert('members', {
         username: user.nickname,
         projectId: project._id,
         lastseenTimestamp: new Date().toISOString()
      });

      return memberId;
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