import CotopiaButton from '@/components/shared-ui/c-button';
import { useTalk } from '..';
import axiosInstance from '@/services/axios';
import { useLoading } from '@/hooks';
import { TalkType } from '@/types/talk';
import { toast } from 'sonner';
import { useTeleport } from '@/components/shared/user-teleportation';

type Props = {
  onAccept: (talk: TalkType) => void;
};

export default function Accept({ onAccept }: Props) {
  const { talk } = useTalk();

  const { navigateHandler } = useTeleport(talk.owner.username);

  const { startLoading, stopLoading, isLoading } = useLoading();

  const handleAccept = () => {
    startLoading();
    axiosInstance
      .post(`/talks/${talk.id}/respond`, {
        response: 'accepted',
      })
      .then((res) => {
        stopLoading();
        if (onAccept) onAccept(res.data.data);
        toast.success(
          `The invitation accepted successfully, you'll navigate to the inviter's location in seconds ...`,
        );
        setTimeout(() => {
          navigateHandler();
        }, 3000);
      })
      .catch((err) => {
        stopLoading();
      });
  };

  return (
    <CotopiaButton
      onClick={handleAccept}
      className="bg-primary"
      loading={isLoading}
    >
      Accept
    </CotopiaButton>
  );
}
