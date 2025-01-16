import CotopiaButton from '@/components/shared-ui/c-button';
import { useTalk } from '..';
import { useLoading } from '@/hooks';
import axiosInstance from '@/services/axios';
import { TalkType } from '@/types/talk';
import { toast } from 'sonner';

type Props = {
  onReject: (talk: TalkType) => void;
};

export default function Reject({ onReject }: Props) {
  const { startLoading, stopLoading, isLoading } = useLoading();

  const { talk } = useTalk();

  const handleReject = () => {
    startLoading();
    axiosInstance
      .post(`/talks/${talk.id}/respond`, {
        response: 'rejected',
      })
      .then((res) => {
        stopLoading();
        if (onReject) onReject(res.data.data);
        toast.success('The invitation rejected successfully.');
      })
      .catch((err) => {
        stopLoading();
      });
  };

  return (
    <CotopiaButton
      onClick={handleReject}
      variant={'outline'}
      className="border-destructive text-destructive"
      loading={isLoading}
    >
      Reject
    </CotopiaButton>
  );
}
