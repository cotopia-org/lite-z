import CotopiaButton from "@/components/shared-ui/c-button";
import { useAppDispatch } from "@/store";
import { logout } from "@/store/slices/auth/slice";

export default function AccountLogout() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <CotopiaButton
      onClick={handleLogout}
      variant={"destructive"}
      className='text-white !px-4'
    >
      Logout
    </CotopiaButton>
  );
}
