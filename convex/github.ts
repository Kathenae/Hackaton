"use node"
import { Octokit } from 'octokit'
import { api } from './_generated/api'
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

async function makekit(ctx: GenericActionCtx<DataModel>){
   const identity = await ctx.auth.getUserIdentity()

   if (!identity) {
      return null;
   }

   const [accessToken] = await clerk.users.getUserOauthAccessToken(identity.subject, 'oauth_github')

   if (!accessToken) {
      return null
   }

   const octokit = new Octokit({
      auth: accessToken.token,
   });

   return octokit;
}