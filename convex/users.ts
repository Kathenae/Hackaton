import { GenericQueryCtx } from "convex/server";
import { DataModel } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const store = mutation({
   args: {},
   handler: async (ctx) => {
     const identity = await ctx.auth.getUserIdentity();
     if (!identity) {
       throw new Error("Called storeUser without authentication present");
     }
 
     // Check if we've already stored this identity before.
     const user = await ctx.db
       .query("users")
       .withIndex("ByToken", (q) =>
         q.eq("tokenIdentifier", identity.tokenIdentifier)
       )
       .unique();
     if (user !== null) {

        // If we've seen this identity before but the name has changed, patch the value.
        if (user.name !== identity.name && user.name !== identity.nickname) {
           await ctx.db.patch(user._id, { name: identity.name ?? identity.nickname });
        }

        if (user.avatarUrl !== identity.pictureUrl) {
           await ctx.db.patch(user._id, { avatarUrl: identity.pictureUrl })
        }

        if (user.username !== identity.nickname) {
           await ctx.db.patch(user._id, { username: identity.nickname })
        }

        if (user.subject !== identity.subject) {
           await ctx.db.patch(user._id, { subject: identity.subject })
        }

        // Update last seen
        await ctx.db.patch(user._id, {lastSeenTimestamp: new Date().toISOString()})

       return user._id;
     }

     // If it's a new identity, create a new `User`.
     return await ctx.db.insert("users", {
       name: identity.name ?? identity.nickname!,
       username: identity.nickname!,
       avatarUrl: identity.pictureUrl,
       subject: identity.subject,
       tokenIdentifier: identity.tokenIdentifier,
       lastSeenTimestamp: new Date().toISOString()
     });
   },
});

export const updateLastSeen = mutation({
   handler: async (ctx) => {
      const user = await current(ctx)
      if (user) {
         await ctx.db.patch(user._id, { lastSeenTimestamp: new Date().toISOString() })
      }
   }
})

export const authenticated = query({
   handler: async (ctx) => {
      return await current(ctx)
   }
})

export const current = async (ctx: GenericQueryCtx<DataModel>) => {
   const authUser = await ctx.auth.getUserIdentity();

   if (!authUser) {
      return null
   }

   const userInfo = await ctx.db.query('users').withIndex('ByToken', (q) => q.eq('tokenIdentifier', authUser?.tokenIdentifier)).first()

   if (!userInfo) {
      return null
   }

   return {
      ...userInfo,
      authUser
   }
}