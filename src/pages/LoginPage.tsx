import { SignIn } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
// import { Button } from "@mui/material";

export default function LoginPage(){
   const location = useLocation();
   const nextUrl = new URLSearchParams(location.search).get('next');

   return (
      <div className="flex items-center justify-center h-screen">
         <SignIn afterSignInUrl={nextUrl}/>
      </div>
   )
}