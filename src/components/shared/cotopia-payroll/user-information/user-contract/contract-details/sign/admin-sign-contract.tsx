import CotopiaButton from "@/components/shared-ui/c-button";
import { useRoomContext } from "@/components/shared/room/room-context";
import TitleEl from "@/components/shared/title-el";
import { useLoading } from "@/hooks";
import useAuth from "@/hooks/auth";
import { isUserAdmin } from "@/lib/utils";
import axiosInstance from "@/services/axios";
import { useAppDispatch } from "@/store";
import { getProfileThunk } from "@/store/slices/auth/slice";
import { UserContractType } from "@/types/contract";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  contract: UserContractType;
  onUpdate: (contract: UserContractType) => void;
};
export default function AdminSignContract({ contract, onUpdate }: Props) {
  const dispatch = useAppDispatch();

  const { workspace_id } = useRoomContext();
  const { user } = useAuth();
  const [isSigned, setIsSigned] = useState<number>(0);
  useEffect(() => {
    setIsSigned(contract.user_sign_status);
  }, [contract.user_sign_status]);

  const { startLoading, stopLoading, isLoading } = useLoading();
  const signContractToggle = () => {
    const newStatus = isSigned === 1 ? 0 : 1;

    if (contract.contractor_sign_status === 1 && newStatus === 0)
      return toast.error(
        "You can not revoke your sign after contractor signing."
      );

    startLoading();
    axiosInstance
      .put(`/contracts/${contract.id}`, {
        user_sign_status: newStatus,
      })
      .then((res) => {
        setIsSigned(newStatus);
        stopLoading();
        dispatch(getProfileThunk());
        if (onUpdate) onUpdate(res.data.data);
      })
      .catch((err) => {
        stopLoading();
      });
  };

  if (workspace_id === undefined) return null;

  const userIsAdmin = isUserAdmin(user, +workspace_id);

  let buttonText = isSigned ? "Revoke as admin" : "Sign as admin";

  if (!userIsAdmin)
    buttonText = isSigned ? "Admin signed" : "Awaiting adming signing";

  return (
    <CotopiaButton
      onClick={signContractToggle}
      loading={isLoading}
      startIcon={<Shield />}
      disabled={!userIsAdmin}
    >
      {buttonText}
    </CotopiaButton>
  );
}
