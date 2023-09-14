import { Octokit } from 'octokit'

export type BranchFile = {
   path?: string | undefined;
   mode?: string | undefined;
   type?: string | undefined;
   sha?: string | undefined;
   size?: number | undefined;
   url?: string | undefined;
   repository: string,
   branch: string,
   owner: string,
}

// type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type Branch = {
   name: string;
   commit: {
      sha: string;
      url: string;
   };
}
export type Branches = Branch[]

export async function listRepos(username: string) {
   const octokit = new Octokit()
   return await octokit.rest.repos.listForUser({ username });
}

export async function listBranches({ username, repo }: { username: string, repo: string }) {
   const octokit = new Octokit()
   const response = await octokit.rest.repos.listBranches({
      owner: username,
      repo: repo,
   })

   return response;
}

export async function commitFile({ username, repo, branch, filepath, filecontent, message, sha }: { username: string, repo: string, branch: string, filecontent: string, filepath: string, message: string, sha: string }) {
   const octokit = new Octokit({
      auth: 'MY_AUTH_TOKEN'
   })
   const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: username,
      repo: repo,
      branch: branch,
      path: filepath,
      content: filecontent,
      message: message,
      sha: sha,
   })

   return response.status;
}

export async function listBranchFiles({ username, repo, branch }: { username: string, repo: string, branch: string }) : Promise<BranchFile[]> {
   try {
      const octokit = new Octokit()

      const { data: { commit } } = await octokit.rest.repos.getBranch({
         owner: username,
         repo: repo,
         branch: branch,
      })

      const treeSha = commit.commit.tree.sha;
      const { data: { tree } } = await octokit.rest.git.getTree({
         owner: username,
         repo: repo,
         tree_sha: treeSha,
         recursive: 'true',
         mediaType: { format: 'raw' }
      });

      return tree.filter((file) => file.type === 'blob').map(file => ({ ...file, owner: username, repository: repo, branch }));
   }
   catch (error) {
      return []
   }
}

export async function getRepoFileContent({username, repo, path, branchName}: {username: string, repo: string, branchName: string, path: string}){
   const octokit = new Octokit()
   const { data } = await octokit.rest.repos.getContent({
      owner: username,
      repo: repo,
      path: path,
      ref: branchName,
      mediaType: { format: 'raw' }
   });

   return data;
}  

export function getMainBranch(branches: Branches) {
   return branches?.find(b => b.name.toLowerCase() == 'main' || b.name.toLowerCase() == 'master')
}