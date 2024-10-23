import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import PublicRoutes from "./public-wrapper";
import { Suspense, lazy } from "react";
import PrivateRoutes from "./private-wrarpper";
import { paths } from "./paths";
import RootBoundary from "@/components/partials/error-boundry";
import ProfileWrapper from "@/components/containers/profile/profile-wrapper";
import { routeResolver } from "@/lib/utils";

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
    errorElement: <RootBoundary />,
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
    errorElement: <RootBoundary />,
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
