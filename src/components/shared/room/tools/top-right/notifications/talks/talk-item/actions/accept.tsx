import CotopiaButton from '@/components/shared-ui/c-button';
import { useTalk } from '..';
import axiosInstance from '@/services/axios';
import { useLoading } from '@/hooks';
import { TalkType } from '@/types/talk';
import { toast } from 'sonner';

type Props = {
  onAccept: (talk: TalkType) => void;
};

export default function Accept({ onAccept }: Props) {
  const { talk } = useTalk();

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
        toast.success('The invitation was accepted successfully.');
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
