import useAuth from "@/hooks/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { paths } from "../paths";
import { io, Socket } from "socket.io-client";
import { VARZ } from "@/const/varz";
import { toast } from "sonner";
import { routeResolver } from "@/lib/utils";
import { dispatch } from "use-bus";
import { __BUS } from "@/const/bus";
import { useAppDispatch } from "@/store";
import { getProfileThunk } from "@/store/slices/auth/slice";

export const useSocket = (
  event?: string,
  cb?: (data: any) => void,
  deps?: any[]
) => {
  const { socketState } = useProfile();
  useEffect(() => {
    if (!event) return;
    if (!cb) return;
    if (socketState === undefined) return;
    socketState.on(event, cb);
    return () => {
      socketState.off(event, cb);
    };
  }, [socketState, event, deps]);

  return socketState;
};

const ProfileContext = createContext<{
  socketState?: Socket;
}>({
  socketState: undefined,
});

export const useProfile = () => useContext(ProfileContext);

export default function PrivateRoutes() {
  const reduxDispatch = useAppDispatch();
  useEffect(() => {
    reduxDispatch(getProfileThunk());
  }, []);

  const [initState, setInitState] = useState(false);

  const navigate = useNavigate();

  const { accessToken } = useAuth();
  useEffect(() => {
    if (!accessToken) {
      return navigate(routeResolver(paths.auth.index, paths.auth.login));
    }
    setInitState(true);
  }, [accessToken, navigate]);

  const [socketState, setSocketState] = useState<Socket>();

  useEffect(() => {
    if (!accessToken) return;

    // Create a socket connection
    const socket = io(VARZ.socketUrl, {
      query: {
        userToken: accessToken,
      },
    });

    if (socket?.id) localStorage.setItem("socket-id", socket.id);

    socket.on("connect", () => {
      toast.success("Socket connected");
      setSocketState(socket);
      dispatch(__BUS.rejoinRoom);
      dispatch({
        type: __BUS.startWorkTimer,
        id: VARZ.userTimeTrackerId,
      });
    });

    socket.on("disconnect", () => {
      setSocketState(undefined);
      toast.error("Socket disconnected");
      dispatch({
        type: __BUS.stopWorkTimer,
        id: VARZ.userTimeTrackerId,
      });
    });

    // Clean up the socket connection on unmount
    return () => {
      toast.error("Socket disconnected");
      socket.disconnect();
    };
  }, [accessToken]);

  if (initState === false) return null;

  return (
    <ProfileContext.Provider value={{ socketState }}>
      <Outlet />
    </ProfileContext.Provider>
  );
}
