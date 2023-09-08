import { Octokit } from 'octokit'

export async function listRepos(username: string) {
   const octokit = new Octokit()
   return await octokit.rest.repos.listForUser({ username });
}

export async function listBranchFiles({ username, repo, branch }: { username: string, repo: string, branch: string }) {
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

      return tree.filter((i) => i.type === 'blob');
   }
   catch (error) {
      return []
   }
}

export async function getRepoFileContent({username, repo, path}: {username: string, repo: string, path: string}){
   const octokit = new Octokit()
   const { data } = await octokit.rest.repos.getContent({
      owner: username,
      repo: repo,
      path: path,
      mediaType: { format: 'raw' }
   });

   return data;
}  
