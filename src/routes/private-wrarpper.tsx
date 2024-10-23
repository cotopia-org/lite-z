import useAuth from "@/hooks/auth";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { paths } from "./paths";
import { useAppDispatch } from "@/store";
import { getProfileThunk } from "@/store/slices/auth/slice";

export default function PrivateRoutes() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getProfileThunk());
  }, []);

  const [initState, setInitState] = useState(false);

  const navigate = useNavigate();

  const { accessToken } = useAuth();
  useEffect(() => {
    if (!accessToken) {
      return navigate(paths.auth.login);
    }
    setInitState(true);
  }, [accessToken, navigate]);

  if (initState === false) return null;

  return <Outlet />;
}
