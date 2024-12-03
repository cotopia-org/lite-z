import { Navigate, createBrowserRouter } from "react-router-dom";
import PublicRoutes from "./public-wrapper";
import { lazy } from "react";
import { paths } from "./paths";
import { routeResolver } from "@/lib/utils";
import ErrorElement from "@/components/shared/error-boundry";
//@ts-ignore
import PrivateRoutes from "./private-wrarpper";

// Home page
const HomePage = lazy(() => import("@/pages/home"));

// Workspace page
const WorkspacePage = lazy(() => import("@/pages/workspace"));
const WorkspaceRoomPage = lazy(() => import("@/pages/workspace/rooms/room"));

// Auth pages
const LoginPage = lazy(() => import("@/pages/auth/login"));
const RegisterPage = lazy(() => import("@/pages/auth/register"));

// NotFound Page
const NotFoundPage = lazy(() => import("@/pages/not-found"));

// Payroll Pages
const PayrollPage = lazy(() => import("@/pages/cotopia-payroll/payroll"));
const PayrollDashboard = lazy(
  () => import("@/pages/cotopia-payroll/dashboard")
);
const PayrollEmployees = lazy(
  () => import("@/pages/cotopia-payroll/employees")
);
const PayrollPayments = lazy(() => import("@/pages/cotopia-payroll/payments"));
const PayrollAdvance = lazy(() => import("@/pages/cotopia-payroll/advance"));

const router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: "/",
        element: <Navigate to={paths.dashboard} />,
      },
      // {
      //   path: "payroll",
      //   element: <PayrollPage />,
      // },
      {
        path: "payroll-employees",
        element: <PayrollEmployees />,
      },
      {
        path: "payroll-dashboard",
        element: <PayrollDashboard />,
      },
      {
        path: "payroll-payments",
        element: <PayrollPayments />,
      },
      {
        path: "payroll-advance",
        element: <PayrollAdvance />,
      },
      {
        path: paths.dashboard,
        element: <HomePage />,
      },
      {
        path: paths.workspaces.index,
        children: [
          {
            path: paths.workspaces.view,
            element: <WorkspacePage />,
          },
        ],
      },
      {
        path: routeResolver(
          paths.workspaces.index,
          paths.workspaces.view,
          paths.workspaces.rooms.index,
          paths.workspaces.rooms.view
        ),
        element: <WorkspaceRoomPage />,
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
