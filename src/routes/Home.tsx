import { useUser } from "@clerk/clerk-react"
import { Avatar } from "@mui/material"

export default function Home(){

   const {isSignedIn, user} = useUser()

   if(!isSignedIn){
      return null;
   }

   return (
      <>
         <h1>Home Page</h1>
         <Avatar 
            alt={user.imageUrl}
            src={user.imageUrl}
         />
         <p>{user?.fullName}</p>
      </>
   )
}