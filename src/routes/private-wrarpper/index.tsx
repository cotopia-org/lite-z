import useAuth from "@/hooks/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { paths } from "../paths";
import { io, Socket } from "socket.io-client";
import { VARZ } from "@/const/varz";
import { toast } from "sonner";

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
  // const dispatch = useAppDispatch();
  // useEffect(() => {
  //   dispatch(getProfileThunk());
  // }, []);

  const [initState, setInitState] = useState(false);

  const navigate = useNavigate();

  const { accessToken } = useAuth();
  useEffect(() => {
    if (!accessToken) {
      return navigate(paths.auth.login);
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

    socket.on("connect", () => {
      toast.success("Socket connected");
      setSocketState(socket);
    });

    socket.on("disconnect", () => {
      toast.error("Socket disconnected");
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
