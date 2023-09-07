export default {
   providers: [
      {
         domain: process.env.CLERK_CONVEX_ISSUER_URL,
         applicationId: 'convex',
      }
   ]
}