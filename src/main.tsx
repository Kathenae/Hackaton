import './index.css'
import './App.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { dark } from '@clerk/themes';
import { RouterProvider } from "react-router-dom";
import { router } from './routes.tsx'
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";


const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider appearance={{baseTheme: dark}} publishableKey={'pk_test_c2VsZWN0ZWQtYWtpdGEtODMuY2xlcmsuYWNjb3VudHMuZGV2JA'}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <RouterProvider router={router} />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>,
)
