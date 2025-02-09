import { Navigate, createBrowserRouter } from 'react-router-dom';
import PublicRoutes from './public-wrapper';
import { lazy } from 'react';
import { paths } from './paths';
import { routeResolver } from '@/lib/utils';
import ErrorElement from '@/components/shared/error-boundry';
//@ts-ignore
import PrivateRoutes from './private-wrarpper';

//Workspace Room Settings
const WorkspaceRoomSettings = lazy(
  () => import('@/pages/workspace/rooms/room/settings'),
);

//Workspace Room Jobs
const WorkspaceRoomJobs = lazy(
  () => import('@/pages/workspace/rooms/room/jobs'),
);

//Workspace Room Jobs
const WorkspaceRoomUsers = lazy(
  () => import('@/pages/workspace/rooms/room/users'),
);

//Home page
const HomePage = lazy(() => import('@/pages/home'));
const Acts = lazy(() => import('@/pages/acts'));

//Workspace payroll page
const WorkspacePayrollPage = lazy(() => import('@/pages/workspace/payroll'));

//Workspace page
const WorkspacePage = lazy(() => import('@/pages/workspace'));
const WorkspaceCalendarPage = lazy(() => import('@/pages/workspace/calendar'));

//Auth pages
const LoginPage = lazy(() => import('@/pages/auth/login'));
const RegisterPage = lazy(() => import('@/pages/auth/register'));

//NotFound Page
const NotFoundPage = lazy(() => import('@/pages/not-found'));

const router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    errorElement: <ErrorElement />,
    children: [
      {
        path: '/',
        element: <Navigate to={paths.dashboard} />,
      },
      {
        path: paths.dashboard,
        element: <HomePage />,
      },
      {
        path: 'acts/',
        element: <Acts />,
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
          paths.workspaces.calendar,
        ),
        element: <WorkspaceCalendarPage />,
      },
      {
        path: routeResolver(
          paths.workspaces.index,
          paths.workspaces.view,
          paths.workspaces.rooms.index,
          paths.workspaces.rooms.view.index,
          paths.workspaces.rooms.view.settings,
        ),
        element: <WorkspaceRoomSettings />,
      },
      {
        path: routeResolver(
          paths.workspaces.index,
          paths.workspaces.view,
          paths.workspaces.rooms.index,
          paths.workspaces.rooms.view.index,
          paths.workspaces.rooms.view.payroll,
        ),
        element: <WorkspacePayrollPage />,
      },
      {
        path: routeResolver(
          paths.workspaces.index,
          paths.workspaces.view,
          paths.workspaces.rooms.index,
          paths.workspaces.rooms.view.index,
          paths.workspaces.rooms.view.jobs,
        ),
        element: <WorkspaceRoomJobs />,
      },
      {
        path: routeResolver(
          paths.workspaces.index,
          paths.workspaces.view,
          paths.workspaces.rooms.index,
          paths.workspaces.rooms.view.index,
          paths.workspaces.rooms.view.users,
        ),
        element: <WorkspaceRoomUsers />,
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
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
