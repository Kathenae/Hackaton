import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Outlet } from "react-router-dom";

export default function Root() {
   
   return (
      <ThemeProvider>
         <Outlet />
      </ThemeProvider>
   )
}