import './index.css'
import './App.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { router } from './routes.tsx'
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ReactFlowProvider } from 'reactflow';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ReactFlowProvider>
        <RouterProvider router={router} />
      </ReactFlowProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
