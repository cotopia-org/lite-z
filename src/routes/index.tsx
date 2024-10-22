import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import PublicRoutes from "./public-wrapper";
import { Suspense, lazy } from "react";
import PrivateRoutes from "./private-wrarpper";
import { paths } from "./paths";
import RootBoundary from "@/components/partials/error-boundry";
import ProfileWrapper from "@/components/containers/profile/profile-wrapper";

//Home page
const HomePage = lazy(() => import("@/pages/home/page"));

//Profile pages
const ProfilePageInformation = lazy(
  () => import("@/pages/profile/information")
);
const ProfilePagePersonnel = lazy(() => import("@/pages/profile/personnel"));
const ProfileViewPagePersonnel = lazy(
  () => import("@/pages/profile/personnel/view")
);

const ProfileWalletPage = lazy(() => import("@/pages/profile/wallet"));
const ProfileWalletIncreasePage = lazy(
  () => import("@/pages/profile/wallet/increase")
);

const ProfileCreditsPage = lazy(() => import("@/pages/profile/credits"));
const ProfileCreditAddPage = lazy(() => import("@/pages/profile/credits/add"));
const ProfileCreditViewPage = lazy(
  () => import("@/pages/profile/credits/view")
);

//Login page
const LoginPage = lazy(() => import("@/pages/login"));
const LoginOtpPage = lazy(() => import("@/pages/login/otp"));

//NotFound Page
const NotFoundPage = lazy(() => import("@/pages/not-found"));

const router = createBrowserRouter([
  {
    element: <PrivateRoutes />,
    errorElement: <RootBoundary />,
    children: [
      {
        path: paths.home,
        element: <Navigate to={paths.profile.index} />,
      },
      {
        path: paths.profile.index,
        element: <ProfileWrapper />,
        children: [
          { index: true, element: <ProfilePageInformation /> },
          {
            path: paths.profile.personnel.index,
            element: <ProfilePagePersonnel />,
          },
          {
            path: `${paths.profile.personnel.index}/${paths.profile.personnel.view}`,
            element: <ProfileViewPagePersonnel />,
          },
          {
            path: paths.profile.wallet.index,
            element: <ProfileWalletPage />,
          },
          {
            path: `${paths.profile.wallet.index}/${paths.profile.wallet.increase}`,
            element: <ProfileWalletIncreasePage />,
          },
          {
            path: paths.profile.credits.index,
            element: <ProfileCreditsPage />,
          },
          {
            path: `${paths.profile.index}/${paths.profile.credits.index}/${paths.profile.credits.add}`,
            element: <ProfileCreditAddPage />,
          },
          {
            path: `${paths.profile.index}/${paths.profile.credits.index}/${paths.profile.credits.view}`,
            element: <ProfileCreditViewPage />,
          },
          {
            path: paths.profile.creditsHistory,
            element: <>credits history</>,
          },
        ],
      },
    ],
  },
  {
    path: paths.login.index,
    element: <PublicRoutes />,
    errorElement: <RootBoundary />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: paths.login.otp,
        element: <LoginOtpPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
