"use node"
import { Octokit } from 'octokit'
import { api, internal } from './_generated/api'
import { action } from './_generated/server'
import clerk from '@clerk/clerk-sdk-node'
import { v } from 'convex/values'
import { GenericActionCtx } from 'convex/server'
import { DataModel } from './_generated/dataModel'

// these actions need to be done from the server because we have to use the github access token and we don't want to send that to the client

export const commitFile = action({
   args: {
      id: v.id('editornodes'),
      username: v.string(),
      repo: v.string(),
      branch: v.string(),
      fileContent: v.string(),
      message: v.string(),
      filepath: v.string(),
      sha: v.optional(v.string(),)
   },
   handler: async (ctx, {id, username, repo, branch, fileContent, filepath, message, sha}) => {
       const octokit = await makekit(ctx)

       if(!octokit){
         return;
       }

      const response = await octokit.rest.repos.createOrUpdateFileContents({
         owner: username,
         repo: repo,
         branch: branch,
         path: filepath,
         content: btoa(fileContent),
         message: message,
         sha: sha,
      })

      if(response.status === 200 || response.status == 201){
         const newSha = response.data.content?.sha
         await ctx.runMutation(api.projects.updateEditorNode, { id, sha: newSha })
      }
   
      return response;
   },
})

export const createBranch = action({
   args: {
      repo: v.string(),
      repoOwner: v.string(),
      fromSha: v.string(),
      branchName: v.string(),
   },
   handler: async (ctx, {repo, repoOwner, branchName, fromSha}) => {
      const octokit = await makekit(ctx)

      if (!octokit) {
         return null;
      }
      
      const response = await octokit.rest.git.createRef({
         owner: repoOwner,
         repo: repo,
         ref: `refs/heads/${branchName}`,
         sha: fromSha,
      });

      return response;
   }
})

export const joinProjectAsCollaborator = action({
   args: {
      inviteCode: v.string(),
   },
   handler: async (ctx, { inviteCode }) => {
      
      const project = await ctx.runQuery(internal.projects.getWithCode, { inviteCode })

      if (!project?.owner?.subject) {
         return {
            error: 'PROJECT_NOT_FOUND'
         }
      }

      const user = await ctx.runQuery(api.users.authenticated)

      if(!user?.subject){
         return {
            error: 'UNAUTHENTICATED'
         }
      }

      // Check if not already a member
      const member = await ctx.runQuery(internal.members.getMember, { projectId: project._id, userId: user._id })
      if (member) {
         return {
            success: 'ALREADY_A_MEMBER'
         }
      }

      // Create github api kits for each user (project owner and user joining the project)
      const ownerKit = await makeGithubKitFor(project.owner.subject)
      const inviteeKit = await makeGithubKitFor(user.subject)

      // Check if user already invited to the repository
      const checkResponse = await inviteeKit?.rest.repos.listInvitationsForAuthenticatedUser();
      let invitation = checkResponse?.data.find(v => v.repository.name === project.repo)

      // If invitation not sent
      if(!invitation){
         // Send invitation
         const inviteResponse = await ownerKit?.rest.repos.addCollaborator({
            repo: project.repo,
            owner: project.owner.username,
            username: user.username,
            permission: 'push',
         })
   
         // if already a collaborator
         if(inviteResponse?.status as number == 204){
            // Add as a project member
            await ctx.runMutation(internal.members.addMember, { projectId: project._id, userId: user._id })

            return {
               success: 'ALREADY_A_COLLABORATOR'
            }
         }

         if(inviteResponse?.status != 201){
            return {
               error: 'UNABLE_TO_CREATE_INVITATION'
            }
         }

         invitation = inviteResponse.data
      }

      // Accept the invite for the invitee
      const acceptResponse = await inviteeKit?.rest.repos.acceptInvitationForAuthenticatedUser({invitation_id: invitation.id})
      
      if(acceptResponse?.status != 204){
         return {
            error: 'UNABLE_TO_ACCEPT_INVITATION'
         }
      }


      // Add as a project member
      await ctx.runMutation(internal.members.addMember, { projectId: project._id, userId: user._id })

      return {
         success: 'COLLABORATOR_ADDED'
      }
   }
})

async function makekit(ctx: GenericActionCtx<DataModel>){
   const identity = await ctx.auth.getUserIdentity()

   if (!identity) {
      return null;
   }

   return await makeGithubKitFor(identity.subject)
}

async function makeGithubKitFor(subject: string) {
   const [accessToken] = await clerk.users.getUserOauthAccessToken(subject, 'oauth_github')

   if (!accessToken) {
      return null
   }

   const octokit = new Octokit({
      auth: accessToken.token,
   });

   return octokit;
}