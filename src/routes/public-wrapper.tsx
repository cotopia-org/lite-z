import useAuth from "@/hooks/auth";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { paths } from "./paths";
import { routeResolver } from "@/lib/utils";

export default function PublicRoutes() {
  const [initState, setInitState] = useState(false);

  const navigate = useNavigate();

  const { accessToken } = useAuth();
  useEffect(() => {
    if (accessToken) {
      return navigate(routeResolver(paths.dashboard));
    }
    setInitState(true);
  }, [accessToken]);

  if (initState === false) return null;

  return <Outlet />;
}
