import CotopiaButton from '@/components/shared-ui/c-button';
import { useTalk } from '..';
import { useLoading } from '@/hooks';
import axiosInstance from '@/services/axios';

type Props = {};

export default function Reject() {
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
