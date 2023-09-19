# CodeTogether | Hackaton Submission

Built for the [Web Dev Cody Hackaton](https://hackathon.webdevcody.com), CodeTogether is a fully featured, cross browser, totally not buggy 😅, collaborative coding platform (or app?) that can be used to easily share your project when you need help with something or if you brave enough, use it when you want to collaborate with other developers on an entire project. 

### [Try it out](https://codetogether.worksper.com)

![Preview Image](https://media.discordapp.net/attachments/1146254904982253568/1150133350477074562/image.png?width=1031&height=494)

<div style="display: flex; justify-content: center; width: 100%;">
   <figure>
      <img width="50" height="50" src="https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae">
      <figcaption>Typescript<figcaption>
   </figure>
   <figure>
      <img width="50" height="50" src="https://react.dev/favicon.ico">
      <figcaption>React<figcaption>
   </figure>
   <figure>
      <img width="50" height="50" src="https://www.convex.dev/favicon.ico">
      <figcaption>Convex<figcaption>
   </figure>
   <figure>
      <img width="50" height="50" src="https://clerk.com/favicon/favicon-32x32.png">
      <figcaption>Clerk Auth<figcaption>
   </figure>
   <figure>
      <img width="50" height="50" src="https://ui.shadcn.com/favicon.ico">
      <figcaption>Shadcn UI<figcaption>
   </figure>
   <figure>
      <img width="50" height="50" src="https://tailwindcss.com/favicons/favicon-32x32.png?v=3">
      <figcaption>Tailwind CSS<figcaption>
   </figure>
</div>

## Features
- [x] Create Project Linked to Github Repo
- [x] Invite Members
- [x] Drag and Drop files into Workspace
- [x] Code Editor with Multi language support
- [x] Realtime Code editing
- [x] Supports Branching and Single file commits

## So, How do i run it?
Its easy, just:
- Yoink the repo 😅
- Run `npm install` to install dependencies
- Run `npx convex dev` to setup your convex project and sync your schema and functions
- Create a clerk project and setup a Convex JWT template named "convex" because we need it for auth (check auth.config.js)
- Make sure to only use the github OAuth provider and include the `public_repo` scope in your clerk project
- Go to convex dashboard and setup your CLERK_CONVEX_ISSUER_URL copied from the JWT template
- Edit `/src/pages/Root.tsx` to use your clerk publishable key on the ClerkProvider (using .env.local for this wasn't possible because it kept being replaced by convex dev or so i think)
- Create a `.env.local` with CONVEX_DEPLOYMENT and VITE_CONVEX_URL variables (npx convex dev should have created this for you)
- `npm run dev`

#### TODO (Soon)
- [x] Remove Members
- [x] Leave Project
- [x] Presense (See who's online)
- [x] Implement Branching and Single file commits
- [ ] Allow creating new files
- [ ] Code Presense (See who's editing what)
- [ ] Add Authorization checks in the backend (Only Project owner should be able to invite or remove members)

#### TODO (Dauting)
- [ ] Implement multi file commits
- [ ] Show indicator when a file has changed in the repo and needs to be "synched"
- [ ] Implement Fixing merge conflics
- [ ] Better error handling for when offline (clerk, convex, github unreashable). Right now the app just crashes or doesn't do the thing
- [ ] Codesandbox esque web environment (HELP!)
- [ ] VS Code Extension for better code presense (HELP!)
- [ ] Lines, Shapes, and Text drawing capabilities (Maybe not needed?) 

### Known Issues
- File selector freezes on large repos
- Editor position synching not the best
- Many more waiting to be discovered...