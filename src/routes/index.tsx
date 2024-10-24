import { Navigate, createBrowserRouter } from "react-router-dom";
import PublicRoutes from "./public-wrapper";
import { lazy } from "react";
import { paths } from "./paths";
import { routeResolver } from "@/lib/utils";
import ErrorElement from "@/components/shared/error-boundry";
//@ts-ignore
import PrivateRoutes from "./private-wrarpper";

//Home page
const HomePage = lazy(() => import("@/pages/home/page"));

//Auth pages
const LoginPage = lazy(() => import("@/pages/auth/login"));
const RegisterPage = lazy(() => import("@/pages/auth/register"));

//NotFound Page
const NotFoundPage = lazy(() => import("@/pages/not-found"));

const router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: paths.dashboard,
        element: <HomePage />,
      },
    ],
  },
  {
    path: routeResolver(paths.auth.index),
    element: <PublicRoutes />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Navigate to={paths.auth.login} />,
      },
      {
        path: paths.auth.login,
        element: <LoginPage />,
      },
      {
        path: paths.auth.register,
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
