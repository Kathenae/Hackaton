import { SignIn } from "@clerk/clerk-react";
// import { Button } from "@mui/material";

export default function Login(){
   return (
      <div className="flex items-center justify-center h-screen">
         <SignIn />
      </div>
   )
}