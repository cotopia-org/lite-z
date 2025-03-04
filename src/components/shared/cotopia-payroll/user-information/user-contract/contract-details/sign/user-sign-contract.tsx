import CotopiaButton from '@/components/shared-ui/c-button';
import { useRoomContext } from '@/components/shared/room/room-context';
import TitleEl from '@/components/shared/title-el';
import { useLoading } from '@/hooks';
import useAuth from '@/hooks/auth';
import { isUserAdmin } from '@/lib/utils';
import axiosInstance from '@/services/axios';
import { useAppDispatch } from '@/store';
import { getProfileThunk } from '@/store/slices/auth/slice';
import { UserContractType } from '@/types/contract';
import { Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  contract: UserContractType;
  onUpdate: (contract: UserContractType) => void;
};
export default function UserSign({ contract, onUpdate }: Props) {
  const dispatch = useAppDispatch();

  const { user } = useAuth();
  const [isSigned, setIsSigned] = useState<number>(0);
  useEffect(() => {
    setIsSigned(contract.user_sign_status);
  }, [contract.user_sign_status]);

  const { startLoading, stopLoading, isLoading } = useLoading();
  const signContractToggle = () => {
    const newStatus = isSigned === 1 ? 0 : 1;

    startLoading();
    axiosInstance
      .get(
        isSigned
          ? `/contracts/${contract.id}/userRevoke`
          : `/contracts/${contract.id}/userSign`,
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

  let buttonText = isSigned ? 'Revoke as User' : 'Sign as User';

  const belongToMe = user?.id === contract.user_id;

  if (!belongToMe)
    buttonText = isSigned ? 'User signed' : 'Awaiting user signing';

  return (
    <CotopiaButton
      onClick={signContractToggle}
      loading={isLoading}
      startIcon={<Shield />}
      disabled={!belongToMe}
    >
      {buttonText}
    </CotopiaButton>
  );
}
