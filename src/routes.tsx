import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import ProjectPage from "./pages/ProjectPage";

export const router = createBrowserRouter([
   {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
         {
            path: '/',
            element: <HomePage />
         },
         {
            path: '/project/:id',
            element: <ProjectPage />
         },
         {
            path: '/login',
            element: <LoginPage />
         }
      ]
   },
])