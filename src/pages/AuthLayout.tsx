import useRequireAuth from "@/components/useRequireAuth";
import { Loader2 } from "lucide-react";
import { Outlet } from "react-router-dom";


export default function AuthLayout() {

   const { isLoading } = useRequireAuth()


   if (isLoading) {
      return (
         <div className="w-screen h-screen flex items-center justify-center">
            <Loader2 className="text-neutral-700 h-32 w-32 animate-spin" />
         </div>
      )
   }

   return (
      <>
         <Outlet />
      </>
   )
}