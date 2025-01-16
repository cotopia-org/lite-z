import CotopiaButton from '@/components/shared-ui/c-button';
import { useLoading } from '@/hooks';
import axiosInstance from '@/services/axios';
import { toast } from 'sonner';

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
        toast.success('You invited successfully.');
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
