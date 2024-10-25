import CotopiaIconButton from "@/components/shared-ui/c-icon-button";
import useLoading from "@/hooks/use-loading";
import { LogOut } from "lucide-react";
import { useRoomContext } from "../../../room-context";
import axiosInstance from "@/services/axios";
import { useNavigate } from "react-router-dom";

export default function UserLogoutButtonTool() {
  const { workspace_id } = useRoomContext();

  const navigate = useNavigate();

  const { startLoading, stopLoading, isLoading } = useLoading();

  const handleBack = () => {
    startLoading();
    axiosInstance
      .get(`/rooms/leave`)
      .then((res) => {
        navigate(`/workspaces/${workspace_id}`);
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
