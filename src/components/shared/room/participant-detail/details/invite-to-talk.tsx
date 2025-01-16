import CotopiaButton from '@/components/shared-ui/c-button';
import { useLoading } from '@/hooks';
import axiosInstance from '@/services/axios';

type Props = {
  user_id: number;
};

export default function InviteToTalk({ user_id }: Props) {
  const { startLoading, stopLoading, isLoading } = useLoading();
  const handleInvite = () => {
    startLoading();
    axiosInstance
      .post(`/talks`, { user_id })
      .then((res) => {
        stopLoading();
      })
      .catch((err) => {
        stopLoading();
      });
  };

  return (
    <CotopiaButton loading={isLoading} onClick={handleInvite}>
      Invite to talk
    </CotopiaButton>
  );
}
