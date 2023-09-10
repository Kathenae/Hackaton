import { createBrowserRouter } from "react-router-dom";
import Root from "./pages/Root";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import ProjectPage from "./pages/ProjectPage";
import JoinPage from "./pages/JoinPage";

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
            path: '/login',
            element: <LoginPage />
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
])