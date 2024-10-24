import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import useLoading from "@/hooks/use-loading";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRoomContext } from "../../../room-context";
import axiosInstance from "@/services/axios";

export default function UserLogoutButtonTool() {
  const { workspace_id } = useRoomContext();

  const router = useRouter();

  const { startLoading, stopLoading, isLoading } = useLoading();

  const handleBack = () => {
    startLoading();
    axiosInstance
      .get(`/rooms/leave`)
      .then((res) => {
        router.push(`/workspaces/${workspace_id}`);
        stopLoading();
      })
      .catch((err) => {
        stopLoading();
      });
  };

  return (
    <CotopiaIconButton
      disabled={isLoading}
      onClick={handleBack}
      className='text-red-600'
    >
      <LogOut />
    </CotopiaIconButton>
  );
}
