import { useAppSelector } from "@/store";

const useAuth = () => {
  const auth = useAppSelector((store) => store.auth);

  return auth;
};

export default useAuth;
