import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/Root";
import Home from "./routes/Home";
import Login from "./routes/Login";
import ErrorPage from "./ErrorPage";

export const router = createBrowserRouter([
   {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
         {
            path: '/',
            element: <Home />
         },
         {
            path: '/login',
            element: <Login />
         }
      ]
   },
])