import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import ProjectPage from "./pages/ProjectPage";
import JoinPage from "./pages/JoinPage";
import AuthLayout from "./pages/AuthLayout";

export const router = createBrowserRouter([
   {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
         {
            path: '/',
            element: <AuthLayout />,
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
                  path: '/join/:inviteCode',
                  element: <JoinPage />
               },
            ]
         },
         {
            path: '/login',
            element: <LoginPage />
         },
      ]
   },
])