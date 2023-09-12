import { PropsWithChildren, createContext, useContext } from "react"
import { useUser } from "@clerk/clerk-react";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel"

type StoredUserState = {
   user: ReturnType<typeof useQuery<typeof api.users.authenticated>> | null
   userId: Id<'users'> | null
}

const StoredUserContext = createContext<StoredUserState>({ userId: null, user: null })

export default function StoredUserProvider({ children }: PropsWithChildren) {
   const { isAuthenticated } = useConvexAuth();
   const { user } = useUser();
   const storedUser = useQuery(api.users.authenticated)
   const updateLastSeen = useMutation(api.users.updateLastSeen)
   const [userId, setUserId] = useState<Id<"users"> | null>(null);
   const storeUser = useMutation(api.users.store);

   useEffect(() => {
      // If the user is not logged in don't do anything
      if (!isAuthenticated) {
         return;
      }
      // Store the user in the database.
      // Recall that `storeUser` gets the user information via the `auth`
      // object on the server. You don't need to pass anything manually here.
      async function createUser() {
         const id = await storeUser();
         setUserId(id);
      }
      createUser();
      return () => setUserId(null);

      // Make sure the effect reruns if the user logs in with
      // a different identity
   }, [isAuthenticated, storeUser, user?.id]);

   useEffect(() => {
      const intervalId = setInterval(async () => {
         console.log('Updating last seen')
         await updateLastSeen()
      }, 1 * 60 * 1000)

      return () => {
         clearInterval(intervalId)
      }
   }, [updateLastSeen])

   return (
      <StoredUserContext.Provider value={{ userId, user: storedUser }}>
         {children}
      </StoredUserContext.Provider>
   )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStoredUser(){
   return useContext(StoredUserContext)
}