import CotopiaButton from '@/components/shared-ui/c-button';
import { useLoading } from '@/hooks';
import useAuth from '@/hooks/auth';
import axiosInstance from '@/services/axios';
import { useAppDispatch } from '@/store';
import { getProfileThunk } from '@/store/slices/auth/slice';
import { UserContractType } from '@/types/contract';
import { Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { isUserAdmin } from '@/lib/utils';
import { useRoomContext } from '@/components/shared/room/room-context';

type Props = {
  contract: UserContractType;
  onUpdate: (contract: UserContractType) => void;
};
export default function ContractorSign({ contract, onUpdate }: Props) {
  const dispatch = useAppDispatch();

  const { user } = useAuth();
  const { workspace_id } = useRoomContext();

  const [isSigned, setIsSigned] = useState<number>(0);
  useEffect(() => {
    setIsSigned(contract.contractor_sign_status);
  }, [contract.contractor_sign_status]);

  const { startLoading, stopLoading, isLoading } = useLoading();
  const signContractToggle = () => {
    const newStatus = isSigned === 1 ? 0 : 1;

    startLoading();
    axiosInstance
      .get(
        isSigned
          ? `/contracts/${contract.id}/adminRevoke`
          : `/contracts/${contract.id}/adminSign`,
      )
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

  let buttonText = isSigned ? 'Revoke as Manager' : 'Sign as Manager';
  if (workspace_id === undefined) return null;

  const userIsAdmin = isUserAdmin(user, +workspace_id);

  if (!userIsAdmin)
    buttonText = isSigned ? 'Manager signed' : 'Awaiting manager signing';
  return (
    <CotopiaButton
      onClick={signContractToggle}
      loading={isLoading}
      startIcon={<Briefcase />}
      disabled={!userIsAdmin}
    >
      {buttonText}
    </CotopiaButton>
  );
}
