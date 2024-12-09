import CotopiaButton from "@/components/shared-ui/c-button";
import { useLoading } from "@/hooks";
import useAuth from "@/hooks/auth";
import axiosInstance from "@/services/axios";
import { useAppDispatch } from "@/store";
import { getProfileThunk } from "@/store/slices/auth/slice";
import { UserContractType } from "@/types/contract";
import { Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  contract: UserContractType;
  onUpdate: (contract: UserContractType) => void;
};
export default function UserSignContract({ contract, onUpdate }: Props) {
  const dispatch = useAppDispatch();

  const { user } = useAuth();

  const belongToMe = user?.id === contract.user_id;

  const [isSigned, setIsSigned] = useState<number>(0);
  useEffect(() => {
    setIsSigned(contract.contractor_sign_status);
  }, [contract.contractor_sign_status]);

  const { startLoading, stopLoading, isLoading } = useLoading();
  const signContractToggle = () => {
    const newStatus = isSigned === 1 ? 0 : 1;

    if (contract.contractor_sign_status === 1 && newStatus === 0)
      return toast.error("You can not revoke your sign after admin signing.");

    startLoading();
    axiosInstance
      .put(`/contracts/${contract.id}`, {
        contractor_sign_status: newStatus,
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

  let buttonText = isSigned ? "Revoke as contractor" : "Sign as contractor";

  if (!belongToMe)
    buttonText = isSigned ? "Contractor signed" : "Awaiting contractor signing";

  return (
    <CotopiaButton
      onClick={signContractToggle}
      loading={isLoading}
      startIcon={<Briefcase />}
      disabled={!belongToMe}
    >
      {buttonText}
    </CotopiaButton>
  );
}
