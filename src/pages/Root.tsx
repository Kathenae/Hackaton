import { dark } from '@clerk/themes';
import { Outlet } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useTheme } from '@/components/providers/ThemeProvider';
import ModalProvider from '@/components/providers/ModalProvider';
import StoredUserProvider from '@/components/providers/StoredUserProvider';
import { Toaster } from '@/components/ui/toaster';


const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

export default function Root() {

   const { theme, systemIsDark } = useTheme()

   return (
      <ClerkProvider appearance={{ baseTheme: ((theme === 'dark' || (theme === 'system' && systemIsDark)) ? dark : undefined) }} publishableKey={'pk_test_c2VsZWN0ZWQtYWtpdGEtODMuY2xlcmsuYWNjb3VudHMuZGV2JA'}>
         <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <StoredUserProvider>
               <ModalProvider>
                  <Outlet />
               </ModalProvider>
               <Toaster />
            </StoredUserProvider>
         </ConvexProviderWithClerk>
      </ClerkProvider>
   )
}